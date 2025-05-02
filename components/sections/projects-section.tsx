"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projectsData } from "@/lib/data";
import { motion } from "@/lib/motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";

// Define Project type if not exported from projectsData
interface Project {
  id: number;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  category: string;
  technologies: string[];
  features: string[];
  demoUrl?: string | null;
  githubUrl?: string | null;
}

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const { t } = useTranslation('common');

  const filteredProjects: Project[] = filter === "all" 
    ? projectsData 
    : projectsData.filter((project: Project) => project.category === filter);

  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-2">{t('projects.title')}</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('projects.subtitle')}
          </p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">{t('projects.all')}</TabsTrigger>
              <TabsTrigger value="web">{t('projects.web')}</TabsTrigger>
              <TabsTrigger value="mobile">{t('projects.mobile')}</TabsTrigger>
              <TabsTrigger value="backend">{t('projects.backend')}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedProject(project)}>
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.shortDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech: string) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="outline">+{project.technologies.length - 3}</Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button size="sm" variant="ghost">{t('projects.viewDetails')}</Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {selectedProject && (
          <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
            <DialogContent className="max-w-3xl h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedProject.title}</DialogTitle>
                <DialogDescription>{selectedProject.shortDescription}</DialogDescription>
              </DialogHeader>
              
              <div className="relative h-64 md:h-80 w-full mb-4 rounded-md overflow-hidden">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium mb-2">{t('projects.overview')}</h4>
                  <p className="text-muted-foreground">{selectedProject.description}</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-2">{t('projects.technologiesUsed')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech: string) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-2">{t('projects.keyFeatures')}</h4>
                  <ul className="list-disc pl-5 text-muted-foreground">
                    {selectedProject.features.map((feature: string, i: number) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-3 pt-2">
                  {selectedProject.demoUrl && (
                    <Button asChild>
                      <a href={selectedProject.demoUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {t('projects.liveDemo')}
                      </a>
                    </Button>
                  )}
                  {selectedProject.githubUrl && (
                    <Button variant="outline" asChild>
                      <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        {t('projects.viewCode')}
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </section>
  );
}