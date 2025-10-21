import React, { useEffect, useState } from 'react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
    { href: 'https://log.entazis.dev', label: 'Log' },
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
                className="text-foreground hover:text-accent transition-colors font-medium"
              >
                {link.label}
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
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-foreground hover:text-accent transition-colors font-medium py-2 text-lg"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
