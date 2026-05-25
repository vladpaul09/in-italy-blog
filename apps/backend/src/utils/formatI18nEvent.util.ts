import { Event, User, UserAlias } from "../app/models";
import config from "../config/app.config";
import getDefaultImageUrl from "./getDefaultImage.util";

const formatI18nEvent = async (event: Event, author: User, authorAlias: UserAlias | null | undefined, currentLocale: string) => {
  const languageEvent = (event.eventLanguages || []).find((eventLanguage) => eventLanguage.languageId === currentLocale);
  const defaultLanguageEvent = (event.eventLanguages || []).find((eventLanguage) => eventLanguage.languageId === config.fallbackLocale);

  const image = event.image ? `${config.serverNameStatics}/uploads/images/events/${event.image}` : await getDefaultImageUrl("default");

  return {
    id: event.id,
    slug: event.slug,
    publish: event.publish,
    author: authorAlias ? authorAlias.name : author.firstName + " " + author.lastName,
    image: image,
    mobileImage: event.mobileImage ? `${config.serverNameStatics}/uploads/images/events/${event.mobileImage}` : image,
    title: languageEvent ? languageEvent.title : defaultLanguageEvent ? defaultLanguageEvent.title : config.noNameDefault,
    description: languageEvent ? languageEvent.description : defaultLanguageEvent ? defaultLanguageEvent.description : config.noNameDefault,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate.toISOString(),
    latitude: event.latitude,
    longitude: event.longitude,
    createdAt: event.createdAt,
  };
};

export default formatI18nEvent;
