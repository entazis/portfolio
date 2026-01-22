import React, { useEffect, useState } from 'react';

type NavLink = Readonly<{
  href: string;
  label: string;
  isExternal?: boolean;
}>;

const DEFAULT_WORK_LOG_URL: string = 'https://log.entazis.dev';

const getWorkLogUrl = (): string => {
  const configuredWorkLogUrl: unknown = import.meta.env.VITE_WORK_LOG_URL;
  if (typeof configuredWorkLogUrl !== 'string') {
    return DEFAULT_WORK_LOG_URL;
  }
  const trimmedWorkLogUrl: string = configuredWorkLogUrl.trim();
  if (trimmedWorkLogUrl.length === 0) {
    return DEFAULT_WORK_LOG_URL;
  }
  return trimmedWorkLogUrl;
};

const ExternalLinkIcon = (): JSX.Element => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-4 w-4 opacity-80"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 3h7v7" />
    <path d="M10 14L21 3" />
    <path d="M21 14v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
  </svg>
);

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const workLogUrl: string = getWorkLogUrl();
  const navLinks: ReadonlyArray<NavLink> = [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
    { href: workLogUrl, label: 'Work Log', isExternal: true },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 shadow-lg backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#" className="text-2xl font-bold text-primary hover:text-accent transition-colors">
            Bence Szabó
          </a>
          <nav className="hidden md:flex space-x-6">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                target={link.isExternal === true ? '_blank' : undefined}
                rel={link.isExternal === true ? 'noopener noreferrer' : undefined}
                aria-label={link.isExternal === true ? `${link.label} (opens in a new tab)` : link.label}
                className="text-foreground hover:text-accent transition-colors font-medium"
              >
                <span className="inline-flex items-center gap-1">
                  <span>{link.label}</span>
                  {link.isExternal === true ? <ExternalLinkIcon /> : null}
                </span>
              </a>
            ))}
          </nav>
          <div className="md:hidden">
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-xl"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 shadow-xl backdrop-blur-md">
          <nav className="flex flex-col items-center space-y-4 py-4">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                target={link.isExternal === true ? '_blank' : undefined}
                rel={link.isExternal === true ? 'noopener noreferrer' : undefined}
                aria-label={link.isExternal === true ? `${link.label} (opens in a new tab)` : link.label}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-foreground hover:text-accent transition-colors font-medium py-2 text-lg"
              >
                <span className="inline-flex items-center gap-1">
                  <span>{link.label}</span>
                  {link.isExternal === true ? <ExternalLinkIcon /> : null}
                </span>
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
