import { useClickTracking } from '@/hooks/useClickTracking';
import { useSectionVisibility } from '@/hooks/useSectionVisibility';
import * as React from 'react';

const GithubIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const ContactSection: React.FC = () => {
  const { trackExternalLink } = useClickTracking();
  const sectionRef = useSectionVisibility('contact');

  const email = "hello@entazis.dev"; 
  const linkedinUrl = "https://www.linkedin.com/in/szabobence1025";
  const githubUrl = "https://github.com/entazis";
  const githubSecondaryUrl = "https://github.com/beam-bence";

  const handleEmailClick = () => {
    trackExternalLink(`mailto:${email}`, 'Email');
  };

  const handleLinkedInClick = () => {
    trackExternalLink(linkedinUrl, 'LinkedIn');
  };

  const handleGitHubPersonalClick = () => {
    trackExternalLink(githubUrl, 'GitHub Personal');
  };

  const handleGitHubCompanyClick = () => {
    trackExternalLink(githubSecondaryUrl, 'GitHub Company');
  };

  return (
    <section 
      id="contact" 
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="section-padding bg-background"
    >
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
              <li>• Scalable microservices architecture & system design</li>
              <li>• AI-assisted development workflows & productivity optimization</li>
              <li>• Monorepo architecture & migration strategies</li>
              <li>• Node.js, TypeScript, NestJS, and React development</li>
              <li>• Database optimization, Redis, PostgreSQL & microservices</li>
              <li>• Distributed team leadership & technical mentorship</li>
              <li>• IoT solutions & real-time systems with MQTT</li>
            </ul>
          </div>
          
          <a 
            href={`mailto:${email}`}
            onClick={handleEmailClick}
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
              onClick={handleLinkedInClick}
              className="inline-flex items-center justify-center w-12 h-12 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            >
              <span className="text-xl">💼</span>
            </a>
            <div className="flex flex-col items-center space-y-2">
              <a 
                href={githubUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="GitHub - Personal"
                onClick={handleGitHubPersonalClick}
                className="inline-flex items-center justify-center w-12 h-12 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
              <span className="text-xs text-muted-foreground">Personal</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <a 
                href={githubSecondaryUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="GitHub - Company"
                onClick={handleGitHubCompanyClick}
                className="inline-flex items-center justify-center w-12 h-12 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
              <span className="text-xs text-muted-foreground">Company</span>
            </div>
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
