import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { EventCategorySchema, ArticleCategorySchema, RegionSchema } from "../schemas/websiteBase.schema";
import { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../../config/httpStatus.config";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import { Category, Region, Settings } from "../models";
import { Op } from "sequelize";
import formatI18nEvent from "../../utils/formatI18nEvent.util";
import formatI18nCategory from "../../utils/formatI18nCategory.util";
import formatI18nArticle from "../../utils/formatI18nArticle.util";
import formatI18nRegion from "../../utils/formatI18nRegion.util";
import { settingsTopBoxesTypeLabels, RegionalArticleSetting } from "../../entries/settingsType.entry";
import PostScope from "../../entries/postScope.entry";

const websiteRegionBaseSchema = {
  params: z.object({
    locale: z.string(),
    regionSlug: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.object({
      region: RegionSchema,
      categoriesArticles: z.array(ArticleCategorySchema.extend({ subcategories: z.array(ArticleCategorySchema) })),
      categoriesEvents: z.array(EventCategorySchema),
    }),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

const websiteRegionPageController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  app.get(`${routePrefix}/:locale/:regionSlug`, { schema: websiteRegionBaseSchema }, async (request, reply) => {
    const { regionSlug, locale } = request.params;

    const currentLocale = await app.getRequestLocale(locale);

    const region = await Region.findOne({
      where: { slug: regionSlug },
      include: [
        {
          association: "provinces",
          include: [
            {
              association: "municipalities",
            },
          ],
        },
        { association: "regionLanguages", required: false },
      ],
    });
    if (!region) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    }

    const municipalityIds = (region.provinces || []).flatMap((p) => (p.municipalities || []).map((m) => m.id));

    // Get selected categories from settings
    const regionalArticlesSetting = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.REGIONAL_ARTICLES } });
    const articleCategoryIds = regionalArticlesSetting
      ? (JSON.parse(regionalArticlesSetting.value) as RegionalArticleSetting[]).map((x) => x.categoryArticleId)
      : [];

    const parentsArticleCategoryIds = (
      await Promise.all(
        articleCategoryIds.map(async (x) => await Category.findOne({ where: { id: x }, include: [{ association: "categoryLanguages" }] }))
      )
    ).filter((item) => item !== null);

    const categoriesEvents = await Category.findAll({
      include: [
        { association: "categoryLanguages", required: false },
        {
          association: "categoryEvents",

          required: true,
          where: {
            publish: true,
            endDate: { [Op.gte]: new Date() },
            municipalityId: { [Op.in]: municipalityIds },
          },
          include: [{ association: "eventLanguages", required: false }, { association: "author" }, { association: "authorAlias" }],
        },
      ],
    });

    return reply.code(HTTP_STATUS_OK).send({
      region: {
        ...(await formatI18nRegion(region, currentLocale)),
      },
      categoriesArticles: await Promise.all(
        parentsArticleCategoryIds.map(async (category) => {
          const categoriesArticles = await Category.findAll({
            where: {
              id: {
                [Op.in]: (await Category.getChildrenCategoriesHierarchy(category.id)).map((x) => x.id),
              },
            },
            include: [
              { association: "categoryLanguages", required: false },
              {
                association: "categoryArticles",
                required: false,
                where: {
                  publish: true,
                  scope: {
                    [Op.in]: [
                      PostScope.EVERYWHERE,
                      PostScope.REGION_ONLY,
                      PostScope.REGION_AND_PROVINCE,
                      PostScope.REGION_AND_MUNICIPALITIES,
                      PostScope.REGION_PROVINCES_AND_MUNICIPALITIES,
                    ],
                  },
                },
                include: [
                  { association: "articleLanguages", required: false },
                  { association: "author" },
                  { association: "authorAlias" },
                  {
                    association: "municipalities",
                    required: true,
                    where: { id: { [Op.in]: municipalityIds } },
                  },
                ],
              },
            ],
          });
          const subcategories = await Promise.all(
            categoriesArticles
              .filter((subcategory) => (subcategory.categoryArticles || []).length > 0)
              .map(async (subcategory) => ({
                ...(await formatI18nCategory(subcategory, currentLocale)),
                articles: await Promise.all(
                  (subcategory.categoryArticles || []).map((article) =>
                    formatI18nArticle(article, article.author!, article.authorAlias, currentLocale)
                  )
                ),
              }))
          );
          if (subcategories.length > 0) {
            return {
              ...(await formatI18nCategory(category, currentLocale)),
              articles: await Promise.all(
                categoriesArticles
                  .flatMap((subcategory) => subcategory.categoryArticles || [])
                  .map((article) => formatI18nArticle(article, article.author!, article.authorAlias, currentLocale))
              ),
              subcategories,
            };
          }
          const categoryWithArticles = await Category.findByPk(category.id, {
            include: [
              {
                association: "categoryLanguages",
              },
              {
                association: "categoryArticles",
                where: {
                  publish: true,
                  scope: {
                    [Op.in]: [
                      PostScope.EVERYWHERE,
                      PostScope.REGION_ONLY,
                      PostScope.REGION_AND_PROVINCE,
                      PostScope.REGION_AND_MUNICIPALITIES,
                      PostScope.REGION_PROVINCES_AND_MUNICIPALITIES,
                    ],
                  },
                },
                include: [
                  {
                    association: "articleLanguages",
                  },
                  { association: "author" },
                  { association: "authorAlias" },
                  {
                    association: "municipalities",
                    where: {
                      id: { [Op.in]: municipalityIds },
                    },
                  },
                ],
              },
            ],
          });
          return {
            ...(await formatI18nCategory(category, currentLocale)),
            articles: categoryWithArticles
              ? await Promise.all(
                  (categoryWithArticles.categoryArticles || []).map((article) =>
                    formatI18nArticle(article, article.author!, article.authorAlias, currentLocale)
                  )
                )
              : [],
            subcategories: categoryWithArticles
              ? [
                  {
                    ...(await formatI18nCategory(categoryWithArticles, currentLocale)),
                    articles: await Promise.all(
                      (categoryWithArticles.categoryArticles || []).map((article) =>
                        formatI18nArticle(article, article.author!, article.authorAlias, currentLocale)
                      )
                    ),
                  },
                ]
              : [],
          };
        })
      ),
      categoriesEvents: await Promise.all(
        categoriesEvents.map(async (cat) => ({
          ...(await formatI18nCategory(cat, currentLocale)),
          events: await Promise.all((cat.categoryEvents || []).map((e) => formatI18nEvent(e, e.author!, e.authorAlias, currentLocale))),
        }))
      ),
    });
  });
};

export default websiteRegionPageController;
