import { Op } from "sequelize";
import Event from "../app/models/event.model";
import Article from "../app/models/article.model";
import Podcast from "../app/models/podcast.model";
import formatI18nTag, { getMarkerImageUrl } from "./formatI18nTag.util";
import formatI18nEvent from "./formatI18nEvent.util";
import formatI18nArticle from "./formatI18nArticle.util";
import formatI18nPodcast from "./formatI18nPodcast.util";

const getMapPosts = async (locale: string, currentLocale: string, filterType?: "region" | "province", filterCode?: string) => {
  const now = new Date();

  // Fetch events (with expiration check)
  const events = await Event.findAll({
    where: {
      publish: true,
      endDate: { [Op.gte]: now },
      latitude: { [Op.ne]: null },
      longitude: { [Op.ne]: null },
    },
    include: [
      { association: "eventLanguages" },
      { association: "author" },
      { association: "authorAlias" },
      {
        association: "categories",
        include: [
          {
            association: "tags",
            where: { mapMarkerImage: { [Op.ne]: null } },
            required: true,
            include: [{ association: "tagLanguages" }],
          },
        ],
        required: true,
      },
      ...(filterType === "region"
        ? [
            {
              association: "municipality",
              include: [{ association: "province", where: { regionId: filterCode } }],
              required: true,
            },
          ]
        : filterType === "province"
        ? [{ association: "municipality", where: { provinceId: filterCode }, required: true }]
        : []),
    ],
    order: [["createdAt", "DESC"]],
  });

  // Fetch articles (no expiration)
  const articles = await Article.findAll({
    where: {
      publish: true,
      latitude: { [Op.ne]: null },
      longitude: { [Op.ne]: null },
    },
    include: [
      { association: "articleLanguages" },
      { association: "author" },
      { association: "authorAlias" },
      {
        association: "categories",
        include: [
          {
            association: "tags",
            where: { mapMarkerImage: { [Op.ne]: null } },
            required: true,
            include: [{ association: "tagLanguages" }],
          },
        ],
        required: true,
      },
      ...(filterType === "region"
        ? [
            {
              association: "municipalities",
              include: [{ association: "province", where: { regionId: filterCode } }],
              required: true,
            },
          ]
        : filterType === "province"
        ? [{ association: "municipalities", where: { provinceId: filterCode }, required: true }]
        : []),
    ],
    order: [["createdAt", "DESC"]],
  });

  // Fetch podcasts (no expiration)
  const podcasts = await Podcast.findAll({
    where: {
      publish: true,
      latitude: { [Op.ne]: null },
      longitude: { [Op.ne]: null },
    },
    include: [
      { association: "podcastLanguages" },
      { association: "author" },
      { association: "authorAlias" },
      {
        association: "categories",
        include: [
          {
            association: "tags",
            where: { mapMarkerImage: { [Op.ne]: null } },
            required: true,
            include: [{ association: "tagLanguages" }],
          },
        ],
        required: true,
      },
      ...(filterType === "region"
        ? [
            {
              association: "municipalities",
              include: [{ association: "province", where: { regionId: filterCode } }],
              required: true,
            },
          ]
        : filterType === "province"
        ? [{ association: "municipalities", where: { provinceId: filterCode }, required: true }]
        : []),
    ],
    order: [["createdAt", "DESC"]],
  });

  // Format events
  const formattedEvents = await Promise.all(
    events.map(async (event) => {
      const allTags = (event.categories || []).flatMap((category) => category.tags || []);
      const markerTag = allTags.find((tag) => tag.mapMarkerImage);
      const formattedTags = allTags.map((tag) => formatI18nTag(tag, currentLocale));

      // Use I18n formatter for the base event data
      const formattedEvent = await formatI18nEvent(event, event.author!, event.authorAlias, currentLocale);

      return {
        type: "event" as const,
        slug: formattedEvent.slug,
        title: formattedEvent.title,
        url: `/${locale}/evento/${formattedEvent.slug}`,
        image: formattedEvent.image,
        mobileImage: formattedEvent.mobileImage,
        markerImage: markerTag ? getMarkerImageUrl(markerTag.mapMarkerImage) : null,
        tags: formattedTags,
        latitude: formattedEvent.latitude!,
        longitude: formattedEvent.longitude!,
        description: formattedEvent.description || "",
        startDate: formattedEvent.startDate,
        endDate: formattedEvent.endDate,
      };
    })
  );

  // Format articles
  const formattedArticles = await Promise.all(
    articles.map(async (article) => {
      const allTags = (article.categories || []).flatMap((category) => category.tags || []);
      const markerTag = allTags.find((tag) => tag.mapMarkerImage);
      const formattedTags = allTags.map((tag) => formatI18nTag(tag, currentLocale));

      // Use I18n formatter for the base article data
      const formattedArticle = await formatI18nArticle(article, article.author!, article.authorAlias, currentLocale);

      return {
        type: "article" as const,
        slug: formattedArticle.slug,
        title: formattedArticle.title,
        url: `/${locale}/articolo/${formattedArticle.slug}`,
        image: formattedArticle.image,
        mobileImage: formattedArticle.mobileImage,
        markerImage: markerTag ? getMarkerImageUrl(markerTag.mapMarkerImage) : null,
        tags: formattedTags,
        latitude: article.latitude!,
        longitude: article.longitude!,
        description: formattedArticle.description || "",
      };
    })
  );

  // Format podcasts
  const formattedPodcasts = await Promise.all(
    podcasts.map(async (podcast) => {
      const allTags = (podcast.categories || []).flatMap((category) => category.tags || []);
      const markerTag = allTags.find((tag) => tag.mapMarkerImage);
      const formattedTags = allTags.map((tag) => formatI18nTag(tag, currentLocale));

      // Use I18n formatter for the base podcast data
      const formattedPodcast = await formatI18nPodcast(podcast, podcast.author!, podcast.authorAlias, currentLocale);

      return {
        type: "podcast" as const,
        slug: formattedPodcast.slug,
        title: formattedPodcast.title,
        url: `/${locale}/podcast/${formattedPodcast.slug}`,
        image: formattedPodcast.image,
        mobileImage: formattedPodcast.mobileImage,
        markerImage: markerTag ? getMarkerImageUrl(markerTag.mapMarkerImage) : null,
        tags: formattedTags,
        latitude: formattedPodcast.latitude!,
        longitude: formattedPodcast.longitude!,
        description: formattedPodcast.description || "",
      };
    })
  );

  // Concatenate all posts
  return [...formattedEvents, ...formattedArticles, ...formattedPodcasts];
};

export default getMapPosts;
