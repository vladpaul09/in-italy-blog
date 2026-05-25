import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { Op, Transaction } from "sequelize";
import {
  adminPageCreateSchema,
  adminPageDeleteSchema,
  adminPageEditSchema,
  adminPageLanguages,
  adminPageListSchema,
  adminPageSchema,
} from "../schemas/adminPage.schema";
import {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_SERVER_ERROR,
} from "../../config/httpStatus.config";
import { Page, PageLanguage } from "../models";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import sequelizeConnector from "../../config/sequelizeConnector.config";
import config from "../../config/app.config";

const adminPageController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  const getInstance = async (id: number, t?: Transaction) =>
    await Page.findOne({
      where: { id },
      include: [
        {
          association: "pageLanguages",
        },
      ],
      transaction: t,
    });

  const formatLanguages = (instance: Page) =>
    (instance.pageLanguages || []).reduce(
      (previous, current) => ({
        ...previous,
        [current.languageId]: {
          langId: current.languageId,
          metaTitle: current.metaTitle,
          metaDescription: current.metaDescription,
          pageTitle: current.pageTitle,
          pageDescription: current.pageDescription,
        },
      }),
      {} as Record<string, z.infer<typeof adminPageLanguages>>
    );

  app.get(routePrefix, { schema: adminPageListSchema, preParsing: app.permGuard("admin.pages.list") }, async (request, reply) => {
    const { rangeFirst, rangeLast, sortBy, sortOrder, filter } = request.query;
    const filters: {
      q?: string;
      pageTitle?: string;
      slug?: string;
      publish?: boolean;
    } = JSON.parse(filter);

    const { count, rows } = await Page.findAndCountAll({
      where: {
        ...(filters.slug ? { slug: { [Op.like]: `%${filters.slug}%` } } : {}),
        ...(filters.publish !== undefined ? { publish: filters.publish } : {}),
      },
      include: [
        {
          association: "pageLanguages",
          ...(filters.q || filters.pageTitle
            ? { where: { pageTitle: { [Op.like]: `%${filters.q || filters.pageTitle}%` } }, required: true }
            : { required: false, separate: true }),
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
        const language = (item.pageLanguages || []).find((pageLanguage) => pageLanguage.languageId === currentLocale);
        return {
          id: item.id,
          name: language ? language.pageTitle : config.noNameDefault,
          slug: item.slug,
          publish: item.publish,
          createdAt: item.createdAt,
        };
      }),
      total: count,
    });
  });

  app.get(`${routePrefix}/:id`, { schema: adminPageSchema, preParsing: app.permGuard("admin.pages.show") }, async (request, reply) => {
    const { id } = request.params;

    const instance = await getInstance(id);

    if (!instance) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    }

    return reply.code(HTTP_STATUS_OK).send({
      id: instance.id,
      slug: instance.slug,
      publish: instance.publish,
      languages: formatLanguages(instance),
    });
  });

  app.post(routePrefix, { schema: adminPageCreateSchema, preParsing: app.permGuard("admin.pages.create") }, async (request, reply) => {
    try {
      const { slug, languages, publish } = request.body;

      const { instance, instanceChildObj } = await sequelizeConnector.transaction(async (t) => {
        const record = await Page.create(
          {
            slug,
            publish: publish ?? false,
          },
          { transaction: t }
        );

        let recordChildObj: { [key: string]: z.infer<typeof adminPageLanguages> } = {};
        for (const [isoCode, { langId, metaTitle, metaDescription, pageTitle, pageDescription }] of Object.entries(languages)) {
          const recordChild = await PageLanguage.create(
            {
              pageId: record.id,
              languageId: langId,
              metaTitle,
              metaDescription,
              pageTitle,
              pageDescription,
            },
            { transaction: t }
          );
          recordChildObj[recordChild.languageId] = {
            langId: recordChild.languageId,
            metaTitle: recordChild.metaTitle,
            metaDescription: recordChild.metaDescription,
            pageTitle: recordChild.pageTitle,
            pageDescription: recordChild.pageDescription,
          };
        }
        return {
          instance: record,
          instanceChildObj: recordChildObj,
        };
      });

      return reply.code(HTTP_STATUS_CREATED).send({
        id: instance.id,
        slug: instance.slug,
        publish: instance.publish,
        languages: instanceChildObj,
      });
    } catch (error) {
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });

  app.put(`${routePrefix}/:id`, { schema: adminPageEditSchema, preParsing: app.permGuard("admin.pages.edit") }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { slug, languages, publish } = request.body;

      const instance = await sequelizeConnector.transaction(async (t) => {
        const record = await getInstance(id, t);
        if (!record) {
          return null;
        }

        record.slug = slug;
        record.publish = publish ?? record.publish;
        await record.save({ transaction: t });

        await PageLanguage.destroy({ where: { pageId: record.id }, transaction: t });
        let recordChildObj: Record<string, z.infer<typeof adminPageLanguages>> = {};
        for (const [isoCode, { langId, metaTitle, metaDescription, pageTitle, pageDescription }] of Object.entries(languages)) {
          const recordChild = await PageLanguage.create(
            {
              pageId: record.id,
              languageId: langId,
              metaTitle,
              metaDescription,
              pageTitle,
              pageDescription,
            },
            { transaction: t }
          );
          recordChildObj[recordChild.languageId] = {
            langId: recordChild.languageId,
            metaTitle: recordChild.metaTitle,
            metaDescription: recordChild.metaDescription,
            pageTitle: recordChild.pageTitle,
            pageDescription: recordChild.pageDescription,
          };
        }
        return { record, recordChildObj };
      });

      if (!instance) {
        return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
      }

      return reply.code(HTTP_STATUS_CREATED).send({
        id: instance.record.id,
        slug: instance.record.slug,
        publish: instance.record.publish,
        languages: instance.recordChildObj,
      });
    } catch (error) {
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });

  app.delete(`${routePrefix}/:id`, { schema: adminPageDeleteSchema, preParsing: app.permGuard("admin.pages.delete") }, async (request, reply) => {
    try {
      const { id } = request.params;
      const instance = await sequelizeConnector.transaction(async (t) => {
        const instance = await getInstance(id, t);
        if (!instance) {
          return null;
        } else {
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

export default adminPageController;
