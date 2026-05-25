import AdminResourceType from "./adminResourceType.entry";

export enum MenuItemType {
  LINK = "link",
  CATEGORY_ARTICLES = AdminResourceType.CategoriesArticles,
  CATEGORY_EVENTS = AdminResourceType.CategoriesEvents,
  TITLE = "title",
  DROPDOWN = "dropdown",
}