"use client";

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

/**
 * Navigation bar with active link highlighting and translation keys.
 */
type NavigationProps = {
  translations: Record<string, string>;
};

const navLinks = [
  { href: '#home', labelKey: 'home' },
  { href: '#projects', labelKey: 'projects' },
  { href: '#skills', labelKey: 'skills' },
  { href: '#experience', labelKey: 'experience' },
  { href: '#about', labelKey: 'about' },
  { href: '#contact', labelKey: 'contact' },
];

const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  if (window.location.hash !== href) {
    window.location.hash = href;
  }
  const target = document.querySelector(href);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
};

const SHRINK_SCROLL_Y = 24;

const Navigation: FC<NavigationProps> = ({ translations }) => {
  // const pathname = usePathname();
  const t = (key: string) => translations[key] || key;
  const [isShrunk, setIsShrunk] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsShrunk(window.scrollY > SHRINK_SCROLL_Y);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth' });
        }, 0);
      }
    }
  }, []);

  return (
    <nav
      aria-label="Main navigation"
      className={
        `transition-all duration-300 ${isShrunk ? 'py-1' : 'py-3'}`
      }
    >
      <ul className="flex gap-4 px-6 justify-center">
        {navLinks.map(({ href, labelKey }) => (
          <li key={href}>
            <a
              href={href}
              className="px-3 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
              tabIndex={0}
              aria-label={t(labelKey)}
              onClick={e => handleNavClick(e, href)}
              onKeyDown={(e: React.KeyboardEvent<HTMLAnchorElement>) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleNavClick(e as unknown as React.MouseEvent<HTMLAnchorElement>, href);
                }
              }}
            >
              {t(labelKey)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation; 