import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../../config/httpStatus.config";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import { Page, PageLanguage } from "../models";

const websitePageSchema = {
  params: z.object({
    locale: z.string(),
    pageSlug: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.object({
      id: z.number(),
      slug: z.string(),
      metaTitle: z.string(),
      metaDescription: z.string(),
      pageTitle: z.string(),
      pageDescription: z.string(),
    }),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

const websitePageController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  app.get(`${routePrefix}/:locale/page/:pageSlug`, { schema: websitePageSchema }, async (request, reply) => {
    const { locale, pageSlug } = request.params;

    const currentLocale = await app.getRequestLocale(locale);

    // Find page by slug and ensure it's published
    const page = await Page.findOne({
      where: {
        slug: pageSlug,
        publish: true,
      },
      include: [
        {
          model: PageLanguage,
          association: "pageLanguages",
          where: {
            languageId: currentLocale,
          },
          required: true,
        },
      ],
    });

    if (!page || !page.pageLanguages || page.pageLanguages.length === 0) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    }

    const pageLanguage = page.pageLanguages[0];

    return reply.code(HTTP_STATUS_OK).send({
      id: page.id,
      slug: page.slug,
      metaTitle: pageLanguage.metaTitle,
      metaDescription: pageLanguage.metaDescription,
      pageTitle: pageLanguage.pageTitle,
      pageDescription: pageLanguage.pageDescription,
    });
  });
};

export default websitePageController;
