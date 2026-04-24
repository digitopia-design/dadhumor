export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') ?? 'https://dadhumor.app';

export function ogImageUrl(joke?: { setup: string; punchline: string; category: string }) {
  if (!joke) return `${BASE_URL}/api/og`;
  const params = new URLSearchParams({
    setup: joke.setup,
    punchline: joke.punchline,
    category: joke.category,
  });
  return `${BASE_URL}/api/og?${params.toString()}`;
}

export function jokeUrl(slug: string) {
  return `${BASE_URL}/j/${slug}`;
}
