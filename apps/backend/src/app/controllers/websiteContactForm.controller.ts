import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { HTTP_STATUS_CREATED, HTTP_STATUS_OK, HTTP_STATUS_SERVER_ERROR } from "../../config/httpStatus.config";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import { ContactForm } from "../models";
import sequelizeConnector from "../../config/sequelizeConnector.config";
import { adminContactFormBase } from "../schemas/adminContactForm.schema";
import { Resend } from "resend";
import config from "../../config/app.config";

const sectorOptions = ["Artigianato", "Alimentare", "Altro"] as const;
const activityOptions = ["Studente", "Impiegato", "Imprenditore", "Pensionato"] as const;

const websiteContactFormSchema = {
  body: adminContactFormBase.omit({ id: true }),
  response: {
    [HTTP_STATUS_CREATED]: z.object({
      id: z.number(),
      name: z.string(),
      surname: z.string(),
      email: z.string(),
      phone: z.string(),
      note: z.string(),
      createdAt: z.date(),
    }),
  },
};

const excellentCrafterFormSchema = z.object({
  activityName: z.string().min(1, "Il nome dell'attività è obbligatorio"),
  companyName: z.string().min(1, "La ragione sociale è obbligatoria"),
  sector: z
    .string()
    .min(1, "Il settore è obbligatorio")
    .refine((val) => sectorOptions.includes(val as (typeof sectorOptions)[number]), {
      message: "Seleziona un settore valido",
    }),
  activityDescription: z.string().min(1, "La descrizione dell'attività è obbligatoria"),
  name: z.string().min(1, "Il nome è obbligatorio"),
  surname: z.string().min(1, "Il cognome è obbligatorio"),
  email: z.string().email("Indirizzo email non valido").min(1, "L'email è obbligatoria"),
  phone: z.string().min(1, "Il telefono è obbligatorio"),
  streetAddress: z.string().min(1, "L'indirizzo è obbligatorio"),
  postalCode: z.string().min(1, "Il CAP è obbligatorio"),
  city: z.string().min(1, "La città è obbligatoria"),
  province: z.string().min(1, "La provincia è obbligatoria"),
  message: z.string().optional(),
});

const explorerFormSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
  surname: z.string().min(1, "Il cognome è obbligatorio"),
  email: z.string().email("Indirizzo email non valido").min(1, "L'email è obbligatoria"),
  phone: z.string().min(1, "Il cellulare è obbligatorio"),
  activity: z
    .string()
    .min(1, "L'attività è obbligatoria")
    .refine((val) => activityOptions.includes(val as (typeof activityOptions)[number]), {
      message: "Seleziona un'attività valida",
    }),
  streetAddress: z.string().min(1, "L'indirizzo è obbligatorio"),
  postalCode: z.string().min(1, "Il CAP è obbligatorio"),
  city: z.string().min(1, "La città è obbligatoria"),
  province: z.string().min(1, "La provincia è obbligatoria"),
  instagramProfile: z.string().optional(),
  socialProfile: z.string().optional(),
  facebookProfile: z.string().optional(),
  whyExplorer: z.string().min(1, "Il campo è obbligatorio"),
});

const excellentCrafterFormApiSchema = {
  body: excellentCrafterFormSchema,
  response: {
    [HTTP_STATUS_OK]: z.object({
      success: z.boolean(),
      message: z.string(),
    }),
    [HTTP_STATUS_SERVER_ERROR]: z.object({
      success: z.boolean(),
      message: z.string(),
    }),
  },
};

const explorerFormApiSchema = {
  body: explorerFormSchema,
  response: {
    [HTTP_STATUS_OK]: z.object({
      success: z.boolean(),
      message: z.string(),
    }),
    [HTTP_STATUS_SERVER_ERROR]: z.object({
      success: z.boolean(),
      message: z.string(),
    }),
  },
};

