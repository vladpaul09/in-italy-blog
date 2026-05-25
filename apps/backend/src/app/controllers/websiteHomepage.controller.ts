import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { websiteProvinceRecentEventsSchema, websiteRegionRecentEventsSchema, websiteHomepageDataSchema } from "../schemas/websiteHomepage.schema";
import { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../../config/httpStatus.config";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import { Region, Province, Event, Municipality, Settings, Category, Article, Podcast } from "../models";
import { Op, literal, where } from "sequelize";
import formatI18nEvent from "../../utils/formatI18nEvent.util";
import formatI18nCategory from "../../utils/formatI18nCategory.util";
import formatI18nArticle from "../../utils/formatI18nArticle.util";
import { ResourceUnionEntryId, settingsTopBoxesTypeLabels } from "../../entries/settingsType.entry";
import { websiteRecentPostsSchema } from "../schemas/websiteHomepage.schema";
import formatI18nPodcast from "../../utils/formatI18nPodcast.util";
import config from "../../config/app.config";
import formatI18nMunicipality from "../../utils/formatI18nMunicipality.util";
import formatI18nProvince from "../../utils/formatI18nProvince.util";
import formatI18nRegion from "../../utils/formatI18nRegion.util";
import { ArticleSchema } from "../schemas/websiteBase.schema";
import { haversineDistanceLiteral } from "../../utils/haversineDistance.util";
import getMapPosts from "../../utils/websiteMapPosts.util";

const websiteHomepageController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  const getHomepageTopBox = async (
    boxType: { value: string } | null,
    categoryArticleId: { value: string } | null,
    categoryEventId: { value: string } | null,
    categoryPodcastId: { value: string } | null,
    articleId: { value: string } | null,
    eventId: { value: string } | null,
    locale: string,
    currentLocale: string
  ) => {
    if (!boxType) return null;

    switch (boxType.value) {
      case ResourceUnionEntryId.CategoryArticle: {
        if (!categoryArticleId) return null;
        const category = await Category.findOne({
          where: { id: Number(categoryArticleId.value) },
          include: [{ association: "categoryLanguages" }],
        });
        const categoryLocalized = category ? await formatI18nCategory(category, currentLocale) : null;
        if (!categoryLocalized) return null;
        return {
          name: categoryLocalized.name,
          image: categoryLocalized.image,
          url: `/${locale}/categoria/articoli/${categoryLocalized.slug}`,
        };
      }
      case ResourceUnionEntryId.CategoryEvent: {
        if (!categoryEventId) return null;
        const category = await Category.findOne({
          where: { id: Number(categoryEventId.value) },
          include: [{ association: "categoryLanguages" }],
        });
        const categoryLocalized = category ? await formatI18nCategory(category, currentLocale) : null;
        if (!categoryLocalized) return null;
        return {
          name: categoryLocalized.name,
          image: categoryLocalized.image,
          url: `/${locale}/categoria/eventi/${categoryLocalized.slug}`,
        };
      }
      case ResourceUnionEntryId.CategoryPodcast: {
        if (!categoryPodcastId) return null;
        const category = await Category.findOne({
          where: { id: Number(categoryPodcastId.value) },
          include: [{ association: "categoryLanguages" }],
        });
        const categoryLocalized = category ? await formatI18nCategory(category, currentLocale) : null;
        if (!categoryLocalized) return null;
        return {
          name: categoryLocalized.name,
          image: categoryLocalized.image,
          url: `/${locale}/categoria/podcast/${categoryLocalized.slug}`,
        };
      }
      case ResourceUnionEntryId.Article: {
        if (!articleId) return null;
        const article = await Article.findOne({
          where: { id: Number(articleId.value) },
          include: [{ association: "articleLanguages" }, { association: "author" }, { association: "authorAlias" }],
        });
        const articleLocalized = article ? await formatI18nArticle(article, article.author!, article.authorAlias, currentLocale) : null;
        if (!articleLocalized) return null;
        return {
          name: articleLocalized.title,
          image: articleLocalized.image,
          url: `/${locale}/articolo/${articleLocalized.slug}`,
        };
      }
      case ResourceUnionEntryId.Event: {
        if (!eventId) return null;
        const now = new Date();
        const event = await Event.findOne({
          where: {
            id: Number(eventId.value),
            endDate: { [Op.gte]: now },
          },
          include: [{ association: "eventLanguages" }, { association: "author" }, { association: "authorAlias" }],
        });
        const eventLocalized = event ? await formatI18nEvent(event, event.author!, event.authorAlias, currentLocale) : null;
        if (!eventLocalized) return null;
        return {
          name: eventLocalized.title,
          image: eventLocalized.image,
          url: `/${locale}/evento/${eventLocalized.slug}`,
        };
      }
      default:
        return null;
    }
  };

  app.get(`${routePrefix}/:locale/recent-region-events/:regionCode`, { schema: websiteRegionRecentEventsSchema }, async (request, reply) => {
    const { regionCode, locale } = request.params;
    const currentLocale = await app.getRequestLocale(locale);

    const region = await Region.findOne({ where: { id: regionCode } });

    if (!region) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    }

    const mapPosts = await getMapPosts(locale, currentLocale, "region", regionCode);

    return reply.code(HTTP_STATUS_OK).send(mapPosts);
  });

  app.get(`${routePrefix}/:locale/recent-province-events/:provinceCode`, { schema: websiteProvinceRecentEventsSchema }, async (request, reply) => {
    const { provinceCode, locale } = request.params;
    const currentLocale = await app.getRequestLocale(locale);

    const province = await Province.findOne({ where: { id: provinceCode } });

    if (!province) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    }

    const mapPosts = await getMapPosts(locale, currentLocale, "province", provinceCode);

    return reply.code(HTTP_STATUS_OK).send(mapPosts);
  });

  app.get(`${routePrefix}/:locale/homepage-data`, { schema: websiteHomepageDataSchema }, async (request, reply) => {
    const { locale } = request.params;
    const currentLocale = await app.getRequestLocale(locale);
    const now = new Date();

    // Fetch all map posts (events, articles, podcasts)
    const allMapPosts = await getMapPosts(locale, currentLocale);

    const homepageBottomBoxesJSON = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_BOTTOM_BOXES } });
    const showcasePodcastSetting = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.SHOWCASE_PODCAST } });

    let defaultPodcast: Podcast | null = null;
    if (showcasePodcastSetting && showcasePodcastSetting.value) {
      const parsed: { podcastId: number }[] = JSON.parse(showcasePodcastSetting.value);
      const podcastIds = parsed.map((obj) => obj.podcastId);
      if (podcastIds.length > 0) {
        defaultPodcast = await Podcast.findOne({
          where: { id: podcastIds[Math.floor(Math.random() * podcastIds.length)] },
          include: [{ association: "podcastLanguages" }, { association: "author" }, { association: "authorAlias" }],
        });
      }
    }
    const { rows: latestPodcasts } = await Podcast.findAndCountAll({
      where: { publish: true, ...(defaultPodcast ? { id: { [Op.ne]: defaultPodcast.id } } : {}) },
      include: [{ association: "podcastLanguages" }, { association: "author" }, { association: "authorAlias" }],
      order: [["createdAt", "DESC"]],
      limit: 3,
      distinct: true,
    });

    const homepageBottomBoxesArray: Array<{
      type: string;
      categoryArticleId?: number | null;
      categoryEventId?: number | null;
      categoryPodcastId?: number | null;
      articleId?: number | null;
      eventId?: number | null;
    }> = homepageBottomBoxesJSON ? JSON.parse(homepageBottomBoxesJSON.value) : [];

    let homepageBottomBoxes: Array<{ name: string; image: string | null; url: string }> = [];

    const homepageTopBoxOne = await getHomepageTopBox(
      await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_TYPE } }),
      await Settings.findOne({
        where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_CATEGORY_ARTICLE_ID },
      }),
      await Settings.findOne({
        where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_CATEGORY_EVENT_ID },
      }),
      await Settings.findOne({
        where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_CATEGORY_PODCAST_ID },
      }),
      await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_ARTICLE_ID } }),
      await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_ONE_EVENT_ID } }),
      locale,
      currentLocale
    );

    const homepageTopBoxTwo = await getHomepageTopBox(
      await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_TYPE } }),
      await Settings.findOne({
        where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_CATEGORY_ARTICLE_ID },
      }),
      await Settings.findOne({
        where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_CATEGORY_EVENT_ID },
      }),
      await Settings.findOne({
        where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_CATEGORY_PODCAST_ID },
      }),
      await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_ARTICLE_ID } }),
      await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_TWO_EVENT_ID } }),
      locale,
      currentLocale
    );

    const homepageTopBoxThree = await getHomepageTopBox(
      await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_TYPE } }),
      await Settings.findOne({
        where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_CATEGORY_ARTICLE_ID },
      }),
      await Settings.findOne({
        where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_CATEGORY_EVENT_ID },
      }),
      await Settings.findOne({
        where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_CATEGORY_PODCAST_ID },
      }),
      await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_ARTICLE_ID } }),
      await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_THREE_EVENT_ID } }),
      locale,
      currentLocale
    );

    const homepageTopBoxFour = await getHomepageTopBox(
      await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_TYPE } }),
      await Settings.findOne({
        where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_CATEGORY_ARTICLE_ID },
      }),
      await Settings.findOne({
        where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_CATEGORY_EVENT_ID },
      }),
      await Settings.findOne({
        where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_CATEGORY_PODCAST_ID },
      }),
      await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_ARTICLE_ID } }),
      await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FOUR_EVENT_ID } }),
      locale,
      currentLocale
    );

    const homepageTopBoxFive = await getHomepageTopBox(
      await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_TYPE } }),
      await Settings.findOne({
        where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_CATEGORY_ARTICLE_ID },
      }),
      await Settings.findOne({
        where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_CATEGORY_EVENT_ID },
      }),
      await Settings.findOne({
        where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_CATEGORY_PODCAST_ID },
      }),
      await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_ARTICLE_ID } }),
      await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_TOP_BOX_FIVE_EVENT_ID } }),
      locale,
      currentLocale
    );

    if (Array.isArray(homepageBottomBoxesArray)) {
      for (const homepageBottomBox of homepageBottomBoxesArray) {
        switch (homepageBottomBox.type) {
          case ResourceUnionEntryId.CategoryArticle:
            const homepageBottomBoxCategoryArticle = await Category.findOne({
              where: { id: Number(homepageBottomBox.categoryArticleId) },
              include: [{ association: "categoryLanguages" }],
            });
            const homepageBottomBoxCategoryArticleLocalized = homepageBottomBoxCategoryArticle
              ? await formatI18nCategory(homepageBottomBoxCategoryArticle, currentLocale)
              : null;
            if (homepageBottomBoxCategoryArticleLocalized) {
              homepageBottomBoxes.push({
                name: homepageBottomBoxCategoryArticleLocalized.name,
                image: homepageBottomBoxCategoryArticleLocalized.image,
                url: `/${locale}/categoria/articoli/${homepageBottomBoxCategoryArticleLocalized.slug}`,
              });
            }
            break;
          case ResourceUnionEntryId.CategoryEvent:
            const homepageBottomBoxCategoryEvent = await Category.findOne({
              where: { id: Number(homepageBottomBox.categoryEventId) },
              include: [{ association: "categoryLanguages" }],
            });
            const homepageBottomBoxCategoryEventLocalized = homepageBottomBoxCategoryEvent
              ? await formatI18nCategory(homepageBottomBoxCategoryEvent, currentLocale)
              : null;
            if (homepageBottomBoxCategoryEventLocalized) {
              homepageBottomBoxes.push({
                name: homepageBottomBoxCategoryEventLocalized.name,
                image: homepageBottomBoxCategoryEventLocalized.image,
                url: `/${locale}/categoria/eventi/${homepageBottomBoxCategoryEventLocalized.slug}`,
              });
            }
            break;
          case ResourceUnionEntryId.CategoryPodcast:
            const homepageBottomBoxCategoryPodcast = await Category.findOne({
              where: { id: Number(homepageBottomBox.categoryPodcastId) },
              include: [{ association: "categoryLanguages" }],
            });
            const homepageBottomBoxCategoryPodcastLocalized = homepageBottomBoxCategoryPodcast
              ? await formatI18nCategory(homepageBottomBoxCategoryPodcast, currentLocale)
              : null;
            if (homepageBottomBoxCategoryPodcastLocalized) {
              homepageBottomBoxes.push({
                name: homepageBottomBoxCategoryPodcastLocalized.name,
                image: homepageBottomBoxCategoryPodcastLocalized.image,
                url: `/${locale}/categoria/podcast/${homepageBottomBoxCategoryPodcastLocalized.slug}`,
              });
            }
            break;
          case ResourceUnionEntryId.Article:
            if (homepageBottomBox.articleId) {
              const homepageBottomBoxArticle = await Article.findOne({
                where: { id: Number(homepageBottomBox.articleId) },
                include: [{ association: "articleLanguages" }, { association: "author" }, { association: "authorAlias" }],
              });
              const homepageBottomBoxArticleLocalized = homepageBottomBoxArticle
                ? await formatI18nArticle(
                    homepageBottomBoxArticle,
                    homepageBottomBoxArticle.author!,
                    homepageBottomBoxArticle.authorAlias,
                    currentLocale
                  )
                : null;
              if (homepageBottomBoxArticleLocalized) {
                homepageBottomBoxes.push({
                  name: homepageBottomBoxArticleLocalized.title,
                  image: homepageBottomBoxArticleLocalized.image,
                  url: `/${locale}/articolo/${homepageBottomBoxArticleLocalized.slug}`,
                });
              }
            }
            break;
          case ResourceUnionEntryId.Event:
            if (homepageBottomBox.eventId) {
              const homepageBottomBoxEvent = await Event.findOne({
                where: {
                  id: Number(homepageBottomBox.eventId),
                  endDate: { [Op.gte]: now },
                },
                include: [{ association: "eventLanguages" }, { association: "author" }, { association: "authorAlias" }],
              });
              const homepageBottomBoxEventLocalized = homepageBottomBoxEvent
                ? await formatI18nEvent(homepageBottomBoxEvent, homepageBottomBoxEvent.author!, homepageBottomBoxEvent.authorAlias, currentLocale)
                : null;
              if (homepageBottomBoxEventLocalized) {
                homepageBottomBoxes.push({
                  name: homepageBottomBoxEventLocalized.title,
                  image: homepageBottomBoxEventLocalized.image,
                  url: `/${locale}/evento/${homepageBottomBoxEventLocalized.slug}`,
                });
              }
            }
            break;
          default:
            break;
        }
      }
    }

    // Get news articles
    let newsArticles: Array<z.infer<typeof ArticleSchema>> = [];
    const newsCategory = await Category.findOne({
      where: { slug: "news" },
      include: [{ association: "categoryLanguages" }],
    });

    if (newsCategory) {
      newsArticles = await Promise.all(
        (
          await Article.findAll({
            where: {
              publish: true,
            },
            include: [
              { association: "articleLanguages" },
              {
                association: "categories",
                where: { id: newsCategory.id },
              },
              { association: "author" },
              { association: "authorAlias" },
            ],
            order: [["createdAt", "DESC"]],
            limit: 20,
          })
        ).map(async (article) => await formatI18nArticle(article, article.author!, article.authorAlias, currentLocale))
      );
    }

    const homepageHeaderImagesSetting = await Settings.findOne({ where: { id: settingsTopBoxesTypeLabels.HOMEPAGE_HEADER_IMAGES } });

    let homepageHeaderImage: { src: string; mobileSrc?: string | null; link?: string | null } | null = null;

    if (homepageHeaderImagesSetting?.value) {
      const arr = JSON.parse(homepageHeaderImagesSetting.value);
      if (Array.isArray(arr) && arr.length > 0) {
        // Pick a random image
        const randomImg = arr[Math.floor(Math.random() * arr.length)];
        if (randomImg && typeof randomImg.title === "string") {
          homepageHeaderImage = {
            src: `${config.serverNameStatics}/uploads/images/homepage-header/${randomImg.title}`,
            mobileSrc: randomImg.mobileTitle ? `${config.serverNameStatics}/uploads/images/homepage-header/${randomImg.mobileTitle}` : null,
            link: randomImg.link ?? null,
          };
        }
      }
    }

    return reply.code(HTTP_STATUS_OK).send({
      homepageTopBoxOne,
      homepageTopBoxTwo,
      homepageTopBoxThree,
      homepageTopBoxFour,
      homepageTopBoxFive,
      homepageBottomBoxes,
      homepageHeaderImage,
      mapPosts: allMapPosts,
      defaultPodcast: defaultPodcast
        ? await formatI18nPodcast(defaultPodcast, defaultPodcast.author!, defaultPodcast.authorAlias, currentLocale)
        : null,
      latestPodcasts: await Promise.all(
        latestPodcasts.map((podcast) => formatI18nPodcast(podcast, podcast.author!, podcast.authorAlias, currentLocale))
      ),
      newsArticles,
    });
  });

  app.get(`${routePrefix}/:locale/recent-posts/:lat/:long`, { schema: websiteRecentPostsSchema }, async (request, reply) => {
    const { locale, lat, long } = request.params;
    const currentLocale = await app.getRequestLocale(locale);

    const latitude = parseFloat(lat);
    const longitude = parseFloat(long);
    const radius = 50; // km

    const municipality = await Municipality.findOne({
      attributes: {
        include: [[literal(haversineDistanceLiteral(latitude, longitude)), "distance"]],
      },
      order: [[literal("distance"), "ASC"]],
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

    const newsArticles = await Article.findAndCountAll({
      attributes: {
        include: [[literal(haversineDistanceLiteral(latitude, longitude, "Article")), "distance"]],
      },
      where: {
        publish: true,
        [Op.and]: [
          { latitude: { [Op.not]: null } },
          { longitude: { [Op.not]: null } },
          where(literal(haversineDistanceLiteral(latitude, longitude, "Article")), "<=", radius),
        ],
      },
      include: [
        {
          association: "categories",
          required: true,
          where: {
            slug: "news",
            type: "categories-articles",
            parentId: null,
          },
        },
        { association: "articleLanguages", required: false },
        { association: "author" },
        { association: "authorAlias" },
      ],
      order: [[literal("distance"), "ASC"]],
      distinct: true,
      limit: 10,
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
                attributes: {
                  include: [[literal(haversineDistanceLiteral(latitude, longitude, "categoryArticles")), "distance"]],
                },
                where: {
                  [Op.and]: [
                    where(literal(haversineDistanceLiteral(latitude, longitude, "categoryArticles")), "<=", radius),
                    {
                      publish: true,
                      latitude: { [Op.not]: null },
                      longitude: { [Op.not]: null },
                    },
                  ],
                },
                order: [[literal("distance"), "ASC"]],
                include: [
                  { association: "articleLanguages", required: false },
                  { association: "author" },
                  { association: "authorAlias", required: false },
                ],
              },
            ],
          });
          return {
            ...(await formatI18nCategory(category, currentLocale)),
            subcategories: await Promise.all(
              categoriesArticles
                .filter((subcategory) => (subcategory.categoryArticles || []).length > 0)
                .map(async (subcategory) => ({
                  ...(await formatI18nCategory(subcategory, currentLocale)),
                  articles: await Promise.all(
                    (subcategory.categoryArticles || [])
                      .map((article) => formatI18nArticle(article, article.author!, article.authorAlias, currentLocale))
                      .slice(0, 10)
                  ),
                }))
            ),
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
                  attributes: {
                    include: [[literal(haversineDistanceLiteral(latitude, longitude, "categoryEvents")), "distance"]],
                  },
                  where: {
                    [Op.and]: [
                      {
                        publish: true,
                        latitude: { [Op.not]: null },
                        longitude: { [Op.not]: null },
                        endDate: { [Op.gte]: new Date() },
                      },
                      where(literal(haversineDistanceLiteral(latitude, longitude, "categoryEvents")), "<=", radius),
                    ],
                  },
                  order: [[literal("distance"), "ASC"]],
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
                    (subcategory.categoryEvents || [])
                      .map((event) => {
                        return formatI18nEvent(event, event.author!, event.authorAlias, currentLocale);
                      })
                      .slice(0, 10)
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
      news: await Promise.all(
        newsArticles.rows.map((article) => {
          return formatI18nArticle(article, article.author!, article.authorAlias, currentLocale);
        })
      ),
    });
  });
};

export default websiteHomepageController;
