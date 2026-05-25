import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { HTTP_STATUS_OK } from "../../config/httpStatus.config";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import { Article, Category, Event, Podcast } from "../models";
import { Op } from "sequelize";
import formatI18nCategory from "../../utils/formatI18nCategory.util";
import formatI18nArticle from "../../utils/formatI18nArticle.util";
import formatI18nEvent from "../../utils/formatI18nEvent.util";
import formatI18nPodcast from "../../utils/formatI18nPodcast.util";

// Unified search result schema
const SearchResultSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  image: z.string().nullable(),
  mobileImage: z.string().nullable(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  url: z.string(),
  type: z.enum(["category", "article", "event", "podcast"]),
});

// Combined search results schema
const websiteSearchSchema = {
  params: z.object({
    locale: z.string(),
  }),
  querystring: z.object({
    q: z.string().min(1, "Search query is required").max(200, "Search query must be less than 200 characters"),
    page: z.coerce.number().optional().default(1),
    limit: z.coerce.number().optional().default(10),
  }),
  response: {
    [HTTP_STATUS_OK]: z.object({
      results: z.array(SearchResultSchema),
      total: z.number(),
    }),
  },
};

const websiteSearchController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  app.get(`${routePrefix}/:locale/search`, { schema: websiteSearchSchema }, async (request, reply) => {
    const { locale } = request.params;
    const { q, page, limit } = request.query;
    const currentLocale = await app.getRequestLocale(locale);

    // Decode URI and parse pagination parameters
    const decodedQuery = decodeURIComponent(q);
    const currentPage = page;
    const itemsPerPage = limit;

    // Search categories (all matching results)
    const categories = await Category.findAll({
      include: [
        {
          association: "categoryLanguages",
          where: {
            languageId: currentLocale,
            name: {
              [Op.like]: `%${decodedQuery}%`,
            },
          },
          required: true,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Search articles (only published)
    const articles = await Article.findAll({
      where: { publish: true },
      include: [
        {
          association: "articleLanguages",
          where: {
            languageId: currentLocale,
            title: {
              [Op.like]: `%${decodedQuery}%`,
            },
          },
          required: true,
        },
        { association: "author" },
        { association: "authorAlias" },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Search events (only published and future/current)
    const now = new Date();
    const events = await Event.findAll({
      where: {
        publish: true,
        endDate: { [Op.gte]: now },
      },
      include: [
        {
          association: "eventLanguages",
          where: {
            languageId: currentLocale,
            title: {
              [Op.like]: `%${decodedQuery}%`,
            },
          },
          required: true,
        },
        { association: "author" },
        { association: "authorAlias" },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Search podcasts (only published)
    const podcasts = await Podcast.findAll({
      where: { publish: true },
      include: [
        {
          association: "podcastLanguages",
          where: {
            languageId: currentLocale,
            title: {
              [Op.like]: `%${decodedQuery}%`,
            },
          },
          required: true,
        },
        { association: "author" },
        { association: "authorAlias" },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Format categories using I18n utility
    const formattedCategories = await Promise.all(
      categories.map(async (category) => {
        const formatted = await formatI18nCategory(category, currentLocale);
        const categoryType = category.type === "categories-articles" ? "articoli" : category.type === "categories-events" ? "eventi" : "podcast";

        return {
          name: formatted.name,
          image: formatted.image,
          mobileImage: formatted.mobileImage,
          url: `/${locale}/categoria/${categoryType}/${formatted.slug}`,
          type: "category" as const,
          createdAt: category.createdAt,
        };
      })
    );

    // Format articles using I18n utility
    const formattedArticles = await Promise.all(
      articles.map(async (article) => {
        const formatted = await formatI18nArticle(article, article.author!, article.authorAlias, currentLocale);

        return {
          title: formatted.title,
          image: formatted.image,
          mobileImage: formatted.mobileImage,
          url: `/${locale}/articolo/${formatted.slug}`,
          type: "article" as const,
          createdAt: formatted.createdAt,
        };
      })
    );

    // Format events using I18n utility
    const formattedEvents = await Promise.all(
      events.map(async (event) => {
        const formatted = await formatI18nEvent(event, event.author!, event.authorAlias, currentLocale);

        return {
          title: formatted.title,
          image: formatted.image,
          mobileImage: formatted.mobileImage,
          startDate: formatted.startDate,
          endDate: formatted.endDate,
          url: `/${locale}/evento/${formatted.slug}`,
          type: "event" as const,
          createdAt: formatted.createdAt,
        };
      })
    );

    // Format podcasts using I18n utility
    const formattedPodcasts = await Promise.all(
      podcasts.map(async (podcast) => {
        const formatted = await formatI18nPodcast(podcast, podcast.author!, podcast.authorAlias, currentLocale);

        return {
          title: formatted.title,
          image: formatted.image,
          mobileImage: formatted.mobileImage,
          url: `/${locale}/podcast/${formatted.slug}`,
          type: "podcast" as const,
          createdAt: formatted.createdAt,
        };
      })
    );

    // Concatenate all results into a single array
    const allResults = [...formattedCategories, ...formattedArticles, ...formattedEvents, ...formattedPodcasts];

    // Sort by createdAt DESC
    allResults.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Calculate pagination
    const totalItems = allResults.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Get paginated results and remove createdAt from response
    const paginatedResults = allResults.slice(startIndex, endIndex).map(({ createdAt, ...rest }) => rest);

    return reply.code(HTTP_STATUS_OK).send({
      results: paginatedResults,
      total: totalItems,
    });
  });
};

export default websiteSearchController;
