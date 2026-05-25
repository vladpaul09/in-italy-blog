import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { Op, Transaction } from "sequelize";
import z from "zod";
import { i18nSchema, i18nListSchema, i18nGetSchema, i18nCreateSchema, i18nUpdateRouteSchema, i18nDeleteSchema } from "../schemas/adminI18n.schema";
import {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_SERVER_ERROR,
} from "../../config/httpStatus.config";
import { I18n, Language } from "../models";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import sequelizeConnector from "../../config/sequelizeConnector.config";

const getInstance = async (id: string, transaction?: Transaction) => {
  const instances = await I18n.findAll({
    where: { id },
    include: [
      {
        model: Language,
        as: "language",
      },
    ],
    transaction,
  });

  if (!instances || instances.length === 0) {
    return null;
  }

  const translationResponse = {
    id,
    languages: instances.reduce((acc, instance) => {
      acc[instance.langId] = {
        langId: instance.langId,
        value: instance.value,
      };
      return acc;
    }, {} as Record<string, { langId: string; value: string }>),
  };

  return translationResponse;
};

const adminI18nController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  app.get(routePrefix, { schema: i18nListSchema, preParsing: app.permGuard("admin.i18n.list") }, async (request, reply) => {
    const { rangeFirst, rangeLast, sortBy, sortOrder, filter } = request.query;

    const filters: { q?: string } = JSON.parse(filter);

    // For i18n we have same ID for multiple languages eg. id home.title will have value it but also value en with same id so for pagination we have to count unique

    // First get all translations that match the filter
    const allTranslations = await I18n.findAll({
      where: filters.q
        ? {
            [Op.or]: [{ id: { [Op.like]: `%${filters.q}%` } }, { value: { [Op.like]: `%${filters.q}%` } }],
          }
        : {},
      include: [
        {
          model: Language,
          as: "language",
          attributes: ["id", "name", "default"],
        },
      ],
      order: [[sortBy, sortOrder]],
    });

    // Get unique IDs
    const uniqueIds = allTranslations.map((t) => t.id).filter((id, index, array) => array.indexOf(id) === index);
    const totalCount = uniqueIds.length;

    // Slice 'em up
    const paginatedIds = uniqueIds.slice(rangeFirst, rangeLast + 1);

    // Filter translations to just those with the paginated IDs
    const paginatedTranslations = allTranslations.filter((t) => paginatedIds.includes(t.id));

    // Group translations by ID
    const groupedTranslations = paginatedTranslations.reduce((acc, translation) => {
      if (!acc[translation.id]) {
        acc[translation.id] = {
          id: translation.id,
          languages: {},
        };
      }
      acc[translation.id].languages[translation.langId] = {
        langId: translation.langId,
        value: translation.value,
      };
      return acc;
    }, {} as Record<string, { id: string; languages: Record<string, { langId: string; value: string }> }>);

    return reply.code(HTTP_STATUS_OK).send({
      data: Object.values(groupedTranslations),
      total: totalCount,
    });
  });

  app.get(`${routePrefix}/:id`, { schema: i18nGetSchema }, async (request, reply) => {
    const { id } = request.params;
    const translation = await getInstance(id);
    if (!translation) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    }
    return reply.code(HTTP_STATUS_OK).send(translation);
  });

  app.post(routePrefix, { schema: i18nCreateSchema }, async (request, reply) => {
    const { id, languages } = request.body as z.infer<typeof i18nSchema>;
    const transaction = await sequelizeConnector.transaction();
    try {
      await Promise.all(
        Object.entries(languages).map(([langId, data]) =>
          I18n.upsert(
            {
              id,
              langId,
              value: data.value,
            },
            { transaction }
          )
        )
      );

      // Fetch the complete translation with all languages
      const translation = await getInstance(id, transaction);
      await transaction.commit();
      if (!translation) {
        return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
      }
      return reply.code(HTTP_STATUS_CREATED).send(translation);
    } catch (error) {
      await transaction.rollback();
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });

  app.put(`${routePrefix}/:id`, { schema: i18nUpdateRouteSchema }, async (request, reply) => {
    const oldId = request.params.id;
    const { id, languages } = request.body;
    const transaction = await sequelizeConnector.transaction();
    try {
      // If we change id we delete old entry
      if (oldId !== id) {
        await I18n.destroy({ where: { id: oldId }, transaction });
      }

      await Promise.all(
        Object.entries(languages).map(([langId, data]) =>
          I18n.upsert(
            {
              id,
              langId,
              value: data.value,
            },
            { transaction }
          )
        )
      );
      // Fetch the complete translation with all languages after update
      const translation = await getInstance(id, transaction);

      await transaction.commit();

      if (!translation) {
        return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
      }
      return reply.code(HTTP_STATUS_OK).send(translation);
    } catch (error) {
      await transaction.rollback();
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });

  app.delete(`${routePrefix}/:id`, { schema: i18nDeleteSchema }, async (request, reply) => {
    try {
      const { id } = request.params;
      const translation = await getInstance(id);
      if (!translation) {
        return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
      }
      await sequelizeConnector.transaction(async (t) => {
        await I18n.destroy({
          where: { id },
          transaction: t,
        });
      });
      return reply.code(HTTP_STATUS_NO_CONTENT).send();
    } catch (error) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    }
  });
};

export default adminI18nController;
