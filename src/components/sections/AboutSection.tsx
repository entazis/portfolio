import { FC } from 'react';

/**
 * AboutSection displays information about the developer.
 * @param t - Translation function
 */
type AboutSectionProps = {
  t: (key: string) => string;
};

const AboutSection: FC<AboutSectionProps> = ({ t }) => (
  <section className="py-16" id="about">
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4 text-primary">{t('aboutTitle')}</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300">{t('aboutText')}</p>
    </div>
  </section>
);

export default AboutSection; 