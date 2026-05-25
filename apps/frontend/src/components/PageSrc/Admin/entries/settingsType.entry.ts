import ResourceType from "./resourceType.entry";

const settingsTypeEntry: Array<{
  id: ResourceType.CategoriesArticles | ResourceType.CategoriesEvents | ResourceType.CategoriesPodcasts | ResourceType.Articles | ResourceType.Events;
  name: string;
}> = [
  { id: ResourceType.CategoriesArticles, name: "Category Articles" },
  { id: ResourceType.CategoriesEvents, name: "Category Events" },
  { id: ResourceType.CategoriesPodcasts, name: "Category Podcasts" },
  { id: ResourceType.Articles, name: "Article" },
  { id: ResourceType.Events, name: "Event" },
];

export const settingsTypeEntryDefaultValue = settingsTypeEntry[0].id;

export default settingsTypeEntry;
