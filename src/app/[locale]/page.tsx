import AboutSection from '../../components/sections/AboutSection';
import ContactSection from '../../components/sections/ContactSection';
import ExperienceSection from '../../components/sections/ExperienceSection';
import HeroSection from '../../components/sections/HeroSection';
import ProjectsSection from '../../components/sections/ProjectsSection';
import SkillsSection from '../../components/sections/SkillsSection';
import { getTranslation } from '../../lib/getTranslation';

/**
 * Home page for the locale route. Renders all main sections with translations.
 * @param params - Route params including locale
 */
type PageProps = {
  params: { locale: string };
};

const Page = async ({ params }: PageProps) => {
  const { locale } = params;
  const translations = await getTranslation(locale, 'common');
  const t = (key: string) => translations[key] || key;

  return (
    <>
      <HeroSection t={t} />
      <AboutSection t={t} />
      <SkillsSection t={t} />
      <ProjectsSection t={t} />
      <ExperienceSection t={t} />
      <ContactSection t={t} />
    </>
  );
};

export default Page; 