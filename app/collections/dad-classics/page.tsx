import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Stache } from '@/components/Stache';

export const metadata: Metadata = {
  title: "20 Dad Classics — Jokes Your Dad Definitely Already Told You",
  description:
    "The 20 most recognisable dad jokes of all time. Puns, wordplay, and peak dad energy. How many have you heard? Don't lie.",
  openGraph: {
    title: "20 Dad Classics | Dad Humor",
    description:
      "The 20 most recognisable dad jokes ever told. How many have you survived? dadhumor.app",
    url: 'https://dadhumor.app/collections/dad-classics',
  },
  keywords: [
    'classic dad jokes',
    'best dad jokes of all time',
    'most famous dad jokes',
    'dad joke collection',
    'dad jokes list',
  ],
};

const DAD_CLASSICS = [
  { setup: "Why don't scientists trust atoms?", punchline: "Because they make up everything." },
  { setup: "I'm reading a book about anti-gravity.", punchline: "It's impossible to put down." },
  { setup: "I told my wife she was drawing her eyebrows too high.", punchline: "She looked surprised." },
  { setup: "Why did the scarecrow win an award?", punchline: "He was outstanding in his field." },
  { setup: "What do you call cheese that isn't yours?", punchline: "Nacho cheese." },
  { setup: "I only know 25 letters of the alphabet.", punchline: "I don't know y." },
  { setup: "Why don't skeletons fight each other?", punchline: "They don't have the guts." },
  { setup: "What did the ocean say to the shore?", punchline: "Nothing, it just waved." },
  { setup: "I'm on a seafood diet.", punchline: "I see food and I eat it." },
  { setup: "What do you call a fake noodle?", punchline: "An impasta." },
  { setup: "How do you organise a space party?", punchline: "You planet." },
  { setup: "I don't trust stairs.", punchline: "They're always up to something." },
  { setup: "Why did the bicycle fall over?", punchline: "Because it was two-tired." },
  { setup: "Whoever invented the knock knock joke...", punchline: "Should get a no-bell prize." },
  { setup: "Parallel lines have so much in common.", punchline: "It's a shame they'll never meet." },
  { setup: "I used to hate facial hair.", punchline: "But then it grew on me." },
  { setup: "What's brown and sticky?", punchline: "A stick." },
  { setup: "Why don't eggs tell jokes?", punchline: "They'd crack each other up." },
  { setup: "I'm terrified of elevators.", punchline: "I'm taking steps to avoid them." },
  { setup: "Did you hear the rumour about butter?", punchline: "Well, I'm not going to spread it." },
];

export default function DadClassicsPage() {
  return (
    <main className="flex flex-col items-center min-h-screen">

      {/* Nav */}
      <nav className="w-full max-w-4xl flex items-center justify-between px-6 py-8">
        <Logo className="text-xl" />
        <div className="flex items-center gap-6">
          <Link
            href="/fathers-day"
            className="font-body text-text-secondary text-sm hover:text-brand-yellow transition-colors"
          >
            Father&#39;s Day →
          </Link>
          <Link
            href="/"
            className="font-body text-text-secondary text-sm hover:text-text transition-colors"
          >
            All jokes →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center gap-6 px-6 py-10 max-w-3xl">
        <Stache mood="smug" size="lg" priority dadMode />

        <div className="flex flex-col gap-3">
          <p className="font-body text-text-secondary text-sm uppercase tracking-widest">
            The classics
          </p>
          <h1
            className="font-display font-bold text-5xl md:text-6xl text-text leading-none"
            style={{ letterSpacing: '-0.03em' }}
          >
            Jokes your dad<br />
            <span className="text-brand-yellow">definitely already told you.</span>
          </h1>
          <p className="font-body text-text-secondary text-lg max-w-xl mx-auto leading-relaxed">
            20 of the most recognisable dad jokes ever committed to groan.
            How many have you heard? Be honest.
          </p>
        </div>

        {/* Stat bar */}
        <div className="flex items-center gap-1 font-body text-text-secondary text-sm">
          <span className="text-brand-yellow font-bold">20</span>
          <span>certified classics</span>
          <span className="text-text-tertiary mx-2">·</span>
          <span className="text-brand-yellow font-bold">0</span>
          <span>original thoughts</span>
          <span className="text-text-tertiary mx-2">·</span>
          <span className="text-brand-yellow font-bold">∞</span>
          <span>groans</span>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full max-w-4xl px-6 mb-4">
        <div className="h-px bg-bg-border" />
      </div>

      {/* Jokes grid */}
      <section className="w-full max-w-4xl px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DAD_CLASSICS.map((joke, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 bg-bg-surface border border-bg-border rounded-2xl px-6 py-5"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-body text-text-secondary text-sm leading-relaxed flex-1">
                  {joke.setup}
                </p>
                <span
                  className="font-display font-bold text-text-tertiary text-sm shrink-0"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  #{i + 1}
                </span>
              </div>
              <div className="h-px bg-bg-border" />
              <p
                className="font-display font-bold text-brand-yellow text-xl leading-tight"
                style={{ letterSpacing: '-0.02em' }}
              >
                {joke.punchline}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center text-center gap-6 px-6 py-16 max-w-xl w-full">
        <div className="flex flex-col gap-3">
          <h2
            className="font-display font-bold text-3xl text-text"
            style={{ letterSpacing: '-0.02em' }}
          >
            200 more where those came from.
          </h2>
          <p className="font-body text-text-secondary text-base leading-relaxed">
            Fresh material. Swipe-based. Rate, stash, and share the ones that land — or don't.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Link
            href="/"
            className="px-8 py-4 rounded-2xl bg-brand-yellow text-midnight font-body font-bold text-base hover:bg-brand-yellow/90 transition-colors text-center"
          >
            Start swiping →
          </Link>
          <Link
            href="/fathers-day"
            className="px-8 py-4 rounded-2xl border border-bg-border text-text-secondary font-body font-bold text-base hover:border-brand-yellow hover:text-brand-yellow transition-colors text-center"
          >
            Father&#39;s Day →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-bg-border mt-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-8 max-w-4xl mx-auto">
          <Logo className="text-base" />
          <div className="flex items-center gap-6">
            <Link href="/" className="font-body text-text-secondary text-sm hover:text-text transition-colors">
              All jokes
            </Link>
            <Link href="/fathers-day" className="font-body text-text-secondary text-sm hover:text-text transition-colors">
              Father&#39;s Day
            </Link>
            <Link href="/privacy" className="font-body text-text-secondary text-sm hover:text-text transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
