import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { Op, Transaction } from "sequelize";
import bcrypt from "bcrypt";
import { adminUserCreateSchema, adminUserDeleteSchema, adminUserEditSchema, adminUserListSchema, adminUserSchema } from "../schemas/adminUser.schema";
import {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_SERVER_ERROR,
} from "../../config/httpStatus.config";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import config from "../../config/app.config";
import { User, UserGroup, UserRegion, UserProvince, UserMunicipality, UserAlias } from "../models";
import sequelizeConnector from "../../config/sequelizeConnector.config";

const adminUserController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  const getInstance = async (id: number, t?: Transaction) => {
    return User.findByPk(id, {
      include: [
        { association: "groups" },
        { association: "regions" },
        { association: "provinces" },
        { association: "municipalities" },
        { association: "aliases" },
      ],
      transaction: t,
    });
  };

  app.get(routePrefix, { schema: adminUserListSchema, preParsing: app.permGuard("admin.users.list") }, async (request, reply) => {
    const { rangeFirst, rangeLast, sortBy, sortOrder, filter } = request.query;

    const filters: { firstName?: string; lastName?: string; groups?: number } = JSON.parse(filter);

    const { rows, count } = await User.findAndCountAll({
      where: {
        ...{
          ...(filters.firstName ? { first_name: { [Op.like]: `${filters.firstName}%` } } : {}),
          ...(filters.lastName ? { last_name: { [Op.like]: `${filters.lastName}%` } } : {}),
        },
      },
      offset: rangeFirst,
      limit: rangeLast - rangeFirst + 1,
      order: [[sortBy, sortOrder]],
      include: [
        {
          association: "groups",
          where: { ...(filters.groups ? { id: filters.groups } : {}) },
          required: filters.groups ? true : false,
        },
        { association: "aliases" },
      ],
    });
    const data = rows.map((item) => ({
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      aliases: item.aliases ? item.aliases.map((a) => ({ id: a.id, name: a.name })) : [],
      groups: item.groups ? item.groups.map((g) => g.id) : [],
    }));
    return reply.code(HTTP_STATUS_OK).send({ data, total: count });
  });

  app.get(`${routePrefix}/:id`, { schema: adminUserSchema, preParsing: app.permGuard("admin.users.show") }, async (request, reply) => {
    const { id } = request.params;

    const instance = await getInstance(id);

    if (!instance) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    } else {
      return reply.code(HTTP_STATUS_OK).send({
        id: instance.id,
        firstName: instance.firstName,
        lastName: instance.lastName,
        aliases: instance.aliases ? instance.aliases.map((a) => ({ id: a.id, name: a.name })) : [],
        email: instance.email,
        groups: instance.groups ? instance.groups.map((item) => item.id) : [],
        regions: instance.regions ? instance.regions.map((item) => item.id) : [],
        provinces: instance.provinces ? instance.provinces.map((item) => item.id) : [],
        municipalities: instance.municipalities ? instance.municipalities.map((item) => item.id) : [],
      });
    }
  });

  app.post(routePrefix, { schema: adminUserCreateSchema, preParsing: app.permGuard("admin.users.create") }, async (request, reply) => {
    try {
      const instance = await sequelizeConnector.transaction(async (t) => {
        const { firstName, lastName, password, email, groups, regions, provinces, municipalities, aliases = [] } = request.body;

        const { current } = password;

        const record = await User.create(
          {
            firstName: firstName,
            lastName: lastName,
            password: await bcrypt.hash(current, config.SALT_ROUNDS),
            email: email,
            isSuperUser: false,
          },
          { transaction: t }
        );

        const userAliases = await UserAlias.bulkCreate(
          aliases.map((item) => ({ userId: record.id, name: item.name })),
          { transaction: t }
        );

        await UserGroup.bulkCreate(
          groups.map((item) => ({ userId: record.id, groupId: item })),
          { transaction: t }
        );

        await UserRegion.bulkCreate(
          regions.map((item) => ({ userId: record.id, regionId: item })),
          { transaction: t }
        );

        await UserProvince.bulkCreate(
          provinces.map((item) => ({ userId: record.id, provinceId: item })),
          { transaction: t }
        );

        await UserMunicipality.bulkCreate(
          municipalities.map((item) => ({ userId: record.id, municipalityId: item })),
          { transaction: t }
        );

        return { record, aliases: userAliases };
      });
      return reply.code(HTTP_STATUS_CREATED).send({
        id: instance.record.id,
        firstName: instance.record.firstName,
        lastName: instance.record.lastName,
        aliases: instance.aliases ? instance.aliases.map((item) => ({ id: item.id, name: item.name })) : [],
        groups: instance.record.groups ? instance.record.groups.map((item) => item.id) : [],
        email: instance.record.email,
        regions: instance.record.regions ? instance.record.regions.map((item) => item.id) : [],
        provinces: instance.record.provinces ? instance.record.provinces.map((item) => item.id) : [],
        municipalities: instance.record.municipalities ? instance.record.municipalities.map((item) => item.id) : [],
      });
    } catch (error) {
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });

  app.put(`${routePrefix}/:id`, { schema: adminUserEditSchema, preParsing: app.permGuard("admin.users.edit") }, async (request, reply) => {
    try {
      const instance = await sequelizeConnector.transaction(async (t) => {
        const { id } = request.params;

        const record = await getInstance(id, t);
        if (!record) {
          return null;
        } else {
          const { firstName, lastName, email, groups, regions, provinces, municipalities, aliases } = request.body;

          record.firstName = firstName;
          record.lastName = lastName;
          record.email = email;

          await record.save({ transaction: t });

          // Existing aliases get updated and keep id but newly created get new id
          const userAliases = await Promise.all(
            aliases.map(async (alias) => {
              const existingAlias = alias.id ? await UserAlias.findOne({ where: { id: alias.id, userId: record.id }, transaction: t }) : null;
              if (existingAlias) {
                return existingAlias.update({ name: alias.name }, { transaction: t });
              } else {
                return UserAlias.create({ userId: record.id, name: alias.name }, { transaction: t });
              }
            })
          );

          await UserGroup.destroy({ where: { userId: record.id }, transaction: t });
          await UserGroup.bulkCreate(
            groups.map((item) => ({ userId: record.id, groupId: item })),
            { transaction: t }
          );

          await UserRegion.destroy({ where: { userId: record.id }, transaction: t });
          await UserRegion.bulkCreate(
            regions.map((item) => ({ userId: record.id, regionId: item })),
            { transaction: t }
          );

          await UserProvince.destroy({ where: { userId: record.id }, transaction: t });
          await UserProvince.bulkCreate(
            provinces.map((item) => ({ userId: record.id, provinceId: item })),
            { transaction: t }
          );

          await UserMunicipality.destroy({ where: { userId: record.id }, transaction: t });
          await UserMunicipality.bulkCreate(
            municipalities.map((item) => ({ userId: record.id, municipalityId: item })),
            { transaction: t }
          );

          return { record, aliases: userAliases };
        }
      });
      if (!instance) {
        return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
      } else {
        return reply.code(HTTP_STATUS_CREATED).send({
          id: instance.record.id,
          firstName: instance.record.firstName,
          lastName: instance.record.lastName,
          email: instance.record.email,
          groups: instance.record.groups ? instance.record.groups.map((item) => item.id) : [],
          regions: instance.record.regions ? instance.record.regions.map((item) => item.id) : [],
          provinces: instance.record.provinces ? instance.record.provinces.map((item) => item.id) : [],
          municipalities: instance.record.municipalities ? instance.record.municipalities.map((item) => item.id) : [],
          aliases: instance.aliases ? instance.aliases.map((item) => ({ id: item.id, name: item.name })) : [],
        });
      }
    } catch (error) {
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });

  app.delete(`${routePrefix}/:id`, { schema: adminUserDeleteSchema, preParsing: app.permGuard("admin.users.delete") }, async (request, reply) => {
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

export default adminUserController;
