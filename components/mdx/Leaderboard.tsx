import Link from 'next/link';
import { getTopJokes } from '@/lib/jokes';
import { cn } from '@/lib/utils';

interface LeaderboardProps {
  limit?: number;
  category?: string;
}

interface LeaderboardCommonProps extends LeaderboardProps {
  metric: 'groans' | 'props';
}

const METRIC_CONFIG = {
  groans: {
    title: 'Top Groan-Inducing Jokes',
    label: 'groans',
    accent: 'text-reaction-pink',
    border: 'border-l-reaction-pink',
  },
  props: {
    title: 'Top Props-Earning Jokes',
    label: 'props',
    accent: 'text-reaction-lime',
    border: 'border-l-reaction-lime',
  },
} as const;

async function Leaderboard({ metric, limit = 10, category }: LeaderboardCommonProps) {
  const all = await getTopJokes(metric, category ? Math.max(limit * 2, 20) : limit);
  const filtered = category ? all.filter(j => j.category === category).slice(0, limit) : all.slice(0, limit);
  const config = METRIC_CONFIG[metric];

  if (filtered.length === 0) {
    return (
      <div className="my-8 bg-bg-surface border border-bg-border rounded-2xl px-6 py-5">
        <p className="font-body text-text-tertiary text-sm">
          Leaderboard is empty. (No reactions yet, or someone unplugged the database.)
        </p>
      </div>
    );
  }

  const valueOf = (j: { groans_count: number; props_count: number }) =>
    metric === 'groans' ? j.groans_count : j.props_count;

  return (
    <div className={cn('my-8 bg-bg-surface border border-l-4 border-bg-border rounded-r-2xl rounded-l-md', config.border)}>
      <div className="px-6 py-5 border-b border-bg-border">
        <h3 className={cn('font-display font-bold text-lg uppercase tracking-widest', config.accent)}>
          {config.title}
        </h3>
        {category && (
          <p className="font-body text-text-secondary text-xs mt-1 uppercase tracking-widest">
            in {category}
          </p>
        )}
      </div>

      <ol className="divide-y divide-bg-border">
        {filtered.map((joke, i) => (
          <li key={joke.id} className="px-6 py-4 flex items-start gap-4 hover:bg-bg-elevated transition-colors">
            <span
              className="font-display font-bold text-text-tertiary text-xl shrink-0 w-8"
              style={{ letterSpacing: '-0.02em' }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>

            <Link href={`/j/${joke.slug}`} className="flex-1 min-w-0 group">
              <p className="font-body text-text text-sm leading-relaxed group-hover:text-brand-yellow transition-colors line-clamp-2">
                {joke.setup}
              </p>
            </Link>

            <div className="shrink-0 text-right">
              <span className={cn('font-display font-bold text-base', config.accent)}>
                {valueOf(joke).toLocaleString()}
              </span>
              <p className="font-body text-text-tertiary text-xs uppercase tracking-widest">
                {config.label}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function GroanLeaderboard(props: LeaderboardProps) {
  return <Leaderboard metric="groans" {...props} />;
}

export function PropsLeaderboard(props: LeaderboardProps) {
  return <Leaderboard metric="props" {...props} />;
}
