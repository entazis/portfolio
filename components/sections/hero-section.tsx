"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "@/lib/motion";
import { Briefcase, ChevronDown, Github } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface GitHubProfile {
  username: string;
  url: string;
  label: string;
}

const TYPING_DELAY = Number(process.env.NEXT_PUBLIC_TYPING_DELAY) || 100;
const PAUSE_DELAY = Number(process.env.NEXT_PUBLIC_PAUSE_DELAY) || 1500;
const DELETING_DELAY = Number(process.env.NEXT_PUBLIC_DELETING_DELAY) || 50;
const GITHUB_PROFILES: GitHubProfile[] = process.env.NEXT_PUBLIC_GITHUB_PROFILES
  ? JSON.parse(process.env.NEXT_PUBLIC_GITHUB_PROFILES)
  : [
    {
      username: "entazis",
      url: "https://github.com/entazis",
      label: "Personal Projects",
    },
    {
      username: "beam-bence",
      url: "https://github.com/beam-bence",
      label: "Work Projects",
    },
  ];

export default function HeroSection() {
  const [typedText, setTypedText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const texts = ["Full-Stack Software Engineer", "7+ Years Experience", "Building Scalable Systems", "AI Enthusiast", "Problem Solver"];
  
  useEffect(() => {
    const typeText = async () => {
      // Type current text
      const currentText = texts[textIndex];
      for (let i = 0; i <= currentText.length; i++) {
        setTypedText(currentText.substring(0, i));
        await new Promise(resolve => setTimeout(resolve, TYPING_DELAY));
      }
      
      // Pause at the end
      await new Promise(resolve => setTimeout(resolve, PAUSE_DELAY));
      
      // Delete the text
      for (let i = currentText.length; i >= 0; i--) {
        setTypedText(currentText.substring(0, i));
        await new Promise(resolve => setTimeout(resolve, DELETING_DELAY));
      }
      
      // Move to next text
      setTextIndex((textIndex + 1) % texts.length);
    };
    
    typeText();
  }, [textIndex]);

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
            <h2 className="text-xl md:text-2xl font-medium text-muted-foreground">
              <span className="text-primary">{typedText}</span>
              <span className="animate-pulse">|</span>
            </h2>
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
                {GITHUB_PROFILES.map((profile) => (
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