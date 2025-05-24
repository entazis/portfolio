
import React from 'react';
import { Button } from '@/components/ui/button';
import { Layers, Zap, Shuffle, CreditCard, TestTube } from 'lucide-react';

interface Project {
  title: string;
  icon: React.ElementType;
  description: string;
  technologies: string[];
  keyAchievements: string[];
}

const projects: Project[] = [
  {
    title: "Nanoservices Engine & Editor",
    icon: Layers,
    description: "Designed and built a nanoservice engine enabling downtime-free feature creation.",
    technologies: ["Node.js", "TypeScript", "Redis", "MQTT", "Docker"],
    keyAchievements: [
      "Reduced system downtime by 50%",
      "Enabled feature creation without service interruption",
      "Created visual editor for service configuration",
    ]
  },
  {
    title: "Redis Clustering & Performance Optimization",
    icon: Zap,
    description: "Led migration from PostgreSQL to Redis for high-traffic services.",
    technologies: ["Redis", "Node.js", "TypeScript", "Performance Optimization"],
     keyAchievements: [
      "Improved response time by 40%",
      "Enhanced fault tolerance and system resilience",
      "Implemented efficient caching strategies",
    ]
  },
  {
    title: "MQTT Load Balancing System",
    icon: Shuffle,
    description: "Developed sophisticated MQTT load balancing system.",
    technologies: ["MQTT", "Node.js", "TypeScript", "Load Balancing"],
    keyAchievements: [
      "Reduced codebase by 30%",
      "Improved deployment speed by 40%",
      "Enhanced multi-tenancy support",
    ]
  },
];


const ProjectsSection: React.FC = () => {
  return (
    <section id="projects" className="section-padding bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Highlighted Projects</h2>
        <p className="section-subtitle">
          A selection of projects that showcase my problem-solving skills and technical expertise. More details coming soon!
        </p>
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={project.title} 
              className="bg-card p-6 rounded-lg shadow-lg flex flex-col hover:shadow-xl transition-shadow duration-300 animate-fade-in-up"
              style={{animationDelay: `${0.2 + index * 0.1}s`}}
            >
              <div className="flex items-center mb-4">
                <project.icon className="h-8 w-8 text-accent mr-3 flex-shrink-0" />
                <h3 className="text-xl font-semibold text-primary">{project.title}</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4 flex-grow">{project.description}</p>
              
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-foreground mb-1">Key Achievements:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs">
                  {project.keyAchievements.slice(0,2).map((ach, i) => <li key={i}>{ach}</li>)}
                   {project.keyAchievements.length > 2 && <li>And more...</li>}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Technologies:</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map(tech => (
                    <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                  ))}
                </div>
              </div>
              {/* <Button variant="link" className="mt-auto self-start px-0 text-accent">Learn More (Soon)</Button> */}
            </div>
          ))}
        </div>
        <div className="text-center mt-12 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
          <p className="text-muted-foreground">More projects and detailed case studies will be added soon.</p>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
