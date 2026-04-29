'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { isReadingContext, THEME_STORAGE_KEY } from '@/lib/theme';

export function ThemeManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (isReadingContext(pathname)) {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      const theme = saved === 'dark' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, [pathname]);

  return null;
}
