import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import bcrypt from "bcrypt";
import { In } from "typeorm";
import { Member } from "../entities/member.model";
import { Category } from "../entities/category.model";
import { Tag } from "../entities/tag.model";
import { PreferredTravelPeriod } from "../entities/preferredTravelPeriod.model";
import { HTTP_STATUS_OK, HTTP_STATUS_CREATED, HTTP_STATUS_UNAUTHORIZED, HTTP_STATUS_BAD_REQUEST } from "../../config/httpStatus.config";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import {
  registerMemberSchema,
  loginMemberSchema,
  getMemberProfileSchema,
  updateMemberProfileSchema,
  deleteMemberProfileSchema,
  confirmEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schemas/memberAuth.schema";
import CategoriesType from "../../entries/categoriesType.entry";
import { sendOptInEmail, sendPasswordResetEmail } from "../../utils/email.service";
import randomString from "../../utils/randomString";

const memberAuthController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;
  // Register new member
  app.post(`${routePrefix}/:locale/me/register`, { schema: registerMemberSchema }, async (request, reply) => {
    const { locale } = request.params;
    const {
      firstName,
      lastName,
      email,
      password,
      country,
      regionId,
      municipalityId,
      phone,
      gender,
      ageRange,
      familySituation,
      travelCompanion,
      travelFrequency,
      averageStayDuration,
      preferredTravelPeriod,
      averageBudget,
      articleInterests,
      eventsInterests,
      travelInterests,
      personalizedContentConsent,
    } = request.body;

    const memberRepository = app.orm.getRepository(Member);

    // Validate email uniqueness using schema validation at the beginning
    await registerMemberSchema.body
      .refine(
        async ({ email }) => {
          const existingMember = await memberRepository.findOne({ where: { email } });
          return !existingMember; // Return true if email doesn't exist (valid)
        },
        {
          message: request.i18n.t("http_messages.email_already_exists") || "Email already exists",
          path: ["email"],
        }
      )
      .parseAsync(request.body);

    try {
      // Combine article and event interests into categoryIds
      const categoryIds = [...(articleInterests || []), ...(eventsInterests || [])];

      const instance = await app.orm.transaction(async (manager) => {
        const memberRepo = manager.getRepository(Member);
        const categoryRepo = manager.getRepository(Category);
        const tagRepo = manager.getRepository(Tag);
        const preferredTravelPeriodRepo = manager.getRepository(PreferredTravelPeriod);

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate email confirmation token
        const emailConfirmationToken = randomString(64);
        // Create member
        const member = memberRepo.create({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          country,
          regionId: regionId || null,
          municipalityId: municipalityId || null,
          phone: phone || null,
          gender: gender || null,
          ageRange: ageRange || null,
          familySituation: familySituation || null,
          travelCompanion: travelCompanion || null,
          travelFrequency: travelFrequency || null,
          averageStayDuration: averageStayDuration || null,
          averageBudget: averageBudget || null,
          personalizedContentConsent: personalizedContentConsent || false,
          isActive: false,
          emailConfirmationToken,
        });
        const savedMember = await memberRepo.save(member);
        // Associate categories if provided
        if (categoryIds && categoryIds.length > 0) {
          const categories = await categoryRepo.find({
            where: { id: In(categoryIds) },
          });
          savedMember.categories = categories;
        }

        // Associate travel interests (tags) if provided
        if (travelInterests && travelInterests.length > 0) {
          const tags = await tagRepo.find({
            where: { id: In(travelInterests) },
          });
          savedMember.tags = tags;
        }

        // Associate preferred travel periods (multiple) if provided
        if (preferredTravelPeriod && preferredTravelPeriod.length > 0) {
          const periods = await preferredTravelPeriodRepo.find({ where: { value: In(preferredTravelPeriod) } });
          savedMember.preferredTravelPeriods = periods;
        }

        if (
          (categoryIds && categoryIds.length > 0) ||
          (travelInterests && travelInterests.length) ||
          (preferredTravelPeriod && preferredTravelPeriod.length > 0)
        ) {
          await memberRepo.save(savedMember);
        }
        
        return savedMember;
      });

      // Send opt-in email after successful registration
      // Don't block the response if email fails
      try {
        await sendOptInEmail({
          to: instance.email,
          firstName: instance.firstName,
          lastName: instance.lastName,
          locale,
          token: instance.emailConfirmationToken!,
        });
      } catch (emailError) {
        // Log error but don't fail the registration
        console.error("Failed to send opt-in email:", emailError);
      }

      return reply.code(HTTP_STATUS_CREATED).send({
        message: request.i18n.t("http_messages.registration_successful") || "Registration successful",
        member: {
          id: instance.id,
          email: instance.email,
          firstName: instance.firstName,
          lastName: instance.lastName,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      return reply.code(HTTP_STATUS_BAD_REQUEST).send({
        message: request.i18n.t("http_messages.registration_failed") || "Registration failed",
      });
    }
  });

  // Confirm email
  app.get(`${routePrefix}/:locale/verify-email/:token`, { schema: confirmEmailSchema }, async (request, reply) => {
    const { token } = request.params;
    const memberRepository = app.orm.getRepository(Member);

    try {
      // Find member with matching token
      const member = await memberRepository.findOne({
        where: { emailConfirmationToken: token },
      });

      if (!member) {
        return reply.code(HTTP_STATUS_UNAUTHORIZED).send({
          message: request.i18n.t("http_messages.invalid_confirmation_token") || "Invalid or expired confirmation token",
        });
      }

      // Check if already confirmed
      if (member.isActive) {
        return reply.code(HTTP_STATUS_OK).send({
          message: request.i18n.t("http_messages.email_already_confirmed") || "Email already confirmed",
          member: {
            id: member.id,
            email: member.email,
            firstName: member.firstName,
            lastName: member.lastName,
          },
        });
      }

      // Activate member and clear token
      member.isActive = true;
      member.emailConfirmationToken = null;
      await memberRepository.save(member);

      return reply.code(HTTP_STATUS_OK).send({
        message: request.i18n.t("http_messages.email_confirmed_successfully") || "Email confirmed successfully. Your account is now active.",
        member: {
          id: member.id,
          email: member.email,
          firstName: member.firstName,
          lastName: member.lastName,
        },
      });
    } catch (error) {
      console.error("Email confirmation error:", error);
      return reply.code(HTTP_STATUS_BAD_REQUEST).send({
        message: request.i18n.t("http_messages.confirmation_failed") || "Email confirmation failed",
      });
    }
  });

  // Forgot password
  app.post(`${routePrefix}/:locale/me/forgot-password`, { schema: forgotPasswordSchema }, async (request, reply) => {
    const { locale } = request.params;
    const { email } = request.body;
    const memberRepository = app.orm.getRepository(Member);

    try {
      // Find member by email (only active members can reset password)
      const member = await memberRepository.findOne({
        where: { email, isActive: true },
      });

      // Always return success message for security (don't reveal if email exists)
      if (!member) {
        return reply.code(HTTP_STATUS_OK).send({
          message:
            request.i18n.t("http_messages.password_reset_email_sent") || "If an account with that email exists, a password reset link has been sent.",
        });
      }

      // Generate password reset token
      const passwordResetToken = randomString(64);
      // Set expiration to 1 hour from now
      const passwordResetTokenExpiresAt = new Date();
      passwordResetTokenExpiresAt.setHours(passwordResetTokenExpiresAt.getHours() + 1);

      // Update member with reset token and expiration
      member.passwordResetToken = passwordResetToken;
      member.passwordResetTokenExpiresAt = passwordResetTokenExpiresAt;
      await memberRepository.save(member);

      // Send password reset email
      // Don't block the response if email fails
      try {
        await sendPasswordResetEmail({
          to: member.email,
          firstName: member.firstName,
          lastName: member.lastName,
          locale,
          token: passwordResetToken,
        });
      } catch (emailError) {
        // Log error but don't fail the request
        console.error("Failed to send password reset email:", emailError);
      }

      return reply.code(HTTP_STATUS_OK).send({
        message:
          request.i18n.t("http_messages.password_reset_email_sent") || "If an account with that email exists, a password reset link has been sent.",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      return reply.code(HTTP_STATUS_BAD_REQUEST).send({
        message: request.i18n.t("http_messages.forgot_password_failed") || "Failed to process password reset request",
      });
    }
  });

  // Reset password
  app.post(`${routePrefix}/:locale/me/reset-password/:token`, { schema: resetPasswordSchema }, async (request, reply) => {
    const { token } = request.params;
    const { password } = request.body;
    const memberRepository = app.orm.getRepository(Member);

    try {
      // Find member with matching token
      const member = await memberRepository.findOne({
        where: { passwordResetToken: token },
      });

      if (!member) {
        return reply.code(HTTP_STATUS_UNAUTHORIZED).send({
          message: request.i18n.t("http_messages.invalid_reset_token") || "Invalid or expired reset token",
        });
      }

      // Check if token has expired
      if (!member.passwordResetTokenExpiresAt || new Date() > member.passwordResetTokenExpiresAt) {
        // Clear expired token
        member.passwordResetToken = null;
        member.passwordResetTokenExpiresAt = null;
        await memberRepository.save(member);
        return reply.code(HTTP_STATUS_UNAUTHORIZED).send({
          message: request.i18n.t("http_messages.invalid_reset_token") || "Invalid or expired reset token",
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update password and clear reset token
      member.password = hashedPassword;
      member.passwordResetToken = null;
      member.passwordResetTokenExpiresAt = null;
      await memberRepository.save(member);

      return reply.code(HTTP_STATUS_OK).send({
        message:
          request.i18n.t("http_messages.password_reset_successful") ||
          "Password has been reset successfully. You can now login with your new password.",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      return reply.code(HTTP_STATUS_BAD_REQUEST).send({
        message: request.i18n.t("http_messages.password_reset_failed") || "Failed to reset password",
      });
    }
  });

  // Login member
  app.post(`${routePrefix}/:locale/me/login`, { schema: loginMemberSchema }, async (request, reply) => {
    const { email, password } = request.body;
    const memberRepository = app.orm.getRepository(Member);

    await loginMemberSchema.body
      .refine(
        async ({ email, password }) => {
          const member = await memberRepository.findOne({
            where: { email, isActive: true },
          });
          if (!member) return false;
          return bcrypt.compare(password, member.password);
        },
        {
          message: request.i18n.t("http_messages.invalid_email_or_password") || "Invalid email or password",
          path: ["email"],
        }
      )
      .parseAsync(request.body);

    const member = await memberRepository.findOne({ where: { email, isActive: true } });
    if (!member) {
      return reply.code(HTTP_STATUS_UNAUTHORIZED).send({
        message: request.i18n.t("http_messages.invalid_email_or_password") || "Invalid email or password",
      });
    }

    return reply.code(HTTP_STATUS_OK).send({
      message: request.i18n.t("http_messages.login_successful") || "Login successful",
      member: {
        id: member.id,
        email: member.email,
        firstName: member.firstName,
        lastName: member.lastName,
      },
    });
  });

  // Get member profile
  app.get(`${routePrefix}/:locale/me/profile/:id`, { schema: getMemberProfileSchema }, async (request, reply) => {
    const { id } = request.params;
    const memberRepository = app.orm.getRepository(Member);
    const preferredTravelPeriodRepo = app.orm.getRepository(PreferredTravelPeriod);

    try {
      // Get member with associations
      const member = await memberRepository.findOne({
        where: { id: Number(id), isActive: true },
        relations: ["region", "municipality", "categories", "tags", "preferredTravelPeriods"],
      });

      if (!member) {
        return reply.code(HTTP_STATUS_UNAUTHORIZED).send({
          message: request.i18n.t("http_messages.unauthorized") || "Unauthorized",
        });
      }

      // Return member profile (excluding password)
      // Separate categories by type
      const articleInterests = (member.categories || []).filter((cat) => cat.type === CategoriesType.ARTICLES).map((cat) => cat.id);

      const eventsInterests = (member.categories || []).filter((cat) => cat.type === CategoriesType.EVENTS).map((cat) => cat.id);

      const travelInterests = (member.tags || []).map((tag) => tag.id);

      const preferredTravelPeriod = (member.preferredTravelPeriods || []).map((p) => p.value);

      return reply.code(HTTP_STATUS_OK).send({
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        country: member.country,
        regionId: member.regionId,
        municipalityId: member.municipalityId,
        phone: member.phone,
        gender: member.gender,
        ageRange: member.ageRange,
        familySituation: member.familySituation,
        travelCompanion: member.travelCompanion,
        travelFrequency: member.travelFrequency,
        averageStayDuration: member.averageStayDuration,
        preferredTravelPeriod,
        averageBudget: member.averageBudget,
        articleInterests,
        eventsInterests,
        travelInterests,
        personalizedContentConsent: member.personalizedContentConsent,
        isActive: member.isActive,
      });
    } catch (error) {
      console.error("Get profile error:", error);
      return reply.code(HTTP_STATUS_UNAUTHORIZED).send({
        message: request.i18n.t("http_messages.unauthorized") || "Unauthorized",
      });
    }
  });

  // Update member profile
  app.put(`${routePrefix}/:locale/me/profile/:id`, { schema: updateMemberProfileSchema }, async (request, reply) => {
    const { id } = request.params;
    const memberRepository = app.orm.getRepository(Member);
    const preferredTravelPeriodRepo = app.orm.getRepository(PreferredTravelPeriod);

    try {
      const member = await memberRepository.findOne({ where: { id: Number(id), isActive: true } });
      if (!member) {
        return reply.code(HTTP_STATUS_UNAUTHORIZED).send({
          message: request.i18n.t("http_messages.unauthorized") || "Unauthorized",
        });
      }

      const {
        firstName,
        lastName,
        country,
        regionId,
        municipalityId,
        phone,
        gender,
        ageRange,
        familySituation,
        travelCompanion,
        travelFrequency,
        averageStayDuration,
        preferredTravelPeriod,
        averageBudget,
        articleInterests,
        eventsInterests,
        travelInterests,
        personalizedContentConsent,
      } = request.body;

      // Combine article and event interests into categoryIds
      const categoryIds = [...(articleInterests || []), ...(eventsInterests || [])];

      const updatedMember = await app.orm.transaction(async (manager) => {
        const memberRepo = manager.getRepository(Member);
        const categoryRepo = manager.getRepository(Category);
        const tagRepo = manager.getRepository(Tag);
        const preferredTravelPeriodTxRepo = manager.getRepository(PreferredTravelPeriod);

        // Update member profile
        if (firstName !== undefined) member.firstName = firstName;
        if (lastName !== undefined) member.lastName = lastName;
        if (country !== undefined) member.country = country;
        if (regionId !== undefined) member.regionId = regionId;
        if (municipalityId !== undefined) member.municipalityId = municipalityId;
        if (phone !== undefined) member.phone = phone;
        if (gender !== undefined) member.gender = gender;
        if (ageRange !== undefined) member.ageRange = ageRange;
        if (familySituation !== undefined) member.familySituation = familySituation;
        if (travelCompanion !== undefined) member.travelCompanion = travelCompanion;
        if (travelFrequency !== undefined) member.travelFrequency = travelFrequency;
        if (averageStayDuration !== undefined) member.averageStayDuration = averageStayDuration;
        if (preferredTravelPeriod !== undefined) {
          if (preferredTravelPeriod && preferredTravelPeriod.length > 0) {
            const periods = await preferredTravelPeriodTxRepo.find({ where: { value: In(preferredTravelPeriod) } });
            member.preferredTravelPeriods = periods;
          } else {
            member.preferredTravelPeriods = [];
          }
        }
        if (averageBudget !== undefined) member.averageBudget = averageBudget;
        if (personalizedContentConsent !== undefined) member.personalizedContentConsent = personalizedContentConsent;

        await memberRepo.save(member);

        // Update categories if provided
        if (Array.isArray(categoryIds)) {
          const categories = await categoryRepo.find({
            where: { id: In(categoryIds) },
          });
          member.categories = categories;
          await memberRepo.save(member);
        }

        // Update tags if provided
        if (Array.isArray(travelInterests)) {
          const tags = await tagRepo.find({
            where: { id: In(travelInterests) },
          });
          member.tags = tags;
          await memberRepo.save(member);
        }

        // Get updated member with categories, tags, and preferred travel periods
        return await memberRepo.findOne({
          where: { id: member.id },
          relations: ["categories", "tags", "preferredTravelPeriods"],
        });
      });

      if (!updatedMember) {
        return reply.code(HTTP_STATUS_UNAUTHORIZED).send({
          message: request.i18n.t("http_messages.unauthorized") || "Unauthorized",
        });
      }

      // Separate categories by type
      const updatedArticleInterests = (updatedMember.categories || []).filter((cat) => cat.type === CategoriesType.ARTICLES).map((cat) => cat.id);
      const updatedEventsInterests = (updatedMember.categories || []).filter((cat) => cat.type === CategoriesType.EVENTS).map((cat) => cat.id);
      const updatedTravelInterests = (updatedMember.tags || []).map((tag) => tag.id);

      const preferredTravelPeriodList = (updatedMember.preferredTravelPeriods || []).map((p) => p.value);

      return reply.code(HTTP_STATUS_OK).send({
        id: updatedMember.id,
        firstName: updatedMember.firstName,
        lastName: updatedMember.lastName,
        email: updatedMember.email,
        country: updatedMember.country,
        regionId: updatedMember.regionId,
        municipalityId: updatedMember.municipalityId,
        phone: updatedMember.phone,
        gender: updatedMember.gender,
        ageRange: updatedMember.ageRange,
        familySituation: updatedMember.familySituation,
        travelCompanion: updatedMember.travelCompanion,
        travelFrequency: updatedMember.travelFrequency,
        averageStayDuration: updatedMember.averageStayDuration,
        preferredTravelPeriod: preferredTravelPeriodList,
        averageBudget: updatedMember.averageBudget,
        articleInterests: updatedArticleInterests,
        eventsInterests: updatedEventsInterests,
        travelInterests: updatedTravelInterests,
        personalizedContentConsent: updatedMember.personalizedContentConsent,
        isActive: updatedMember.isActive,
      });
    } catch (error) {
      console.error("Update profile error:", error);
      return reply.code(HTTP_STATUS_BAD_REQUEST).send({
        message: request.i18n.t("http_messages.update_profile_failed") || "Update profile failed",
      });
    }
  });

  // Delete member account
  app.delete(`${routePrefix}/:locale/me/profile/:id`, { schema: deleteMemberProfileSchema }, async (request, reply) => {
    const { id } = request.params;
    const memberRepository = app.orm.getRepository(Member);

    try {
      const member = await memberRepository.findOne({ where: { id: Number(id), isActive: true } });
      if (!member) {
        return reply.code(HTTP_STATUS_UNAUTHORIZED).send({
          message: request.i18n.t("http_messages.unauthorized") || "Unauthorized",
        });
      }

      await memberRepository.remove(member);

      return reply.code(HTTP_STATUS_OK).send({
        message: request.i18n.t("http_messages.account_deleted_successfully") || "Account deleted successfully",
      });
    } catch (error) {
      console.error("Delete account error:", error);
      return reply.code(HTTP_STATUS_BAD_REQUEST).send({
        message: request.i18n.t("http_messages.delete_account_failed") || "Failed to delete account",
      });
    }
  });
};

export default memberAuthController;
