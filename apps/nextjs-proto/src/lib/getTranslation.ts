import enCommon from '../locales/en/common.json';
import huCommon from '../locales/hu/common.json';

/**
 * Loads translation JSON for a given locale and namespace using static imports and a map.
 * Falls back to English if locale or namespace is not found.
 * @param locale - The locale code (e.g., 'en', 'hu')
 * @param ns - The namespace (e.g., 'common')
 * @returns The translation object
 */
const translationsMap: Record<string, Record<string, Record<string, string>>> = {
  en: { common: enCommon },
  hu: { common: huCommon },
};

export const getTranslation = async (
  locale: string,
  ns: string = 'common',
): Promise<Record<string, string>> => {
  let localeTranslations = translationsMap[locale]?.[ns];
  if (!localeTranslations) {
    console.warn(`[getTranslation] Fallback to English for locale: ${locale}, ns: ${ns}`);
    localeTranslations = translationsMap['en']?.[ns];
  }
  if (!localeTranslations) {
    console.error(`Translation file not found for locale: ${locale}, ns: ${ns}`);
    return {};
  }
  return localeTranslations;
};
