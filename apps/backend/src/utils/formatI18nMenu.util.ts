import { MenuItem } from "../app/models";
import config from "../config/app.config";

// Helper to build icon object from filename
export const menuItemIconUrlBase = (iconName: string | null) => {
  return iconName ? { src: `${config.serverNameStatics}/uploads/images/menu-icons/${iconName}`, title: iconName } : null;
};

const headerUrlEncode = (url: string | null, locale: string) => {
  if (!url) {
    return null;
  }
  const re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  if (re.test(url)) {
    return url;
  }
  return `/${locale}${url}`;
};

async function formatI18nMenuItem(menuItem: MenuItem, locale: string) {
  const languageMenuItem = (menuItem.menuItemLanguages || []).find((menuItemLanguage) => menuItemLanguage.languageId === locale);
  const defaultLanguageMenuItem = (menuItem.menuItemLanguages || []).find(
    (menuItemLanguage) => menuItemLanguage.languageId === config.fallbackLocale
  );

  return {
    id: menuItem.id,
    parentId: menuItem.parentId,
    categoryId: menuItem.categoryId,
    url: headerUrlEncode(menuItem.url, locale),
    icon: menuItemIconUrlBase(menuItem.icon),
    type: menuItem.type,
    isVisible: menuItem.isVisible,
    position: menuItem.position,
    title: languageMenuItem ? languageMenuItem.title : defaultLanguageMenuItem ? defaultLanguageMenuItem.title : config.noNameDefault,
  };
}

export default formatI18nMenuItem;
