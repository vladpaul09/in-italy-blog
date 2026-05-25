import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { Op } from "sequelize";
import { ArticleSchema, CategorySchema, EventSchema, RegionSchema, PodcastSchema, ArticleCategorySchema } from "../schemas/websiteBase.schema";
import { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../../config/httpStatus.config";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import { Article, Category, Event, Podcast, Region, RegionLanguage } from "../models";
import formatI18nCategory from "../../utils/formatI18nCategory.util";
import formatI18nEvent from "../../utils/formatI18nEvent.util";
import formatI18nArticle from "../../utils/formatI18nArticle.util";
import formatI18nPodcast from "../../utils/formatI18nPodcast.util";
import formatI18nRegion from "../../utils/formatI18nRegion.util";
import config from "../../config/app.config";
import CategoriesType from "../../entries/categoriesType.entry";
import PostScope from "../../entries/postScope.entry";

const websiteCategoryPageParamsSchema = z.object({
  locale: z.string(),
  categorySlug: z.string(),
  rangeFirst: z.coerce.number(),
  rangeLast: z.coerce.number(),
});

const regionsWithArticlesSchema = RegionSchema.extend({
  articles: z.array(ArticleSchema),
});

const regionsWithPodcastsSchema = RegionSchema.extend({
  podcasts: z.array(PodcastSchema),
});

const regionsWithEventsSchema = RegionSchema.extend({
  events: z.array(EventSchema),
});

const websiteCategoryArticlesPageSchema = {
  params: websiteCategoryPageParamsSchema,
  response: {
    [HTTP_STATUS_OK]: z.object({
      articles: z.array(ArticleSchema),
      latestArticles: z.array(ArticleSchema),
      categoriesArticles: z.array(CategorySchema.extend({ subcategories: z.array(ArticleCategorySchema) })),
      category: CategorySchema,
      total: z.number(),
      articlesBasedOnRegions: z.array(regionsWithArticlesSchema),
    }),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

const websiteCategoryEventsPageSchema = {
  params: websiteCategoryPageParamsSchema,
  response: {
    [HTTP_STATUS_OK]: z.object({
      events: z.array(EventSchema),
      latestEvents: z.array(EventSchema),
      category: CategorySchema,
      total: z.number(),
      eventsBasedOnRegions: z.array(regionsWithEventsSchema),
    }),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

const websiteCategoryPodcastsPageSchema = {
  params: websiteCategoryPageParamsSchema,
  response: {
    [HTTP_STATUS_OK]: z.object({
      podcasts: z.array(PodcastSchema),
      podcastsBasedOnRegions: z.array(regionsWithPodcastsSchema),
      category: CategorySchema,
      total: z.number(),
    }),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

const websiteCategoryPageController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  app.get(
    `${routePrefix}/:locale/category/articles/:categorySlug/:rangeFirst/:rangeLast`,
    { schema: websiteCategoryArticlesPageSchema },
    async (request, reply) => {
      const { categorySlug, locale, rangeFirst, rangeLast } = request.params;

      const currentLocale = await app.getRequestLocale(locale);

      const category = await Category.findOne({
        where: { slug: categorySlug, type: CategoriesType.ARTICLES },
        include: [
          {
            association: "categoryLanguages",
          },
        ],
      });

      if (!category) {
        return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
      }

      const parentCategories = await Category.getParentCategoriesHierarchy(category.id);
      const latestArticles = await Article.findAll({
        where: { publish: true },
        include: [
          { association: "articleLanguages" },
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
              id: {
                [Op.not]: category.id,
              },
              type: CategoriesType.ARTICLES,
            },
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: config.maxLimitNews,
      });

      const { rows: articles, count: total } = await Article.findAndCountAll({
        where: { publish: true },
        include: [
          { association: "categories", where: { id: category.id } },
          { association: "articleLanguages" },
          { association: "author" },
          { association: "authorAlias" },
        ],
        offset: rangeFirst,
        limit: rangeLast - rangeFirst + 1,
        order: [["createdAt", "DESC"]],
      });

      // Get municipalities grouped by regions that have articles in this category using Sequelize
      const regions = await Region.findAll({
        include: [
          {
            association: "regionLanguages",
          },
          {
            association: "provinces",
            include: [
              {
                association: "municipalities",
                include: [
                  {
                    association: "municipalityLanguages",
                  },
                  {
                    association: "province",
                    include: [
                      {
                        association: "provinceLanguages",
                      },
                      {
                        association: "region",
                        include: [
                          {
                            association: "regionLanguages",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    association: "articles",
                    where: { publish: true },
                    include: [
                      {
                        association: "categories",
                        where: { id: category.id },
                      },
                      {
                        association: "author",
                      },
                      {
                        association: "authorAlias",
                      },
                      {
                        association: "articleLanguages",
                      },
                    ],
                    required: true,
                  },
                ],
                required: true,
              },
            ],
            required: true,
          },
        ],
        order: [["id", "ASC"]],
      });

      return reply.code(HTTP_STATUS_OK).send({
        articles: await Promise.all(
          (articles || []).map((article) => formatI18nArticle(article, article.author!, article.authorAlias, currentLocale))
        ),
        latestArticles: await Promise.all(
          (latestArticles || []).map((article) => formatI18nArticle(article, article.author!, article.authorAlias, currentLocale))
        ),
        articlesBasedOnRegions: (await Promise.all(
          regions.map(async (region) => {
            const articles = (region.provinces || [])
              .flatMap((province) => province.municipalities || [])
              .flatMap((municipality) => municipality.articles || []);

            return {
              ...(await formatI18nRegion(region, currentLocale)),
              articles: (
                await Promise.all(articles.map((article) => formatI18nArticle(article, article.author!, article.authorAlias, currentLocale)))
              ).filter((obj, index, self) => index === self.findIndex((t) => t.id === obj.id)),
            };
          })
        )).sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        }),
        categoriesArticles: await Promise.all(
          (
            await Category.findAll({
              where: { type: CategoriesType.ARTICLES, parentId: category.id },
              include: [{ association: "categoryLanguages" }],
            })
          ).map(async (category) => {
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
                  include: [{ association: "articleLanguages", required: false }, { association: "author" }, { association: "authorAlias" }],
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
        category: await formatI18nCategory(category, currentLocale),
        total: total,
      });
    }
  );

  app.get(
    `${routePrefix}/:locale/category/events/:categorySlug/:rangeFirst/:rangeLast`,
    { schema: websiteCategoryEventsPageSchema },
    async (request, reply) => {
      const { categorySlug, locale, rangeFirst, rangeLast } = request.params;

      const currentLocale = await app.getRequestLocale(locale);

      const category = await Category.findOne({
        where: { slug: categorySlug, type: CategoriesType.EVENTS },
        include: [
          {
            association: "categoryLanguages",
          },
        ],
      });

      if (!category) {
        return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
      }

      const parentCategories = await Category.getParentCategoriesHierarchy(category.id);
      const now = new Date();
      const latestEvents = await Event.findAll({
        where: { 
          publish: true,
          endDate: { [Op.gte]: now }
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
              id: {
                [Op.not]: category.id,
              },
              type: CategoriesType.EVENTS,
            },
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: config.maxLimitNews,
      });

      const { rows: events, count: total } = await Event.findAndCountAll({
        where: { 
          publish: true,
          endDate: { [Op.gte]: now }
        },
        include: [
          { association: "categories", where: { id: category.id } },
          { association: "eventLanguages" },
          { association: "author" },
          { association: "authorAlias" },
        ],
        offset: rangeFirst,
        limit: rangeLast - rangeFirst + 1,
        order: [["createdAt", "DESC"]],
      });

      // Get events grouped by regions that have events in this category using Sequelize
      const regions = await Region.findAll({
        include: [
          {
            association: "regionLanguages",
          },
          {
            association: "provinces",
            include: [
              {
                association: "municipalities",
                include: [
                  {
                    association: "events",
                    where: { 
                      publish: true,
                      endDate: { [Op.gte]: now }
                    },
                    include: [
                      {
                        association: "categories",
                        where: { id: category.id },
                      },
                      {
                        association: "author",
                      },
                      {
                        association: "authorAlias",
                      },
                      {
                        association: "eventLanguages",
                      },
                    ],
                    required: true,
                  },
                ],
                required: true,
              },
            ],
            required: true,
          },
        ],
        order: [["id", "ASC"]],
      });

      return reply.code(HTTP_STATUS_OK).send({
        events: await Promise.all((events || []).map((event) => formatI18nEvent(event, event.author!, event.authorAlias, currentLocale))),
        latestEvents: await Promise.all((latestEvents || []).map((event) => formatI18nEvent(event, event.author!, event.authorAlias, currentLocale))),
        eventsBasedOnRegions: (await Promise.all(
          regions.map(async (region) => {
            const events = (region.provinces || [])
              .flatMap((province) => province.municipalities || [])
              .flatMap((municipality) => municipality.events || []);

            return {
              ...(await formatI18nRegion(region, currentLocale)),
              events: (await Promise.all(events.map((event) => formatI18nEvent(event, event.author!, event.authorAlias, currentLocale)))).filter(
                (obj, index, self) => index === self.findIndex((t) => t.id === obj.id)
              ),
            };
          })
        )).sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        }),
        category: await formatI18nCategory(category, currentLocale),
        total: total,
      });
    }
  );

  app.get(
    `${routePrefix}/:locale/category/podcasts/:categorySlug/:rangeFirst/:rangeLast`,
    { schema: websiteCategoryPodcastsPageSchema },
    async (request, reply) => {
      const { categorySlug, locale, rangeFirst, rangeLast } = request.params;

      const currentLocale = await app.getRequestLocale(locale);

      const category = await Category.findOne({
        where: { slug: categorySlug, type: CategoriesType.PODCASTS },
        include: [
          {
            association: "categoryLanguages",
          },
        ],
      });

      if (!category) {
        return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
      }

      const { rows: podcasts, count: total } = await Podcast.findAndCountAll({
        where: { publish: true },
        include: [
          {
            association: "categories",
            where: {
              id: category.id,
            },
          },
          { association: "author" },
          { association: "authorAlias" },
          { association: "podcastLanguages" },
        ],
        offset: rangeFirst,
        limit: rangeLast - rangeFirst + 1,
        order: [["createdAt", "DESC"]],
      });

      // Get municipalities grouped by regions that have podcasts in this category using Sequelize
      const regions = await Region.findAll({
        include: [
          {
            association: "regionLanguages",
          },
          {
            association: "provinces",
            include: [
              {
                association: "municipalities",
                include: [
                  {
                    association: "podcasts",
                    where: { publish: true },
                    include: [
                      {
                        association: "categories",
                        where: { id: category.id },
                      },
                      {
                        association: "author",
                      },
                      {
                        association: "authorAlias",
                      },
                      {
                        association: "podcastLanguages",
                      },
                    ],
                    required: true,
                  },
                ],
                required: true,
              },
            ],
            required: true,
          },
        ],
        order: [["id", "ASC"]],
      });

      return reply.code(HTTP_STATUS_OK).send({
        podcasts: await Promise.all(
          (podcasts || []).map((podcast) => formatI18nPodcast(podcast, podcast.author!, podcast.authorAlias, currentLocale))
        ),
        podcastsBasedOnRegions: (await Promise.all(
          regions.map(async (region) => {
            const podcasts = (region.provinces || [])
              .flatMap((province) => province.municipalities || [])
              .flatMap((municipality) => municipality.podcasts || []);

            return {
              ...(await formatI18nRegion(region, currentLocale)),
              podcasts: (
                await Promise.all(podcasts.map((podcast) => formatI18nPodcast(podcast, podcast.author!, podcast.authorAlias, currentLocale)))
              ).filter((obj, index, self) => index === self.findIndex((t) => t.id === obj.id)),
            };
          })
        )).sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        }),
        category: await formatI18nCategory(category, currentLocale),
        total: total,
      });
    }
  );
};

export default websiteCategoryPageController;
