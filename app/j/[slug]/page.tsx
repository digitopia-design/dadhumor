import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getJokeBySlug } from '@/lib/jokes';

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
      title: 'Joke not found — Dad Humor',
      description: 'This joke walked into a bar. It\'s not there anymore.',
    };
  }

  const title = `"${joke.setup}" — Dad Humor`;
  const description = `${joke.setup} ${joke.punchline}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://dadhumor.app/j/${joke.slug}`,
      siteName: 'Dad Humor',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function JokePage({ params }: Props) {
  const { slug } = await params;
  const joke = await fetchJoke(slug);

  if (!joke) notFound();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#121212] px-6">
      <div className="flex flex-col items-center w-full max-w-3xl text-center gap-12">
        <h1 className="text-4xl font-bold leading-tight text-[#FFFFFF] md:text-6xl">
          {joke.setup}
        </h1>
        <h2 className="text-3xl font-bold text-[#E3FF00] md:text-5xl">
          {joke.punchline}
        </h2>
        <a
          href="/"
          className="text-[#00E0FF] text-lg underline underline-offset-4 hover:opacity-75 transition-opacity"
        >
          More dad jokes →
        </a>
      </div>
    </main>
  );
}
