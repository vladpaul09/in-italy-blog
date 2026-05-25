import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { Op } from "sequelize";
import { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../../config/httpStatus.config";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import { Article, Category } from "../models";
import formatI18nMunicipality from "../../utils/formatI18nMunicipality.util";
import formatI18nProvince from "../../utils/formatI18nProvince.util";
import formatI18nRegion from "../../utils/formatI18nRegion.util";
import config from "../../config/app.config";
import { ArticleSchema, MunicipalitySchema } from "../schemas/websiteBase.schema";
import formatI18nArticle from "../../utils/formatI18nArticle.util";
import CategoriesType from "../../entries/categoriesType.entry";
import { adArray } from "../../entries/ads.entry";
import adInjector from "../../utils/adsInjector.util";

const websiteArticleBaseSchema = {
  params: z.object({
    locale: z.string(),
    articleSlug: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.object({
      article: ArticleSchema,
      municipality: MunicipalitySchema.optional(),
      latestArticles: z.array(ArticleSchema),
    }),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

const websiteArticlePageController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  app.get(`${routePrefix}/:locale/article/:articleSlug`, { schema: websiteArticleBaseSchema }, async (request, reply) => {
    const { locale, articleSlug } = request.params;

    const currentLocale = await app.getRequestLocale(locale);

    const article = await Article.findOne({
      where: {
        slug: articleSlug,
        publish: true,
      },
      include: [
        { association: "articleLanguages" },
        { association: "author" },
        { association: "authorAlias" },
        {
          association: "municipalities",
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
            type: CategoriesType.ARTICLES,
          },
        },
      ],
    });

    if (!article) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    }

    const articleCategories = article.categories || [];
    const parentCategories = (await Promise.all(articleCategories.map((category) => Category.getParentCategoriesHierarchy(category.id)))).reduce(
      (acc, val) => acc.concat(val),
      []
    );

    const latestArticles = await Article.findAll({
      where: {
        publish: true,
        id: {
          [Op.not]: article.id,
        },
      },
      include: [
        { association: "articleLanguages" },
        { association: "author", required: false },
        { association: "authorAlias", required: false },
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
            type: CategoriesType.ARTICLES,
          },
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: config.maxLimitNews,
    });

    const articleFormatted = await formatI18nArticle(article, article.author!, article.authorAlias, currentLocale);

    return reply.code(HTTP_STATUS_OK).send({
      article: { ...articleFormatted, description: adInjector(articleFormatted.description!, adArray) },
      latestArticles: await Promise.all(
        (latestArticles || []).map((article) => formatI18nArticle(article, article.author!, article.authorAlias, currentLocale))
      ),
      municipality:
        (article.municipalities || []).length > 0 && article.municipalities
          ? {
              ...(await formatI18nMunicipality(article.municipalities[0], currentLocale)),
              province: {
                ...(await formatI18nProvince(article.municipalities[0].province!, currentLocale)),
                region: {
                  ...(await formatI18nRegion(article.municipalities[0].province!.region!, currentLocale)),
                },
              },
            }
          : undefined,
    });
  });
};

export default websiteArticlePageController;
