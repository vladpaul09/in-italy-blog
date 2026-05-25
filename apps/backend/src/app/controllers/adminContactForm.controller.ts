import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { Op, Transaction } from "sequelize";
import { adminContactFormListSchema, adminContactFormSchema } from "../schemas/adminContactForm.schema";
import { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../../config/httpStatus.config";
import { ContactForm } from "../models";
import IBaseRoute from "../../interfaces/baseRoute.interface";

const adminContactFormController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  const getInstance = async (id: number, t?: Transaction) =>
    await ContactForm.findOne({
      where: { id },
      transaction: t,
    });

  // List Contact Forms
  app.get(routePrefix, { schema: adminContactFormListSchema, preParsing: app.permGuard("admin.contact-form.list") }, async (request, reply) => {
    const { rangeFirst, rangeLast, sortBy, sortOrder, filter } = request.query;
    const filters: { name?: string; surname?: string; email?: string; phone?: string } = JSON.parse(filter);

    const { rows, count } = await ContactForm.findAndCountAll({
      where: {
        ...(filters.name ? { name: { [Op.like]: `${filters.name}%` } } : {}),
        ...(filters.surname ? { surname: { [Op.like]: `${filters.surname}%` } } : {}),
        ...(filters.email ? { email: { [Op.like]: `${filters.email}%` } } : {}),
        ...(filters.phone ? { phone: { [Op.like]: `${filters.phone}%` } } : {}),
      },
      offset: rangeFirst,
      limit: rangeLast - rangeFirst + 1,
      order: [[sortBy, sortOrder]],
    });

    return reply.code(HTTP_STATUS_OK).send({
      data: rows.map((item) => ({
        id: item.id,
        name: item.name,
        surname: item.surname,
        email: item.email,
        phone: item.phone,
        note: item.note,
        createdAt: item.createdAt,
      })),
      total: count,
    });
  });

  // Get Contact Form
  app.get(`${routePrefix}/:id`, { schema: adminContactFormSchema, preParsing: app.permGuard("admin.contact-form.show") }, async (request, reply) => {
    const { id } = request.params;
    const instance = await getInstance(id);

    if (!instance) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    }

    return reply.code(HTTP_STATUS_OK).send({
      id: instance.id,
      name: instance.name,
      surname: instance.surname,
      email: instance.email,
      phone: instance.phone,
      note: instance.note,
    });
  });
};

export default adminContactFormController;
