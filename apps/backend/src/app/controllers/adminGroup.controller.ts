import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { Op, Transaction } from "sequelize";
import {
  adminGroupCreateSchema,
  adminGroupDeleteSchema,
  adminGroupEditSchema,
  adminGroupListSchema,
  adminGroupSchema,
} from "../schemas/adminGroup.schema";
import {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_SERVER_ERROR,
} from "../../config/httpStatus.config";
import { Group, Permission, GroupPermission } from "../models";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import sequelizeConnector from "../../config/sequelizeConnector.config";

const adminGroupController: FastifyPluginAsyncZod<IBaseRoute> = async (app, { routePrefix }) => {
  const getInstance = async (id: number, t?: Transaction) =>
    await Group.findByPk(id, { include: { model: Permission, as: "permissions" }, transaction: t });

  app.get(routePrefix, { schema: adminGroupListSchema, preParsing: app.permGuard("admin.groups.list") }, async (request, reply) => {
    const { rangeFirst, rangeLast, sortBy, sortOrder, filter } = request.query;
    const filters: { q?: string } = JSON.parse(filter);

    const { count, rows } = await Group.findAndCountAll({
      where: { ...(filters.q ? { name: { [Op.like]: `%${filters.q}%` } } : {}) },
      offset: rangeFirst,
      limit: rangeLast - rangeFirst + 1,
      order: [[sortBy, sortOrder]],
      distinct: true,
    });

    return reply.code(HTTP_STATUS_OK).send({
      data: rows.map((item) => ({
        id: item.id,
        name: item.name,
      })),
      total: count,
    });
  });

  app.get(`${routePrefix}/:id`, { schema: adminGroupSchema, preParsing: app.permGuard("admin.groups.show") }, async (request, reply) => {
    const { id } = request.params;

    const instance = await getInstance(id);

    if (!instance) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    } else {
      return reply.code(HTTP_STATUS_OK).send({
        id: instance.id,
        name: instance.name,
        description: instance.description,
        permissions: instance.permissions ? instance.permissions.map((item) => item.codename) : [],
      });
    }
  });

  app.post(routePrefix, { schema: adminGroupCreateSchema, preParsing: app.permGuard("admin.groups.create") }, async (request, reply) => {
    try {
      const { name, description, permissions } = request.body;

      const { instance, instanceChilds } = await sequelizeConnector.transaction(async (t) => {
        const record = await Group.create({ name: name, description: description ?? undefined }, { transaction: t });
        const recordChilds = await GroupPermission.bulkCreate(
          permissions.map((item) => ({ groupId: record.id, permissionCodename: item })),
          { transaction: t }
        );
        return { instance: record, instanceChilds: recordChilds };
      });
      return reply.code(HTTP_STATUS_CREATED).send({
        id: instance.id,
        name: instance.name,
        description: instance.description,
        permissions: instanceChilds.map((item) => item.permissionCodename),
      });
    } catch (error) {
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });

  app.put(`${routePrefix}/:id`, { schema: adminGroupEditSchema, preParsing: app.permGuard("admin.groups.edit") }, async (request, reply) => {
    try {
      const { id } = request.params;

      const items = await sequelizeConnector.transaction(async (t) => {
        const record = await getInstance(id, t);
        if (!record) {
          return null;
        } else {
          const { name, description, permissions } = request.body;

          record.name = name;
          record.description = description ?? undefined;

          await record.save({ transaction: t });
          await GroupPermission.destroy({ where: { groupId: record.id }, transaction: t });
          const recordChilds = await GroupPermission.bulkCreate(
            permissions.map((item) => ({ groupId: record.id, permissionCodename: item })),
            { transaction: t }
          );

          return { instance: record, instanceChilds: recordChilds };
        }
      });
      if (!items) {
        return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
      } else {
        const { instance, instanceChilds } = items;
        return reply.code(HTTP_STATUS_CREATED).send({
          id: instance.id,
          name: instance.name,
          description: instance.description,
          permissions: instanceChilds.map((item) => item.permissionCodename),
        });
      }
    } catch (error) {
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });

  app.delete(`${routePrefix}/:id`, { schema: adminGroupDeleteSchema, preParsing: app.permGuard("admin.groups.delete") }, async (request, reply) => {
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

export default adminGroupController;
