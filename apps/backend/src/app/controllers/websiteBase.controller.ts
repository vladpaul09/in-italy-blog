import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
  websiteRegionalSlugsSchema,
  websiteLanguagesSchema,
  websiteTranslationsSchema,
  websiteMunicipalitiesSearchSchema,
  websiteNewsletterSubscribeSchema,
  websiteCategoriesArticlesSchema,
  websiteCategoriesEventsSchema,
  websiteTagsSchema,
  websiteRegionsSchema,
  websiteMunicipalitiesSchema,
} from "../schemas/websiteBase.schema";
import {
  HTTP_STATUS_OK,
  HTTP_STATUS_SERVER_ERROR,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_UNPROCESSABLE_CONTENT,
} from "../../config/httpStatus.config";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import { Region, Language, I18n, Municipality, Article, Newsletter, Category, Tag } from "../models";
import config from "../../config/app.config";
import formatI18nRegion from "../../utils/formatI18nRegion.util";
import formatI18nMunicipality from "../../utils/formatI18nMunicipality.util";
import formatI18nProvince from "../../utils/formatI18nProvince.util";
import formatI18nArticle from "../../utils/formatI18nArticle.util";
import formatI18nCategory from "../../utils/formatI18nCategory.util";
import formatI18nTag from "../../utils/formatI18nTag.util";
import { websiteLatestArticlesSchema } from "../schemas/websiteBase.schema";
import CategoriesType from "../../entries/categoriesType.entry";

