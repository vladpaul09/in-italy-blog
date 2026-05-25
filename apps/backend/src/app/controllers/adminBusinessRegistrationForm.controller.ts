import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { Op, Transaction } from "sequelize";
import {
  adminBusinessRegistrationFormListSchema,
  adminBusinessRegistrationFormSchema,
} from "../schemas/adminBusinessRegistrationForm.schema";
import { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../../config/httpStatus.config";
import { BusinessRegistrationForm } from "../models";
import IBaseRoute from "../../interfaces/baseRoute.interface";

const adminBusinessRegistrationFormController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  const getInstance = async (id: number, t?: Transaction) =>
    await BusinessRegistrationForm.findOne({
      where: { id },
      transaction: t,
    });

  // List Business Registration Forms
  app.get(routePrefix, { schema: adminBusinessRegistrationFormListSchema, preParsing: app.permGuard("admin.business-registration-form.list") }, async (request, reply) => {
    const { rangeFirst, rangeLast, sortBy, sortOrder, filter } = request.query;
    const filters: { name?: string; surname?: string; email?: string; company?: string; phone?: string; } = JSON.parse(filter);

    const { rows, count } = await BusinessRegistrationForm.findAndCountAll({
      where: {
        ...(filters.name ? { name: { [Op.like]: `${filters.name}%` } } : {}),
        ...(filters.surname ? { surname: { [Op.like]: `${filters.surname}%` } } : {}),
        ...(filters.email ? { email: { [Op.like]: `${filters.email}%` } } : {}),
        ...(filters.company ? { company: { [Op.like]: `${filters.company}%` } } : {}),
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
        company: item.company,
        fiscalCode: item.fiscalCode,
        createdAt: item.createdAt,
      })),
      total: count,
    });
  });

  // Get Business Registration Form
  app.get(`${routePrefix}/:id`, { schema: adminBusinessRegistrationFormSchema, preParsing: app.permGuard("admin.business-registration-form.show") }, async (request, reply) => {
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
      company: instance.company,
      fiscalCode: instance.fiscalCode,
    });
  });
};

export default adminBusinessRegistrationFormController;