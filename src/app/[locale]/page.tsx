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

  return (
    <>
      <HeroSection translations={translations} />
      <AboutSection translations={translations} />
      <SkillsSection translations={translations} />
      <ProjectsSection translations={translations} />
      <ExperienceSection translations={translations} />
      <ContactSection translations={translations} />
    </>
  );
};

export default Page; 