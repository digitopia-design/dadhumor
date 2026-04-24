const REACTIONS_KEY = 'dh_reactions';

type JokeReactions = {
  props: boolean;
  groaned: boolean;
  stashed: boolean;
};

type ReactionsStore = Record<string, JokeReactions>;

function getStore(): ReactionsStore {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(REACTIONS_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function saveStore(store: ReactionsStore): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REACTIONS_KEY, JSON.stringify(store));
}

export function getReactions(jokeId: number): JokeReactions {
  return getStore()[jokeId] ?? { props: false, groaned: false, stashed: false };
}

export function markProps(jokeId: number): void {
  const store = getStore();
  store[jokeId] = { ...getReactions(jokeId), props: true };
  saveStore(store);
}

export function markGroaned(jokeId: number): void {
  const store = getStore();
  store[jokeId] = { ...getReactions(jokeId), groaned: true };
  saveStore(store);
}

export function markStashed(jokeId: number, stashed: boolean): void {
  const store = getStore();
  store[jokeId] = { ...getReactions(jokeId), stashed };
  saveStore(store);
}

export function hasGivenProps(jokeId: number): boolean {
  return getReactions(jokeId).props;
}

export function hasGroaned(jokeId: number): boolean {
  return getReactions(jokeId).groaned;
}
