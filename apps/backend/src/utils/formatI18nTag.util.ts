import { Tag } from "../app/models";
import config from "../config/app.config";

export const getMarkerImageUrl = (markerImageFilename?: string | null): string | null => {
  if (!markerImageFilename) return null;
  return `${config.serverNameStatics}/uploads/images/tags/${markerImageFilename}`;
};

const formatI18nTag = (tag: Tag, currentLocale: string) => {
  const languageTag = (tag.tagLanguages || []).find((tagLanguage) => tagLanguage.languageId === currentLocale);
  const defaultLanguageTag = (tag.tagLanguages || []).find((tagLanguage) => tagLanguage.languageId === config.fallbackLocale);

  return {
    id: tag.id,
    slug: tag.slug,
    name: languageTag ? languageTag.name : defaultLanguageTag ? defaultLanguageTag.name : tag.slug,
    markerImage: getMarkerImageUrl(tag.mapMarkerImage),
  };
};

export default formatI18nTag;

