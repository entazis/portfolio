import { FC } from 'react';

/**
 * SkillsSection displays a list of skills and technologies.
 * @param translations - Translation object
 */
type SkillsSectionProps = {
  translations: Record<string, string>;
};

const SkillsSection: FC<SkillsSectionProps> = ({ translations }) => {
  const t = (key: string) => translations[key] || key;
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800" id="skills">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-primary">{t('skillsTitle')}</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">{t('skillsText')}</p>
        {/* TODO: Replace with real skills */}
        <div className="flex flex-wrap justify-center gap-3">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">TypeScript</span>
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">React</span>
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">Next.js</span>
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">NestJS</span>
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">Tailwind CSS</span>
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">Node.js</span>
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">PostgreSQL</span>
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">Docker</span>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection; 