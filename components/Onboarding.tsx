'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Stache, type StacheMood } from './Stache';
import { cn } from '@/lib/utils';

interface OnboardingProps {
  step: number;
  totalSteps: number;
  onNext: () => void;
  onSkip: () => void;
}

type StepConfig = {
  mood: StacheMood;
  heading: string;
  body: string;
  cta: string;
};

const STEPS: StepConfig[] = [
  {
    mood: 'smug',
    heading: 'Meet Stache.',
    body: "Your guide to dad joke excellence. He's been waiting for this moment.",
    cta: 'Nice to meet you →',
  },
  {
    mood: 'anticipation',
    heading: 'Tap to reveal.',
    body: "Every joke hides a punchline. Tap the card to unleash it. Brace yourself.",
    cta: 'Got it →',
  },
  {
    mood: 'pointing',
    heading: 'Swipe to react.',
    body: '',
    cta: "Let's go →",
  },
];

const GESTURE_HINTS = [
  { gesture: '← swipe',  label: 'next joke',   colour: 'text-yellow' },
  { gesture: '→ swipe',  label: 'props',        colour: 'text-lime'   },
  { gesture: '↑ swipe',  label: 'share',        colour: 'text-cyan'   },
  { gesture: 'hold',     label: 'groan',        colour: 'text-pink'   },
];

export function Onboarding({ step, totalSteps, onNext, onSkip }: OnboardingProps) {
  const current = STEPS[step];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-midnight/95 backdrop-blur-sm px-8">
      <button
        onClick={onSkip}
        className="absolute top-8 right-8 font-body text-smoke text-sm hover:text-white transition-colors"
      >
        Skip
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center text-center gap-8 max-w-sm"
        >
          <Stache mood={current.mood} size="xl" priority />

          <div className="flex flex-col gap-4">
            <h2 className="font-display font-bold text-4xl text-white">
              {current.heading}
            </h2>

            {current.body && (
              <p className="font-body text-smoke text-lg leading-relaxed">
                {current.body}
              </p>
            )}

            {step === 2 && (
              <ul className="flex flex-col gap-3 mt-2">
                {GESTURE_HINTS.map(({ gesture, label, colour }) => (
                  <li key={gesture} className="flex items-center justify-between gap-6">
                    <span className={cn('font-display font-bold text-xl', colour)}>
                      {gesture}
                    </span>
                    <span className="font-body text-white">{label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={onNext}
            className="w-full py-4 rounded-2xl bg-yellow text-midnight font-body font-bold text-lg hover:bg-yellow/90 transition-colors"
          >
            {current.cta}
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  i === step ? 'bg-yellow' : 'bg-graphite'
                )}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
