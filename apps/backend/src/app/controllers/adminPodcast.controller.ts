import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { Op, Transaction } from "sequelize";
import z from "zod";
import {
  adminPodcastListSchema,
  adminPodcastSchema,
  adminPodcastCreateSchema,
  adminPodcastEditSchema,
  adminPodcastDeleteSchema,
  adminPodcastLanguages,
} from "../schemas/adminPodcast.schema";
import {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_SERVER_ERROR,
} from "../../config/httpStatus.config";
import { Podcast, PodcastLanguage, PodcastCategory, Category, Municipality, UserAlias } from "../models";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import sequelizeConnector from "../../config/sequelizeConnector.config";
import randomString from "../../utils/randomString";
import slugifyService from "../services/slugify.service";
import { deleteUploadedFile, saveUploadedFile } from "../../utils/upload";
import config from "../../config/app.config";
import PodcastMunicipality from "../models/podcastMunicipality.model";

const adminPodcastController: FastifyPluginAsyncZod<IBaseRoute> = async (app, { routePrefix }) => {
  const checkAuthorAlias = async (authorId?: number | null, authorAliasId?: number | null) => {
    if (authorAliasId && authorId) {
      if (await UserAlias.findOne({ where: { id: authorAliasId, userId: authorId } })) {
        return authorAliasId;
      }
    }
    return null;
  };

  const getInstance = (id: number, userId?: number, t?: Transaction) => {
    return Podcast.findOne({
      where: { id, ...(userId ? { [Op.or]: [{ userId }, { userReviewId: userId }] } : {}) },
      include: [
        { association: "podcastLanguages", include: [{ association: "language" }] },
        { association: "categories" },
        { association: "municipalities" },
      ],
      transaction: t,
    });
  };

  const formatLanguages = (instance: Podcast) =>
    (instance.podcastLanguages || []).reduce(
      (previous, current) => ({
        ...previous,
        [current.languageId]: {
          langId: current.languageId,
          title: current.title,
          shortDescription: current.shortDescription,
          description: current.description,
        },
      }),
      {} as Record<string, z.infer<typeof adminPodcastLanguages>>
    );

  const imageUrlBase = (slug: string, imageFileName: string) => ({
    src: `${config.serverNameStatics}/uploads/images/podcasts/${imageFileName || ""}`,
    title: slug,
  });

  app.get(routePrefix, { schema: adminPodcastListSchema, preParsing: app.permGuard("admin.podcasts.list") }, async (request, reply) => {
    const { rangeFirst, rangeLast, sortBy, sortOrder, filter } = request.query;
    const filters: {
      q?: string;
      title?: string;
      category?: string;
      municipality?: string;
      needsReview?: boolean;
      publish?: boolean;
      scope?: string;
      author?: number;
      createdAtStart?: string;
      createdAtEnd?: string;
    } = JSON.parse(filter);

    const userOwnOnly = await app.permGuardCheck(`admin.podcasts.own`)(request);
    const isSuperUser = await app.isSuperUser(request);

    const { rows, count } = await Podcast.findAndCountAll({
      where: {
        ...(userOwnOnly && !isSuperUser ? { [Op.or]: [{ userId: request.user.id }, { userReviewId: request.user.id }] } : {}),
        ...(filters.scope ? { scope: filters.scope } : {}),
        ...(filters.needsReview
          ? { userReviewId: { [Op.is]: null } }
          : userOwnOnly && !isSuperUser
          ? { [Op.or]: [{ userId: request.user.id }, { userReviewId: request.user.id }] }
          : {}),
        ...(filters.publish !== undefined ? { publish: filters.publish } : {}),
        ...(filters.author ? { authorId: filters.author } : {}),
        ...(filters.createdAtStart ? { createdAt: { [Op.gte]: filters.createdAtStart } } : {}),
        ...(filters.createdAtEnd ? { createdAt: { [Op.lte]: filters.createdAtEnd } } : {}),
      },
      include: [
        {
          model: PodcastLanguage,
          as: "podcastLanguages",
          ...(filters.q || filters.title
            ? { where: { title: { [Op.like]: `%${filters.q || filters.title}%` } }, required: true }
            : { required: false, separate: true }),
        },
        {
          model: Municipality,
          as: "municipalities",
          ...(filters.municipality ? { where: { id: filters.municipality }, required: true } : { required: false }),
        },
        {
          model: Category,
          as: "categories",
          ...(filters.category ? { where: { id: filters.category }, required: true } : { required: false }),
        },
      ],
      offset: rangeFirst,
      limit: rangeLast - rangeFirst + 1,
      order: [[sortBy, sortOrder]],
      distinct: true,
    });

    const currentLocale = await app.currentLocale(request);

    return reply.code(HTTP_STATUS_OK).send({
      data: rows.map((item) => {
        const language = (item.podcastLanguages || []).find((podcastLanguage) => podcastLanguage.languageId === currentLocale);
        return {
          id: item.id,
          name: language ? language.title : config.noNameDefault,
          municipalities: item.municipalities ? item.municipalities.map((item) => item.id) : [],
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

  app.get(`${routePrefix}/:id`, { schema: adminPodcastSchema, preParsing: app.permGuard("admin.podcasts.show") }, async (request, reply) => {
    const { id } = request.params;

    const userOwnOnly = await app.permGuardCheck(`admin.podcasts.own`)(request);
    const isSuperUser = await app.isSuperUser(request);
    const instance = await getInstance(id, userOwnOnly && !isSuperUser ? request.user.id : undefined);

    if (!instance) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    }

    return reply.code(HTTP_STATUS_OK).send({
      id: instance.id,
      slug: instance.slug,
      youtubeLink: instance.youtubeLink,
      image: instance.image ? imageUrlBase(instance.slug, instance.image) : null,
      mobileImage: instance.mobileImage ? imageUrlBase(instance.slug, instance.mobileImage) : null,
      categories: instance.categories?.map((category) => category.id) || [],
      publish: instance.publish,
      latitude: instance.latitude,
      longitude: instance.longitude,
      scope: instance.scope,
      authorId: instance.authorId,
      authorAliasId: instance.authorAliasId,
      municipalities: instance.municipalities ? instance.municipalities.map((item) => item.id) : [],
      podcastLanguages: formatLanguages(instance),
    });
  });

  app.post(routePrefix, { schema: adminPodcastCreateSchema, preParsing: app.permGuard("admin.podcasts.create") }, async (request, reply) => {
    try {
      const { youtubeLink, image, mobileImage, categories, podcastLanguages, latitude, longitude, scope, municipalities, publish, authorId, authorAliasId } =
        request.body;

      const { instance, instanceCategoriesCreated, instanceMunicipalitiesCreated } = await sequelizeConnector.transaction(async (t) => {
        // Create main record
        const record = await Podcast.create(
          {
            slug: randomString(),
            userId: request.user.id,
            userReviewId: (await app.permGuardCheck(`admin.podcasts.review`)(request)) ? request.user.id : null,
            youtubeLink,
            image: randomString(),
            latitude: latitude ?? null,
            longitude: longitude ?? null,
            scope,
            publish: publish ?? false,
            authorId: authorId ?? request.user.id,
            authorAliasId: await checkAuthorAlias(authorId, authorAliasId),
          },
          { transaction: t }
        );

        // Set slug and image from default language
        const defaultIsoCode = await app.defaultIsoCode(t);
        const defaultLang = podcastLanguages[defaultIsoCode];
        record.slug = slugifyService(`${defaultLang.title} ${record.id}`);
        if (image) {
          record.image = await saveUploadedFile(image, ["images", "podcasts"], `${record.slug}-${Date.now()}`);
        } else {
          record.image = null;
        }
        if (mobileImage) {
          record.mobileImage = await saveUploadedFile(mobileImage, ["images", "podcasts"], `${record.slug}-mobile-${Date.now()}`);
        } else {
          record.mobileImage = null;
        }
        await record.save({ transaction: t });

        // Create language entries
        for (const isoCode in podcastLanguages) {
          const lang = podcastLanguages[isoCode];
          await PodcastLanguage.create(
            {
              podcastId: record.id,
              languageId: lang.langId,
              title: lang.title,
              shortDescription: lang.shortDescription,
              description: lang.description || undefined,
            },
            { transaction: t }
          );
        }

        // Create category associations
        const categoriesCreated = await PodcastCategory.bulkCreate(
          categories.map((categoryId) => ({ podcastId: record.id, categoryId })),
          { transaction: t }
        );

        // Create municipality associations
        const municipalitiesCreated = await PodcastMunicipality.bulkCreate(
          municipalities.map((item) => ({ podcastId: record.id, municipalityId: item })),
          { transaction: t }
        );

        return { instance: record, instanceCategoriesCreated: categoriesCreated, instanceMunicipalitiesCreated: municipalitiesCreated };
      });

      // Send push notifications if the podcast is published
      // if (instance.publish) {
      //   const podcastForNotification = await Podcast.findByPk(instance.id, {
      //     include: [{ association: "podcastLanguages" }, { association: "author" }, { association: "authorAlias" }],
      //   });

      //   if (podcastForNotification) {
      //     (await PushSubscription.findAll()).map(async (subscription) => {
      //       const formattedPodcast = await formatI18nPodcast(
      //         podcastForNotification,
      //         podcastForNotification.author!,
      //         podcastForNotification.authorAlias,
      //         subscription.locale
      //       );
      //       webpush.setVapidDetails(config.vapid.subject, config.vapid.publicKey, config.vapid.privateKey);
      //       webpush
      //         .sendNotification(
      //           {
      //             endpoint: subscription.endpoint,
      //             keys: {
      //               p256dh: subscription.p256dhKey,
      //               auth: subscription.authKey,
      //             },
      //           },
      //           JSON.stringify({
      //             id: formattedPodcast.id,
      //             title: formattedPodcast.title,
      //             content: stripText(formattedPodcast.description ?? "", true, 50),
      //             openUrl: `/${subscription.locale}/podcast/${formattedPodcast.slug}`,
      //           })
      //         )
      //         .catch((error) => {
      //           console.log(error);
      //         });
      //     });
      //   }
      // }

      return reply.code(HTTP_STATUS_CREATED).send({
        id: instance.id,
        slug: instance.slug,
        youtubeLink: instance.youtubeLink,
        image: instance.image ? imageUrlBase(instance.slug, instance.image) : null,
        mobileImage: instance.mobileImage ? imageUrlBase(instance.slug, instance.mobileImage) : null,
        categories: instanceCategoriesCreated.map((item) => item.categoryId),
        municipalities: instanceMunicipalitiesCreated.map((item) => item.municipalityId),
        podcastLanguages: formatLanguages(instance),
        latitude: instance.latitude,
        longitude: instance.longitude,
        scope: instance.scope,
        authorId: instance.authorId,
        authorAliasId: instance.authorAliasId,
      });
    } catch (error) {
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });

  app.put(`${routePrefix}/:id`, { schema: adminPodcastEditSchema, preParsing: app.permGuard("admin.podcasts.edit") }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { slug, youtubeLink, image, mobileImage, categories, podcastLanguages, latitude, longitude, scope, municipalities, publish, authorId, authorAliasId } =
        request.body;

      const instance = await sequelizeConnector.transaction(async (t) => {
        const userOwnOnly = await app.permGuardCheck(`admin.podcasts.own`)(request);
        const isSuperUser = await app.isSuperUser(request);
        const record = await getInstance(id, userOwnOnly && !isSuperUser ? request.user.id : undefined, t);
        if (!record) return null;
        const wasPublishedBefore = record.publish;

        // Update main record
        record.slug = slug;
        record.youtubeLink = youtubeLink;
        record.latitude = latitude ?? null;
        record.longitude = longitude ?? null;
        record.scope = scope;
        record.publish = (await app.permGuardCheck(`admin.podcasts.review`)(request)) ? publish ?? record.publish : record.publish;
        record.userReviewId = (await app.permGuardCheck(`admin.podcasts.review`)(request)) ? request.user.id : record.userReviewId;
        record.authorId = authorId ?? record.authorId;
        record.authorAliasId = await checkAuthorAlias(authorId, authorAliasId);

        if (image) {
          if (record.image) deleteUploadedFile(record.image, ["images", "podcasts"]);
          record.image = await saveUploadedFile(image, ["images", "podcasts"], `${slug}-${Date.now()}`);
        } else if (image === null && record.image) {
          // Image is being removed TO:DO See if we can send null only when user removed image
          // deleteUploadedFile(record.image, ["images", "podcasts"]);
          record.image = null;
        }
        if (mobileImage) {
          if (record.mobileImage) deleteUploadedFile(record.mobileImage, ["images", "podcasts"]);
          record.mobileImage = await saveUploadedFile(mobileImage, ["images", "podcasts"], `${slug}-mobile-${Date.now()}`);
        } else if (mobileImage === null && record.mobileImage) {
          // Mobile image is being removed TO:DO See if we can send null only when user removed image
          // deleteUploadedFile(record.mobileImage, ["images", "podcasts"]);
          record.mobileImage = null;
        }
        await record.save({ transaction: t });

        // Replace language entries
        await PodcastLanguage.destroy({ where: { podcastId: record.id }, transaction: t });
        for (const isoCode in podcastLanguages) {
          const lang = podcastLanguages[isoCode];
          await PodcastLanguage.create(
            {
              podcastId: record.id,
              languageId: lang.langId,
              title: lang.title,
              shortDescription: lang.shortDescription,
              description: lang.description!,
            },
            { transaction: t }
          );
        }

        // Update category associations
        await PodcastCategory.destroy({ where: { podcastId: record.id }, transaction: t });
        const categoriesCreated = await PodcastCategory.bulkCreate(
          categories.map((categoryId) => ({ podcastId: record.id, categoryId })),
          { transaction: t }
        );

        // Update municipality associations
        await PodcastMunicipality.destroy({ where: { podcastId: record.id }, transaction: t });
        const municipalitiesCreated = await PodcastMunicipality.bulkCreate(
          municipalities.map((item) => ({ podcastId: record.id, municipalityId: item })),
          { transaction: t }
        );

        return { record, wasPublishedBefore, categoriesCreated, municipalitiesCreated };
      });

      if (!instance) {
        return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
      }

      // Send push notifications if the podcast was not published before but is now published
      // if (!instance.wasPublishedBefore && instance.record.publish) {
      //   const podcastForNotification = await Podcast.findByPk(instance.record.id, {
      //     include: [{ association: "podcastLanguages" }, { association: "author" }, { association: "authorAlias" }],
      //   });

      //   if (podcastForNotification) {
      //     (await PushSubscription.findAll()).map(async (subscription) => {
      //       const formattedPodcast = await formatI18nPodcast(
      //         podcastForNotification,
      //         podcastForNotification.author!,
      //         podcastForNotification.authorAlias,
      //         subscription.locale
      //       );
      //       webpush.setVapidDetails(config.vapid.subject, config.vapid.publicKey, config.vapid.privateKey);
      //       webpush
      //         .sendNotification(
      //           {
      //             endpoint: subscription.endpoint,
      //             keys: {
      //               p256dh: subscription.p256dhKey,
      //               auth: subscription.authKey,
      //             },
      //           },
      //           JSON.stringify({
      //             id: formattedPodcast.id,
      //             title: formattedPodcast.title,
      //             content: stripText(formattedPodcast.description ?? "", true, 50),
      //             openUrl: `/${subscription.locale}/podcast/${formattedPodcast.slug}`,
      //           })
      //         )
      //         .catch((error) => {
      //           console.log(error);
      //         });
      //     });
      //   }
      // }

      return reply.code(HTTP_STATUS_CREATED).send({
        id: instance.record.id,
        slug: instance.record.slug,
        youtubeLink: instance.record.youtubeLink,
        image: instance.record.image ? imageUrlBase(instance.record.slug, instance.record.image) : null,
        mobileImage: instance.record.mobileImage ? imageUrlBase(instance.record.slug, instance.record.mobileImage) : null,
        categories: instance.categoriesCreated.map((item) => item.categoryId),
        municipalities: instance.municipalitiesCreated.map((item) => item.municipalityId),
        podcastLanguages: formatLanguages(instance.record),
        latitude: instance.record.latitude,
        longitude: instance.record.longitude,
        scope: instance.record.scope,
        authorId: instance.record.authorId,
        authorAliasId: instance.record.authorAliasId,
      });
    } catch (error) {
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });

  app.delete(
    `${routePrefix}/:id`,
    { schema: adminPodcastDeleteSchema, preParsing: app.permGuard("admin.podcasts.delete") },
    async (request, reply) => {
      try {
        const { id } = request.params;

        const instance = await sequelizeConnector.transaction(async (t) => {
          const userOwnOnly = await app.permGuardCheck(`admin.podcasts.own`)(request);
          const isSuperUser = await app.isSuperUser(request);
          const record = await getInstance(id, userOwnOnly && !isSuperUser ? request.user.id : undefined, t);
          if (!record) {
            return null;
          }

          if (record.image) {
            deleteUploadedFile(record.image, ["images", "podcasts"]);
          }
          await record.destroy({ transaction: t });
          return record;
        });

        if (!instance) {
          return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
        }
        return reply.code(HTTP_STATUS_NO_CONTENT).send(true);
      } catch (error) {
        return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
      }
    }
  );
};

export default adminPodcastController;
