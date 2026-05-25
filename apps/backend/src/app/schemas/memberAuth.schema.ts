import { z } from "zod";
import {
  CountryEnum,
  GenderEnum,
  AgeRangeEnum,
  FamilySituationEnum,
  TravelCompanionEnum,
  TravelFrequencyEnum,
  AverageStayDurationEnum,
  PreferredTravelPeriodEnum,
  AverageBudgetEnum,
} from "../../entries/memberEnums.entry";
import {
  HTTP_STATUS_CONFLICT,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_OK,
  HTTP_STATUS_UNAUTHORIZED,
} from "../../config/httpStatus.config";

// Base schema for member registration
export const registerMemberSchema = {
  params: z.object({
    locale: z.string(),
  }),
  body: z
    .object({
      // Mandatory fields
      firstName: z.string().min(1).max(100),
      lastName: z.string().min(1).max(100),
      email: z.string().email().max(255),
      password: z.string().min(8).max(100),
      confirmPassword: z.string().min(8).max(100),
      country: z.nativeEnum(CountryEnum),
      regionId: z.string().max(2).optional().nullable(),
      municipalityId: z.string().max(10).optional().nullable(),
      phone: z.string().max(20).optional().nullable(),

      // Personal Profile (optional)
      gender: z.nativeEnum(GenderEnum).optional().nullable(),
      ageRange: z.nativeEnum(AgeRangeEnum).optional().nullable(),
      familySituation: z.nativeEnum(FamilySituationEnum).optional().nullable(),
      travelCompanion: z.nativeEnum(TravelCompanionEnum).optional().nullable(),

      // Travel Habits (optional)
      travelFrequency: z.nativeEnum(TravelFrequencyEnum).optional().nullable(),
      averageStayDuration: z.nativeEnum(AverageStayDurationEnum).optional().nullable(),
      preferredTravelPeriod: z.array(z.nativeEnum(PreferredTravelPeriodEnum)).optional().default([]),
      averageBudget: z.nativeEnum(AverageBudgetEnum).optional().nullable(),

      // Interests (arrays of IDs)
      articleInterests: z.array(z.number().positive()).default([]),
      eventsInterests: z.array(z.number().positive()).default([]),
      travelInterests: z.array(z.number().positive()).default([]),

      // Consent and Privacy
      personalizedContentConsent: z.boolean().optional().default(false),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }),
  response: {
    [HTTP_STATUS_CREATED]: z.object({
      message: z.string(),
      member: z.object({
        id: z.number(),
        email: z.string(),
        firstName: z.string(),
        lastName: z.string(),
      }),
    }),
    [HTTP_STATUS_BAD_REQUEST]: z.object({
      message: z.string(),
    }),
    [HTTP_STATUS_CONFLICT]: z.object({
      message: z.string(),
    }),
  },
};

// Schema for member login
export const loginMemberSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.object({
      message: z.string(),
      member: z.object({
        id: z.number(),
        email: z.string(),
        firstName: z.string(),
        lastName: z.string(),
      }),
    }),
    [HTTP_STATUS_UNAUTHORIZED]: z.object({
      message: z.string(),
    }),
  },
};

// Schema for getting member profile
export const getMemberProfileSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.object({
      id: z.number(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      country: z.nativeEnum(CountryEnum),
      regionId: z.string().nullable(),
      municipalityId: z.string().nullable(),
      phone: z.string().nullable(),
      gender: z.nativeEnum(GenderEnum).nullable(),
      ageRange: z.nativeEnum(AgeRangeEnum).nullable(),
      familySituation: z.nativeEnum(FamilySituationEnum).nullable(),
      travelCompanion: z.nativeEnum(TravelCompanionEnum).nullable(),
      travelFrequency: z.nativeEnum(TravelFrequencyEnum).nullable(),
      averageStayDuration: z.nativeEnum(AverageStayDurationEnum).nullable(),
      preferredTravelPeriod: z.array(z.nativeEnum(PreferredTravelPeriodEnum)).nullable(),
      averageBudget: z.nativeEnum(AverageBudgetEnum).nullable(),
      articleInterests: z.array(z.number()),
      eventsInterests: z.array(z.number()),
      travelInterests: z.array(z.number()),
      personalizedContentConsent: z.boolean(),
      isActive: z.boolean(),
    }),
    [HTTP_STATUS_UNAUTHORIZED]: z.object({
      message: z.string(),
    }),
  },
};

