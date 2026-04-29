import { getJokeBySlug } from '@/lib/jokes';
import { JokeReveal } from './JokeReveal';

interface JokeEmbedProps {
  slug: string;
}

export async function JokeEmbed({ slug }: JokeEmbedProps) {
  const joke = await getJokeBySlug(slug);

  if (!joke) {
    return (
      <div className="my-10 bg-bg-surface border border-bg-border rounded-2xl px-6 py-5">
        <p className="font-body text-text-tertiary text-sm">
          Joke <code className="font-mono">{slug}</code> not found. (Probably for the best.)
        </p>
      </div>
    );
  }

  return (
    <JokeReveal
      setup={joke.setup}
      punchline={joke.punchline}
      slug={joke.slug}
      category={joke.category}
    />
  );
}
