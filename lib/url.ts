export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') ?? 'https://dadhumor.app';

export function ogImageUrl(slug?: string) {
  return slug ? `${BASE_URL}/api/og/${slug}` : `${BASE_URL}/api/og/default`;
}

export function jokeUrl(slug: string) {
  return `${BASE_URL}/j/${slug}`;
}
