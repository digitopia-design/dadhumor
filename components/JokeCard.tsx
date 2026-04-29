'use client';

import { motion } from 'framer-motion';
import { cn, getSetupSize, getPunchlineSize } from '@/lib/utils';
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
        'bg-bg-surface border border-bg-border rounded-3xl px-8 py-12',
        'text-center select-none gap-8 md:gap-10'
      )}
    >
      {joke.category && (
        <CategoryPill category={joke.category} />
      )}

      <h1
        className={cn(
          'font-display font-semibold text-text-secondary leading-tight tracking-tight',
          getSetupSize(joke.setup)
        )}
        style={{ letterSpacing: '-0.02em' }}
      >
        {joke.setup}
      </h1>

      {isRevealed ? (
        <motion.h2
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
          className={cn(
            'font-display font-bold text-brand-yellow leading-none tracking-tight',
            getPunchlineSize(joke.punchline)
          )}
          style={{ letterSpacing: '-0.02em' }}
        >
          {joke.punchline}
        </motion.h2>
      ) : (
        <p className="font-body text-text-secondary/50 text-sm uppercase tracking-widest animate-pulse">
          Brace yourself. Tap.
        </p>
      )}
    </div>
  );
}
