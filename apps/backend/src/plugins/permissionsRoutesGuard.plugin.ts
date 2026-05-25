import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import User from "../app/models/user.model";
import Group from "../app/models/group.model";
import Permission from "../app/models/permission.model";
import sequelizeConnector from "../config/sequelizeConnector.config";
import { HTTP_STATUS_UNAUTHORIZED } from "../config/httpStatus.config";

declare module "fastify" {
  interface FastifyInstance {
    permGuard: (codename: string) => (request: FastifyRequest, reply: FastifyReply) => void;
    permGuardCheck: (codename: string) => (request: FastifyRequest) => Promise<boolean>;
    isSuperUser: (request: FastifyRequest) => Promise<boolean>;
  }
}

const permissionsRoutesGuard: FastifyPluginAsync = async (fastify, options) => {
  const checkPermission = (codename: string, request: FastifyRequest) =>
    sequelizeConnector.transaction(async (t) => {
      const superUser = await User.findOne({ where: { id: request.user.id, isSuperUser: true }, transaction: t });
      if (!superUser) {
        const user = await User.findOne({
          where: { id: request.user.id },
          include: [
            {
              model: Group,
              as: "groups",
              required: true,
              include: [
                {
                  model: Permission,
                  as: "permissions",
                  where: { codename: codename },
                },
              ],
            },
          ],
          transaction: t,
        });
        if (!user) {
          return false;
        }
      }
      return true;
    });

  fastify.decorate("permGuard", (codename: string) => async (request: FastifyRequest, reply: FastifyReply) => {
    const instanceCheck = await checkPermission(codename, request);
    if (!instanceCheck) {
      return reply.code(HTTP_STATUS_UNAUTHORIZED).send(request.i18n.t("http_messages.unauthorized"));
    }
  });

  fastify.decorate("permGuardCheck", (codename: string) => async (request: FastifyRequest) => {
    return checkPermission(codename, request);
  });

  fastify.decorate("isSuperUser", async (request: FastifyRequest) => {
    const user = await User.findOne({ where: { id: request.user.id, isSuperUser: true } });
    return user ? true : false;
  });
};

export default fp(permissionsRoutesGuard);
