import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Root page. Redirects to /en or /hu based on the user's preferred language.
 */
const SUPPORTED_LOCALES = ['en', 'hu'] as const;
const DEFAULT_LOCALE = 'en';

/**
 * Detects the preferred locale from the Accept-Language header.
 * @param acceptLanguage - The Accept-Language header value
 * @returns The preferred locale ('en' or 'hu')
 */
const detectPreferredLocale = (acceptLanguage: string | undefined): string => {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const languages = acceptLanguage.split(',').map((lang) => lang.split(';')[0].trim().toLowerCase());
  const found = languages.find((lang) => SUPPORTED_LOCALES.includes(lang as typeof SUPPORTED_LOCALES[number]));
  return found ?? DEFAULT_LOCALE;
};

export default async function Home() {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') ?? undefined;
  const preferredLocale = detectPreferredLocale(acceptLanguage);
  redirect(`/${preferredLocale}`);
}
