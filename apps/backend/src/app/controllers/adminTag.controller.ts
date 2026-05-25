import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { Op, Transaction } from "sequelize";
import {
  adminTagCreateSchema,
  adminTagDeleteSchema,
  adminTagEditSchema,
  adminTagLanguages,
  adminTagListSchema,
  adminTagSchema,
} from "../schemas/adminTag.schema";
import {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_SERVER_ERROR,
} from "../../config/httpStatus.config";
import { Tag, TagLanguage, Language } from "../models";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import config from "../../config/app.config";
import sequelizeConnector from "../../config/sequelizeConnector.config";
import randomString from "../../utils/randomString";
import slugifyService from "../services/slugify.service";
import { deleteUploadedFile, saveUploadedFile } from "../../utils/upload";

const adminTagController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  const getInstance = async (id: number, transaction?: Transaction) => {
    return await Tag.findOne({
      where: { id },
      include: [
        {
          model: TagLanguage,
          as: "tagLanguages",
          include: [
            {
              model: Language,
              as: "language",
            },
          ],
        },
      ],
      transaction,
    });
  };

  const formatLanguages = (instance: Tag) =>
    (instance.tagLanguages || []).reduce(
      (previous, current) => ({
        ...previous,
        [current.languageId]: {
          langId: current.languageId,
          name: current.name,
          description: current.description,
        },
      }),
      {} as Record<string, z.infer<typeof adminTagLanguages>>
    );

  const imageUrlBase = (imageName: string, imageFileName: string) => ({
    src: `${config.serverNameStatics}/uploads/images/tags/${imageFileName}`,
    title: imageName,
  });

  app.get(routePrefix, { schema: adminTagListSchema, preParsing: app.permGuard("admin.tags.list") }, async (request, reply) => {
    const { rangeFirst, rangeLast, sortBy, sortOrder, filter } = request.query;
    const filters: { name?: string; q?: string } = JSON.parse(filter);

    const { count, rows } = await Tag.findAndCountAll({
      include: [
        {
          association: "tagLanguages",
          where: {
            ...(filters.name ? { name: { [Op.like]: `%${filters.name}%` } } : {}),
            ...(filters.q ? { name: { [Op.like]: `%${filters.q}%` } } : {}),
          },
          required: filters.name || filters.q ? true : false,
          separate: filters.name || filters.q ? undefined : true,
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
        const language = (item.tagLanguages || []).find((tagLanguage) => tagLanguage.languageId === currentLocale);
        return {
          id: item.id,
          name: language ? language.name : config.noNameDefault,
          slug: item.slug,
        };
      }),
      total: count,
    });
  });

  app.get(`${routePrefix}/:id`, { schema: adminTagSchema, preParsing: app.permGuard("admin.tags.show") }, async (request, reply) => {
    const { id } = request.params;

    const instance = await getInstance(id);

    if (!instance) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    }

    return reply.code(HTTP_STATUS_OK).send({
      id: instance.id,
      slug: instance.slug,
      mapMarkerImage: instance.mapMarkerImage ? imageUrlBase(instance.slug, instance.mapMarkerImage) : null,
      tagLanguages: formatLanguages(instance),
    });
  });

  app.post(routePrefix, { schema: adminTagCreateSchema, preParsing: app.permGuard("admin.tags.add") }, async (request, reply) => {
    try {
      const { tagLanguages, mapMarkerImage } = request.body;

      const { instance, instanceChildObj } = await sequelizeConnector.transaction(async (t) => {
        const record = await Tag.create({ slug: randomString(), mapMarkerImage: randomString() }, { transaction: t });
        const defaultIsoCode = await app.defaultIsoCode(t);
        let recordChildObj: { [key: string]: z.infer<typeof adminTagLanguages> } = {};
        for (const [isoCode, { langId, name, description }] of Object.entries(tagLanguages)) {
          if (isoCode === defaultIsoCode) {
            record.slug = slugifyService(`${name} ${record.id}`);
            if (mapMarkerImage) {
              record.mapMarkerImage = await saveUploadedFile(mapMarkerImage, ["images", "tags"], `${record.slug}-${Date.now()}`);
            } else {
              record.mapMarkerImage = null;
            }
            await record.save({ transaction: t });
          }
          const recordChild = await TagLanguage.create(
            {
              tagId: record.id,
              languageId: langId,
              name: name,
              description: description || null,
            },
            { transaction: t }
          );
          recordChildObj[recordChild.languageId] = {
            langId: recordChild.languageId,
            name: recordChild.name,
            description: recordChild.description,
          };
        }
        return { instance: record, instanceChildObj: recordChildObj };
      });

      return reply.code(HTTP_STATUS_CREATED).send({
        id: instance.id,
        slug: instance.slug,
        mapMarkerImage: instance.mapMarkerImage ? imageUrlBase(instance.slug, instance.mapMarkerImage) : null,
        tagLanguages: instanceChildObj,
      });
    } catch (error) {
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });

  //EDIT Tag
  app.put(`${routePrefix}/:id`, { schema: adminTagEditSchema, preParsing: app.permGuard("admin.tags.edit") }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { slug, tagLanguages, mapMarkerImage } = request.body;

      const instance = await sequelizeConnector.transaction(async (t) => {
        const record = await getInstance(id, t);
        if (!record) {
          return null;
        }

        record.slug = slug;
        
        if (mapMarkerImage) {
          if (record.mapMarkerImage) deleteUploadedFile(record.mapMarkerImage, ["images", "tags"]);
          record.mapMarkerImage = await saveUploadedFile(mapMarkerImage, ["images", "tags"], `${record.slug}-${Date.now()}`);
        } else if (mapMarkerImage === null && record.mapMarkerImage) {
          deleteUploadedFile(record.mapMarkerImage, ["images", "tags"]);
          record.mapMarkerImage = null;
        }
        
        await record.save({ transaction: t });

        await TagLanguage.destroy({ where: { tagId: record.id }, transaction: t });

        const tagLanguagesFormatted: { [key: string]: z.infer<typeof adminTagLanguages> } = {};

        for (const [isoCode, { langId, name, description }] of Object.entries(tagLanguages)) {
          const recordChild = await TagLanguage.create(
            {
              tagId: record.id,
              languageId: langId,
              name,
              description: description || null,
            },
            { transaction: t }
          );

          tagLanguagesFormatted[recordChild.languageId] = {
            langId: recordChild.languageId,
            name: recordChild.name,
            description: recordChild.description,
          };
        }

        return { record, tagLanguagesFormatted };
      });

      if (!instance) return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));

      return reply.code(HTTP_STATUS_CREATED).send({
        id: instance.record.id,
        slug: instance.record.slug,
        mapMarkerImage: instance.record.mapMarkerImage ? imageUrlBase(instance.record.slug, instance.record.mapMarkerImage) : null,
        tagLanguages: instance.tagLanguagesFormatted,
      });
    } catch (error) {
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });

  // Delete Tag
  app.delete(`${routePrefix}/:id`, { schema: adminTagDeleteSchema, preParsing: app.permGuard("admin.tags.delete") }, async (request, reply) => {
    const { id } = request.params;
    const instance = await getInstance(id);

    if (!instance) return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));

    if (instance.mapMarkerImage) {
      deleteUploadedFile(instance.mapMarkerImage, ["images", "tags"]);
    }
    
    await instance.destroy();

    return reply.code(HTTP_STATUS_NO_CONTENT).send(true);
  });
};

export default adminTagController;

