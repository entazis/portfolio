import { FC, ReactNode } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import Navigation from './Navigation';
import ThemeSwitcher from './ThemeSwitcher';

/**
 * MainLayout component wraps the page with header and footer.
 * @param children - The content to render inside the layout.
 * @param t - Translation function
 * @param locale - Current locale
 */
type MainLayoutProps = {
  children: ReactNode;
  t: (key: string) => string;
  locale: string;
};

const MainLayout: FC<MainLayoutProps> = ({ children, t, locale }) => (
  <div className="flex flex-col min-h-screen bg-background text-foreground">
    <header className="w-full py-4 px-6 bg-white shadow-md dark:bg-gray-900">
      <div className="container mx-auto flex justify-between items-center">
        <span className="font-bold text-xl">{t('siteTitle')}</span>
        <div className="flex items-center gap-4">
          <Navigation t={t} />
          <LanguageSwitcher locale={locale} />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
    <main className="flex-1 container mx-auto px-6 py-8">{children}</main>
    <footer className="w-full py-4 px-6 bg-gray-100 text-center text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400">
      &copy; {new Date().getFullYear()} {t('siteTitle')}. All rights reserved.
    </footer>
  </div>
);

export default MainLayout; 