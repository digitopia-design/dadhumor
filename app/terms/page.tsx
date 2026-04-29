import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: 'Terms of Service — Dad Humor',
  description: 'The rules. There are not many. Mostly: don\'t be weird about the jokes.',
};

export default function TermsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <header className="flex items-center justify-between">
          <Logo className="text-xl" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/" className="font-body text-text-secondary text-sm hover:text-text transition-colors">
              ← Back
            </Link>
          </div>
        </header>

        <div className="flex flex-col gap-6">
          <h1 className="font-display font-bold text-4xl text-text">Terms of Service</h1>
          <p className="font-body text-text-secondary text-sm">Last updated: April 2026</p>

          <div className="flex flex-col gap-8 font-body text-text-secondary leading-relaxed">
            <section className="flex flex-col gap-3">
              <h2 className="font-display font-bold text-xl text-text">The short version</h2>
              <p>
                Dad Humor is a free service. Use it to enjoy, share, and groan at dad jokes. Don{"'"}t
                abuse it, scrape it commercially, or use it to do anything that would embarrass your
                actual dad.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-display font-bold text-xl text-text">Who we are</h2>
              <p>
                Dad Humor (<span className="text-text">dadhumor.app</span>) is operated by
                Digitopia Design Ltd, a company registered in England and Wales. Questions:{' '}
                <a
                  href="mailto:hello@dadhumor.app"
                  className="text-reaction-cyan underline underline-offset-2 hover:text-reaction-cyan/80"
                >
                  hello@dadhumor.app
                </a>
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-display font-bold text-xl text-text">Using the service</h2>
              <ul className="list-disc list-inside flex flex-col gap-2 ml-2">
                <li>Dad Humor is free to use with no account required</li>
                <li>You may share jokes using the built-in share tools</li>
                <li>You may embed the Joke of the Day widget in your own site or application</li>
                <li>Commercial scraping or bulk extraction of joke content is not permitted</li>
                <li>Automated requests that strain the service are not permitted</li>
              </ul>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-display font-bold text-xl text-text">The content</h2>
              <p>
                Jokes on Dad Humor are curated from the public domain or written in-house. They are
                intended to be G-rated and inoffensive. If you find a joke that crosses a line,
                email us and we{"'"}ll remove it.
              </p>
              <p>
                Dad Humor and the Stache mascot are trademarks of Digitopia Design Ltd. You may
                share screenshots and cards in a personal, non-commercial context.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-display font-bold text-xl text-text">Availability</h2>
              <p>
                We aim for the service to be available at all times, but we make no guarantees.
                Given the nature of dad jokes, downtime is probably funnier than the content anyway.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-display font-bold text-xl text-text">Limitation of liability</h2>
              <p>
                Dad Humor is provided as-is. We are not responsible for any groaning, eye-rolling,
                strained family relationships, or involuntary laughter caused by use of this service.
                By using Dad Humor you accept this risk.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-display font-bold text-xl text-text">Changes</h2>
              <p>
                We may update these terms occasionally. Continued use of the service after changes
                are posted constitutes acceptance. We{"'"}ll try to keep them this readable.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-display font-bold text-xl text-text">Governing law</h2>
              <p>
                These terms are governed by the laws of England and Wales.
              </p>
            </section>
          </div>
        </div>

        <div className="flex items-center gap-6 pt-4 border-t border-bg-border">
          <Link href="/privacy" className="font-body text-text-secondary text-sm hover:text-text transition-colors">
            Privacy Policy
          </Link>
          <Link href="/" className="font-body text-text-secondary text-sm hover:text-text transition-colors">
            Back to jokes
          </Link>
        </div>
      </div>
    </main>
  );
}
