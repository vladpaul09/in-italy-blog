import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { Op, Transaction } from "sequelize";
import { adminNewsletterListSchema, adminNewsletterSchema } from "../schemas/adminNewsletter.schema";
import { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../../config/httpStatus.config";
import { Newsletter } from "../models";
import IBaseRoute from "../../interfaces/baseRoute.interface";

const adminNewsletterController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  const getInstance = async (id: number, t?: Transaction) =>
    await Newsletter.findOne({
      where: { id },
      transaction: t,
    });

  // List Newsletters
  app.get(routePrefix, { schema: adminNewsletterListSchema, preParsing: app.permGuard("admin.newsletter.list") }, async (request, reply) => {
    const { rangeFirst, rangeLast, sortBy, sortOrder, filter } = request.query as any;
    const filters: { email?: string } = JSON.parse(filter);

    const { rows, count } = await Newsletter.findAndCountAll({
      where: {
        ...(filters.email ? { email: { [Op.like]: `%${filters.email}%` } } : {}),
      },
      offset: rangeFirst,
      limit: rangeLast - rangeFirst + 1,
      order: [[sortBy, sortOrder]],
    });

    return reply.code(HTTP_STATUS_OK).send({
      data: rows.map((item) => ({
        email: item.email,
        createdAt: item.createdAt,
      })),
      total: count,
    });
  });

  // Get Newsletter Registration Form
  app.get(`${routePrefix}/:id`, { schema: adminNewsletterSchema, preParsing: app.permGuard("admin.newsletter.show") }, async (request, reply) => {
    const { id } = request.params;
    const instance = await getInstance(id);

    if (!instance) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    }
    
    return reply.code(HTTP_STATUS_OK).send({
      email: instance.email,
      createdAt: instance.createdAt,
    });
  });
};

export default adminNewsletterController; 