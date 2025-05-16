import { FC, useEffect, useState } from 'react';

/**
 * ThemeSwitcher toggles between light and dark mode using Tailwind's dark mode.
 */
const ThemeSwitcher: FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
      setIsDark(true);
    } else {
      root.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const handleToggle = () => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background text-sm font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      tabIndex={0}
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeSwitcher; 