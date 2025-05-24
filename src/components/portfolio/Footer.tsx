
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-secondary/50 py-8 text-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} Bence Szabó. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Built with React, Tailwind CSS, and ❤️.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
