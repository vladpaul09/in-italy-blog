import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { Op } from "sequelize";
import { EventCategorySchema, MunicipalitySchema, ArticleCategorySchema, CategorySchema, MapPostSchema } from "../schemas/websiteBase.schema";
import { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../../config/httpStatus.config";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import { Category, Municipality, Settings } from "../models";
import formatI18nArticle from "../../utils/formatI18nArticle.util";
import formatI18nCategory from "../../utils/formatI18nCategory.util";
import formatI18nMunicipality from "../../utils/formatI18nMunicipality.util";
import formatI18nProvince from "../../utils/formatI18nProvince.util";
import formatI18nRegion from "../../utils/formatI18nRegion.util";
import formatI18nEvent from "../../utils/formatI18nEvent.util";
import { settingsTopBoxesTypeLabels, RegionalArticleSetting } from "../../entries/settingsType.entry";
import PostScope from "../../entries/postScope.entry";
import getMapPosts from "../../utils/websiteMapPosts.util";

const websiteMunicipalityBaseSchema = {
  params: z.object({
    locale: z.string(),
    regionSlug: z.string(),
    provinceSlug: z.string(),
    municipalitySlug: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.object({
      municipality: MunicipalitySchema,
      categoriesArticles: z.array(CategorySchema.extend({ subcategories: z.array(ArticleCategorySchema) })),
      categoriesEvents: z.array(EventCategorySchema),
      mapPosts: z.array(MapPostSchema),
    }),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

const websiteMunicipalityEventsBaseSchema = {
  params: z.object({
    locale: z.string(),
    regionSlug: z.string(),
    provinceSlug: z.string(),
    municipalitySlug: z.string(),
    startDate: z.string(),
    endDate: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.object({
      municipality: MunicipalitySchema,
      categoriesArticles: z.array(CategorySchema.extend({ subcategories: z.array(ArticleCategorySchema) })),
      categoriesEvents: z.array(EventCategorySchema),
      mapPosts: z.array(MapPostSchema),
    }),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

const websiteMunicipalityPageController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  app.get(`${routePrefix}/:locale/:regionSlug/:provinceSlug/:municipalitySlug`, { schema: websiteMunicipalityBaseSchema }, async (request, reply) => {
    const { regionSlug, provinceSlug, municipalitySlug, locale } = request.params;

    const currentLocale = await app.getRequestLocale(locale);

    const municipality = await Municipality.findOne({
      where: {
        slug: municipalitySlug,
      },
      include: [
        {
          association: "province",
          required: true,
          where: {
            slug: provinceSlug,
          },
          include: [
            {
              association: "region",
              required: true,
              where: {
                slug: regionSlug,
              },
              include: [
                {
                  association: "regionLanguages",
                  required: false,
                },
              ],
            },
            {
              association: "provinceLanguages",
              required: false,
            },
          ],
        },
        {
          association: "municipalityLanguages",
          required: false,
        },
      ],
    });

    if (!municipality) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    }

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
        {
          association: "categoryLanguages",
          required: false,
        },
        {
          association: "categoryEvents",

          required: true,
          where: {
            publish: true,
            endDate: { [Op.gte]: new Date() },
            municipalityId: municipality.id,
          },
          include: [
            {
              association: "eventLanguages",
              required: false,
            },
            { association: "author" },
            { association: "authorAlias" },
          ],
        },
      ],
    });

    return reply.code(HTTP_STATUS_OK).send({
      municipality: {
        ...(await formatI18nMunicipality(municipality, currentLocale)),
        province: {
          ...(await formatI18nProvince(municipality.province!, currentLocale)),
          region: {
            ...(await formatI18nRegion(municipality.province!.region!, currentLocale)),
          },
        },
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
                      PostScope.MUNICIPALITY_ONLY,
                      PostScope.REGION_AND_MUNICIPALITIES,
                      PostScope.PROVINCE_AND_MUNICIPALITIES,
                      PostScope.REGION_PROVINCES_AND_MUNICIPALITIES,
                      PostScope.MUNICIPALITIES_SELECTED,
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
                    where: {
                      id: municipality.id,
                    },
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
            return { ...(await formatI18nCategory(category, currentLocale)), subcategories };
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
                      PostScope.MUNICIPALITY_ONLY,
                      PostScope.REGION_AND_MUNICIPALITIES,
                      PostScope.PROVINCE_AND_MUNICIPALITIES,
                      PostScope.REGION_PROVINCES_AND_MUNICIPALITIES,
                      PostScope.MUNICIPALITIES_SELECTED,
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
                      id: municipality.id,
                    },
                  },
                ],
              },
            ],
          });
          return {
            ...(await formatI18nCategory(category, currentLocale)),
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
      mapPosts: await getMapPosts(locale, currentLocale, "province", municipality.province!.id),
    });
  });

  app.get(
    `${routePrefix}/:locale/:regionSlug/:provinceSlug/:municipalitySlug/events/:startDate/:endDate`,
    { schema: websiteMunicipalityEventsBaseSchema },
    async (request, reply) => {
      const { regionSlug, provinceSlug, municipalitySlug, locale, startDate, endDate } = request.params;

      const currentLocale = await app.getRequestLocale(locale);

      const municipality = await Municipality.findOne({
        where: {
          slug: municipalitySlug,
        },
        include: [
          {
            association: "province",
            required: true,
            where: {
              slug: provinceSlug,
            },
            include: [
              {
                association: "region",
                required: true,
                where: {
                  slug: regionSlug,
                },
                include: [
                  {
                    association: "regionLanguages",
                    required: false,
                  },
                ],
              },
              {
                association: "provinceLanguages",
                required: false,
              },
            ],
          },
          {
            association: "municipalityLanguages",
            required: false,
          },
        ],
      });

      if (!municipality) {
        return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
      }

      // Get selected categories from settings
      const regionalArticlesSetting = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.REGIONAL_ARTICLES } });
      const articleCategoryIds = regionalArticlesSetting
        ? (JSON.parse(regionalArticlesSetting.value) as RegionalArticleSetting[]).map((x) => x.categoryArticleId)
        : [];

      const parentsArticleCategoryIds = (
        await Promise.all(articleCategoryIds.map(async (x) => await Category.findByPk(x, { include: [{ association: "categoryLanguages" }] })))
      ).filter((item) => item !== null);

      const categoriesEvents = await Category.findAll({
        include: [
          {
            association: "categoryLanguages",
            required: false,
          },
          {
            association: "categoryEvents",

            required: true,
            where: {
              publish: true,
              municipalityId: municipality.id,
              startDate: { [Op.lte]: endDate },
              endDate: { [Op.gte]: startDate },
            },
            include: [
              {
                association: "eventLanguages",
                required: false,
              },
              { association: "author" },
              { association: "authorAlias" },
            ],
          },
        ],
      });

      return reply.code(HTTP_STATUS_OK).send({
        municipality: {
          ...(await formatI18nMunicipality(municipality, currentLocale)),
          province: {
            ...(await formatI18nProvince(municipality.province!, currentLocale)),
            region: {
              ...(await formatI18nRegion(municipality.province!.region!, currentLocale)),
            },
          },
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
                {
                  association: "categoryLanguages",
                  required: false,
                },
                {
                  association: "categoryArticles",
                  required: false,
                  where: {
                    publish: true,
                    scope: {
                      [Op.in]: [
                        PostScope.EVERYWHERE,
                        PostScope.MUNICIPALITY_ONLY,
                        PostScope.REGION_AND_MUNICIPALITIES,
                        PostScope.PROVINCE_AND_MUNICIPALITIES,
                        PostScope.REGION_PROVINCES_AND_MUNICIPALITIES,
                        PostScope.MUNICIPALITIES_SELECTED,
                      ],
                    },
                  },
                  include: [
                    {
                      association: "articleLanguages",
                      required: false,
                    },
                    { association: "author" },
                    { association: "authorAlias" },
                    {
                      association: "municipalities",
                      required: true,
                      where: {
                        id: municipality.id,
                      },
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
              return { ...(await formatI18nCategory(category, currentLocale)), subcategories };
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
                        PostScope.MUNICIPALITY_ONLY,
                        PostScope.REGION_AND_MUNICIPALITIES,
                        PostScope.PROVINCE_AND_MUNICIPALITIES,
                        PostScope.REGION_PROVINCES_AND_MUNICIPALITIES,
                        PostScope.MUNICIPALITIES_SELECTED,
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
                        id: municipality.id,
                      },
                    },
                  ],
                },
              ],
            });
            return {
              ...(await formatI18nCategory(category, currentLocale)),
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
        mapPosts: await getMapPosts(locale, currentLocale, "province", municipality.province!.id),
      });
    }
  );
};

export default websiteMunicipalityPageController;
