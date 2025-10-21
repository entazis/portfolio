import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, TrendingUp, Award } from "lucide-react";

const projects = [
  {
    title: "Dynamic Model Loading & Schema Generation",
    period: "2025.07 - 2025.10",
    description: "Developed runtime schema system for Beam's dynamic data models, unifying metadata and automating schema management.",
    highlights: [
      "Merged all entity model types into unified schema with metadata",
      "Implemented runtime JSON Schema generation and dynamic loading",
      "Automated database index, trigger, and validation schema generation"
    ],
    impact: "Drastically reduced schema maintenance time and improved consistency across services",
    technologies: ["JSON Schema", "NestJS", "TypeScript", "Redis", "Automation"]
  },
  {
    title: "Beam Live Monorepo & AI Integration",
    period: "2025.07 - 2025.09",
    description: "Consolidated 15+ repositories into single monorepo with AI-enhanced development workflows.",
    highlights: [
      "Migrated 6,674 commits with full version history preserved",
      "Achieved 5x productivity increase through systematic AI agent usage",
      "Introduced Prometheus monitoring for system observability",
      "Established MCP server integration for AI-assisted development"
    ],
    impact: "Simplified maintenance and dramatically improved developer productivity through consolidated codebase",
    technologies: ["Monorepo", "AI Agents", "MCP", "Prometheus", "DevOps"]
  },
  {
    title: "Beam v2.2 Migration & System Stabilization",
    period: "2025.03 - 2025.08",
    description: "Large-scale migration enhancing scalability, testing, and deployment consistency across all services.",
    highlights: [
      "Oversaw multiple service migrations (connector, authenticator, notification, CUDB)",
      "Created 20+ integration tests per service improving reliability",
      "Established deployment protocols and security review policies",
      "Implemented AI-assisted development guidelines"
    ],
    impact: "Successfully migrated all core services with improved stability and test coverage",
    technologies: ["Microservices", "NestJS", "Redis", "Jest", "Integration Testing"]
  },
  {
    title: "Location Service & Geofencing Evolution",
    period: "2022.04 - 2024.03",
    description: "Built comprehensive real-time location tracking and geofencing system for IoT devices.",
    highlights: [
      "Integrated Tile38 for real-time geofencing and MQTT-based triggers",
      "Implemented RediSearch for efficient JSON-based queries with polygon support",
      "Enabled dynamic geofences like real-time bus tracking",
      "Optimized architecture reducing overhead and improving scalability"
    ],
    impact: "Transformed location service into robust real-time solution supporting complex IoT ecosystems",
    technologies: ["Tile38", "Redis", "MQTT", "GeoJSON", "Real-time Processing"]
  },
  {
    title: "Nano-Service Engine & Editor",
    period: "2022.08 - 2023.02",
    description: "Revolutionary architecture enabling dynamic workflow creation and deployment without downtime.",
    highlights: [
      "Developed web editor and actionflow logic for managing business logic",
      "Introduced TypeScript support in workflow IDE",
      "Enabled management of thousands of active workflows simultaneously",
      "Separated core backend from business logic for better maintainability"
    ],
    impact: "Enabled rapid feature deployment and customization for multi-tenant B2B2C platform",
    technologies: ["Microservices", "NestJS", "Redis", "TypeScript", "Workflow Engine"]
  },
  {
    title: "Scalable Multi-Tenant Architecture",
    period: "2021.09 - 2022.09",
    description: "Transformed architecture from per-customer repositories to unified multi-tenant system.",
    highlights: [
      "Eliminated need for separate repositories per customer",
      "Dramatically reduced development and deployment complexity",
      "Enabled efficient resource utilization and faster feature rollout",
      "Maintained security isolation between tenants"
    ],
    impact: "Made sustainable business growth possible by eliminating exponential scaling complexity",
    technologies: ["Multi-Tenant", "NestJS", "PostgreSQL", "Architecture Design"]
  }
];

export const Projects = () => {
  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold">
              Featured Projects
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transformative technical initiatives delivering measurable business impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {projects.map((project, index) => (
              <Card 
                key={index}
                className="shadow-card hover:shadow-glow transition-smooth group"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'both'
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <CardTitle className="text-xl group-hover:text-primary transition-smooth">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-sm">
                        <Rocket className="h-4 w-4" />
                        {project.period}
                      </CardDescription>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    {project.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                      <TrendingUp className="h-4 w-4" />
                      Key Highlights
                    </div>
                    <ul className="space-y-1.5">
                      {project.highlights.map((highlight, i) => (
                        <li key={i} className="flex gap-2 text-sm">
                          <span className="text-primary mt-0.5">•</span>
                          <span className="text-muted-foreground">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-accent">
                      <Award className="h-4 w-4" />
                      Impact
                    </div>
                    <p className="text-sm text-muted-foreground italic">
                      {project.impact}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.technologies.map((tech, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
