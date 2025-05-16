/**
 * Loads translation JSON for a given locale and namespace.
 * @param locale - The locale code (e.g., 'en', 'hu')
 * @param ns - The namespace (e.g., 'common')
 * @returns The translation object
 */
export const getTranslation = async (
  locale: string,
  ns: string = 'common',
): Promise<Record<string, string>> => {
  try {
    const translation = await import(`../../public/locales/${locale}/${ns}.json`);
    return translation.default;
  } catch (err) {
    console.error(`Translation file not found for locale: ${locale}, ns: ${ns}`);
    return {};
  }
};
