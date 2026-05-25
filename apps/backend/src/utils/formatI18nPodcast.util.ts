import { Podcast, User, UserAlias } from "../app/models";
import config from "../config/app.config";
import getDefaultImageUrl from "./getDefaultImage.util";

const formatI18nPodcast = async (podcast: Podcast, author: User, authorAlias: UserAlias | null | undefined, currentLocale: string) => {
  const languagePodcast = (podcast.podcastLanguages || []).find((podcastLanguage) => podcastLanguage.languageId === currentLocale);
  const defaultLanguagePodcast = (podcast.podcastLanguages || []).find((podcastLanguage) => podcastLanguage.languageId === config.fallbackLocale);

  const image = podcast.image ? `${config.serverNameStatics}/uploads/images/podcasts/${podcast.image}` : await getDefaultImageUrl("default");

  return {
    id: podcast.id,
    slug: podcast.slug,
    publish: podcast.publish,
    author: authorAlias ? authorAlias.name : author.firstName + " " + author.lastName,
    youtubeLink: podcast.youtubeLink,
    image: image,
    mobileImage: podcast.mobileImage ? `${config.serverNameStatics}/uploads/images/podcasts/${podcast.mobileImage}` : image,
    title: languagePodcast ? languagePodcast.title : defaultLanguagePodcast ? defaultLanguagePodcast.title : config.noNameDefault,
    shortDescription: languagePodcast ? languagePodcast.shortDescription : defaultLanguagePodcast ? defaultLanguagePodcast.shortDescription : null,
    description: languagePodcast ? languagePodcast.description : defaultLanguagePodcast ? defaultLanguagePodcast.description : null,
    latitude: podcast.latitude ?? null,
    longitude: podcast.longitude ?? null,
    scope: podcast.scope,
    municipalities: podcast.municipalities ? podcast.municipalities.map((item: any) => item.id) : [],
    createdAt: podcast.createdAt,
  };
};

export default formatI18nPodcast;
