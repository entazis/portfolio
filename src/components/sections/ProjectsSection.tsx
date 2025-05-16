import { FC } from 'react';

/**
 * ProjectsSection displays a list of projects.
 * @param t - Translation function
 */
type ProjectsSectionProps = {
  t: (key: string) => string;
};

const ProjectsSection: FC<ProjectsSectionProps> = ({ t }) => (
  <section className="py-16" id="projects">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4 text-primary">{t('projectsTitle')}</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">{t('projectsText')}</p>
      {/* TODO: Replace with real projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-gray-900 rounded shadow">
          <h3 className="font-semibold text-xl mb-2">Project One</h3>
          <p className="text-gray-600 dark:text-gray-300">Description of project one.</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-900 rounded shadow">
          <h3 className="font-semibold text-xl mb-2">Project Two</h3>
          <p className="text-gray-600 dark:text-gray-300">Description of project two.</p>
        </div>
      </div>
    </div>
  </section>
);

export default ProjectsSection; 