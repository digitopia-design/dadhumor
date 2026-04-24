'use client';

import { useState, useCallback, useEffect } from 'react';
import { getRandomJoke, type Joke } from '@/lib/jokes';

const MAX_EXCLUDE = 10;

export function useJoke(initialJoke?: Joke) {
  const [joke, setJoke] = useState<Joke | null>(initialJoke ?? null);
  const [loading, setLoading] = useState(!initialJoke);
  const [excludeIds, setExcludeIds] = useState<number[]>(
    initialJoke ? [initialJoke.id] : []
  );

  useEffect(() => {
    if (!initialJoke) {
      getRandomJoke([]).then((next) => {
        if (next) {
          setExcludeIds([next.id]);
          setJoke(next);
        }
        setLoading(false);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNext = useCallback(async () => {
    setLoading(true);
    const next = await getRandomJoke(excludeIds);
    if (next) {
      setExcludeIds((prev) => [...prev.slice(-(MAX_EXCLUDE - 1)), next.id]);
      setJoke(next);
    }
    setLoading(false);
  }, [excludeIds]);

  return { joke, loading, loadNext };
}
