import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { Op } from "sequelize";
import { adminPermissionListSchema, adminPermissionSchema } from "../schemas/adminPermission.schema";
import { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../../config/httpStatus.config";
import { Permission } from "../models";
import IBaseRoute from "../../interfaces/baseRoute.interface";

const adminPermissionController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  const getInstance = async (id: string) => await Permission.findByPk(id);

  app.get(routePrefix, { schema: adminPermissionListSchema }, async (request, reply) => {
    const { rangeFirst, rangeLast, sortBy, sortOrder, filter } = request.query;

    const filters: { resource?: string } = JSON.parse(filter);

    const { count, rows } = await Permission.findAndCountAll({
      attributes: ["codename", "resource", "action"],
      where: { ...(filters.resource ? { name: { [Op.like]: `${filters.resource}%` } } : {}) },
      offset: rangeFirst,
      limit: rangeLast - rangeFirst + 1,
      order: [[sortBy !== "id" ? sortBy : Permission.primaryKeyAttribute, sortOrder]],
    });

    return reply.code(HTTP_STATUS_OK).send({
      data: rows.map((instance) => ({
        id: instance.codename,
        name: request.i18n.t(`permissions.${instance.codename}`),
        codename: instance.codename,
        resource: instance.resource,
        action: instance.action,
      })),
      total: count,
    });
  });

  app.get(`${routePrefix}/:id`, { schema: adminPermissionSchema }, async (request, reply) => {
    const { id } = request.params;

    const instance = await getInstance(id);
    if (!instance) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    }
    return reply.code(HTTP_STATUS_OK).send({
      id: instance.codename,
      name: request.i18n.t(`permissions.${instance.codename}`),
      codename: instance.codename,
      resource: instance.resource,
      action: instance.action,
    });
  });
};

export default adminPermissionController;
