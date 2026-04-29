'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface JokeRevealProps {
  setup: string;
  punchline: string;
  slug: string;
  category: string;
}

export function JokeReveal({ setup, punchline, slug, category }: JokeRevealProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="my-10 bg-charcoal text-white border border-bg-border rounded-2xl p-6 md:p-8 flex flex-col gap-4 not-prose">
      <span className="font-body text-smoke text-xs uppercase tracking-widest">
        Joke embedded · {category}
      </span>

      <p className="font-body text-smoke text-base md:text-lg leading-relaxed">
        {setup}
      </p>

      <div className="min-h-[60px] flex items-center">
        {revealed ? (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="font-display font-bold text-yellow text-2xl md:text-3xl leading-tight"
            style={{ letterSpacing: '-0.02em' }}
          >
            {punchline}
          </motion.p>
        ) : (
          <button
            onClick={() => setRevealed(true)}
            className="px-5 py-2.5 rounded-xl bg-yellow text-midnight font-body font-bold text-sm hover:bg-yellow/90 transition-colors"
          >
            Brace yourself. Tap.
          </button>
        )}
      </div>

      <Link
        href={`/j/${slug}`}
        className="font-body text-smoke text-xs hover:text-yellow transition-colors self-start"
      >
        Open joke →
      </Link>
    </div>
  );
}