// Schema for deleting member account
export const deleteMemberProfileSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.object({
      message: z.string(),
    }),
    [HTTP_STATUS_UNAUTHORIZED]: z.object({
      message: z.string(),
    }),
    [HTTP_STATUS_BAD_REQUEST]: z.object({
      message: z.string(),
    }),
  },
};

// Schema for updating member profile
export const updateMemberProfileSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  body: z.object({
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    country: z.nativeEnum(CountryEnum).optional(),
    regionId: z.string().max(2).nullable().optional(),
    municipalityId: z.string().max(10).nullable().optional(),
    phone: z.string().max(20).nullable().optional(),

    gender: z.nativeEnum(GenderEnum).nullable().optional(),
    ageRange: z.nativeEnum(AgeRangeEnum).nullable().optional(),
    familySituation: z.nativeEnum(FamilySituationEnum).nullable().optional(),
    travelCompanion: z.nativeEnum(TravelCompanionEnum).nullable().optional(),

    travelFrequency: z.nativeEnum(TravelFrequencyEnum).nullable().optional(),
    averageStayDuration: z.nativeEnum(AverageStayDurationEnum).nullable().optional(),
    preferredTravelPeriod: z.array(z.nativeEnum(PreferredTravelPeriodEnum)).optional(),
    averageBudget: z.nativeEnum(AverageBudgetEnum).nullable().optional(),

    articleInterests: z.array(z.number().positive()),
    eventsInterests: z.array(z.number().positive()),
    travelInterests: z.array(z.number().positive()),

    personalizedContentConsent: z.boolean().optional(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.object({
      id: z.number(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      country: z.nativeEnum(CountryEnum),
      regionId: z.string().nullable(),
      municipalityId: z.string().nullable(),
      phone: z.string().nullable(),
      gender: z.nativeEnum(GenderEnum).nullable(),
      ageRange: z.nativeEnum(AgeRangeEnum).nullable(),
      familySituation: z.nativeEnum(FamilySituationEnum).nullable(),
      travelCompanion: z.nativeEnum(TravelCompanionEnum).nullable(),
      travelFrequency: z.nativeEnum(TravelFrequencyEnum).nullable(),
      averageStayDuration: z.nativeEnum(AverageStayDurationEnum).nullable(),
      preferredTravelPeriod: z.array(z.nativeEnum(PreferredTravelPeriodEnum)),
      averageBudget: z.nativeEnum(AverageBudgetEnum).nullable(),
      articleInterests: z.array(z.number()),
      eventsInterests: z.array(z.number()),
      travelInterests: z.array(z.number()),
      personalizedContentConsent: z.boolean(),
      isActive: z.boolean(),
    }),
    [HTTP_STATUS_UNAUTHORIZED]: z.object({
      message: z.string(),
    }),
    [HTTP_STATUS_BAD_REQUEST]: z.object({
      message: z.string(),
    }),
  },
};

// Schema for email confirmation
export const confirmEmailSchema = {
  params: z.object({
    locale: z.string(),
    token: z.string().min(1),
  }),
  response: {
    [HTTP_STATUS_OK]: z.object({
      message: z.string(),
      member: z.object({
        id: z.number(),
        email: z.string(),
        firstName: z.string(),
        lastName: z.string(),
      }),
    }),
    [HTTP_STATUS_BAD_REQUEST]: z.object({
      message: z.string(),
    }),
    [HTTP_STATUS_UNAUTHORIZED]: z.object({
      message: z.string(),
    }),
  },
};

// Schema for forgot password
export const forgotPasswordSchema = {
  params: z.object({
    locale: z.string(),
  }),
  body: z.object({
    email: z.string().email(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.object({
      message: z.string(),
    }),
    [HTTP_STATUS_BAD_REQUEST]: z.object({
      message: z.string(),
    }),
  },
};

// Schema for reset password
export const resetPasswordSchema = {
  params: z.object({
    locale: z.string(),
    token: z.string().min(1),
  }),
  body: z
    .object({
      password: z.string().min(8).max(100),
      confirmPassword: z.string().min(8).max(100),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }),
  response: {
    [HTTP_STATUS_OK]: z.object({
      message: z.string(),
    }),
    [HTTP_STATUS_BAD_REQUEST]: z.object({
      message: z.string(),
    }),
    [HTTP_STATUS_UNAUTHORIZED]: z.object({
      message: z.string(),
    }),
  },
};
