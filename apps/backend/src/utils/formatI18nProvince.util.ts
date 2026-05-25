import { Province } from "../app/models";
import config from "../config/app.config";
import getDefaultImageUrl from "./getDefaultImage.util";

const formatI18nProvince = async (province: Province, currentLocale: string) => {
  const languageProvince = (province.provinceLanguages || []).find((provinceLanguage) => provinceLanguage.languageId === currentLocale);
  const defaultLanguageProvince = (province.provinceLanguages || []).find(
    (provinceLanguage) => provinceLanguage.languageId === config.fallbackLocale
  );

  const image = province.image ? `${config.serverNameStatics}/uploads/images/provinces/${province.image}` : await getDefaultImageUrl("default");

  return {
    id: province.id,
    slug: province.slug,
    name: languageProvince ? languageProvince.name : defaultLanguageProvince ? defaultLanguageProvince.name : config.noNameDefault,
    description: languageProvince
      ? languageProvince.description
      : defaultLanguageProvince
      ? defaultLanguageProvince.description
      : config.noNameDefault,
    image: image,
    mobileImage: province.mobileImage ? `${config.serverNameStatics}/uploads/images/provinces/${province.mobileImage}` : image,
  };
};

export default formatI18nProvince;
