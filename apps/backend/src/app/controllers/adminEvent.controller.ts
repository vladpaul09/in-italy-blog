import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import webpush from "web-push";
import { Op, Transaction, literal, where } from "sequelize";
import PushSubscription from "../models/pushSubscription.model";
import { haversineDistanceLiteral } from "../../utils/haversineDistance.util";
import {
  adminEventCreateSchema,
  adminEventDeleteSchema,
  adminEventEditSchema,
  adminEventLanguages,
  adminEventListSchema,
  adminEventSchema,
} from "../schemas/adminEvent.schema";
import {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_SERVER_ERROR,
} from "../../config/httpStatus.config";
import { Event, EventLanguage, EventCategory, UserAlias } from "../models";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import sequelizeConnector from "../../config/sequelizeConnector.config";
import randomString from "../../utils/randomString";
import slugifyService from "../services/slugify.service";
import { deleteUploadedFile, saveUploadedFile } from "../../utils/upload";
import config from "../../config/app.config";
import formatI18nEvent from "../../utils/formatI18nEvent.util";
import stripText from "../../utils/stripText.util";

const adminEventController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  const checkAuthorAlias = async (authorId?: number | null, authorAliasId?: number | null) => {
    if (authorAliasId && authorId) {
      if (await UserAlias.findOne({ where: { id: authorAliasId, userId: authorId } })) {
        return authorAliasId;
      }
    }
    return null;
  };

  const getInstance = (id: number, userId?: number, t?: Transaction) =>
    Event.findOne({
      where: { id, ...(userId ? { [Op.or]: [{ userId }, { userReviewId: userId }] } : {}) },
      include: [
        { association: "eventLanguages", include: [{ association: "language" }] },
        { association: "municipality" },
        { association: "categories" },
      ],
      transaction: t,
    });

  const formatLanguages = (instance: Event) =>
    (instance.eventLanguages || []).reduce(
      (previous, current) => ({
        ...previous,
        [current.languageId]: {
          langId: current.languageId,
          title: current.title,
          description: current.description,
        },
      }),
      {} as Record<string, z.infer<typeof adminEventLanguages>>
    );

  const imageUrlBase = (imageName: string, imageFileName: string) => ({
    src: `${config.serverNameStatics}/uploads/images/events/${imageFileName}`,
    title: imageName,
  });

  app.get(routePrefix, { schema: adminEventListSchema, preParsing: app.permGuard("admin.events.list") }, async (request, reply) => {
    const { rangeFirst, rangeLast, sortBy, sortOrder, filter } = request.query;
    const filters: {
      q?: string;
      title?: string;
      category?: string;
      municipality?: string;
      needsReview?: boolean;
      createdAtStart?: string;
      createdAtEnd?: string;
      author?: string | number;
      user_review?: string | number;
      publish?: boolean;
      createdAt?: string;
    } = JSON.parse(filter);

    const userOwnOnly = await app.permGuardCheck(`admin.events.own`)(request);
    const isSuperUser = await app.isSuperUser(request);
    const currentLocale = await app.currentLocale(request);

    const { count, rows } = await Event.findAndCountAll({
      where: {
        ...(userOwnOnly && !isSuperUser ? { [Op.or]: [{ userId: request.user.id }, { userReviewId: request.user.id }] } : {}),
        ...(filters.needsReview
          ? { userReviewId: { [Op.is]: null } }
          : userOwnOnly && !isSuperUser
          ? { [Op.or]: [{ userId: request.user.id }, { userReviewId: request.user.id }] }
          : {}),
        ...(filters.createdAtStart && !filters.createdAtEnd ? { createdAt: { [Op.gte]: filters.createdAtStart } } : {}),
        ...(!filters.createdAtStart && filters.createdAtEnd ? { createdAt: { [Op.lte]: filters.createdAtEnd } } : {}),
        ...(filters.createdAtStart && filters.createdAtEnd ? { createdAt: { [Op.between]: [filters.createdAtStart, filters.createdAtEnd] } } : {}),
        ...(filters.author ? { authorId: filters.author } : {}),
        ...(filters.publish !== undefined ? { publish: filters.publish } : {}),
        ...(filters.createdAt ? { createdAt: { [Op.gte]: filters.createdAt } } : {}),
      },
      include: [
        {
          association: "eventLanguages",
          ...(filters.q || filters.title
            ? { where: { title: { [Op.like]: `%${filters.q || filters.title}%` } }, required: true }
            : { required: false, separate: true }),
        },
        { association: "categories", ...(filters.category ? { where: { id: filters.category }, required: true } : { required: false }) },
        { association: "municipality", ...(filters.municipality ? { where: { id: filters.municipality }, required: true } : { required: false }) },
      ],
      offset: rangeFirst,
      limit: rangeLast - rangeFirst + 1,
      order: [[sortBy, sortOrder]],
      distinct: true,
    });

    return reply.code(HTTP_STATUS_OK).send({
      data: rows.map((item) => {
        const language = (item.eventLanguages || []).find((eventLanguage) => eventLanguage.languageId === currentLocale);
        return {
          id: item.id,
          name: language ? language.title : config.noNameDefault,
          startDate: item.startDate,
          endDate: item.endDate,
          municipality: item.municipalityId,
          categories: item.categories ? item.categories.map((item) => item.id) : [],
          user: item.userId,
          userReview: item.userReviewId,
          publish: item.publish,
          authorId: item.authorId,
          createdAt: item.createdAt,
        };
      }),
      total: count,
    });
  });

  app.get(`${routePrefix}/:id`, { schema: adminEventSchema, preParsing: app.permGuard("admin.events.show") }, async (request, reply) => {
    const { id } = request.params;
    const userOwnOnly = await app.permGuardCheck(`admin.events.own`)(request);
    const isSuperUser = await app.isSuperUser(request);
    const instance = await getInstance(id, userOwnOnly && !isSuperUser ? request.user.id : undefined);

    if (!instance) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    }

    return reply.code(HTTP_STATUS_OK).send({
      id: instance.id,
      slug: instance.slug,
      publish: instance.publish,
      image: instance.image ? imageUrlBase(instance.slug, instance.image) : null,
      mobileImage: instance.mobileImage ? imageUrlBase(instance.slug, instance.mobileImage) : null,
      municipalityId: instance.municipalityId,
      categories: instance.categories ? instance.categories.map((item) => item.id) : [],
      latitude: instance.latitude,
      longitude: instance.longitude,
      authorId: instance.authorId,
      authorAliasId: instance.authorAliasId,
      dateInterval: {
        startDate: instance.startDate.toISOString(),
        endDate: instance.endDate.toISOString(),
      },
      eventLanguages: formatLanguages(instance),
    });
  });

  app.post(routePrefix, { schema: adminEventCreateSchema, preParsing: app.permGuard("admin.events.create") }, async (request, reply) => {
    try {
      const {
        image,
        mobileImage,
        eventLanguages,
        municipalityId,
        categories,
        latitude,
        longitude,
        dateInterval,
        publish,
        authorId,
        authorAliasId,
      } = request.body;

      const { instance, instanceChildObj, instanceCategoriesCreated } = await sequelizeConnector.transaction(async (t) => {
        const record = await Event.create(
          {
            slug: randomString(),
            image: randomString(),
            userId: request.user.id,
            userReviewId: (await app.permGuardCheck(`admin.events.review`)(request)) ? request.user.id : null,
            latitude: latitude,
            longitude: longitude,
            authorId: authorId ?? request.user.id,
            authorAliasId: await checkAuthorAlias(authorId, authorAliasId),
            municipalityId,
            startDate: new Date(dateInterval.startDate),
            endDate: new Date(dateInterval.endDate),
            publish: publish ?? false,
          },
          { transaction: t }
        );
        const defaultIsoCode = await app.defaultIsoCode(t);

        const categoriesCreated = await EventCategory.bulkCreate(
          categories.map((item) => ({ eventId: record.id, categoryId: item })),
          { transaction: t }
        );
        let recordChildObj: { [key: string]: z.infer<typeof adminEventLanguages> } = {};
        for (const [isoCode, { langId, title, description }] of Object.entries(eventLanguages)) {
          if (isoCode === defaultIsoCode) {
            record.slug = slugifyService(`${title} ${record.id}`);
            if (image) {
              record.image = await saveUploadedFile(image, ["images", "events"], `${record.slug}-${Date.now()}`);
            } else {
              record.image = null;
            }
            if (mobileImage) {
              record.mobileImage = await saveUploadedFile(mobileImage, ["images", "events"], `${record.slug}-mobile-${Date.now()}`);
            } else {
              record.mobileImage = null;
            }
            await record.save({ transaction: t });
          }
          const recordChild = await EventLanguage.create(
            {
              eventId: record.id,
              languageId: langId,
              title: title,
              description: description ?? null,
            },
            { transaction: t }
          );
          recordChildObj[recordChild.languageId] = {
            langId: recordChild.languageId,
            title: recordChild.title,
            description: recordChild.description,
          };
        }
        return { instance: record, instanceChildObj: recordChildObj, instanceCategoriesCreated: categoriesCreated };
      });

      // Send push notifications if the event is published
      if (instance.publish) {
        const eventForNotification = await Event.findByPk(instance.id, {
          include: [{ association: "eventLanguages" }, { association: "author" }, { association: "authorAlias" }],
        });

        if (eventForNotification && eventForNotification.latitude && eventForNotification.longitude) {
          // Get subscribers within 200km using SQL with Haversine formula
          (
            await PushSubscription.findAll({
              attributes: {
                include: [
                  [
                    literal(
                      haversineDistanceLiteral(Number(eventForNotification.latitude), Number(eventForNotification.longitude), "PushSubscription")
                    ),
                    "distance",
                  ],
                ],
              },
              where: {
                [Op.and]: [
                  { latitude: { [Op.not]: null } },
                  { longitude: { [Op.not]: null } },
                  where(
                    literal(
                      haversineDistanceLiteral(Number(eventForNotification.latitude), Number(eventForNotification.longitude), "PushSubscription")
                    ),
                    "<=",
                    200
                  ),
                ],
              },
              order: [[literal("distance"), "ASC"]],
            })
          ).forEach(async (subscription) => {
            const formattedEvent = await formatI18nEvent(
              eventForNotification,
              eventForNotification.author!,
              eventForNotification.authorAlias,
              subscription.locale
            );
            webpush.setVapidDetails(config.vapid.subject, config.vapid.publicKey, config.vapid.privateKey);
            webpush
              .sendNotification(
                {
                  endpoint: subscription.endpoint,
                  keys: {
                    p256dh: subscription.p256dhKey,
                    auth: subscription.authKey,
                  },
                },
                JSON.stringify({
                  id: formattedEvent.id,
                  title: formattedEvent.title,
                  content: stripText(formattedEvent.description ?? "", true, 50),
                  openUrl: `/${subscription.locale}/evento/${formattedEvent.slug}`,
                })
              )
              .catch((error) => {
                console.log(error);
              });
          });
        }
      }

      return reply.code(HTTP_STATUS_CREATED).send({
        id: instance.id,
        image: instance.image ? imageUrlBase(instance.slug, instance.image) : null,
        mobileImage: instance.mobileImage ? imageUrlBase(instance.slug, instance.mobileImage) : null,
        slug: instance.slug,
        categories: instanceCategoriesCreated.map((item) => item.categoryId),
        municipalityId: instance.municipalityId,
        latitude: instance.latitude,
        longitude: instance.longitude,
        authorId: instance.authorId,
        authorAliasId: instance.authorAliasId,
        dateInterval: {
          startDate: instance.startDate.toISOString(),
          endDate: instance.endDate.toISOString(),
        },
        eventLanguages: instanceChildObj,
      });
    } catch (error) {
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });

  app.put(`${routePrefix}/:id`, { schema: adminEventEditSchema, preParsing: app.permGuard("admin.events.edit") }, async (request, reply) => {
    try {
      const { id } = request.params;
      const {
        slug,
        image,
        mobileImage,
        eventLanguages,
        municipalityId,
        categories,
        latitude,
        longitude,
        dateInterval,
        publish,
        authorId,
        authorAliasId,
      } = request.body;

      const instance = await sequelizeConnector.transaction(async (t) => {
        const userOwnOnly = await app.permGuardCheck(`admin.events.own`)(request);
        const isSuperUser = await app.isSuperUser(request);
        const record = await getInstance(id, userOwnOnly && !isSuperUser ? request.user.id : undefined, t);
        if (!record) {
          return null;
        }
        const wasPublishedBefore = record.publish;

        record.slug = slug;
        record.latitude = latitude || null;
        record.longitude = longitude || null;
        record.municipalityId = municipalityId;
        record.startDate = new Date(dateInterval.startDate);
        record.endDate = new Date(dateInterval.endDate);
        record.publish = (await app.permGuardCheck(`admin.events.review`)(request)) ? publish ?? record.publish : record.publish;
        record.userReviewId = (await app.permGuardCheck(`admin.events.review`)(request)) ? request.user.id : record.userReviewId;
        record.authorId = authorId ?? record.authorId;
        record.authorAliasId = await checkAuthorAlias(authorId, authorAliasId);

        if (image) {
          if (record.image) deleteUploadedFile(record.image, ["images", "events"]);
          record.image = await saveUploadedFile(image, ["images", "events"], `${record.slug}-${Date.now()}`);
        } else if (image === null && record.image) {
          //TO DO: See if we can send from frontend null if user deleted image
          //deleteUploadedFile(record.image, ["images", "events"]);
          record.image = null;
        }
        if (mobileImage) {
          if (record.mobileImage) deleteUploadedFile(record.mobileImage, ["images", "events"]);
          record.mobileImage = await saveUploadedFile(mobileImage, ["images", "events"], `${record.slug}-mobile-${Date.now()}`);
        } else if (mobileImage === null && record.mobileImage) {
          //TO DO: See if we can send from frontend null if user deleted image
          //deleteUploadedFile(record.mobileImage, ["images", "events"]);
          record.mobileImage = null;
        }
        record.save({ transaction: t });

        await EventCategory.destroy({ where: { eventId: record.id }, transaction: t });
        const categoriesCreated = await EventCategory.bulkCreate(
          categories.map((item) => ({ eventId: record.id, categoryId: item })),
          { transaction: t }
        );

        await EventLanguage.destroy({ where: { eventId: record.id }, transaction: t });
        let recordChildObj: Record<string, z.infer<typeof adminEventLanguages>> = {};
        for (const [isoCode, { langId, title, description }] of Object.entries(eventLanguages)) {
          const recordChild = await EventLanguage.create(
            {
              eventId: record.id,
              languageId: langId,
              title: title,
              description: description ?? null,
            },
            { transaction: t }
          );
          recordChildObj[recordChild.languageId] = {
            langId: recordChild.languageId,
            title: recordChild.title,
            description: recordChild.description,
          };
        }
        return { record, recordChildObj, wasPublishedBefore, categoriesCreated };
      });

      if (!instance) {
        return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
      }

      if (!instance.wasPublishedBefore && instance.record.publish) {
        const eventForNotification = await Event.findByPk(instance.record.id, {
          include: [{ association: "eventLanguages" }, { association: "author" }, { association: "authorAlias" }],
        });

        if (eventForNotification && eventForNotification.latitude && eventForNotification.longitude) {
          // Get subscribers within 200km using SQL with Haversine formula
          (
            await PushSubscription.findAll({
              attributes: {
                include: [
                  [
                    literal(
                      haversineDistanceLiteral(Number(eventForNotification.latitude), Number(eventForNotification.longitude), "PushSubscription")
                    ),
                    "distance",
                  ],
                ],
              },
              where: {
                [Op.and]: [
                  { latitude: { [Op.not]: null } },
                  { longitude: { [Op.not]: null } },
                  where(
                    literal(
                      haversineDistanceLiteral(Number(eventForNotification.latitude), Number(eventForNotification.longitude), "PushSubscription")
                    ),
                    "<=",
                    200
                  ),
                ],
              },
              order: [[literal("distance"), "ASC"]],
            })
          ).forEach(async (subscription) => {
            const formattedEvent = await formatI18nEvent(
              eventForNotification,
              eventForNotification.author!,
              eventForNotification.authorAlias,
              subscription.locale
            );
            webpush.setVapidDetails(config.vapid.subject, config.vapid.publicKey, config.vapid.privateKey);
            webpush
              .sendNotification(
                {
                  endpoint: subscription.endpoint,
                  keys: {
                    p256dh: subscription.p256dhKey,
                    auth: subscription.authKey,
                  },
                },
                JSON.stringify({
                  id: formattedEvent.id,
                  title: formattedEvent.title,
                  content: stripText(formattedEvent.description ?? "", true, 50),
                  openUrl: `/${subscription.locale}/evento/${formattedEvent.slug}`,
                })
              )
              .catch((error) => {
                console.log(error);
              });
          });
        }
      }

      return reply.code(HTTP_STATUS_CREATED).send({
        id: instance.record.id,
        image: instance.record.image ? imageUrlBase(instance.record.slug, instance.record.image) : null,
        mobileImage: instance.record.mobileImage ? imageUrlBase(instance.record.slug, instance.record.mobileImage) : null,
        slug: instance.record.slug,
        categories: instance.categoriesCreated.map((item) => item.categoryId),
        municipalityId: instance.record.municipalityId,
        latitude: instance.record.latitude,
        longitude: instance.record.longitude,
        authorId: instance.record.authorId,
        authorAliasId: instance.record.authorAliasId,
        dateInterval: {
          startDate: instance.record.startDate.toISOString(),
          endDate: instance.record.endDate.toISOString(),
        },
        eventLanguages: instance.recordChildObj,
      });
    } catch (error) {
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });

  app.delete(`${routePrefix}/:id`, { schema: adminEventDeleteSchema, preParsing: app.permGuard("admin.events.delete") }, async (request, reply) => {
    try {
      const { id } = request.params;
      const instance = await sequelizeConnector.transaction(async (t) => {
        const userOwnOnly = await app.permGuardCheck(`admin.events.own`)(request);
        const isSuperUser = await app.isSuperUser(request);
        const instance = await getInstance(id, userOwnOnly && !isSuperUser ? request.user.id : undefined, t);
        if (!instance) {
          return null;
        } else {
          if (instance.image) {
            deleteUploadedFile(instance.image, ["images", "events"]);
          }
          await instance.destroy({ transaction: t });
        }
        return instance;
      });
      if (!instance) return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
      return reply.code(HTTP_STATUS_NO_CONTENT).send(true);
    } catch (error) {
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });
};

export default adminEventController;
