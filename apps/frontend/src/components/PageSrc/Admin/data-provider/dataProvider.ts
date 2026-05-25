import { combineDataProviders } from "react-admin";
import mainDataProvider from "./mainDataProvider";
import config from "@/config";
import { httpJsonFetchClient } from "./httpClient";
import languagesDataProvider from "./languagesDataProvider";
import categoriesDataProvider from "./categoriesDataProvider";
import articleDataProvider from "./articleDataProvider";
import eventDataProvider from "./eventDataProvider";
import municipalitiesDataProvider from "./municipalitiesDataProvider";
import provincesDataProvider from "./provincesDataProvider";
import regionsDataProvider from "./regionsDataProvider";
import podcastDataProvider from "./podcastsDataProvider";
import websiteIntlDataProvider from "./websiteIntlDataProvider";
import menuItemsDataProvider from "./menuItemsDataProvider";
import ResourceType from "../entries/resourceType.entry";
import settingsDataProvider from "./settingsDataProvider";
import tagsDataProvider from "./tagsDataProvider";

const dataProvider = combineDataProviders((resource) => {
  switch (resource) {
    case ResourceType.Languages:
      return languagesDataProvider(config.admin.mainDataProviderUrlBase, httpJsonFetchClient);
    case ResourceType.Categories:
    case ResourceType.CategoriesArticles:
    case ResourceType.CategoriesEvents:
    case ResourceType.CategoriesPodcasts:
      return categoriesDataProvider(config.admin.mainDataProviderUrlBase, httpJsonFetchClient);
    case ResourceType.Articles:
    case ResourceType.News:
      return articleDataProvider(config.admin.mainDataProviderUrlBase, httpJsonFetchClient);
    case ResourceType.Events:
      return eventDataProvider(config.admin.mainDataProviderUrlBase, httpJsonFetchClient);
    case ResourceType.Municipalities:
      return municipalitiesDataProvider(config.admin.mainDataProviderUrlBase, httpJsonFetchClient);
    case ResourceType.Provinces:
      return provincesDataProvider(config.admin.mainDataProviderUrlBase, httpJsonFetchClient);
    case ResourceType.Regions:
      return regionsDataProvider(config.admin.mainDataProviderUrlBase, httpJsonFetchClient);
    case ResourceType.Podcasts:
      return podcastDataProvider(config.admin.mainDataProviderUrlBase, httpJsonFetchClient);
    case ResourceType.WebsiteIntl:
      return websiteIntlDataProvider(config.admin.mainDataProviderUrlBase, httpJsonFetchClient);
    case ResourceType.MenuItems:
      return menuItemsDataProvider(config.admin.mainDataProviderUrlBase, httpJsonFetchClient);
    case ResourceType.Settings:
      return settingsDataProvider(config.admin.mainDataProviderUrlBase, httpJsonFetchClient);
    case ResourceType.Tags:
      return tagsDataProvider(config.admin.mainDataProviderUrlBase, httpJsonFetchClient);
    default:
      return mainDataProvider(config.admin.mainDataProviderUrlBase, httpJsonFetchClient);
  }
});

export default dataProvider;
