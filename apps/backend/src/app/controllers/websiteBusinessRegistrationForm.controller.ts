import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { HTTP_STATUS_CREATED } from "../../config/httpStatus.config";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import { BusinessRegistrationForm } from "../models";
import sequelizeConnector from "../../config/sequelizeConnector.config";
import { adminBusinessRegistrationFormBase } from "../schemas/adminBusinessRegistrationForm.schema";

const websiteBusinessRegistrationFormSchema = {
  body: adminBusinessRegistrationFormBase.omit({ id: true }),
  response: {
    [HTTP_STATUS_CREATED]: z.object({
      id: z.number(),
      name: z.string(),
      surname: z.string(),
      email: z.string(),
      phone: z.string(),
      note: z.string(),
      company: z.string(),
      fiscalCode: z.string(),
      createdAt: z.date(),
    }),
  },
};

const websiteBusinessRegistrationFormController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  // Submit Business Registration Form
  app.post(`${routePrefix}/business-registration-form`, { schema: websiteBusinessRegistrationFormSchema }, async (request, reply) => {
      const { name, surname, email, phone, note, company, fiscalCode } = request.body;

      const businessRegistrationForm = await sequelizeConnector.transaction(async (t) => {
        return await BusinessRegistrationForm.create(
          {
            name,
            surname,
            email,
            phone,
            note,
            company,
            fiscalCode,
          },
          { transaction: t }
        );
      });
      
      return reply.code(HTTP_STATUS_CREATED).send({
        id: businessRegistrationForm.id,
        name: businessRegistrationForm.name,
        surname: businessRegistrationForm.surname,
        email: businessRegistrationForm.email,
        phone: businessRegistrationForm.phone,
        note: businessRegistrationForm.note,
        company: businessRegistrationForm.company,
        fiscalCode: businessRegistrationForm.fiscalCode,
        createdAt: businessRegistrationForm.createdAt,
      });
  });
};

export default websiteBusinessRegistrationFormController;