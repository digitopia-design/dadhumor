'use client';

import { useState, useEffect } from 'react';
import { THEME_STORAGE_KEY } from '@/lib/theme';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') as Theme | null;
    setTheme(current === 'dark' ? 'dark' : 'light');
  }, []);

  function toggle() {
    setTheme(prev => {
      const next: Theme = prev === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(THEME_STORAGE_KEY, next);
      return next;
    });
  }

  return { theme, toggle };
}
