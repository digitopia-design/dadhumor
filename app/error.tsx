'use client';

import { useEffect } from 'react';
import { Stache } from '@/components/Stache';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <Stache mood="groan" size="lg" priority />

      <div className="flex flex-col gap-3 max-w-sm">
        <h1 className="font-display font-bold text-3xl text-white">
          Oof. That one bombed.
        </h1>
        <p className="font-body text-smoke">
          Something broke on our end. Try again?
        </p>
      </div>

      <button
        onClick={reset}
        className="px-8 py-4 rounded-2xl bg-yellow text-midnight font-body font-bold text-lg hover:bg-yellow/90 transition-colors"
      >
        Try again →
      </button>
    </main>
  );
}
