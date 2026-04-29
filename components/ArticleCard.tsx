import Link from 'next/link';
import type { Article } from '@/types/content';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured';
}

const CATEGORY_LABELS: Record<string, string> = {
  data: 'Data',
  guides: 'Guides',
  press: 'Press',
  brand: 'Brand',
  jokes: 'Jokes',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const { frontmatter, readingTime } = article;

  if (variant === 'featured') {
    return (
      <Link
        href={`/blog/${frontmatter.slug}`}
        className="group flex flex-col gap-5 bg-bg-surface border border-bg-border rounded-3xl p-8 md:p-10 hover:border-brand-yellow transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-bg text-brand-yellow text-xs font-body font-bold uppercase tracking-widest">
            Featured
          </span>
          <span className="font-body text-text-secondary text-xs uppercase tracking-widest">
            {CATEGORY_LABELS[frontmatter.category]}
          </span>
        </div>

        <h2
          className="font-display font-bold text-3xl md:text-4xl text-text leading-tight group-hover:text-brand-yellow transition-colors"
          style={{ letterSpacing: '-0.02em' }}
        >
          {frontmatter.title}
        </h2>

        <p className="font-body text-text-secondary text-base md:text-lg leading-relaxed max-w-2xl">
          {frontmatter.description}
        </p>

        <div className="flex items-center gap-3 font-body text-text-tertiary text-xs">
          <span>{formatDate(frontmatter.date)}</span>
          <span>·</span>
          <span>{readingTime}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${frontmatter.slug}`}
      className="group flex flex-col gap-3 bg-bg-surface border border-bg-border rounded-2xl p-6 hover:border-brand-yellow transition-colors"
    >
      <span className="font-body text-text-secondary text-xs uppercase tracking-widest">
        {CATEGORY_LABELS[frontmatter.category]}
      </span>

      <h3
        className="font-display font-bold text-xl text-text leading-tight group-hover:text-brand-yellow transition-colors"
        style={{ letterSpacing: '-0.02em' }}
      >
        {frontmatter.title}
      </h3>

      <p className="font-body text-text-secondary text-sm leading-relaxed flex-1">
        {frontmatter.description}
      </p>

      <div className="flex items-center gap-2 font-body text-text-tertiary text-xs pt-2">
        <span>{formatDate(frontmatter.date)}</span>
        <span>·</span>
        <span>{readingTime}</span>
      </div>
    </Link>
  );
}
