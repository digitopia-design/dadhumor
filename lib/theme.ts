export const READING_CONTEXT_PATHS = [
  '/about',
  '/privacy',
  '/terms',
  '/contact',
  '/colophon',
  '/blog',
];

export function isReadingContext(pathname: string): boolean {
  return READING_CONTEXT_PATHS.some(
    path => pathname === path || pathname.startsWith(path + '/')
  );
}

export const THEME_STORAGE_KEY = 'dh_reading_theme';
