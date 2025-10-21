import React from 'react';
import OptimizedImage from './OptimizedImage';

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
            <OptimizedImage
              src="/information_technology_2-800.jpg"
              alt="Information Technology - Modern workspace with coding and development tools"
              className="rounded-lg shadow-xl w-full h-auto aspect-video"
              sizes={{
                webp: {
                  desktop: '/information_technology_2-800.webp',
                  mobile: '/information_technology_2-400.webp'
                },
                jpg: {
                  desktop: '/information_technology_2-800.jpg',
                  mobile: '/information_technology_2-400.jpg'
                }
              }}
              loading="lazy"
              fetchPriority="low"
            />
          </div>
          <div className="space-y-6 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <div>
              <h3 className="text-2xl font-semibold text-primary mb-3">Who I Am</h3>
              <p className="text-muted-foreground leading-relaxed">
                Tech Lead with 7+ years driving technical innovation in high-growth startups. I hold a Master's degree from 
                Budapest University of Technology and Economics, specializing in Computer-based Systems with a focus on Smart City technologies. 
                Recently, I led the consolidation of 15+ repositories into a unified monorepo at BeamLive (preserving 6,674+ commits), 
                and achieved 5x productivity gains through systematic AI-assisted development workflows. My career has evolved from 
                Data Scientist to Tech Lead, always fueled by a desire to solve complex problems and build maintainable, scalable systems.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-primary mb-3">My Expertise</h3>
              <p className="text-muted-foreground leading-relaxed">
                I specialize in building <strong className="text-foreground">scalable microservices architectures</strong> and 
                <strong className="text-foreground"> leading distributed teams</strong>. Currently managing a team of 5 engineers 
                across multiple time zones while integrating AI-assisted development workflows into daily operations. 
                My experience spans from designing nano-service architectures to implementing database replication, sharding, 
                and monorepo management. I'm passionate about <strong className="text-foreground">mentoring engineers</strong>, 
                establishing robust deployment protocols, and achieving measurable productivity improvements through innovative tooling.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-primary mb-3">Beyond Code</h3>
              <p className="text-muted-foreground leading-relaxed">
                I'm passionate about <strong className="text-foreground">AI and machine learning</strong>, which has come 
                full circle from my early data science work to now implementing AI-assisted development workflows that deliver 
                measurable productivity gains. I integrate MCP servers and AI agents into development processes, exploring how 
                autonomous systems can enhance engineering productivity. I also have extensive experience in 
                <strong className="text-foreground"> organizational development</strong> through my volunteer work, 
                including serving as CEO of Invisible University and training others in nonviolent communication and leadership.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
