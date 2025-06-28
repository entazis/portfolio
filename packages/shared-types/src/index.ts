// Shared types across portfolio versions
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  keyAchievements?: string[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string[];
  technologies?: string[];
}

export interface Skill {
  name: string;
  level: 'Master' | 'Expert' | 'Advanced' | 'Intermediate' | 'Beginner';
  category: string;
}

export interface ContactInfo {
  email: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export type PortfolioVersion = 'nextjs' | 'vite' | 'classic';
