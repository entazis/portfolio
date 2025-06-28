import React from 'react';

interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  description: string[];
}

const experiences: ExperienceItem[] = [
  {
    role: 'Tech Lead',
    company: 'beamLive',
    duration: 'January 2025 - Present',
    description: [
      'Leading development teams and defining technical strategy.',
      'Mentoring engineers and fostering a culture of innovation.',
    ],
  },
  {
    role: 'Senior Software Engineer',
    company: 'beamLive',
    duration: 'February 2022 - January 2025',
    description: [
      'Designed and built critical APIs using Node.js and TypeScript.',
      'Developed a nano-service engine and visual editor.',
      'Led migration from PostgreSQL/HTTP to Redis/MQTT for core services.',
    ],
  },
  {
    role: 'Full Stack Developer & Product Owner',
    company: 'beamLive',
    duration: 'August 2020 - January 2022',
    description: [
      'Architected and shipped key features for the administrative platform.',
      'Initiated system redesign for improved performance and scalability.',
    ],
  },
];

const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Career Journey</h2>
        <p className="section-subtitle">
          Tracing my path through impactful roles and challenging projects.
        </p>
        <div className="relative max-w-3xl mx-auto">
          {/* Timeline line */}
          <div className="absolute top-0 h-full w-1 bg-primary/20 left-5 md:left-1/2 md:-translate-x-1/2"></div>
          
          {experiences.map((exp, index) => (
            <div 
              key={index} 
              className="mb-12 flex items-start animate-fade-in-up"
              style={{animationDelay: `${0.2 + index * 0.15}s`}}
            >
              {/* Icon and Connector for large screens */}
              <div className="hidden md:flex flex-col items-center mr-8 relative z-10">
                <div className="bg-accent text-accent-foreground rounded-full p-3 shadow-md flex items-center justify-center">
                  <span className="text-lg">💼</span>
                </div>
              </div>

              {/* Icon for small screens */}
               <div className="md:hidden flex flex-col items-center mr-4 relative z-10 mt-1">
                <div className="bg-accent text-accent-foreground rounded-full p-2 shadow-md flex items-center justify-center">
                  <span className="text-sm">💼</span>
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-lg w-full md:w-auto md:flex-1 md:ml-0 ml-4 border-l-4 border-accent md:border-none">
                <h3 className="text-xl font-semibold text-primary mb-1">{exp.role}</h3>
                <p className="text-md font-medium text-muted-foreground mb-1">{exp.company}</p>
                <p className="text-sm text-accent font-mono mb-3">{exp.duration}</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  {exp.description.map((desc, i) => (
                    <li key={i}>{desc}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
