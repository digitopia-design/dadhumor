'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Stache } from '@/components/Stache';
import { track } from '@/lib/analytics';

const QUIZ_JOKES = [
  { setup: "Why don't scientists trust atoms?", punchline: "Because they make up everything." },
  { setup: "I'm reading a book about anti-gravity.", punchline: "It's impossible to put down." },
  { setup: "Why did the scarecrow win an award?", punchline: "He was outstanding in his field." },
  { setup: "What do you call cheese that isn't yours?", punchline: "Nacho cheese." },
  { setup: "I only know 25 letters of the alphabet.", punchline: "I don't know y." },
  { setup: "Why don't skeletons fight each other?", punchline: "They don't have the guts." },
  { setup: "How do you organise a space party?", punchline: "You planet." },
  { setup: "Whoever invented the knock knock joke...", punchline: "Should get a no-bell prize." },
  { setup: "What's brown and sticky?", punchline: "A stick." },
  { setup: "Did you hear the rumour about butter?", punchline: "Well, I'm not going to spread it." },
];

type Result = {
  min: number;
  max: number;
  badge: string;
  title: string;
  description: string;
  stacheMood: 'smug' | 'laughing' | 'groan' | 'mind-blown' | 'winking';
};

const RESULTS: Result[] = [
  {
    min: 0, max: 2,
    badge: "Apprentice Dad Joke Survivor",
    title: "Your dad clearly diversified.",
    description: "Either he went off-piste or you've been remarkably sheltered. Either way, you've got catching up to do.",
    stacheMood: 'winking',
  },
  {
    min: 3, max: 5,
    badge: "Dad Joke Tourist",
    title: "You've sampled the buffet.",
    description: "You've been exposed. Not enough to build immunity, but enough to recognise the smell.",
    stacheMood: 'smug',
  },
  {
    min: 6, max: 8,
    badge: "Dad Joke Veteran",
    title: "You've earned battle scars.",
    description: "Years of service. You've sat through these at dinner tables, in cars, at Christmas. You deserved better.",
    stacheMood: 'groan',
  },
  {
    min: 9, max: 10,
    badge: "Dad Joke Hostage",
    title: "We're sorry. And also impressed.",
    description: "All 10. Every single one. Your dad did a thorough job and we salute his commitment to the craft.",
    stacheMood: 'mind-blown',
  },
];

function getResult(score: number): Result {
  return RESULTS.find(r => score >= r.min && score <= r.max) ?? RESULTS[RESULTS.length - 1];
}

const WHATSAPP_URL =
  'https://wa.me/?text=' +
  encodeURIComponent(
    "I just did the Dad Humor quiz - how many dad jokes has your dad told you?\n\nhttps://dadhumor.app/quiz\n\nBrace yourself."
  );

