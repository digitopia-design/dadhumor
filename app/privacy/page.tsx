import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Dad Humor handles your data. Spoiler: we are not creepy about it.',
};

export default function PrivacyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <header className="flex items-center justify-between">
          <Logo className="text-xl" />
          <Link href="/" className="font-body text-smoke text-sm hover:text-white transition-colors">
            ← Back
          </Link>
        </header>

        <div className="flex flex-col gap-6">
          <h1 className="font-display font-bold text-4xl text-white">Privacy Policy</h1>
          <p className="font-body text-smoke text-sm">Last updated: April 2026</p>

          <div className="flex flex-col gap-8 font-body text-smoke leading-relaxed">
            <section className="flex flex-col gap-3">
              <h2 className="font-display font-bold text-xl text-white">The short version</h2>
              <p>
                We use analytics to understand which jokes land. We do not sell your data, track you
                across the internet, or require an account. Most things are stored on your own device.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-display font-bold text-xl text-white">What we collect</h2>
              <ul className="list-disc list-inside flex flex-col gap-2 ml-2">
                <li>Anonymous usage events (joke views, reactions, shares) via PostHog and Google Analytics</li>
                <li>Page view data via Vercel Analytics</li>
                <li>No personal information is collected or required</li>
              </ul>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-display font-bold text-xl text-white">What stays on your device</h2>
              <ul className="list-disc list-inside flex flex-col gap-2 ml-2">
                <li>Your stashed jokes (localStorage)</li>
                <li>Your joke reactions - props and groans (localStorage)</li>
                <li>Your cookie preference (localStorage)</li>
                <li>Whether you have completed onboarding (localStorage)</li>
              </ul>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-display font-bold text-xl text-white">Cookies</h2>
              <p>
                We use first-party analytics cookies. If you choose "Essential only" in the cookie
                banner, analytics are not loaded. You can change this preference at any time by
                clearing your browser{"'"}s localStorage for this site.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-display font-bold text-xl text-white">Third-party services</h2>
              <ul className="list-disc list-inside flex flex-col gap-2 ml-2">
                <li>
                  <span className="text-white">PostHog</span> — product analytics (EU region, GDPR compliant)
                </li>
                <li>
                  <span className="text-white">Google Analytics 4</span> — web analytics
                </li>
                <li>
                  <span className="text-white">Vercel Analytics</span> — performance monitoring
                </li>
                <li>
                  <span className="text-white">Supabase</span> — database (EU region)
                </li>
              </ul>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-display font-bold text-xl text-white">Your rights</h2>
              <p>
                Under UK GDPR you have the right to access, correct, or delete any personal data
                we hold about you. Given we collect no personal data, there is very little to
                work with. But if you have questions, email us at{' '}
                <a
                  href="mailto:hello@dadhumor.app"
                  className="text-cyan underline underline-offset-2 hover:text-cyan/80"
                >
                  hello@dadhumor.app
                </a>
                .
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-display font-bold text-xl text-white">Controller</h2>
              <p>
                Dad Humor is operated by Digitopia Design Ltd, United Kingdom.
              </p>
            </section>
          </div>
        </div>

        <div className="flex items-center gap-6 pt-4 border-t border-graphite">
          <Link href="/terms" className="font-body text-smoke text-sm hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="/" className="font-body text-smoke text-sm hover:text-white transition-colors">
            Back to jokes
          </Link>
        </div>
      </div>
    </main>
  );
}
