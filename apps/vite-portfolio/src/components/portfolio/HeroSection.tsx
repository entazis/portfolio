import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-secondary/30 section-padding relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <img 
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Bence Szabó"
            className="w-40 h-40 md:w-48 md:h-48 rounded-full mx-auto mb-8 shadow-xl border-4 border-primary object-cover animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
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
            Full-Stack Developer | Problem Solver | Tech Lead
          </p>
          <p 
            className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto animate-fade-in-up"
            style={{ animationDelay: '0.8s' }}
          >
            Building scalable, high-performance systems with 7+ years of experience. Passionate about elegant solutions and mentoring.
          </p>
          <div 
            className="space-x-4 animate-fade-in-up"
            style={{ animationDelay: '1s' }}
          >
            <a 
              href="#projects"
              className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors"
            >
              View Projects
            </a>
            <a 
              href="#contact"
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
