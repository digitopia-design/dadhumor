'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getRandomJoke } from '@/lib/jokes';
import type { Joke } from '@/lib/jokes';
import { Stache } from '@/components/Stache';
import { Logo } from '@/components/Logo';

const SETUP_MS = 6000;
const PUNCHLINE_MS = 9000;

type Phase = 'setup' | 'punchline';

export default function SignagePage() {
  const [joke, setJoke] = useState<Joke | null>(null);
  const [phase, setPhase] = useState<Phase>('setup');
  const [progress, setProgress] = useState(0);
  const seenIds = useRef<number[]>([]);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const phaseRef = useRef<Phase>('setup');

  const loadNext = useCallback(async () => {
    const next = await getRandomJoke(seenIds.current.slice(-30));
    if (next) {
      seenIds.current = [...seenIds.current, next.id];
      setJoke(next);
      setPhase('setup');
      phaseRef.current = 'setup';
    }
  }, []);

  // Progress + auto-advance loop
  const startTimer = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    startRef.current = performance.now();
    const duration = phaseRef.current === 'setup' ? SETUP_MS : PUNCHLINE_MS;

    function tick(now: number) {
      const elapsed = now - startRef.current;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);

      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        if (phaseRef.current === 'setup') {
          phaseRef.current = 'punchline';
          setPhase('punchline');
          setProgress(0);
          startRef.current = performance.now();
          rafRef.current = requestAnimationFrame(tick);
        } else {
          loadNext();
        }
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [loadNext]);

  // Initial load
  useEffect(() => {
    loadNext();
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start timer when joke or phase changes
  useEffect(() => {
    if (!joke) return;
    startTimer();
    return () => cancelAnimationFrame(rafRef.current);
  }, [joke, startTimer]);

  // Midnight page reload to stay fresh
  useEffect(() => {
    const midnight = new Date();
    midnight.setUTCHours(24, 0, 5, 0);
    const ms = midnight.getTime() - Date.now();
    const t = setTimeout(() => window.location.reload(), ms);
    return () => clearTimeout(t);
  }, []);

  const stacheMood = phase === 'punchline' ? 'laughing' : 'anticipation';

  return (
    <div className="fixed inset-0 bg-bg flex flex-col select-none overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-16 pt-12 pb-0">
        <Logo className="text-3xl" />
        <span className="font-body text-text-secondary/40 text-base uppercase tracking-[0.25em]">
          dadhumor.app
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-14 px-24">
        <Stache mood={stacheMood} size="xl" priority />

        <AnimatePresence mode="wait">
          {joke && (
            <motion.div
              key={joke.id}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="flex flex-col items-center text-center gap-12 max-w-6xl"
            >
              <h1
                className="font-display font-semibold text-text-secondary leading-tight"
                style={{ fontSize: '4.5rem', letterSpacing: '-0.02em' }}
              >
                {joke.setup}
              </h1>

              <AnimatePresence>
                {phase === 'punchline' && (
                  <motion.h2
                    key="punchline"
                    initial={{ opacity: 0, scale: 0.96, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                    className="font-display font-bold text-brand-yellow leading-none"
                    style={{ fontSize: '7.5rem', letterSpacing: '-0.02em' }}
                  >
                    {joke.punchline}
                  </motion.h2>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer + progress */}
      <div className="px-16 pb-10 flex flex-col gap-4">
        <div className="w-full h-1 bg-bg-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress * 100}%`,
              background: phase === 'punchline' ? '#E3FF00' : '#333333',
              transition: 'background 0.3s',
            }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="font-body text-text-secondary/30 text-sm uppercase tracking-widest">
            {joke?.category?.replace(/-/g, ' ')}
          </span>
          <span className="font-body text-text-secondary/30 text-sm">
            #{joke?.id}
          </span>
        </div>
      </div>
    </div>
  );
}
