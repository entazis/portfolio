import { useEffect, useState } from 'react';
import { getTranslation } from './getTranslation';

/**
 * useTranslation hook loads translation data and provides a t function.
 * @param locale - The current locale
 * @param ns - The namespace (default: 'common')
 */
export const useTranslation = (locale: string, ns: string = 'common') => {
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    getTranslation(locale, ns).then(setTranslations);
  }, [locale, ns]);

  const t = (key: string): string => translations[key] || key;

  return { t };
};
