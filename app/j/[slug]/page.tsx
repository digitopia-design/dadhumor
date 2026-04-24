import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getJokeBySlug } from '@/lib/jokes';
import { ogImageUrl, jokeUrl } from '@/lib/url';
import { Stache } from '@/components/Stache';
import { Logo } from '@/components/Logo';

type Props = {
  params: Promise<{ slug: string }>;
};

const fetchJoke = cache(async (slug: string) => {
  return getJokeBySlug(slug);
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const joke = await fetchJoke(slug);

  if (!joke) {
    return {
      title: 'Joke not found',
      description: "This joke walked into a bar. It's not there anymore.",
    };
  }

  const title = `"${joke.setup}"`;
  const description = `${joke.punchline} — Dad Humor`;
  const image = ogImageUrl(joke.slug);
  const url = jokeUrl(joke.slug);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Dad Humor',
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: joke.setup }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function JokePage({ params }: Props) {
  const { slug } = await params;
  const joke = await fetchJoke(slug);

  if (!joke) notFound();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-6 py-8">
      <header className="w-full max-w-xl flex items-center justify-between">
        <Logo className="text-xl" />
        <span className="font-body text-smoke text-xs uppercase tracking-widest">
          #{joke.id}
        </span>
      </header>

      <div className="flex flex-col items-center w-full max-w-xl text-center gap-10">
        <Stache mood="laughing" size="lg" priority />

        <div className="w-full bg-charcoal border border-graphite rounded-3xl px-8 py-10 flex flex-col gap-6">
          <p className="font-body text-smoke text-xl leading-relaxed">{joke.setup}</p>
          <p className="font-display font-bold text-yellow text-3xl leading-tight">
            {joke.punchline}
          </p>
          <span className="font-body text-smoke/50 text-xs uppercase tracking-widest">
            {joke.category.replace(/-/g, ' ')}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Link
          href="/"
          className="px-8 py-4 rounded-2xl bg-yellow text-midnight font-body font-bold text-lg hover:bg-yellow/90 transition-colors"
        >
          More dad jokes →
        </Link>
        <p className="font-body text-smoke/50 text-xs">dadhumor.app</p>
      </div>
    </main>
  );
}
