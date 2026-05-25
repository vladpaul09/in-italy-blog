import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import webpush from "web-push";
import { Op, Transaction } from "sequelize";
import PushSubscription from "../models/pushSubscription.model";
import {
  adminArticleCreateSchema,
  adminArticleDeleteSchema,
  adminArticleEditSchema,
  adminArticleLanguages,
  adminArticleListSchema,
  adminArticleSchema,
} from "../schemas/adminArticle.schema";
import {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_SERVER_ERROR,
} from "../../config/httpStatus.config";
import { Article, ArticleLanguage, ArticleMunicipality, ArticleCategory, Category, UserAlias } from "../models";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import sequelizeConnector from "../../config/sequelizeConnector.config";
import randomString from "../../utils/randomString";
import slugifyService from "../services/slugify.service";
import { deleteUploadedFile, saveUploadedFile } from "../../utils/upload";
import config from "../../config/app.config";
import ArticlesType from "../../entries/articlesType.entry";
import formatI18nArticle from "../../utils/formatI18nArticle.util";
import stripText from "../../utils/stripText.util";

const adminArticleController: FastifyPluginAsyncZod<IBaseRoute & { type: ArticlesType }> = async (app, options) => {
  const { routePrefix, type } = options;

  const getNewsCategory = (t?: Transaction) => Category.findOne({ where: { slug: "news" }, transaction: t });

  const getInstance = (id: number, userId?: number, t?: Transaction) =>
    Article.findOne({
      where: { id, ...(userId ? { [Op.or]: [{ userId }, { userReviewId: userId }] } : {}) },
      include: [
        { association: "articleLanguages", include: [{ association: "language" }] },
        { association: "municipalities" },
        { association: "categories" },
      ],
      transaction: t,
    });

  const formatLanguages = (instance: Article) =>
    (instance.articleLanguages || []).reduce(
      (previous, current) => ({
        ...previous,
        [current.languageId]: {
          langId: current.languageId,
          title: current.title,
          description: current.description,
        },
      }),
      {} as Record<string, z.infer<typeof adminArticleLanguages>>
    );

  const imageUrlBase = (imageName: string, imageFileName: string) => ({
    src: `${config.serverNameStatics}/uploads/images/articles/${imageFileName}`,
    title: imageName,
  });

  const checkAuthorAlias = async (authorId?: number | null, authorAliasId?: number | null) => {
    if (authorAliasId && authorId) {
      if (await UserAlias.findOne({ where: { id: authorAliasId, userId: authorId } })) {
        return authorAliasId;
      }
    }
    return null;
  };

  app.get(routePrefix, { schema: adminArticleListSchema, preParsing: app.permGuard(`admin.${type}.list`) }, async (request, reply) => {
    const { rangeFirst, rangeLast, sortBy, sortOrder, filter } = request.query;
    const filters: {
      q?: string;
      title?: string;
      category?: string;
      municipality?: string;
      type?: string;
      needsReview?: boolean;
      publish?: boolean;
      scope?: string;
      author?: number;
      createdAtStart?: string;
      createdAtEnd?: string;
    } = JSON.parse(filter);

    const newsCategory = await getNewsCategory();

    const userOwnOnly = await app.permGuardCheck(`admin.${type}.own`)(request);
    const isSuperUser = await app.isSuperUser(request);
    const { count, rows } = await Article.findAndCountAll({
      where: {
        ...(userOwnOnly && !isSuperUser ? { [Op.or]: [{ userId: request.user.id }, { userReviewId: request.user.id }] } : {}),
        ...(filters.type ? { scope: filters.type } : {}),
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
        ...(type === ArticlesType.NEWS
          ? filters.category
            ? { [Op.and]: [{ [`$categories.id$`]: filters.category }, newsCategory ? { [`$categories.id$`]: newsCategory.id } : {}] }
            : { [`$categories.id$`]: newsCategory ? newsCategory.id : {} }
          : filters.category
          ? {
              [Op.and]: [{ [`$categories.id$`]: filters.category }, newsCategory ? { [`$categories.id$`]: { [Op.not]: newsCategory.id } } : {}],
            }
          : newsCategory
          ? { [`$categories.id$`]: { [Op.not]: newsCategory.id } }
          : {}),
      },
      include: [
        {
          association: "articleLanguages",
          ...(filters.q || filters.title
            ? { where: { title: { [Op.like]: `%${filters.q || filters.title}%` } }, required: true }
            : { required: false, separate: true }),
        },
        {
          association: "municipalities",
          ...(filters.municipality ? { where: { id: filters.municipality }, required: true } : { required: false }),
        },
        {
          association: "categories",
        },
      ],
      offset: rangeFirst,
      limit: rangeLast - rangeFirst + 1,
      order: [[sortBy, sortOrder]],
      distinct: true,
      subQuery: false,
    });

    const currentLocale = await app.currentLocale(request);

    return reply.code(HTTP_STATUS_OK).send({
      data: rows.map((item) => {
        const language = (item.articleLanguages || []).find((articleLanguage) => articleLanguage.languageId === currentLocale);
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

  app.get(`${routePrefix}/:id`, { schema: adminArticleSchema, preParsing: app.permGuard(`admin.${type}.show`) }, async (request, reply) => {
    const { id } = request.params;

    const userOwnOnly = await app.permGuardCheck(`admin.${type}.own`)(request);
    const isSuperUser = await app.isSuperUser(request);
    const instance = await getInstance(id, userOwnOnly && !isSuperUser ? request.user.id : undefined);

    if (!instance) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    }

    return reply.code(HTTP_STATUS_OK).send({
      id: instance.id,
      slug: instance.slug,
      scope: instance.scope,
      publish: instance.publish,
      image: instance.image ? imageUrlBase(instance.slug, instance.image) : null,
      mobileImage: instance.mobileImage ? imageUrlBase(instance.slug, instance.mobileImage) : null,
      municipalities: instance.municipalities ? instance.municipalities.map((item) => item.id) : [],
      categories: instance.categories ? instance.categories.map((item) => item.id) : [],
      latitude: instance.latitude,
      longitude: instance.longitude,
      authorId: instance.authorId,
      authorAliasId: instance.authorAliasId,
      articleLanguages: formatLanguages(instance),
    });
  });

  app.post(routePrefix, { schema: adminArticleCreateSchema, preParsing: app.permGuard(`admin.${type}.create`) }, async (request, reply) => {
    try {
      const { image, mobileImage, articleLanguages, municipalities, categories, scope, latitude, longitude, publish, authorId, authorAliasId } =
        request.body;

      const { instance, instanceChildObj, instanceMunicipalities, instanceCategories } = await sequelizeConnector.transaction(async (t) => {
        const record = await Article.create(
          {
            slug: randomString(),
            image: randomString(),
            userId: request.user.id,
            userReviewId: (await app.permGuardCheck(`admin.${type}.review`)(request)) ? request.user.id : null,
            publish: publish ?? false,
            scope,
            latitude: latitude ?? null,
            longitude: longitude ?? null,
            authorId: authorId ?? request.user.id,
            authorAliasId: await checkAuthorAlias(authorId, authorAliasId),
          },
          { transaction: t }
        );
        const defaultIsoCode = await app.defaultIsoCode(t);
        const municipalitiesCreated = await ArticleMunicipality.bulkCreate(
          municipalities.map((item) => ({ articleId: record.id, municipalityId: item })),
          { transaction: t }
        );
        const categoriesCreated = await ArticleCategory.bulkCreate(
          categories.map((item) => ({ articleId: record.id, categoryId: item })),
          { transaction: t }
        );
        let recordChildObj: { [key: string]: z.infer<typeof adminArticleLanguages> } = {};
        for (const [isoCode, { langId, title, description }] of Object.entries(articleLanguages)) {
          if (isoCode === defaultIsoCode) {
            record.slug = slugifyService(`${title} ${record.id}`);
            if (image) {
              record.image = await saveUploadedFile(image, ["images", "articles"], `${record.slug}-${Date.now()}`);
            } else {
              record.image = null;
            }
            if (mobileImage) {
              record.mobileImage = await saveUploadedFile(mobileImage, ["images", "articles"], `${record.slug}-mobile-${Date.now()}`);
            } else {
              record.mobileImage = null;
            }
            await record.save({ transaction: t });
          }
          const recordChild = await ArticleLanguage.create(
            {
              articleId: record.id,
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
        return {
          instance: record,
          instanceChildObj: recordChildObj,
          instanceMunicipalities: municipalitiesCreated,
          instanceCategories: categoriesCreated,
        };
      });

      // Send push notifications if the article is published
      if (instance.publish && type === ArticlesType.NEWS) {
        const articleForNotification = await Article.findByPk(instance.id, {
          include: [{ association: "articleLanguages" }, { association: "author" }, { association: "authorAlias" }],
        });

        if (articleForNotification) {
          (await PushSubscription.findAll()).map(async (subscription) => {
            const formattedArticle = await formatI18nArticle(
              articleForNotification,
              articleForNotification.author!,
              articleForNotification.authorAlias,
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
                  id: formattedArticle.id,
                  title: formattedArticle.title,
                  content: stripText(formattedArticle.description ?? "", true, 50),
                  openUrl: `/${subscription.locale}/articolo/${formattedArticle.slug}`,
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
        scope: instance.scope,
        categories: instanceCategories.map((item) => item.categoryId),
        municipalities: instanceMunicipalities.map((item) => item.municipalityId),
        latitude: instance.latitude,
        longitude: instance.longitude,
        authorId: instance.authorId,
        authorAliasId: instance.authorAliasId,
        articleLanguages: instanceChildObj,
      });
    } catch (error) {
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });

  app.put(`${routePrefix}/:id`, { schema: adminArticleEditSchema, preParsing: app.permGuard(`admin.${type}.edit`) }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { slug, image, mobileImage, articleLanguages, municipalities, categories, scope, latitude, longitude, publish, authorId, authorAliasId } =
        request.body;

      const instance = await sequelizeConnector.transaction(async (t) => {
        const userOwnOnly = await app.permGuardCheck(`admin.${type}.own`)(request);
        const isSuperUser = await app.isSuperUser(request);
        const record = await getInstance(id, userOwnOnly && !isSuperUser ? request.user.id : undefined, t);
        if (!record) {
          return null;
        }
        const wasPublishedBefore = record.publish;

        record.slug = slug;
        record.scope = scope;
        record.latitude = latitude ?? null;
        record.longitude = longitude ?? null;
        record.publish = (await app.permGuardCheck(`admin.${type}.review`)(request)) ? publish ?? record.publish : record.publish;
        record.userReviewId = (await app.permGuardCheck(`admin.${type}.review`)(request)) ? request.user.id : record.userReviewId;
        record.authorId = authorId ?? record.authorId;
        record.authorAliasId = await checkAuthorAlias(authorId, authorAliasId);

        if (image) {
          if (record.image) deleteUploadedFile(record.image, ["images", "articles"]);
          record.image = await saveUploadedFile(image, ["images", "articles"], `${record.slug}-${Date.now()}`);
        } else if (image === null && record.image) {
          //TO DO: See if we can send from frontend null if user deleted image
          //deleteUploadedFile(record.image, ["images", "articles"]);
          record.image = null;
        }
        if (mobileImage) {
          if (record.mobileImage) deleteUploadedFile(record.mobileImage, ["images", "articles"]);
          record.mobileImage = await saveUploadedFile(mobileImage, ["images", "articles"], `${record.slug}-mobile-${Date.now()}`);
        } else if (mobileImage === null && record.mobileImage) {
          //TO DO: See if we can send from frontend null if user deleted image
          //deleteUploadedFile(record.mobileImage, ["images", "articles"]);
          record.mobileImage = null;
        }
        record.save({ transaction: t });

        await ArticleMunicipality.destroy({ where: { articleId: record.id }, transaction: t });
        await ArticleMunicipality.bulkCreate(
          municipalities.map((item) => ({ articleId: record.id, municipalityId: item })),
          { transaction: t }
        );

        await ArticleCategory.destroy({ where: { articleId: record.id }, transaction: t });
        await ArticleCategory.bulkCreate(
          categories.map((item) => ({ articleId: record.id, categoryId: item })),
          { transaction: t }
        );

        await ArticleLanguage.destroy({ where: { articleId: record.id }, transaction: t });
        let recordChildObj: Record<string, z.infer<typeof adminArticleLanguages>> = {};
        for (const [isoCode, { langId, title, description }] of Object.entries(articleLanguages)) {
          const recordChild = await ArticleLanguage.create(
            {
              articleId: record.id,
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
        return { record, recordChildObj, wasPublishedBefore };
      });

      if (!instance) {
        return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
      }

      if (!instance.wasPublishedBefore && instance.record.publish && type === ArticlesType.NEWS) {
        const articleForNotification = await Article.findByPk(instance.record.id, {
          include: [{ association: "articleLanguages" }, { association: "author" }, { association: "authorAlias" }],
        });

        if (articleForNotification) {
          (await PushSubscription.findAll()).map(async (subscription) => {
            const formattedArticle = await formatI18nArticle(
              articleForNotification,
              articleForNotification.author!,
              articleForNotification.authorAlias,
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
                  id: formattedArticle.id,
                  title: formattedArticle.title,
                  content: stripText(formattedArticle.description ?? "", true, 50),
                  openUrl: `/${subscription.locale}/articolo/${formattedArticle.slug}`,
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
        scope: instance.record.scope,
        categories: instance.record.categories ? instance.record.categories.map((item) => item.id) : [],
        municipalities: instance.record.municipalities ? instance.record.municipalities.map((item) => item.id) : [],
        latitude: instance.record.latitude,
        longitude: instance.record.longitude,
        articleLanguages: instance.recordChildObj,
        authorId: instance.record.authorId,
      });
    } catch (error) {
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });

  app.delete(
    `${routePrefix}/:id`,
    { schema: adminArticleDeleteSchema, preParsing: app.permGuard(`admin.${type}.delete`) },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const instance = await sequelizeConnector.transaction(async (t) => {
          const userOwnOnly = await app.permGuardCheck(`admin.${type}.own`)(request);
          const isSuperUser = await app.isSuperUser(request);
          const instance = await getInstance(id, userOwnOnly && !isSuperUser ? request.user.id : undefined, t);
          if (!instance) {
            return null;
          } else {
            if (instance.image) {
              deleteUploadedFile(instance.image, ["images", "articles"]);
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
    }
  );
};

export default adminArticleController;
