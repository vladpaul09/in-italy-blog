import polyglotI18nProvider from "ra-i18n-polyglot";
import config from "@/config";
import en from "./en";
import it from "./it";

const i18nProvider = polyglotI18nProvider(
  (locale) => {
    switch (locale) {
      case "en":
        return en;
      default:
        return it;
    }
  },
  config.fallbackLocale, // default locale
  [
    { locale: "en", name: "English" },
    { locale: "it", name: "Italiano" },
  ],
  { allowMissing: true },
);

export default i18nProvider;
