import { Region } from "../app/models";
import config from "../config/app.config";
import getDefaultImageUrl from "./getDefaultImage.util";

const formatI18nRegion = async (region: Region, currentLocale: string) => {
  const languageRegion = (region.regionLanguages || []).find((regionLanguage) => regionLanguage.languageId === currentLocale);
  const defaultLanguageRegion = (region.regionLanguages || []).find((regionLanguage) => regionLanguage.languageId === config.fallbackLocale);

  const image = region.image ? `${config.serverNameStatics}/uploads/images/regions/${region.image}` : await getDefaultImageUrl("default");

  return {
    id: region.id,
    slug: region.slug,
    name: languageRegion ? languageRegion.name : defaultLanguageRegion ? defaultLanguageRegion.name : config.noNameDefault,
    description: languageRegion ? languageRegion.description : defaultLanguageRegion ? defaultLanguageRegion.description : config.noNameDefault,
    image: image,
    mobileImage: region.mobileImage ? `${config.serverNameStatics}/uploads/images/regions/${region.mobileImage}` : image,
  };
};

export default formatI18nRegion;
