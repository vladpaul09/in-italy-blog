import AdminResourceType from "./adminResourceType.entry";

export enum settingsTopBoxesTypeLabels {
  HOMEPAGE_TOP_BOX_ONE_CATEGORY_ARTICLE_ID = "homepageTopBoxOneCategoryArticleId",
  HOMEPAGE_TOP_BOX_TWO_CATEGORY_ARTICLE_ID = "homepageTopBoxTwoCategoryArticleId",
  HOMEPAGE_TOP_BOX_THREE_CATEGORY_ARTICLE_ID = "homepageTopBoxThreeCategoryArticleId",
  HOMEPAGE_TOP_BOX_FOUR_CATEGORY_ARTICLE_ID = "homepageTopBoxFourCategoryArticleId",
  HOMEPAGE_TOP_BOX_FIVE_CATEGORY_ARTICLE_ID = "homepageTopBoxFiveCategoryArticleId",

  HOMEPAGE_TOP_BOX_ONE_CATEGORY_EVENT_ID = "homepageTopBoxOneCategoryEventId",
  HOMEPAGE_TOP_BOX_TWO_CATEGORY_EVENT_ID = "homepageTopBoxTwoCategoryEventId",
  HOMEPAGE_TOP_BOX_THREE_CATEGORY_EVENT_ID = "homepageTopBoxThreeCategoryEventId",
  HOMEPAGE_TOP_BOX_FOUR_CATEGORY_EVENT_ID = "homepageTopBoxFourCategoryEventId",
  HOMEPAGE_TOP_BOX_FIVE_CATEGORY_EVENT_ID = "homepageTopBoxFiveCategoryEventId",

  HOMEPAGE_TOP_BOX_ONE_CATEGORY_PODCAST_ID = "homepageTopBoxOneCategoryPodcastId",
  HOMEPAGE_TOP_BOX_TWO_CATEGORY_PODCAST_ID = "homepageTopBoxTwoCategoryPodcastId",
  HOMEPAGE_TOP_BOX_THREE_CATEGORY_PODCAST_ID = "homepageTopBoxThreeCategoryPodcastId",
  HOMEPAGE_TOP_BOX_FOUR_CATEGORY_PODCAST_ID = "homepageTopBoxFourCategoryPodcastId",
  HOMEPAGE_TOP_BOX_FIVE_CATEGORY_PODCAST_ID = "homepageTopBoxFiveCategoryPodcastId",

  HOMEPAGE_TOP_BOX_ONE_ARTICLE_ID = "homepageTopBoxOneArticleId",
  HOMEPAGE_TOP_BOX_TWO_ARTICLE_ID = "homepageTopBoxTwoArticleId",
  HOMEPAGE_TOP_BOX_THREE_ARTICLE_ID = "homepageTopBoxThreeArticleId",
  HOMEPAGE_TOP_BOX_FOUR_ARTICLE_ID = "homepageTopBoxFourArticleId",
  HOMEPAGE_TOP_BOX_FIVE_ARTICLE_ID = "homepageTopBoxFiveArticleId",

  HOMEPAGE_TOP_BOX_ONE_EVENT_ID = "homepageTopBoxOneEventId",
  HOMEPAGE_TOP_BOX_TWO_EVENT_ID = "homepageTopBoxTwoEventId",
  HOMEPAGE_TOP_BOX_THREE_EVENT_ID = "homepageTopBoxThreeEventId",
  HOMEPAGE_TOP_BOX_FOUR_EVENT_ID = "homepageTopBoxFourEventId",
  HOMEPAGE_TOP_BOX_FIVE_EVENT_ID = "homepageTopBoxFiveEventId",

  HOMEPAGE_TOP_BOX_ONE_TYPE = "homepageTopBoxOneType",
  HOMEPAGE_TOP_BOX_TWO_TYPE = "homepageTopBoxTwoType",
  HOMEPAGE_TOP_BOX_THREE_TYPE = "homepageTopBoxThreeType",
  HOMEPAGE_TOP_BOX_FOUR_TYPE = "homepageTopBoxFourType",
  HOMEPAGE_TOP_BOX_FIVE_TYPE = "homepageTopBoxFiveType",

  HOMEPAGE_BOTTOM_BOXES = "homepageBottomBoxes",

  REGIONAL_ARTICLES = "regionalArticles",
  HOMEPAGE_AROUND_YOU = "homepageAroundYou",
  SHOWCASE_PODCAST = "showcasePodcast",
  HOMEPAGE_HEADER_IMAGES = "homepageHeaderImages",
  DEFAULT_IMAGE = "defaultImage",
}

export enum ResourceUnionEntryId {
  CategoryArticle = AdminResourceType.CategoriesArticles,
  CategoryEvent = AdminResourceType.CategoriesEvents,
  CategoryPodcast = AdminResourceType.CategoriesPodcasts,
  Article = AdminResourceType.Articles,
  Event = AdminResourceType.Events,
}

export const resourceUnionEntry: Array<{ id: ResourceUnionEntryId; name: string }> = [
  { id: ResourceUnionEntryId.CategoryArticle, name: "CategoryArticle" },
  { id: ResourceUnionEntryId.CategoryEvent, name: "CategoryEvent" },
  { id: ResourceUnionEntryId.CategoryPodcast, name: "CategoryPodcast" },
  { id: ResourceUnionEntryId.Article, name: "Article" },
  { id: ResourceUnionEntryId.Event, name: "Event" },
];

export const resourceUnionEntryIds = resourceUnionEntry.map((item) => item.id) as [ResourceUnionEntryId, ...ResourceUnionEntryId[]];
export const resourceUnionEntryDefaultValue = resourceUnionEntry[0].id;

export type RegionalArticleSetting = { categoryArticleId: number };

export type ShowcasePodcastSetting = { podcastId: number };