const websiteBaseController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  // Get all active languages
  app.get(`${routePrefix}/languages`, { schema: websiteLanguagesSchema }, async (request, reply) => {
    const languages = await Language.findAll({
      where: {
        status: true,
      },
      attributes: ["id", "name", "default", "image", "sortOrder"],
    });

    return reply.code(HTTP_STATUS_OK).send(
      languages.map((language) => ({
        id: language.id,
        name: language.name,
        default: language.default,
        sortOrder: language.sortOrder,
        image: `${config.serverNameStatics}/uploads/images/languages/${language.image}`,
      }))
    );
  });

  // Get all municipality slugs with their region and province hierarchy
  app.get(`${routePrefix}/regions/all`, { schema: websiteRegionalSlugsSchema }, async (request, reply) => {
    const regions = await Region.findAll({
      attributes: ["slug"],
      where: {
        showFrontend: true,
      },
      include: [
        {
          association: "provinces",
          required: false,
          attributes: ["slug"],
          where: {
            showFrontend: true,
          },
          include: [
            {
              association: "municipalities",
              required: false,
              attributes: ["slug"],
              where: {
                showFrontend: true,
              },
            },
          ],
        },
      ],
    });

    return reply.code(HTTP_STATUS_OK).send(
      regions.map((region) => ({
        regionSlug: region.slug,
        provincesSlugs: (region.provinces || []).map((province) => ({
          provinceSlug: province.slug,
          municipalitiesSlugs: (province.municipalities || []).map((municipality) => ({
            municipalitySlug: municipality.slug,
          })),
        })),
      }))
    );
  });

  // Get all translations for a specific language
  app.get(`${routePrefix}/:locale/translations`, { schema: websiteTranslationsSchema }, async (request, reply) => {
    const { locale } = request.params;
    // First find the language by ID
    const language = await app.getRequestLocale(locale);
    // Get translations for default language
    const results = await I18n.findAll({ where: { langId: language } });
    return reply.code(HTTP_STATUS_OK).send(Object.fromEntries(results.map((translation) => [translation.id, translation.value])));
  });

  app.get(`${routePrefix}/:locale/municipalities-search`, { schema: websiteMunicipalitiesSearchSchema }, async (request, reply) => {
    const { locale } = request.params;

    const currentLocale = await app.getRequestLocale(locale);

    const municipalities = await Municipality.findAll({
      include: [
        {
          association: "province",
          include: [
            {
              association: "region",
              include: [{ association: "regionLanguages" }],
            },
            { association: "provinceLanguages" },
          ],
        },
        { association: "municipalityLanguages" },
      ],
    });

    return reply.code(HTTP_STATUS_OK).send(
      (
        await Promise.all(
          municipalities.map(async (municipality) => ({
            ...(await formatI18nMunicipality(municipality, currentLocale)),
            province: {
              ...(await formatI18nProvince(municipality.province!, currentLocale)),
              region: {
                ...(await formatI18nRegion(municipality.province!.region!, currentLocale)),
              },
            },
          }))
        )
      )
        .map((item) => {
          return {
            id: item.id,
            name: item.name,
            url: `${item.province.region.slug}/${item.province.slug}/${item.slug}`,
          };
        })
        .sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        })
    );
  });

  app.get(`${routePrefix}/:locale/latest-articles`, { schema: websiteLatestArticlesSchema }, async (request, reply) => {
    const { locale } = request.params;
    const currentLocale = await app.getRequestLocale(locale);

    const articles = await Article.findAll({
      where: { publish: true },
      include: [{ association: "articleLanguages" }, { association: "author" }, { association: "authorAlias" }],
      order: [["createdAt", "DESC"]],
      limit: 6,
    });

    return reply.code(HTTP_STATUS_OK).send(
      await Promise.all(
        articles.map(async (article) => ({
          ...(await formatI18nArticle(article, article.author!, article.authorAlias, currentLocale)),
          createdAt: article.createdAt,
        }))
      )
    );
  });

  // Subscribe to Newsletter
  app.post(`${routePrefix}/newsletter-registration`, { schema: websiteNewsletterSubscribeSchema }, async (request, reply) => {
    try {
      const { email } = request.body;

      // Check if email already exists
      const existingSubscription = await Newsletter.findOne({ where: { email } });
      if (existingSubscription) {
        return reply.code(HTTP_STATUS_OK).send({
          message: "Email is already subscribed to newsletter",
        });
      }

      // Create new subscription
      const subscription = await Newsletter.create({ email });

      return reply.code(HTTP_STATUS_CREATED).send({
        message: "Successfully subscribed to newsletter",
      });
    } catch (error) {
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });

  // Get all article categories
  app.get(`${routePrefix}/:locale/categories-articles`, { schema: websiteCategoriesArticlesSchema }, async (request, reply) => {
    const { locale } = request.params;
    const currentLocale = await app.getRequestLocale(locale);

    const categories = await Category.findAll({
      where: { type: CategoriesType.ARTICLES },
      include: [{ association: "categoryLanguages" }],
      order: [["createdAt", "ASC"]],
    });

    return reply.code(HTTP_STATUS_OK).send(
      await Promise.all(categories.map(async (category) => await formatI18nCategory(category, currentLocale)))
    );
  });

  // Get all event categories
  app.get(`${routePrefix}/:locale/categories-events`, { schema: websiteCategoriesEventsSchema }, async (request, reply) => {
    const { locale } = request.params;
    const currentLocale = await app.getRequestLocale(locale);

    const categories = await Category.findAll({
      where: { type: CategoriesType.EVENTS },
      include: [{ association: "categoryLanguages" }],
      order: [["createdAt", "ASC"]],
    });

    return reply.code(HTTP_STATUS_OK).send(
      await Promise.all(categories.map(async (category) => await formatI18nCategory(category, currentLocale)))
    );
  });

  // Get all tags
  app.get(`${routePrefix}/:locale/tags`, { schema: websiteTagsSchema }, async (request, reply) => {
    const { locale } = request.params;
    const currentLocale = await app.getRequestLocale(locale);

    const tags = await Tag.findAll({
      include: [{ association: "tagLanguages" }],
      order: [["createdAt", "ASC"]],
    });

    return reply.code(HTTP_STATUS_OK).send(tags.map((tag) => formatI18nTag(tag, currentLocale)));
  });

  // Get all regions
  app.get(`${routePrefix}/:locale/regions`, { schema: websiteRegionsSchema }, async (request, reply) => {
    const { locale } = request.params;
    const currentLocale = await app.getRequestLocale(locale);

    const regions = await Region.findAll({
      where: { showFrontend: true },
      include: [{ association: "regionLanguages" }],
      order: [["createdAt", "ASC"]],
    });

    return reply.code(HTTP_STATUS_OK).send(
      await Promise.all(regions.map(async (region) => await formatI18nRegion(region, currentLocale)))
    );
  });

  // Get all municipalities
  app.get(`${routePrefix}/:locale/municipalities`, { schema: websiteMunicipalitiesSchema }, async (request, reply) => {
    const { locale } = request.params;
    const currentLocale = await app.getRequestLocale(locale);

    const municipalities = await Municipality.findAll({
      include: [
        {
          association: "municipalityLanguages",
        },
        {
          association: "province",
          required: true,
          include: [
            {
              association: "provinceLanguages",
            },
            {
              association: "region",
              required: true,
              include: [{ association: "regionLanguages" }],
            },
          ],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    return reply.code(HTTP_STATUS_OK).send(
      await Promise.all(
        municipalities.map(async (municipality) => {
          const formattedMunicipality = await formatI18nMunicipality(municipality, currentLocale);
          const provinceData = await formatI18nProvince(municipality.province!, currentLocale);
          const regionData = await formatI18nRegion(municipality.province!.region!, currentLocale);

          return {
            ...formattedMunicipality,
            province: {
              ...provinceData,
              region: regionData,
            },
          };
        })
      )
    );
  });
};

export default websiteBaseController;
