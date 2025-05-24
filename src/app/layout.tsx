import type { ReactNode } from 'react';
import '../app/globals.css';

/**
 * Root layout for the application, only provides global styles and html/body tags.
 * @param children - The page content.
 */
type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en">
    <body>
      {children}
    </body>
  </html>
);

export default RootLayout;
