import { FC } from 'react';

/**
 * HeroSection displays the main introduction with a title, subtitle, and CTA button.
 * @param translations - Translation object
 */
type HeroSectionProps = {
  translations: Record<string, string>;
};

const HeroSection: FC<HeroSectionProps> = ({ translations }) => {
  const t = (key: string) => translations[key] || key;
  return (
    <section id="home" className="flex flex-col items-center justify-center text-center py-16 gap-6">
      <h1 className="text-4xl md:text-5xl font-bold text-primary">{t('heroTitle')}</h1>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">{t('heroSubtitle')}</p>
      <a
        href="#projects"
        className="mt-4 px-6 py-3 bg-primary text-white rounded shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
        tabIndex={0}
        aria-label={t('heroCTA')}
      >
        {t('heroCTA')}
      </a>
    </section>
  );
};

export default HeroSection; 