export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') ?? 'https://dadhumor.app';

const FD_START = new Date('2026-06-01T00:00:00Z');
const FD_END   = new Date('2026-06-26T00:00:00Z');

function isFathersDayCampaign(): boolean {
  const now = new Date();
  return now >= FD_START && now < FD_END;
}

export function ogImageUrl(joke?: { setup: string; punchline: string; category: string }) {
  if (!joke) return `${BASE_URL}/api/og`;
  const params: Record<string, string> = {
    setup: joke.setup,
    punchline: joke.punchline,
    category: joke.category,
  };
  if (isFathersDayCampaign()) params.fd = '1';
  return `${BASE_URL}/api/og?${new URLSearchParams(params).toString()}`;
}

export function jokeUrl(slug: string) {
  return `${BASE_URL}/j/${slug}`;
}
