import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../../config/httpStatus.config";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import { Category, Event } from "../models";
import formatI18nMunicipality from "../../utils/formatI18nMunicipality.util";
import formatI18nProvince from "../../utils/formatI18nProvince.util";
import formatI18nRegion from "../../utils/formatI18nRegion.util";
import { EventSchema, MunicipalitySchema } from "../schemas/websiteBase.schema";
import { Op } from "sequelize";
import config from "../../config/app.config";
import formatI18nEvent from "../../utils/formatI18nEvent.util";
import CategoriesType from "../../entries/categoriesType.entry";
import adInjector from "../../utils/adsInjector.util";
import { adArray } from "../../entries/ads.entry";

const websiteEventBaseSchema = {
  params: z.object({
    locale: z.string(),
    eventSlug: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.object({
      event: EventSchema,
      municipality: MunicipalitySchema.optional(),
      latestEvents: z.array(EventSchema),
    }),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

const websiteEventPageController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  app.get(`${routePrefix}/:locale/event/:eventSlug`, { schema: websiteEventBaseSchema }, async (request, reply) => {
    const { locale, eventSlug } = request.params;

    const currentLocale = await app.getRequestLocale(locale);

    const event = await Event.findOne({
      where: {
        slug: eventSlug,
        publish: true,
      },
      include: [
        { association: "eventLanguages" },
        { association: "author" },
        { association: "authorAlias" },
        {
          association: "municipality",
          include: [
            { association: "municipalityLanguages" },
            {
              association: "province",
              include: [{ association: "provinceLanguages" }, { association: "region", include: [{ association: "regionLanguages" }] }],
            },
          ],
        },
        {
          association: "categories",
          where: {
            type: CategoriesType.EVENTS,
          },
        },
      ],
    });

    if (!event) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    }

    const eventCategories = event.categories || [];
    const parentCategories = (await Promise.all(eventCategories.map((category) => Category.getParentCategoriesHierarchy(category.id)))).reduce(
      (acc, val) => acc.concat(val),
      []
    );

    const latestEvents = await Event.findAll({
      where: {
        publish: true,
        endDate: { [Op.gte]: new Date() },
        id: {
          [Op.not]: event.id,
        },
      },
      include: [
        { association: "eventLanguages" },
        { association: "author" },
        { association: "authorAlias" },
        {
          association: "categories",
          where: {
            [Op.or]: [
              {
                id: {
                  [Op.in]: parentCategories.map((category) => category.id),
                },
              },
              {
                parentId: {
                  [Op.in]: parentCategories.map((category) => category.id),
                },
              },
            ],
            type: CategoriesType.EVENTS,
          },
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: config.maxLimitNews,
    });

    const eventFormatted = await formatI18nEvent(event, event.author!, event.authorAlias, currentLocale);

    return reply.code(HTTP_STATUS_OK).send({
      event: { ...eventFormatted, description: adInjector(eventFormatted.description!, adArray) },
      latestEvents: await Promise.all((latestEvents || []).map((event) => formatI18nEvent(event, event.author!, event.authorAlias, currentLocale))),
      municipality: event.municipalityId
        ? {
            ...(await formatI18nMunicipality(event.municipality!, currentLocale)),
            province: {
              ...(await formatI18nProvince(event.municipality!.province!, currentLocale)),
              region: {
                ...(await formatI18nRegion(event.municipality!.province!.region!, currentLocale)),
              },
            },
          }
        : undefined,
    });
  });
};

export default websiteEventPageController;
