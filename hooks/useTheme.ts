'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { STORAGE_KEYS } from '@/lib/constants';

export type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);
  const initialized = useRef(false);

  const applyTheme = useCallback((newTheme: Theme) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (!document.documentElement) return;

    if (newTheme === 'system') {
      if (typeof window.matchMedia !== 'undefined') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', isDark);
      }
    } else {
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }
  }, []);

  const updateTheme = useCallback(
    (newTheme: Theme) => {
      setTheme(newTheme);
      applyTheme(newTheme);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
        } catch (e) {
          console.warn('Failed to save theme to localStorage:', e);
        }
      }
    },
    [applyTheme]
  );

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    setMounted(true);
    if (typeof window !== 'undefined') {
      try {
        const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as Theme | null;
        if (
          storedTheme &&
          (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system')
        ) {
          setTheme(storedTheme);
          applyTheme(storedTheme);
        } else {
          setTheme('system');
          applyTheme('system');
        }
      } catch (e) {
        console.warn('Failed to load theme from localStorage:', e);
        setTheme('system');
        applyTheme('system');
      }
    }
  }, [applyTheme]);

  useEffect(() => {
    if (typeof window === 'undefined' || theme !== 'system') return;
    if (typeof window.matchMedia === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme('system');
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);

  const effectiveTheme = (() => {
    if (!mounted) return 'light';
    if (
      theme === 'system' &&
      typeof window !== 'undefined' &&
      typeof window.matchMedia !== 'undefined'
    ) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  })();

  return {
    theme,
    setTheme: updateTheme,
    mounted,
    effectiveTheme,
  };
}

