"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "@/lib/motion";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

// Define skill categories and their items
const skillCategories = {
  frontend: [
    { name: "React", level: 90 },
    { name: "Next.js", level: 85 },
    { name: "TypeScript", level: 85 },
    { name: "CSS/Tailwind", level: 95 },
    { name: "Redux", level: 80 },
    { name: "JavaScript", level: 95 },
  ],
  backend: [
    { name: "Node.js", level: 85 },
    { name: "Express", level: 80 },
    { name: "Python", level: 75 },
    { name: "PostgreSQL", level: 80 },
    { name: "MongoDB", level: 75 },
    { name: "GraphQL", level: 70 },
  ],
  tools: [
    { name: "Git/GitHub", level: 90 },
    { name: "Docker", level: 75 },
    { name: "CI/CD", level: 80 },
    { name: "AWS", level: 70 },
    { name: "Jest", level: 85 },
    { name: "Webpack", level: 75 },
  ],
};

const technologies = [
  "React", "Next.js", "TypeScript", "Node.js", "Express", 
  "Tailwind CSS", "Redux", "GraphQL", "PostgreSQL", "MongoDB",
  "Jest", "React Testing Library", "Cypress", "Git", "GitHub",
  "Docker", "AWS", "Vercel", "Netlify", "Figma",
  "Responsive Design", "Progressive Web Apps", "Accessibility",
];

export function SkillsSection() {
  const { theme } = useTheme();
  const { t } = useTranslation('common');
  
  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-2">{t('skills.title')}</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('skills.subtitle')}
          </p>
        </motion.div>

        <Tabs defaultValue="frontend" className="w-full max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="frontend">{t('skills.frontend')}</TabsTrigger>
              <TabsTrigger value="backend">{t('skills.backend')}</TabsTrigger>
              <TabsTrigger value="tools">{t('skills.tools')}</TabsTrigger>
            </TabsList>
          </div>
          
          {Object.entries(skillCategories).map(([category, skills]) => (
            <TabsContent key={category} value={category} className="space-y-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6"
              >
                {skills.map((skill, index) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-muted-foreground">{skill.level}%</span>
                    </div>
                    <Progress 
                      value={skill.level} 
                      className="h-2"
                    />
                  </div>
                ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16"
        >
          <h3 className="text-xl font-semibold text-center mb-6">
            {t('skills.technologies')}
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {technologies.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}