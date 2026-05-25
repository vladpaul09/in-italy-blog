import { Municipality } from "../app/models";
import config from "../config/app.config";
import getDefaultImageUrl from "./getDefaultImage.util";

const formatI18nMunicipality = async (municipality: Municipality, currentLocale: string) => {
  const languageMunicipality = (municipality.municipalityLanguages || []).find(
    (municipalityLanguage) => municipalityLanguage.languageId === currentLocale
  );
  const defaultLanguageMunicipality = (municipality.municipalityLanguages || []).find(
    (municipalityLanguage) => municipalityLanguage.languageId === config.fallbackLocale
  );

  const image = municipality.image
    ? `${config.serverNameStatics}/uploads/images/municipalities/${municipality.image}`
    : await getDefaultImageUrl("default");

  return {
    id: municipality.id,
    slug: municipality.slug,
    name: languageMunicipality ? languageMunicipality.name : defaultLanguageMunicipality ? defaultLanguageMunicipality.name : config.noNameDefault,
    description: languageMunicipality
      ? languageMunicipality.description
      : defaultLanguageMunicipality
      ? defaultLanguageMunicipality.description
      : config.noNameDefault,
    image: image,
    mobileImage: municipality.mobileImage ? `${config.serverNameStatics}/uploads/images/municipalities/${municipality.mobileImage}` : image,
    latitude: municipality.latitude,
    longitude: municipality.longitude,
    radius: municipality.radius,
    radiusUnit: municipality.radiusUnit,
  };
};

export default formatI18nMunicipality;
