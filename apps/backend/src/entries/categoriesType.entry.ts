import AdminResourceType from "./adminResourceType.entry";

enum CategoriesType {
  ALL = AdminResourceType.Categories,
  ARTICLES = AdminResourceType.CategoriesArticles,
  EVENTS = AdminResourceType.CategoriesEvents,
  PODCASTS = AdminResourceType.CategoriesPodcasts,
}

export enum CategoryPageView {
  POSTS_VIEW = "POSTS_VIEW",
  REGIONAL_VIEW = "REGIONAL_VIEW",
  PARENT_CATEGORY_VIEW = "PARENT_CATEGORY_VIEW",
}

export default CategoriesType;
