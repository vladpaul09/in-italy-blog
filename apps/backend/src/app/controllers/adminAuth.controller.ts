import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import bcrypt from "bcrypt";
import { User, Permission } from "../models";
import { HTTP_STATUS_CREATED, HTTP_STATUS_OK, HTTP_STATUS_UNAUTHORIZED } from "../../config/httpStatus.config";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import { checkAuthSchema, loginSchema, logoutSchema } from "../schemas/adminAuth.schema";

const adminAuthController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  app.post(`${routePrefix}/check-auth`, { schema: checkAuthSchema, onRequest: [app.jwtAuthenticate] }, async (request, reply) => {
    return reply.code(HTTP_STATUS_OK).send(true);
  });

  app.post(`${routePrefix}/login`, { schema: loginSchema }, async (request, reply) => {
    const { username, password } = request.body;

    const user = await User.findOne({
      where: { email: username },
      include: [
        {
          association: "groups",
          include: [
            {
              association: "permissions",
              attributes: ["resource", "action"],
            },
          ],
        },
      ],
    });
    const isMatch = user && (await bcrypt.compare(password, user.password));
    if (!user || !isMatch) {
      return reply.code(HTTP_STATUS_UNAUTHORIZED).send({
        message: request.i18n.t("http_messages.invalid_email_or_password"),
      });
    }
    const payload = {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      isSuperUser: user.isSuperUser,
    };
    const token = request.jwt.sign(payload, { expiresIn: "72h" });

    reply.setCookie("access_token", token, { path: "/", httpOnly: true, secure: true, sameSite: "none" });
    return reply.code(HTTP_STATUS_CREATED).send(
      user.isSuperUser
        ? await Permission.findAll({
            attributes: ["resource", "action"],
          })
        : (user.groups || [])
            .reduce((acc, group) => [...acc, ...(group.permissions || [])], [] as Permission[])
            .map((perm) => ({
              resource: perm.resource,
              action: perm.action,
            }))
    );
  });

  app.post(`${routePrefix}/logout`, { schema: logoutSchema, onRequest: [app.jwtAuthenticate] }, async (request, reply) => {
    reply.clearCookie("access_token", { sameSite: "none", secure: true });
    return reply.send({ message: "Logout successful" });
  });
};

export default adminAuthController;
