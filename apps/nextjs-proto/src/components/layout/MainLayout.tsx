import { FC, ReactNode } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import Navigation from './Navigation';
import ThemeSwitcher from './ThemeSwitcher';

/**
 * MainLayout component wraps the page with header and footer.
 * @param children - The content to render inside the layout.
 * @param translations - Translation object
 * @param locale - Current locale
 */
type MainLayoutProps = {
  children: ReactNode;
  translations?: Record<string, string>;
  locale: string;
};

const MainLayout: FC<MainLayoutProps> = ({ children, translations = {}, locale }) => {
  const t = (key: string) => translations[key] || key;
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur shadow border-b border-gray-200 dark:border-gray-800 w-full">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <span className="font-bold text-xl">{t('siteTitle')}</span>
          <div className="flex items-center gap-4">
            <Navigation translations={translations} />
            <LanguageSwitcher locale={locale} />
            <ThemeSwitcher />
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-6 py-8">
        {/* If children are sections that need translations, pass translations as prop */}
        {children}
      </main>
      <footer className="w-full py-4 px-6 bg-gray-100 text-center text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400">
        &copy; {new Date().getFullYear()} {t('siteTitle')}. All rights reserved.
      </footer>
    </div>
  );
};

export default MainLayout; 