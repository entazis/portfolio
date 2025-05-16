import { FC } from 'react';

/**
 * ExperienceSection displays a timeline of experience.
 * @param t - Translation function
 */
type ExperienceSectionProps = {
  t: (key: string) => string;
};

const ExperienceSection: FC<ExperienceSectionProps> = ({ t }) => (
  <section className="py-16 bg-gray-50 dark:bg-gray-800" id="experience">
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4 text-primary">{t('experienceTitle')}</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">{t('experienceText')}</p>
      {/* TODO: Replace with real experience timeline */}
      <div className="flex flex-col gap-6 items-center">
        <div className="w-full max-w-xl p-4 bg-white dark:bg-gray-900 rounded shadow">
          <h3 className="font-semibold text-lg mb-1">Senior Developer at ExampleCorp</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">2022 - Present</p>
          <p className="text-gray-700 dark:text-gray-400 mt-2">Leading a team of developers to build scalable web applications.</p>
        </div>
        <div className="w-full max-w-xl p-4 bg-white dark:bg-gray-900 rounded shadow">
          <h3 className="font-semibold text-lg mb-1">Full-Stack Developer at WebStudio</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">2020 - 2022</p>
          <p className="text-gray-700 dark:text-gray-400 mt-2">Developed and maintained client projects using modern web technologies.</p>
        </div>
      </div>
    </div>
  </section>
);

export default ExperienceSection; 