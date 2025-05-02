"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { config } from "@/lib/config";
import { motion } from "@/lib/motion";
import { Briefcase, ChevronDown, Github } from "lucide-react";
import Link from "next/link";
import { TypingText } from "./typing-text";

interface GitHubProfile {
  username: string;
  url: string;
  label: string;
}

export default function HeroSection() {
  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center pt-16"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background z-0" />
      
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Hello, I&apos;m <span className="text-primary">Bence</span>
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="h-8"
          >
            <TypingText texts={config.heroTexts} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-muted-foreground max-w-2xl"
          >
            Expertise in building scalable systems, optimizing performance, improving system stability, and mentoring team members in fast-paced environments.
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Button asChild size="lg" className="group">
              <Link href="#projects">
                <Briefcase className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                View Projects
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg" className="group">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub Profiles
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {config.githubProfiles.map((profile: GitHubProfile) => (
                  <DropdownMenuItem key={profile.username} asChild>
                    <a
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Github className="h-4 w-4" />
                      <span>{profile.label}</span>
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>
      </div>
      
      <Link 
        href="#about" 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce"
        aria-label="Scroll to About section"
      >
        <ChevronDown className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
      </Link>
    </section>
  );
}