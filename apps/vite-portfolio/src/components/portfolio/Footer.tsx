import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-secondary/50 py-12 text-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-primary mb-4">Bence Szabó</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Tech Lead & Full-Stack Software Engineer specializing in scalable systems, 
            performance optimization, and team leadership.
          </p>
          
          <div className="flex justify-center space-x-6 mb-6">
            <a 
              href="https://www.linkedin.com/in/szabobence1025" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              LinkedIn
            </a>
            <a 
              href="https://github.com/entazis" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              GitHub
            </a>
            <a 
              href="mailto:hello@entazis.dev"
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Email
            </a>
          </div>
          
          <div className="border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} Bence Szabó. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Built with React, TypeScript, Tailwind CSS, and ❤️
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
