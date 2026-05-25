import ResourceType from "./resourceType.entry";

const menuItemTypeEntry: Array<{
  id: ResourceType.CategoriesArticles | ResourceType.CategoriesEvents | ResourceType.CategoriesPodcasts | "link" | "title" | "dropdown";
  name: string;
}> = [
  { id: "dropdown", name: "Dropdown" },
  { id: "title", name: "Title" },
  { id: "link", name: "Link" },
  { id: ResourceType.CategoriesArticles, name: "Articles" },
  { id: ResourceType.CategoriesEvents, name: "Events" },
  { id: ResourceType.CategoriesPodcasts, name: "Podcasts" },
];

export default menuItemTypeEntry;
