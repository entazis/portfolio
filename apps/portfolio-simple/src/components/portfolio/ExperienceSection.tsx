import React from 'react';

interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  description: string[];
  icon: string;
}

const experiences: ExperienceItem[] = [
  {
    role: 'Tech Lead',
    company: 'BeamLive',
    duration: 'January 2025 - Present',
    description: [
      'Leading technical architecture and distributed team of 5 engineers across multiple time zones, conducting daily stand-ups and weekly technical meetings.',
      'Led migration to Beam v2.2 and consolidated 15+ repositories into unified monorepo architecture, preserving 6,674+ commits with full version history.',
      'Achieved 5x productivity increase through systematic AI-assisted development workflows and MCP server integration for automated code review and refactoring.',
      'Established deployment protocols with mandatory security reviews, improving production reliability and system security.',
      'Implemented dynamic model loading system with automated JSON schema generation and database validation, drastically reducing schema maintenance time.',
      'Introduced Prometheus monitoring for comprehensive system observability across all services.',
      'Built collaborative team culture by implementing camera-on policy during remote meetings to strengthen non-verbal communication and trust across time zones.',
      'Mentored senior developers on refactoring practices and design patterns, addressing recurring code issues and promoting continuous learning through reading and tutorials.',
      'Advocated for team interests with management during organizational challenges, ensuring developers felt supported through difficult periods.',
    ],
    icon: '🎯',
  },
  {
    role: 'Senior Software Engineer',
    company: 'BeamLive',
    duration: 'February 2022 - December 2024',
    description: [
      'Designed and built APIs using Node.js and TypeScript, delivering low-latency solutions with 40% faster response times.',
      'Developed a nano-service engine and visual editor enabling downtime-free feature creation.',
      'Led migration from PostgreSQL/HTTP to Redis/MQTT, optimizing performance for high-scale environments.',
      'Implemented database replication/sharding and created testing framework enhancing system stability.',
    ],
    icon: '⚡',
  },
  {
    role: 'Full Stack Developer & Product Owner',
    company: 'BeamLive',
    duration: 'August 2020 - January 2022',
    description: [
      'Architected and shipped new features for the administrative platform, improving scalability and performance.',
      'Initiated system redesign that boosted performance and scalability, ensuring adaptability to future requirements.',
      'Improved code quality by 40% through core component extraction, simplifying the codebase.',
    ],
    icon: '🔧',
  },
  {
    role: 'Software Developer',
    company: 'CodeBerry Programming School',
    duration: 'October 2018 - August 2020',
    description: [
      'Created and enhanced web-based platforms, ensuring seamless user experience.',
      'Developed gamification features including badge system to increase user interaction and retention.',
      'Built data extraction tools and web scrapers to support operational needs.',
      'Worked as Data Analyst, creating dashboards and performing statistical analyses of ad campaigns.',
    ],
    icon: '💻',
  },
  {
    role: 'Data Scientist Intern & ML Engineer',
    company: 'CodeBerry Programming School',
    duration: 'June 2017 - June 2018',
    description: [
      'Developed predictive machine learning models for customer churn prediction.',
      'Conducted correlation analysis to uncover meaningful relationships within data.',
      'Built automated systems for customer retention using Node.js and Intercom integration.',
    ],
    icon: '🤖',
  },
];

const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Career Journey</h2>
        <p className="section-subtitle">
          Tracing my path through impactful roles and challenging projects in fast-paced environments.
        </p>
        <div className="relative max-w-4xl mx-auto">
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
                <div className="bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg border-2 border-white/20 flex items-center justify-center">
                  <span className="text-lg">{exp.icon}</span>
                </div>
              </div>

              {/* Icon for small screens */}
               <div className="md:hidden flex flex-col items-center mr-4 relative z-10 mt-1">
                <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg border-2 border-white/20 flex items-center justify-center">
                  <span className="text-sm">{exp.icon}</span>
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