const websiteContactFormController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  // Submit Contact Form
  app.post(`${routePrefix}/contact-form`, { schema: websiteContactFormSchema }, async (request, reply) => {
    const { name, surname, email, phone, note } = request.body;

    const contactForm = await sequelizeConnector.transaction(async (t) => {
      return await ContactForm.create(
        {
          name,
          surname,
          email,
          phone,
          note,
        },
        { transaction: t }
      );
    });

    return reply.code(HTTP_STATUS_CREATED).send({
      id: contactForm.id,
      name: contactForm.name,
      surname: contactForm.surname,
      email: contactForm.email,
      phone: contactForm.phone,
      note: contactForm.note,
      createdAt: contactForm.createdAt,
    });
  });

  // Excellent Crafter Form
  app.post(`${routePrefix}/:locale/excellent-crafter-form`, { schema: excellentCrafterFormApiSchema }, async (request, reply) => {
    const formData = request.body;
    const resend = new Resend(config.resend.apiKey);
    const fromEmail = config.resend.fromEmail;
    const fromName = config.resend.fromName;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nuova Richiesta Excellent Crafter</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
          <h1 style="color: #2c3e50; margin-bottom: 20px;">Nuova Richiesta Excellent Crafter</h1>
          
          <h2 style="color: #34495e; margin-top: 30px; margin-bottom: 15px;">Informazioni Attività</h2>
          <p><strong>Nome Attività:</strong> ${formData.activityName}</p>
          <p><strong>Ragione Sociale:</strong> ${formData.companyName}</p>
          <p><strong>Settore:</strong> ${formData.sector}</p>
          <p><strong>Descrizione Attività:</strong> ${formData.activityDescription}</p>
          
          <h2 style="color: #34495e; margin-top: 30px; margin-bottom: 15px;">Informazioni Contatto</h2>
          <p><strong>Nome:</strong> ${formData.name}</p>
          <p><strong>Cognome:</strong> ${formData.surname}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Telefono:</strong> ${formData.phone}</p>
          
          <h2 style="color: #34495e; margin-top: 30px; margin-bottom: 15px;">Indirizzo</h2>
          <p><strong>Indirizzo:</strong> ${formData.streetAddress}</p>
          <p><strong>CAP:</strong> ${formData.postalCode}</p>
          <p><strong>Città:</strong> ${formData.city}</p>
          <p><strong>Provincia:</strong> ${formData.province}</p>
          
          ${formData.message ? `<h2 style="color: #34495e; margin-top: 30px; margin-bottom: 15px;">Messaggio</h2><p>${formData.message}</p>` : ""}
          
          <p style="margin-top: 30px; font-size: 12px; color: #666;">
            Il team di In Italy
          </p>
        </div>
      </body>
      </html>
    `;

    try {
      const { data, error } = await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: [formData.email, "vladpaul1996@gmail.com", "info@ndbwebservice.com"],
        subject: "Conferma Richiesta Excellent Crafter - In Italy",
        html: emailHtml,
      });

      if (error) {
        console.error("Error sending excellent crafter form email:", error);
        return reply.code(HTTP_STATUS_SERVER_ERROR).send({
          success: false,
          message: "Errore nell'invio dell'email",
        });
      }

      console.log("Excellent crafter form email sent successfully:", data);
      return reply.code(HTTP_STATUS_OK).send({
        success: true,
        message: "Email inviata con successo",
      });
    } catch (error) {
      console.error("Exception sending excellent crafter form email:", error);
      return reply.code(HTTP_STATUS_SERVER_ERROR).send({
        success: false,
        message: "Errore nell'invio dell'email",
      });
    }
  });

  // Explorer Form
  app.post(`${routePrefix}/:locale/explorer-form`, { schema: explorerFormApiSchema }, async (request, reply) => {
    const formData = request.body;
    const resend = new Resend(config.resend.apiKey);
    const fromEmail = config.resend.fromEmail;
    const fromName = config.resend.fromName;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nuova Richiesta Explorer</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
          <h1 style="color: #2c3e50; margin-bottom: 20px;">Nuova Richiesta Explorer</h1>
          
          <h2 style="color: #34495e; margin-top: 30px; margin-bottom: 15px;">Informazioni Personali</h2>
          <p><strong>Nome:</strong> ${formData.name}</p>
          <p><strong>Cognome:</strong> ${formData.surname}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Cellulare:</strong> ${formData.phone}</p>
          <p><strong>Attività:</strong> ${formData.activity}</p>
          
          <h2 style="color: #34495e; margin-top: 30px; margin-bottom: 15px;">Indirizzo</h2>
          <p><strong>Indirizzo:</strong> ${formData.streetAddress}</p>
          <p><strong>CAP:</strong> ${formData.postalCode}</p>
          <p><strong>Città:</strong> ${formData.city}</p>
          <p><strong>Provincia:</strong> ${formData.province}</p>
          
          <h2 style="color: #34495e; margin-top: 30px; margin-bottom: 15px;">Profili Social</h2>
          ${formData.instagramProfile ? `<p><strong>Instagram:</strong> ${formData.instagramProfile}</p>` : ""}
          ${formData.socialProfile ? `<p><strong>Profilo Social:</strong> ${formData.socialProfile}</p>` : ""}
          ${formData.facebookProfile ? `<p><strong>Facebook:</strong> ${formData.facebookProfile}</p>` : ""}
          
          <h2 style="color: #34495e; margin-top: 30px; margin-bottom: 15px;">Perché Explorer</h2>
          <p>${formData.whyExplorer}</p>
          
          <p style="margin-top: 30px; font-size: 12px; color: #666;">
            Il team di In Italy
          </p>
        </div>
      </body>
      </html>
    `;

    try {
      const { data, error } = await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: [formData.email, "vladpaul1996@gmail.com", "info@ndbwebservice.com"],
        subject: "Conferma Richiesta Explorer - In Italy",
        html: emailHtml,
      });

      if (error) {
        console.error("Error sending explorer form email:", error);
        return reply.code(HTTP_STATUS_SERVER_ERROR).send({
          success: false,
          message: "Errore nell'invio dell'email",
        });
      }

      console.log("Explorer form email sent successfully:", data);
      return reply.code(HTTP_STATUS_OK).send({
        success: true,
        message: "Email inviata con successo",
      });
    } catch (error) {
      console.error("Exception sending explorer form email:", error);
      return reply.code(HTTP_STATUS_SERVER_ERROR).send({
        success: false,
        message: "Errore nell'invio dell'email",
      });
    }
  });
};

export default websiteContactFormController;
