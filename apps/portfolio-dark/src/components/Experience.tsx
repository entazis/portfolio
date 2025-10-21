import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Calendar } from "lucide-react";

const experiences = [
  {
    company: "BeamLive",
    role: "Tech Lead",
    period: "January 2025 - Present",
    description: "Leading technical architecture and team management for B2B2C IoT platform serving multiple enterprise clients.",
    achievements: [
      "Led migration to Beam v2.2 and consolidated 15+ repositories into unified monorepo architecture (6,600+ commits preserved)",
      "Achieved 5x productivity increase through systematic AI-assisted development workflows and MCP server integration",
      "Established deployment protocols with mandatory security reviews, improving production reliability",
      "Implemented dynamic model loading system with automated JSON schema generation and database validation",
      "Managed distributed tech team of 5 engineers across multiple time zones"
    ],
    technologies: ["NestJS", "TypeScript", "Redis", "Microservices", "AI Agents", "MCP", "Prometheus"]
  },
  {
    company: "BeamLive",
    role: "Senior Software Engineer",
    period: "February 2022 - December 2024",
    description: "Designed and implemented scalable backend solutions for IoT platform with focus on performance optimization.",
    achievements: [
      "Developed nano-service engine enabling downtime-free feature deployment for multi-tenant B2B2C model",
      "Led migration from PostgreSQL to Redis and HTTP to MQTT, resulting in 40% faster response times",
      "Implemented comprehensive testing framework with Jest, increasing code coverage by 70%",
      "Built real-time location service with geofencing capabilities using Tile38 for IoT device tracking",
      "Created configurable admin platform reducing maintenance time by 60%"
    ],
    technologies: ["TypeScript", "NestJS", "Redis", "Jest", "Tile38", "MQTT", "Multi-Tenant Management"]
  },
  {
    company: "BeamLive",
    role: "Full Stack Software Developer & Product Owner",
    period: "August 2020 - January 2022",
    description: "Led feature development and system redesign initiatives for administrative platform.",
    achievements: [
      "Architected and shipped scalable features for administrative platform, improving system performance",
      "Initiated comprehensive system redesign, enhancing performance and scalability",
      "Improved code quality by 40% through core component extraction and modularization",
      "Collaborated directly with CEO on customer feature requests and product roadmap"
    ],
    technologies: ["NestJS", "TypeScript", "MongoDB", "PostgreSQL", "Redis", "Angular", "React"]
  },
  {
    company: "CodeBerry Programming School",
    role: "Software Developer",
    period: "October 2018 - August 2020",
    description: "Full-stack development and data analytics for online education platform serving thousands of students.",
    achievements: [
      "Rebuilt landing pages and payment flow, transitioning to optimized single-page application",
      "Implemented gamification features increasing user engagement and retention",
      "Developed automated email trigger system for student engagement",
      "Built comprehensive analytics infrastructure with Google Analytics and Data Studio"
    ],
    technologies: ["Node.js", "MongoDB", "GraphQL", "Docker", "React.js", "Google Analytics"]
  },
];

export const Experience = () => {
  return (
    <section id="experience" className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold">
              Professional Experience
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Over 7 years of driving technical innovation in high-growth startups
            </p>
          </div>

          <div className="space-y-6 mt-12">
            {experiences.map((exp, index) => (
              <Card 
                key={index} 
                className="shadow-card hover:shadow-glow transition-smooth border-l-4 border-l-primary"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'both'
                }}
              >
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        {exp.role}
                      </CardTitle>
                      <CardDescription className="text-lg font-semibold text-foreground">
                        {exp.company}
                      </CardDescription>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {exp.period}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-4">{exp.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-primary">
                      Key Achievements
                    </h4>
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="text-primary mt-1">▸</span>
                          <span className="text-muted-foreground">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-primary">
                      Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
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
