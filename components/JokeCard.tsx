'use client';

import { cn } from '@/lib/utils';
import { CategoryPill } from './CategoryPill';
import type { Joke } from '@/lib/jokes';

interface JokeCardProps {
  joke: Joke;
  isRevealed: boolean;
}

export function JokeCard({ joke, isRevealed }: JokeCardProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center w-full max-w-xl',
        'bg-charcoal border border-graphite rounded-3xl px-8 py-12',
        'text-center select-none'
      )}
    >
      {joke.category && (
        <CategoryPill category={joke.category} className="mb-8" />
      )}

      <p className="font-display font-bold text-2xl md:text-4xl text-white leading-tight">
        {joke.setup}
      </p>

      {isRevealed ? (
        <p className="mt-8 font-display font-bold text-2xl md:text-4xl text-yellow leading-tight animate-fade-in-up">
          {joke.punchline}
        </p>
      ) : (
        <p className="mt-8 font-body text-smoke text-sm uppercase tracking-widest animate-pulse">
          Brace yourself. Tap.
        </p>
      )}
    </div>
  );
}
