import { FC, ReactNode } from 'react';

/**
 * MainLayout component wraps the page with header and footer.
 * @param children - The content to render inside the layout.
 */
type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout: FC<MainLayoutProps> = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-background text-foreground">
    <header className="w-full py-4 px-6 bg-white shadow-md dark:bg-gray-900">
      <div className="container mx-auto flex justify-between items-center">
        <span className="font-bold text-xl">Bence Szabó</span>
        {/* TODO: Add navigation and language switcher here */}
      </div>
    </header>
    <main className="flex-1 container mx-auto px-6 py-8">{children}</main>
    <footer className="w-full py-4 px-6 bg-gray-100 text-center text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400">
      &copy; {new Date().getFullYear()} Bence Szabó. All rights reserved.
    </footer>
  </div>
);

export default MainLayout; 