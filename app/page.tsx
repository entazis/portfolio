import { AboutSection } from '@/components/sections/about-section';
import { ContactSection } from '@/components/sections/contact-section';
import { ExperienceSection } from '@/components/sections/experience-section';
import HeroSection from '@/components/sections/hero-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { SkillsSection } from '@/components/sections/skills-section';

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />
    </div>
  );
}