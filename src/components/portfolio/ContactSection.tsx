
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Linkedin, Github } from 'lucide-react';

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
          <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
            <a href={`mailto:${email}`}>
              <Mail className="mr-2 h-5 w-5" /> Send me an Email
            </a>
          </Button>
          <p className="text-muted-foreground text-sm">Or find me on:</p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" size="icon" asChild className="hover:text-accent hover:border-accent">
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild className="hover:text-accent hover:border-accent">
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
