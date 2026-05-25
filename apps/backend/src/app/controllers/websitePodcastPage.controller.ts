import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../../config/httpStatus.config";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import { Category, Podcast } from "../models";
import { PodcastSchema } from "../schemas/websiteBase.schema";
import { Op } from "sequelize";
import config from "../../config/app.config";
import formatI18nPodcast from "../../utils/formatI18nPodcast.util";
import CategoriesType from "../../entries/categoriesType.entry";
import adInjector from "../../utils/adsInjector.util";
import { adArray } from "../../entries/ads.entry";


const websitePodcastBaseSchema = {
  params: z.object({
    locale: z.string(),
    podcastSlug: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.object({
      podcast: PodcastSchema,
      latestPodcasts: z.array(PodcastSchema),
    }),
    [HTTP_STATUS_NOT_FOUND]: z.string(),
  },
};

const websitePodcastPageController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  app.get(`${routePrefix}/:locale/podcast/:podcastSlug`, { schema: websitePodcastBaseSchema }, async (request, reply) => {
    const { locale, podcastSlug } = request.params;

    const currentLocale = await app.getRequestLocale(locale);

    const podcast = await Podcast.findOne({
      where: {
        slug: podcastSlug,
        publish: true,
      },
      include: [
        { association: "podcastLanguages" },
        { association: "author" },
        { association: "authorAlias" },
        {
          association: "categories",
          where: {
            type: CategoriesType.PODCASTS,
          },
        },
      ],
    });

    if (!podcast) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    }

    const podcastCategories = podcast.categories || [];
    const parentCategories = (await Promise.all(podcastCategories.map((category) => Category.getParentCategoriesHierarchy(category.id)))).reduce(
      (acc, val) => acc.concat(val),
      []
    );

    const latestPodcasts = await Podcast.findAll({
      where: {
        publish: true,
        id: {
          [Op.not]: podcast.id,
        },
      },
      include: [
        { association: "podcastLanguages" },
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
            type: CategoriesType.PODCASTS,
          },
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: config.maxLimitNews,
    });

    const podcastFormatted = await formatI18nPodcast(podcast, podcast.author!, podcast.authorAlias, currentLocale);

    return reply.code(HTTP_STATUS_OK).send({
      podcast: { ...podcastFormatted, description: adInjector(podcastFormatted.description!, adArray) },
      latestPodcasts: await Promise.all((latestPodcasts || []).map((podcast) => formatI18nPodcast(podcast, podcast.author!, podcast.authorAlias, currentLocale))),
    });
  });
};

export default websitePodcastPageController;
