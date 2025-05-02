import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./public/locales/en/common.json";

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: { common: en },
  },
  ns: ["common"],
  defaultNS: "common",
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
