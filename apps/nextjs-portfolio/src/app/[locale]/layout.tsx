import type { ReactNode } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { getTranslation } from '../../lib/getTranslation';

/**
 * Locale layout for the application, loads translations and provides them to MainLayout.
 * @param children - The page content.
 * @param params - Route params including locale
 */
type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

const LocaleLayout = async ({ children, params }: LocaleLayoutProps) => {
  const { locale } = await params;
  const translations = await getTranslation(locale, 'common');
  console.log('[LocaleLayout] translations:', translations);

  return (
    <html>
      <body>
        <MainLayout translations={translations} locale={locale}>
          {children}
        </MainLayout>
      </body>
    </html>
  );
};

export default LocaleLayout; 