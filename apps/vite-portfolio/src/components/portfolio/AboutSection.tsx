
import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">About Me</h2>
        <p className="section-subtitle">
          My journey in tech, driven by curiosity and a passion for impact.
        </p>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop"
              alt="Coding environment"
              className="rounded-lg shadow-xl w-full h-auto object-cover aspect-video"
            />
          </div>
          <div className="space-y-6 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <div>
              <h3 className="text-2xl font-semibold text-primary mb-3">Who I Am</h3>
              <p className="text-muted-foreground leading-relaxed">
                Hello! I'm Bence, a Full-Stack Software Engineer with a Master's from Budapest University of Technology and Economics. My career has spanned roles from Data Analyst to Tech Lead, always fueled by a desire to solve complex problems and build efficient, scalable systems. I thrive on turning innovative ideas into reality and enjoy mentoring others to grow their skills.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-primary mb-3">My Approach</h3>
              <p className="text-muted-foreground leading-relaxed">
                I believe in <strong className="text-foreground">Optimization-Driven Development</strong>, focusing on performance from day one. My background in data analysis ensures <strong className="text-foreground">Data-Informed Solutions</strong>. I apply <strong className="text-foreground">Architectural Thinking</strong> to design robust and scalable systems that stand the test of time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
