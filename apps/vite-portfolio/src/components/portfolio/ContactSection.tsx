import React from 'react';

const ContactSection: React.FC = () => {
  const email = "hello@entazis.dev"; 
  const linkedinUrl = "https://www.linkedin.com/in/szabobence1025";
  const githubUrl = "https://github.com/entazis";

  return (
    <section id="contact" className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="section-title">Let's Build Something Amazing</h2>
        <p className="section-subtitle">
          Ready to discuss your next project? I'm always excited to explore new challenges, 
          share technical insights, or collaborate on innovative solutions.
        </p>
        <div className="max-w-md mx-auto space-y-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-primary mb-3">What I Can Help With</h3>
            <ul className="text-sm text-muted-foreground space-y-1 text-left">
              <li>• Scalable system architecture & design</li>
              <li>• Node.js, TypeScript, and React development</li>
              <li>• Database optimization & microservices</li>
              <li>• Team mentoring & technical leadership</li>
              <li>• IoT solutions & real-time systems</li>
            </ul>
          </div>
          
          <a 
            href={`mailto:${email}`}
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors"
          >
            <span className="mr-2 text-lg">📧</span> Send me an Email
          </a>
          
          <p className="text-muted-foreground text-sm">Or connect with me on:</p>
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
          
          <div className="text-xs text-muted-foreground">
            <p>Based in Hungary • Available for remote collaboration</p>
            <p>Experienced with international teams & time zones</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
