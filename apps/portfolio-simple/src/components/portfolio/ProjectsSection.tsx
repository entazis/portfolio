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
    title: "Deployment Protocol & Security Hardening",
    icon: "🔒",
    duration: "2025.09",
    description: "Unified all repositories under BeamLive GitHub organization and established robust deployment practices with comprehensive review processes.",
    technologies: ["DevOps", "Security", "CI/CD", "Release Management", "GitHub", "Policy Design"],
    keyAchievements: [
      "Designed comprehensive deployment policy with review and staging process",
      "Introduced technical and security reviews before production deployments",
      "Established clear guidelines for code quality and security standards",
      "Enhanced system security and deployment reliability through standardized processes",
    ]
  },
  {
    title: "MCP Server Integration",
    icon: "🤖",
    duration: "2025.08",
    description: "Deployed Model-Context Protocol servers to enable AI agents to interact with core services and automate development workflows.",
    technologies: ["AI Agents", "MCP", "API Integration", "Automation", "Protocol Design"],
    keyAchievements: [
      "Integrated MCP servers with existing infrastructure",
      "Experimented with autonomous agents for testing and development tasks",
      "Enabled AI-driven automation for routine development operations",
      "Created foundation for AI-assisted development workflows",
    ]
  },
  {
    title: "Dynamic Model Loading & Schema Generation",
    icon: "🔄",
    duration: "2025.07 - 2025.10",
    description: "Developed runtime schema system for Beam's dynamic data models, unifying metadata and automating schema management across all services.",
    technologies: ["JSON Schema", "Runtime Validation", "NestJS", "TypeScript", "Automation", "Redis"],
    keyAchievements: [
      "Merged all entity model types into unified schema with metadata",
      "Implemented runtime JSON Schema generation and dynamic loading",
      "Automated database index, trigger, and validation schema generation",
      "Drastically reduced schema maintenance time and improved consistency",
    ]
  },
  {
    title: "Beam Live Monorepo & DevOps Ecosystem",
    icon: "📦",
    duration: "2025.07 - 2025.09",
    description: "Consolidated 15+ repositories into single Beam Live Core Monorepo with full version history preservation and enhanced developer productivity.",
    technologies: ["Monorepo", "DevOps", "Prometheus", "AI Agents", "NestJS", "TypeScript", "GitHub Actions"],
    keyAchievements: [
      "Migrated 6,674 commits with full version history preservation",
      "Achieved 5x productivity increase through AI-assisted code migration",
      "Introduced Prometheus monitoring for comprehensive observability",
      "Simplified maintenance and unified development workflow",
    ]
  },
  {
    title: "Beam v2.2 Migration & System Stabilization",
    icon: "⚙️",
    duration: "2025.03 - 2025.08",
    description: "Directed large-scale migration project enhancing scalability, testing, and deployment consistency across all core services.",
    technologies: ["Microservices", "NestJS", "Redis", "CI/CD", "Testing Automation", "Integration Testing", "Jest"],
    keyAchievements: [
      "Oversaw multiple service migrations (connector, authenticator, notification, CUDB)",
      "Created 20+ integration tests per service improving reliability",
      "Established AI-assisted development guidelines and team stand-ups",
      "Successfully migrated all services with improved stability and coverage",
    ]
  },
  {
    title: "AI-Assisted Development & Team Management",
    icon: "👥",
    duration: "2025.02 - 2025.10",
    description: "Integrated AI tools into daily workflows, enabling automated code review and refactoring while managing distributed team of 5 developers.",
    technologies: ["Leadership", "AI Tooling", "Remote Team Management", "Process Automation", "Mentorship"],
    keyAchievements: [
      "Set up AI tools budget and rules for AI agent usage",
      "Implemented AI-driven code review processes and debugging workflows",
      "Mentored developers in AI-assisted development practices",
      "Dramatically improved team productivity and code quality",
    ]
  },
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
