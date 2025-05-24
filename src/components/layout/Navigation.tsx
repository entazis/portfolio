"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

/**
 * Navigation bar with active link highlighting and translation keys.
 */
type NavigationProps = {
  translations: Record<string, string>;
};

const navLinks = [
  { href: '/', labelKey: 'home' },
  { href: '/projects', labelKey: 'projects' },
  { href: '/experience', labelKey: 'experience' },
  { href: '/about', labelKey: 'about' },
  { href: '/contact', labelKey: 'contact' },
];

const Navigation: FC<NavigationProps> = ({ translations }) => {
  const pathname = usePathname();
  const t = (key: string) => translations[key] || key;
  return (
    <nav aria-label="Main navigation">
      <ul className="flex gap-4">
        {navLinks.map(({ href, labelKey }) => (
          <li key={href}>
            <Link
              href={href}
              className={`px-3 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
                ${pathname === href ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              aria-current={pathname === href ? 'page' : undefined}
            >
              {t(labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation; 