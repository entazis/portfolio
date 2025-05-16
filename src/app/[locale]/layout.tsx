import type { ReactNode } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { getTranslation } from '../../lib/getTranslation';

/**
 * Locale layout for the application, loads translations and provides t function.
 * @param children - The page content.
 * @param params - Route params including locale
 */
type LocaleLayoutProps = {
  children: ReactNode;
  params: { locale: string };
};

const LocaleLayout = async ({ children, params }: LocaleLayoutProps) => {
  const { locale } = params;
  const translations = await getTranslation(locale, 'common');
  const t = (key: string) => translations[key] || key;

  return (
    <html lang={locale}>
      <body>
        <MainLayout t={t} locale={locale}>
          {children}
        </MainLayout>
      </body>
    </html>
  );
};

export default LocaleLayout; 