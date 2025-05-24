"use client";
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';

/**
 * LanguageSwitcher component for switching between EN and HU locales.
 * @param locale - Current locale
 */
const locales = [
  { code: 'en', label: 'EN' },
  { code: 'hu', label: 'HU' },
];

type LanguageSwitcherProps = {
  locale: string;
};

const LanguageSwitcher: FC<LanguageSwitcherProps> = ({ locale }) => {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = locale;

  const handleSwitch = (targetLocale: string) => {
    if (targetLocale === currentLocale) return;
    // Set cookie for 1 year
    document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000`;
    const segments = pathname.split('/');
    segments[1] = targetLocale;
    router.push(segments.join('/') || '/');
  };

  return (
    <div className="flex gap-2" role="group" aria-label="Language switcher">
      {locales.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => handleSwitch(code)}
          className={`px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background text-sm font-medium transition-colors
            ${currentLocale === code ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          aria-pressed={currentLocale === code}
          aria-label={`Switch language to ${label}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher; 