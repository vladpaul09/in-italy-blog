import { Article, User, UserAlias } from "../app/models";
import config from "../config/app.config";
import getDefaultImageUrl from "./getDefaultImage.util";

const formatI18nArticle = async (article: Article, author: User, authorAlias: UserAlias | null | undefined, currentLocale: string) => {
  const languageArticle = (article.articleLanguages || []).find((articleLanguage) => articleLanguage.languageId === currentLocale);
  const defaultLanguageArticle = (article.articleLanguages || []).find((articleLanguage) => articleLanguage.languageId === config.fallbackLocale);

  const image = article.image ? `${config.serverNameStatics}/uploads/images/articles/${article.image}` : await getDefaultImageUrl("default");

  return {
    id: article.id,
    slug: article.slug,
    publish: article.publish,
    author: authorAlias ? authorAlias.name : author.firstName + " " + author.lastName,
    image: image,
    mobileImage: article.mobileImage ? `${config.serverNameStatics}/uploads/images/articles/${article.mobileImage}` : image,
    title: languageArticle ? languageArticle.title : defaultLanguageArticle ? defaultLanguageArticle.title : config.noNameDefault,
    description: languageArticle ? languageArticle.description : defaultLanguageArticle ? defaultLanguageArticle.description : config.noNameDefault,
    createdAt: article.createdAt,
  };
};

export default formatI18nArticle;
