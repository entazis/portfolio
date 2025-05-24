
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

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
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <a href="#projects">View Projects</a>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-primary text-primary hover:bg-primary/10">
              <a href="#contact">Contact Me</a>
            </Button>
          </div>
        </div>
      </div>
      <a href="#about" aria-label="Scroll to about section" className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <ArrowDown className="h-8 w-8 text-primary hover:text-accent transition-colors" />
      </a>
    </section>
  );
};

export default HeroSection;
