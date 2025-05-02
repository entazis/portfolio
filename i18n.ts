import { getOptions } from "@/i18n.config";
import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

const initI18next = async (lng: string, ns: string) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`./public/locales/${language}/${namespace}.json`)
      )
    )
    .init(getOptions(lng, ns));
  return i18nInstance;
};

export async function createTranslation(
  ns: string,
  options: { keyPrefix?: string } = {}
) {
  const i18nextInstance = await initI18next("en", ns);
  return {
    t: i18nextInstance.getFixedT("en", ns, options.keyPrefix),
    i18n: i18nextInstance,
  };
}