export function DadQuiz() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [phase, setPhase] = useState<'quiz' | 'result'>('quiz');
  const [direction, setDirection] = useState(1);

  const score = answers.filter(Boolean).length;
  const result = getResult(score);
  const joke = QUIZ_JOKES[index];
  const progress = (index / QUIZ_JOKES.length) * 100;

  function answer(heard: boolean) {
    setDirection(1);
    const next = [...answers, heard];
    setAnswers(next);

    if (index + 1 >= QUIZ_JOKES.length) {
      track('onboarding_completed', { quiz_score: next.filter(Boolean).length });
      setPhase('result');
    } else {
      setIndex(i => i + 1);
    }
  }

  async function handleShare() {
    const text = `I'm a "${result.badge}" on the Dad Humor quiz. ${score}/10 dad jokes already inflicted. What's your score?\n\nhttps://dadhumor.app/quiz`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: result.badge, text });
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(`${text}`);
    }
  }

  function restart() {
    setIndex(0);
    setAnswers([]);
    setPhase('quiz');
    setDirection(1);
  }

  return (
    <main className="flex flex-col items-center min-h-screen">

      {/* Nav */}
      <nav className="w-full max-w-2xl flex items-center justify-between px-6 py-8">
        <Logo className="text-xl" />
        <Link href="/" className="font-body text-smoke text-sm hover:text-white transition-colors">
          All jokes →
        </Link>
      </nav>

      {phase === 'quiz' && (
        <div className="flex flex-col items-center gap-8 px-6 w-full max-w-2xl flex-1">

          {/* Header */}
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="font-body text-smoke text-sm uppercase tracking-widest">
              The dad joke damage test
            </p>
            <h1
              className="font-display font-bold text-3xl md:text-4xl text-white"
              style={{ letterSpacing: '-0.02em' }}
            >
              How many did your dad<br />
              <span className="text-yellow">already tell you?</span>
            </h1>
          </div>

          {/* Progress bar */}
          <div className="w-full flex flex-col gap-2">
            <div className="w-full h-1.5 bg-graphite rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-yellow rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="font-body text-smoke/60 text-xs text-right">
              {index + 1} of {QUIZ_JOKES.length}
            </p>
          </div>

          {/* Joke card */}
          <div className="w-full relative" style={{ minHeight: '220px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.2 }}
                className="w-full bg-charcoal border border-graphite rounded-3xl px-8 py-10 flex flex-col gap-5 text-center"
              >
                <p className="font-body text-smoke text-lg leading-relaxed">
                  {joke.setup}
                </p>
                <div className="h-px bg-graphite mx-auto w-12" />
                <p
                  className="font-display font-bold text-yellow text-2xl md:text-3xl leading-tight"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {joke.punchline}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 w-full">
            <button
              onClick={() => answer(false)}
              className="flex-1 flex flex-col items-center gap-1.5 py-5 rounded-2xl bg-charcoal border border-graphite hover:border-smoke text-smoke hover:text-white font-body font-bold text-base transition-colors"
            >
              <span className="text-2xl">😐</span>
              Never heard it
            </button>
            <button
              onClick={() => answer(true)}
              className="flex-1 flex flex-col items-center gap-1.5 py-5 rounded-2xl bg-yellow text-midnight hover:bg-yellow/90 font-body font-bold text-base transition-colors"
            >
              <span className="text-2xl">😬</span>
              Heard it
            </button>
          </div>

          <p className="font-body text-smoke/40 text-xs text-center pb-8">
            Be honest. Your dad isn't watching. Probably.
          </p>
        </div>
      )}

      {phase === 'result' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-8 px-6 w-full max-w-2xl flex-1 text-center"
        >
          <Stache mood={result.stacheMood} size="lg" priority />

          {/* Score */}
          <div className="flex items-baseline gap-2">
            <span
              className="font-display font-bold text-yellow"
              style={{ fontSize: '80px', lineHeight: 1, letterSpacing: '-0.04em' }}
            >
              {score}
            </span>
            <span className="font-body text-smoke text-xl">/ 10</span>
          </div>

          {/* Result card */}
          <div className="w-full bg-charcoal border border-yellow/30 rounded-3xl px-8 py-8 flex flex-col gap-4">
            <p className="font-body text-yellow text-sm uppercase tracking-widest">
              Your verdict
            </p>
            <p
              className="font-display font-bold text-white text-2xl md:text-3xl leading-tight"
              style={{ letterSpacing: '-0.02em' }}
            >
              {result.badge}
            </p>
            <div className="h-px bg-graphite" />
            <p className="font-body text-smoke text-base leading-relaxed">
              {result.title} {result.description}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={handleShare}
              className="w-full py-4 rounded-2xl bg-yellow text-midnight font-body font-bold text-base hover:bg-yellow/90 transition-colors"
            >
              Share your result →
            </button>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-2xl border border-graphite text-smoke font-body font-bold text-base hover:border-lime hover:text-lime transition-colors"
            >
              💬 Challenge your dad
            </a>

            <div className="flex gap-3">
              <button
                onClick={restart}
                className="flex-1 py-3 rounded-2xl border border-graphite text-smoke font-body text-sm hover:border-smoke hover:text-white transition-colors"
              >
                Try again
              </button>
              <Link
                href="/"
                className="flex-1 py-3 rounded-2xl border border-graphite text-smoke font-body text-sm hover:border-smoke hover:text-white transition-colors text-center"
              >
                More jokes →
              </Link>
            </div>
          </div>

          <p className="font-body text-smoke/40 text-xs pb-8">
            Results accurate to ±1 traumatised childhood.
          </p>
        </motion.div>
      )}
    </main>
  );
}
