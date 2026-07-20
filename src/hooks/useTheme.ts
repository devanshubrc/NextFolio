/**
 * useTheme.ts — Dark / light mode React hook.
 *
 * Persists the user's preference via `useLocalStorage` and applies
 * the appropriate class on `<html>` so Tailwind's dark-mode utilities work.
 *
 * The site defaults to **dark** mode. When `light` is selected the
 * `"light"` class is added to `document.documentElement`; otherwise it
 * is removed.
 *
 * @example
 * ```tsx
 * const { theme, toggleTheme, setTheme } = useTheme();
 *
 * return (
 *   <button onClick={toggleTheme}>
 *     Current: {theme}
 *   </button>
 * );
 * ```
 */

import { useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

type Theme = 'dark' | 'light';

interface UseThemeReturn {
  /** The currently active theme */
  theme: Theme;
  /** Toggle between dark ↔ light */
  toggleTheme: () => void;
  /** Explicitly set the theme */
  setTheme: (theme: Theme) => void;
}

/**
 * Manage the site-wide colour theme.
 *
 * @returns `{ theme, toggleTheme, setTheme }`
 */
export function useTheme(): UseThemeReturn {
  const [theme, setThemeValue] = useLocalStorage<Theme>(
    'nextfolios-theme',
    'dark',
  );

  // Apply the class whenever the persisted value changes.
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeValue((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, [setThemeValue]);

  const setTheme = useCallback(
    (t: Theme) => {
      setThemeValue(t);
    },
    [setThemeValue],
  );

  return { theme, toggleTheme, setTheme };
}
