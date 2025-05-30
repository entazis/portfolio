import { FC } from 'react';

/**
 * AboutSection displays information about the developer.
 * @param translations - Translation object
 */
type AboutSectionProps = {
  translations: Record<string, string>;
};

const AboutSection: FC<AboutSectionProps> = ({ translations }) => {
  const t = (key: string) => translations[key] || key;
  return (
    <section className="py-16 scroll-mt-10" id="about"> {/* Navigation anchor: #about */}
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-primary">{t('aboutTitle')}</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">{t('aboutText')}</p>
      </div>
    </section>
  );
};

export default AboutSection; 