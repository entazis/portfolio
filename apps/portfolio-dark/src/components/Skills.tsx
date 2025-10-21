import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Database, Server, Workflow, Brain, Users } from "lucide-react";

const skillCategories = [
  {
    category: "Backend Engineering",
    icon: Server,
    skills: ["Node.js", "TypeScript", "NestJS", "Redis", "PostgreSQL", "MongoDB", "MQTT", "GraphQL"]
  },
  {
    category: "Architecture & Design",
    icon: Workflow,
    skills: ["Microservices", "Multi-Tenant Systems", "Monorepo Management", "API Design", "System Architecture"]
  },
  {
    category: "DevOps & Infrastructure",
    icon: Database,
    skills: ["CI/CD", "Docker", "GitHub Actions", "Prometheus", "AWS", "Database Sharding", "Load Balancing"]
  },
  {
    category: "Frontend Development",
    icon: Code2,
    skills: ["React", "React Native", "Angular", "TypeScript", "Next.js", "Tailwind CSS"]
  },
  {
    category: "AI & Automation",
    icon: Brain,
    skills: ["AI-Assisted Development", "MCP Servers", "Machine Learning", "Automation Workflows", "LLM Integration"]
  },
  {
    category: "Leadership & Management",
    icon: Users,
    skills: ["Team Management", "Distributed Teams", "Mentorship", "Agile Methodologies", "Technical Strategy"]
  }
];

export const Skills = () => {
  return (
    <section id="skills" className="py-20">
      <div className="container px-4 mx-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold">
              Core Competencies
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Full-stack expertise with deep specialization in scalable backend systems
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {skillCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card 
                  key={index}
                  className="shadow-card hover:shadow-glow transition-smooth hover:border-primary/50"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'both'
                  }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <div className="p-2 rounded-lg gradient-primary">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, i) => (
                        <Badge 
                          key={i} 
                          variant="outline"
                          className="text-xs hover:bg-primary/10 transition-smooth"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
