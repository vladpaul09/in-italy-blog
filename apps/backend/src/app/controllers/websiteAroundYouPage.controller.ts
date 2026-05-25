import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { RecentPostsParentArticleCategorySchema, RecentPostsParentEventCategorySchema } from "../schemas/websiteHomepage.schema";
import { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../../config/httpStatus.config";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import { Municipality, Settings, Category } from "../models";
import { Op, literal, where } from "sequelize";
import formatI18nEvent from "../../utils/formatI18nEvent.util";
import formatI18nCategory from "../../utils/formatI18nCategory.util";
import formatI18nArticle from "../../utils/formatI18nArticle.util";
import { settingsTopBoxesTypeLabels } from "../../entries/settingsType.entry";
import formatI18nMunicipality from "../../utils/formatI18nMunicipality.util";
import formatI18nProvince from "../../utils/formatI18nProvince.util";
import formatI18nRegion from "../../utils/formatI18nRegion.util";
import { MunicipalitySchema } from "../schemas/websiteBase.schema";
import dayjs from "dayjs";
import { haversineDistanceLiteral } from "../../utils/haversineDistance.util";

const websiteAroundYouPageSchema = {
  params: z.object({
    locale: z.string(),
    municipalityId: z.string(),
    lat: z.string(),
    long: z.string(),
    datetime: z.enum(["today", "tomorrow", "next-7-days"]),
  }),
  response: {
    [HTTP_STATUS_OK]: z.object({
      municipalityData: MunicipalitySchema,
      categoriesArticles: z.array(RecentPostsParentArticleCategorySchema),
      categoriesEvents: z.array(RecentPostsParentEventCategorySchema),
    }),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

const websiteAroundYouPageController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  app.get(
    `${routePrefix}/:locale/around-you/:municipalityId/:lat/:long/:datetime`,
    { schema: websiteAroundYouPageSchema },
    async (request, reply) => {
      const { municipalityId, locale, lat, long, datetime } = request.params;
      const currentLocale = await app.getRequestLocale(locale);

      const latitude = parseFloat(lat);
      const longitude = parseFloat(long);
      const radius = 0.5; // 0.5 km = 500 meters

      const municipality = await Municipality.findOne({
        where: { slug: municipalityId },
        include: [
          { association: "municipalityLanguages" },
          {
            association: "province",
            include: [{ association: "provinceLanguages" }, { association: "region", include: [{ association: "regionLanguages" }] }],
          },
        ],
      });

      if (!municipality) {
        return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
      }

      // Get selected categories from settings
      const homepageAroundYouSetting = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_AROUND_YOU } });
      const articleCategoryIds = homepageAroundYouSetting
        ? (JSON.parse(homepageAroundYouSetting.value) as { categoryArticleId: number }[]).map((x) => x.categoryArticleId)
        : [];

      const parentsArticleCategoryIds = (
        await Promise.all(
          articleCategoryIds.map(async (x) => await Category.findOne({ where: { id: x }, include: [{ association: "categoryLanguages" }] }))
        )
      ).filter((item) => item !== null);

      const topLevelEventCategories = await Category.findAll({
        where: { parentId: null, type: "categories-events" },
        include: [{ association: "categoryLanguages", required: false }],
      });

      return reply.code(HTTP_STATUS_OK).send({
        municipalityData: {
          ...(await formatI18nMunicipality(municipality, currentLocale)),
          province: {
            ...(await formatI18nProvince(municipality!.province!, currentLocale)),
            region: {
              ...(await formatI18nRegion(municipality!.province!.region!, currentLocale)),
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
                  required: true,
                  where: {
                    [Op.and]: [
                      {
                        publish: true,
                        latitude: { [Op.not]: null },
                        longitude: { [Op.not]: null },
                      },
                      where(literal(haversineDistanceLiteral(latitude, longitude, "categoryArticles")), "<=", radius),
                    ],
                  },
                  include: [
                    { association: "articleLanguages", required: false },
                    { association: "author", required: false },
                    { association: "authorAlias", required: false },
                    {
                      association: "municipalities",
                      required: true,
                      where: { id: municipality.id },
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
                    [Op.and]: [
                      {
                        publish: true,
                        latitude: { [Op.ne]: null },
                        longitude: { [Op.ne]: null },
                      },
                      where(literal(haversineDistanceLiteral(latitude, longitude, "categoryArticles")), "<=", radius),
                    ],
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
        categoriesEvents: (
          await Promise.all(
            topLevelEventCategories.map(async (category) => {
              const subcategories = await Category.findAll({
                where: {
                  parentId: category.id,
                },
                include: [
                  { association: "categoryLanguages", required: false },
                  {
                    association: "categoryEvents",
                    required: true,
                    where: {
                      [Op.and]: [
                        {
                          endDate: { [Op.gte]: new Date() },
                          publish: true,
                          municipalityId: municipality.id,
                          latitude: { [Op.not]: null },
                          longitude: { [Op.not]: null },
                          ...(datetime === "today"
                            ? {
                                startDate: { [Op.gte]: dayjs().toISOString() },
                                endDate: { [Op.lte]: dayjs().toISOString() },
                              }
                            : {}),
                          ...(datetime === "tomorrow"
                            ? {
                                startDate: { [Op.gte]: dayjs().add(1, "day").toISOString() },
                                endDate: { [Op.lte]: dayjs().add(1, "day").toISOString() },
                              }
                            : {}),
                          ...(datetime === "next-7-days"
                            ? {
                                startDate: { [Op.lte]: dayjs().add(7, "day").toISOString() },
                                endDate: { [Op.gte]: dayjs().toISOString() },
                              }
                            : {}),
                        },
                        where(literal(haversineDistanceLiteral(latitude, longitude, "categoryEvents")), "<=", radius),
                      ],
                    },
                    include: [{ association: "eventLanguages", required: false }, { association: "author" }, { association: "authorAlias" }],
                  },
                ],
              });

              const filteredSubcategories = await Promise.all(
                subcategories
                  .filter((subcategory) => (subcategory.categoryEvents || []).length > 0)
                  .map(async (subcategory) => ({
                    ...(await formatI18nCategory(subcategory, currentLocale)),
                    events: await Promise.all(
                      (subcategory.categoryEvents || []).map((event) => formatI18nEvent(event, event.author!, event.authorAlias, currentLocale))
                    ),
                  }))
              );
              if (filteredSubcategories.length === 0) return null;
              return {
                ...(await formatI18nCategory(category, currentLocale)),
                subcategories: filteredSubcategories,
              };
            })
          )
        ).filter((cat) => cat !== null),
      });
    }
  );
};

export default websiteAroundYouPageController;
