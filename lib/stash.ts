const STASH_KEY = 'dh_stash';

export type StashEntry = {
  joke_id: number;
  added_at: string;
};

export function getStash(): StashEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STASH_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function addToStash(jokeId: number): void {
  if (typeof window === 'undefined') return;
  const stash = getStash();
  if (stash.some((e) => e.joke_id === jokeId)) return;
  stash.push({ joke_id: jokeId, added_at: new Date().toISOString() });
  localStorage.setItem(STASH_KEY, JSON.stringify(stash));
}

export function removeFromStash(jokeId: number): void {
  if (typeof window === 'undefined') return;
  const stash = getStash().filter((e) => e.joke_id !== jokeId);
  localStorage.setItem(STASH_KEY, JSON.stringify(stash));
}

export function isStashed(jokeId: number): boolean {
  return getStash().some((e) => e.joke_id === jokeId);
}

export function getStashCount(): number {
  return getStash().length;
}

export function clearStash(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STASH_KEY);
}
