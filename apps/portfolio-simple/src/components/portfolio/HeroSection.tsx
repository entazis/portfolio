import { useClickTracking } from '@/hooks/useClickTracking';
import { useSectionVisibility } from '@/hooks/useSectionVisibility';
import React from 'react';
import OptimizedImage from './OptimizedImage';

const HeroSection: React.FC = () => {
  const { trackClick } = useClickTracking();
  const sectionRef = useSectionVisibility('hero');

  const handleViewProjectsClick = () => {
    trackClick('View Projects', 'projects');
  };

  const handleContactMeClick = () => {
    trackClick('Contact Me', 'contact');
  };

  return (
    <section 
      id="hero" 
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="min-h-screen flex items-center justify-center bg-secondary/30 section-padding relative"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <OptimizedImage
            src="/bence-szabo-400.jpg"
            alt="Bence Szabó - Tech Lead and Full-Stack Software Engineer"
            className="w-40 h-40 md:w-48 md:h-48 rounded-full mx-auto mb-8 shadow-xl border-4 border-primary animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
            sizes={{
              webp: {
                desktop: '/bence-szabo-400.webp',
                mobile: '/bence-szabo-200.webp'
              },
              jpg: {
                desktop: '/bence-szabo-400.jpg',
                mobile: '/bence-szabo-200.jpg'
              }
            }}
            placeholder="/bence-szabo-placeholder.jpg"
            loading="eager"
            fetchPriority="high"
          />
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-4 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            Bence Szabó
          </h1>
          <p 
            className="text-xl sm:text-2xl text-foreground mb-8 font-mono animate-fade-in-up"
            style={{ animationDelay: '0.6s' }}
          >
            Tech Lead | Full-Stack Software Engineer | AI Enthusiast
          </p>
          <p 
            className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: '0.8s' }}
          >
            8+ years of experience in fast-paced environments, building scalable systems, leading distributed teams, 
            and achieving measurable productivity gains through AI-assisted development. Passionate about elegant solutions, 
            innovative problem-solving, and mentoring engineers.
          </p>
          <div 
            className="space-x-4 animate-fade-in-up"
            style={{ animationDelay: '1s' }}
          >
            <a 
              href="#projects"
              onClick={handleViewProjectsClick}
              className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors"
            >
              View Projects
            </a>
            <a 
              href="#contact"
              onClick={handleContactMeClick}
              className="inline-block px-6 py-3 border border-primary text-primary hover:bg-primary/10 rounded-md font-medium transition-colors"
            >
              Contact Me
            </a>
          </div>
        </div>
      </div>
      <a href="#about" aria-label="Scroll to about section" className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <div className="h-8 w-8 text-primary hover:text-accent transition-colors text-2xl">↓</div>
      </a>
    </section>
  );
};

export default HeroSection;
