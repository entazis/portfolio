import React from 'react';

interface Project {
  title: string;
  icon: string;
  duration: string;
  description: string;
  technologies: string[];
  keyAchievements: string[];
  githubUrl?: string;
}

const projects: Project[] = [
  {
    title: "Nano-Service Engine & Editor",
    icon: "🏗️",
    duration: "2022.08 - 2023.02",
    description: "Developed a comprehensive nano-service engine enabling downtime-free feature creation with a visual editor for workflow management.",
    technologies: ["TypeScript", "NestJS", "Redis", "MQTT", "JSON Schema", "React"],
    keyAchievements: [
      "Enabled workflow development without traditional IDE complexity",
      "Created TypeScript support in workflow IDE",
      "Managed thousands of active workflows with performance optimization",
      "Separated core backend functions from business logic",
    ]
  },
  {
    title: "Live 2.2 - System Restructuring",
    icon: "⚡",
    duration: "2022.11 - 2024.10",
    description: "Comprehensive restructuring and enhancement of software platform transitioning from Postgres to Redis for improved performance.",
    technologies: ["Redis", "JSON Schema", "Multi-tenancy", "React", "TypeScript"],
    keyAchievements: [
      "Transitioned from Postgres to Redis for enhanced speed",
      "Developed multi-tenant architecture for per-customer functions",
      "Created development tools for custom feature functions",
      "Managed 25-30 repositories with coordinated refactoring",
    ]
  },
  {
    title: "Location Service & Geofencing Evolution",
    icon: "🗺️",
    duration: "2022.04 - 2024.03",
    description: "Evolved from basic location storage to real-time geofencing with advanced spatial queries and dynamic geofence management.",
    technologies: ["Redis", "Tile38", "GeoJSON", "RediSearch", "MongoDB", "MQTT"],
    keyAchievements: [
      "Implemented real-time processing with device-to-service communication",
      "Added polygon support and advanced geospatial queries",
      "Integrated Tile38 for efficient dynamic geofences",
      "Eliminated legacy dependencies and redundant data handling",
    ]
  },
  {
    title: "Horizontal Scaling Architecture",
    icon: "🔄",
    duration: "2023.11 - 2024.01",
    description: "Enhanced service scalability through horizontal scaling using MQTT load balancing and message queues.",
    technologies: ["MQTT v5", "Node.js", "Message Queues", "Load Balancing"],
    keyAchievements: [
      "Implemented MQTT shared subscriptions for load balancing",
      "Simplified codebase significantly with direct MQTT approach",
      "Used round-robin algorithm for efficient load distribution",
      "Replaced separate controller/service architecture",
    ]
  },
  {
    title: "CI/CD and Testing Framework",
    icon: "🔧",
    duration: "2024.03 - 2024.10",
    description: "Established comprehensive CI/CD pipeline with automated testing framework for integration tests.",
    technologies: ["GitHub Actions", "Jest", "Redis", "MQTT", "Integration Testing"],
    keyAchievements: [
      "Created proof of concept for complete CI/CD flow",
      "Automated Redis and MQTT setup in GitHub workflows",
      "Developed framework for MQTT request/response testing",
      "Shifted from manual to automated testing practices",
    ]
  },
  {
    title: "Customer Churn Prediction ML System",
    icon: "🤖",
    duration: "2017.06 - 2018.01",
    description: "Built predictive machine learning system to identify users at risk of churning with automated retention emails.",
    technologies: ["R", "Machine Learning", "Node.js", "MongoDB", "AWS", "Neural Networks"],
    keyAchievements: [
      "Achieved two-thirds accuracy in churn prediction",
      "Significantly outperformed random selection",
      "Automated retention email system via Intercom",
      "Explored neural networks for enhanced accuracy",
    ],
    githubUrl: "https://github.com/entazis/churnacle-node"
  },
];

const ProjectsSection: React.FC = () => {
  return (
    <section id="projects" className="section-padding bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Key Projects</h2>
        <p className="section-subtitle">
          Highlighting significant projects that showcase technical expertise and innovation in scalable system design.
        </p>
        <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={project.title} 
              className="bg-card p-6 rounded-lg shadow-lg flex flex-col hover:shadow-xl transition-shadow duration-300 animate-fade-in-up"
              style={{animationDelay: `${0.2 + index * 0.1}s`}}
            >
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3 flex-shrink-0">{project.icon}</span>
                <div>
                  <h3 className="text-xl font-semibold text-primary">{project.title}</h3>
                  <p className="text-sm text-accent font-mono">{project.duration}</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-4 flex-grow">{project.description}</p>
              
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-foreground mb-2">Key Achievements:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs">
                  {project.keyAchievements.slice(0, 3).map((ach, i) => <li key={i}>{ach}</li>)}
                  {project.keyAchievements.length > 3 && <li>And more...</li>}
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-foreground mb-2">Technologies:</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map(tech => (
                    <span key={tech} className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded">{tech}</span>
                  ))}
                </div>
              </div>

              {project.githubUrl && (
                <div className="mt-auto">
                  <a 
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-accent hover:text-primary transition-colors"
                  >
                    <span className="mr-1">🔗</span> View on GitHub
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-12 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
          <p className="text-muted-foreground mb-4">
            These represent key highlights from my professional journey. Each project involved complex technical challenges 
            and delivered measurable business impact.
          </p>
          <p className="text-sm text-muted-foreground">
            Want to see more projects or discuss technical details? Feel free to reach out!
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
