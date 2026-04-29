import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Stache } from '@/components/Stache';
import { CountdownTimer } from '@/components/CountdownTimer';
import { EmailCapture } from '@/components/EmailCapture';

export const metadata: Metadata = {
  title: "Father's Day Dad Jokes 2026",
  description:
    "The ultimate dad joke collection for Father's Day 2026. Send the perfect terrible joke to your dad. He'll love it. Probably.",
  openGraph: {
    title: "Father's Day Dad Jokes 2026 | Dad Humor",
    description:
      "The one day a year his jokes are tolerated. Send yours. dadhumor.app",
    url: 'https://dadhumor.app/fathers-day',
  },
  keywords: [
    "father's day jokes",
    'dad jokes for fathers day',
    'best dad jokes 2026',
    'fathers day 2026',
    'send dad a joke',
  ],
};

const WHATSAPP_URL =
  'https://wa.me/?text=' +
  encodeURIComponent(
    "Happy Father's Day! I found you some fresh material 👇\n\nhttps://dadhumor.app\n\nYou're welcome. (Sorry.)"
  );

const SAMPLE_JOKES = [
  { setup: "I'm reading a book about anti-gravity.", punchline: "It's impossible to put down." },
  { setup: "Why don't eggs tell jokes?", punchline: "They'd crack each other up." },
  { setup: "I used to hate facial hair.", punchline: "But then it grew on me." },
  { setup: "What do you call a fish without eyes?", punchline: "A fsh." },
  { setup: "I told my wife she was drawing her eyebrows too high.", punchline: "She looked surprised." },
  { setup: "Why can't a nose be 12 inches long?", punchline: "Because then it'd be a foot." },
];

export default function FathersDayPage() {
  return (
    <main className="flex flex-col items-center min-h-screen">

      {/* Nav */}
      <nav className="w-full max-w-4xl flex items-center justify-between px-6 py-8">
        <Logo className="text-xl" />
        <Link
          href="/"
          className="font-body text-text-secondary text-sm hover:text-text transition-colors"
        >
          All jokes →
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center gap-8 px-6 py-12 max-w-3xl">
        <Stache mood="laughing" size="xl" priority dadMode />

        <div className="flex flex-col gap-4">
          <p className="font-body text-text-secondary text-sm uppercase tracking-widest">
            Father's Day 2026 — 21 June
          </p>
          <h1 className="font-display font-bold text-5xl md:text-7xl text-text leading-none" style={{ letterSpacing: '-0.03em' }}>
            The one day a year<br />
            <span className="text-brand-yellow">his jokes are tolerated.</span>
          </h1>
          <p className="font-body text-text-secondary text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
            Give him something to work with. Dad Humor has 200 fresh groans — send the best ones before he does.
          </p>
        </div>

        <CountdownTimer />

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-yellow text-midnight font-body font-bold text-lg hover:bg-brand-yellow/90 transition-colors"
        >
          <span>💬</span>
          Send to your dad. He'll send three back.
        </a>
      </section>

      {/* Divider */}
      <div className="w-full max-w-4xl px-6">
        <div className="h-px bg-bg-border" />
      </div>

      {/* Dad Classics */}
      <section className="flex flex-col items-center text-center gap-8 px-6 py-16 max-w-4xl w-full">
        <div className="flex flex-col gap-3">
          <p className="font-body text-text-secondary text-sm uppercase tracking-widest">The classics</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-text" style={{ letterSpacing: '-0.02em' }}>
            Jokes your dad definitely<br />already told you.
          </h2>
          <p className="font-body text-text-secondary text-lg">How many have you heard? Don't lie.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {SAMPLE_JOKES.map((joke, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 bg-bg-surface border border-bg-border rounded-2xl px-6 py-5 text-left"
            >
              <p className="font-body text-text-secondary text-sm leading-relaxed">{joke.setup}</p>
              <p className="font-display font-bold text-brand-yellow text-xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
                {joke.punchline}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/collections/dad-classics"
          className="px-8 py-4 rounded-2xl border border-bg-border text-text-secondary font-body font-bold hover:border-brand-yellow hover:text-brand-yellow transition-colors"
        >
          See all 20 dad classics →
        </Link>
      </section>

      {/* Divider */}
      <div className="w-full max-w-4xl px-6">
        <div className="h-px bg-bg-border" />
      </div>

      {/* Email capture */}
      <section className="flex flex-col items-center text-center gap-8 px-6 py-16 max-w-2xl w-full">
        <Stache mood="winking" size="lg" dadMode />

        <div className="flex flex-col gap-3">
          <h2 className="font-display font-bold text-4xl text-text" style={{ letterSpacing: '-0.02em' }}>
            20 brand new dad jokes<br />
            <span className="text-brand-yellow">for Father's Day.</span>
          </h2>
          <p className="font-body text-text-secondary text-lg leading-relaxed">
            Fresh material he hasn't heard yet. Free PDF, no faff.
            <br />
            <span className="text-text-secondary/60 text-sm">
              "20 jokes your dad doesn't know yet (but soon will)"
            </span>
          </p>
        </div>

        <EmailCapture />

        <p className="font-body text-text-secondary/40 text-xs">
          No spam. Unsubscribe any time. We're dad joke people, not newsletter people.
        </p>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-bg-border mt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-8 max-w-4xl mx-auto">
          <Logo className="text-base" />
          <div className="flex items-center gap-6">
            <Link href="/" className="font-body text-text-secondary text-sm hover:text-text transition-colors">
              All jokes
            </Link>
            <Link href="/quiz" className="font-body text-text-secondary text-sm hover:text-brand-yellow transition-colors">
              Take the quiz
            </Link>
            <Link href="/privacy" className="font-body text-text-secondary text-sm hover:text-text transition-colors">
              Privacy
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-reaction-lime text-sm hover:text-reaction-lime/80 transition-colors"
            >
              Send to Dad →
            </a>
          </div>
        </div>
      </footer>

    </main>
  );
}
