import React from 'react';

const ContactSection: React.FC = () => {
  // Replace with actual links
  const email = "bence.szabo.dev@example.com"; 
  const linkedinUrl = "https://www.linkedin.com/in/benceszabo-dev"; // Placeholder
  const githubUrl = "https://github.com/benceszabo-dev"; // Placeholder

  return (
    <section id="contact" className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="section-title">Get In Touch</h2>
        <p className="section-subtitle">
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of something great.
        </p>
        <div className="max-w-md mx-auto space-y-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <a 
            href={`mailto:${email}`}
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors"
          >
            <span className="mr-2 text-lg">📧</span> Send me an Email
          </a>
          <p className="text-muted-foreground text-sm">Or find me on:</p>
          <div className="flex justify-center space-x-4">
            <a 
              href={linkedinUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn"
              className="inline-flex items-center justify-center w-12 h-12 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            >
              <span className="text-xl">💼</span>
            </a>
            <a 
              href={githubUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="GitHub"
              className="inline-flex items-center justify-center w-12 h-12 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            >
              <span className="text-xl">🐙</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
