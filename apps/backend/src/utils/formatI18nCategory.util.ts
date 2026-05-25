import { Category } from "../app/models";
import config from "../config/app.config";
import getDefaultImageUrl from "./getDefaultImage.util";

const formatI18nCategory = async (category: Category, currentLocale: string) => {
  const languageCategory = (category.categoryLanguages || []).find((categoryLanguage) => categoryLanguage.languageId === currentLocale);
  const defaultLanguageCategory = (category.categoryLanguages || []).find(
    (categoryLanguage) => categoryLanguage.languageId === config.fallbackLocale
  );

  const image = category.image ? `${config.serverNameStatics}/uploads/images/categories/${category.image}` : await getDefaultImageUrl("default");

  return {
    id: category.id,
    slug: category.slug,
    parentId: category.parentId,
    pageView: category.pageView,
    image: image,
    mobileImage: category.mobileImage ? `${config.serverNameStatics}/uploads/images/categories/${category.mobileImage}` : image,
    name: languageCategory ? languageCategory.name : defaultLanguageCategory ? defaultLanguageCategory.name : config.noNameDefault,
    description: languageCategory
      ? languageCategory.description
      : defaultLanguageCategory
      ? defaultLanguageCategory.description
      : config.noNameDefault,
  };
};

export default formatI18nCategory;
