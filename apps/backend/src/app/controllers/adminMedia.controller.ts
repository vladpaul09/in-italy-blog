import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { Op, Transaction } from "sequelize";
import { adminMediaCreateSchema, adminMediaDeleteSchema, adminMediaListSchema, adminMediaSchema } from "../schemas/adminMedia.schema";
import {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_SERVER_ERROR,
} from "../../config/httpStatus.config";
import { Media } from "../models";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import sequelizeConnector from "../../config/sequelizeConnector.config";
import config from "../../config/app.config";
import { saveUploadedFile } from "../../utils/upload";

const adminMediaController: FastifyPluginAsyncZod<IBaseRoute> = async (app, { routePrefix }) => {
  const getInstance = async (id: string, t?: Transaction) => await Media.findByPk(id, { transaction: t });

  const imageUrlBase = (imageName: string, imageFileName: string) => ({
    src: `${config.serverNameStatics}/uploads/images/media/${imageFileName}`,
    title: imageName,
  });

  app.get(routePrefix, { schema: adminMediaListSchema, preParsing: app.permGuard("admin.media.list") }, async (request, reply) => {
    const { rangeFirst, rangeLast, sortBy, sortOrder, filter } = request.query;

    const filters: { name?: string } = JSON.parse(filter);

    const { count, rows } = await Media.findAndCountAll({
      where: { ...(filters.name ? { id: { [Op.like]: `${filters.name}%` } } : {}) },
      offset: rangeFirst,
      limit: rangeLast - rangeFirst + 1,
      order: [[sortBy, sortOrder]],
      distinct: true,
    });

    return reply.code(HTTP_STATUS_OK).send({
      data: rows.map((item) => ({
        id: item.id,
        name: item.getName(),
        image: imageUrlBase(item.id, item.id),
        url: imageUrlBase(item.id, item.id).src,
      })),
      total: count,
    });
  });

  app.get(`${routePrefix}/:id`, { schema: adminMediaSchema, preParsing: app.permGuard("admin.media.show") }, async (request, reply) => {
    const { id } = request.params;

    const instance = await getInstance(id);

    if (!instance) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    } else {
      const imageData = imageUrlBase(instance.id, instance.id);
      return reply.code(HTTP_STATUS_OK).send({
        id: instance.id,
        name: instance.getName(),
        image: imageData,
        url: imageData.src,
      });
    }
  });

  app.post(routePrefix, { schema: adminMediaCreateSchema, preParsing: app.permGuard("admin.media.create") }, async (request, reply) => {
    try {
      const { name, image } = request.body;
      const instance = await sequelizeConnector.transaction(async (t) => {
        const record = await Media.create({ id: await saveUploadedFile(image, ["images", "media"], `${name}-${Date.now()}`) }, { transaction: t });
        return record;
      });
      const imageData = imageUrlBase(instance.id, instance.id);
      return reply.code(HTTP_STATUS_CREATED).send({
        id: instance.id,
        name: instance.getName(),
        image: imageData,
        url: imageData.src,
      });
    } catch (error) {
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });

  app.delete(`${routePrefix}/:id`, { schema: adminMediaDeleteSchema, preParsing: app.permGuard("admin.media.delete") }, async (request, reply) => {
    try {
      const { id } = request.params;

      const instance = await sequelizeConnector.transaction(async (t) => {
        const record = await getInstance(id, t);
        if (!record) {
          return null;
        } else {
          await record.destroy({ transaction: t });
        }
        return record;
      });
      if (!instance) {
        return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
      } else {
        return reply.code(HTTP_STATUS_NO_CONTENT).send(true);
      }
    } catch (error) {
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });
};

export default adminMediaController;
