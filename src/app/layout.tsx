import type { ReactNode } from 'react';
import '../app/globals.css';
import MainLayout from '../components/layout/MainLayout';

/**
 * Root layout for the application, wraps all pages with MainLayout.
 * @param children - The page content.
 */
type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en">
    <body>
      <MainLayout>{children}</MainLayout>
    </body>
  </html>
);

export default RootLayout;
