import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Root page. Redirects to /en or /hu based on the user's preferred language or stored cookie.
 */
const SUPPORTED_LOCALES = ['en', 'hu'] as const;
const DEFAULT_LOCALE = 'en';

/**
 * Parses the cookie header and returns an object of key-value pairs.
 * @param cookieHeader - The raw cookie header string
 */
const parseCookies = (cookieHeader: string | undefined): Record<string, string> => {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(';').map(cookie => {
      const [key, ...rest] = cookie.trim().split('=');
      return [key, rest.join('=')];
    })
  );
};

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
  const cookieHeader = headersList.get('cookie') ?? undefined;
  const cookies = parseCookies(cookieHeader);
  const cookieLocale = cookies['NEXT_LOCALE'];
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as typeof SUPPORTED_LOCALES[number])) {
    redirect(`/${cookieLocale}`);
  }
  const acceptLanguage = headersList.get('accept-language') ?? undefined;
  const preferredLocale = detectPreferredLocale(acceptLanguage);
  redirect(`/${preferredLocale}`);
}
