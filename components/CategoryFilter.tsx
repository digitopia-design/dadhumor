'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ARTICLE_CATEGORIES, type ArticleCategory } from '@/types/content';

const LABELS: Record<ArticleCategory | 'all', string> = {
  all: 'All',
  data: 'Data',
  guides: 'Guides',
  press: 'Press',
  brand: 'Brand',
  jokes: 'Jokes',
};

interface CategoryFilterProps {
  counts: Record<ArticleCategory, number>;
  total: number;
}

export function CategoryFilter({ counts, total }: CategoryFilterProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get('category') ?? 'all';

  function href(category: 'all' | ArticleCategory) {
    if (category === 'all') return pathname;
    return `${pathname}?category=${category}`;
  }

  const items: ('all' | ArticleCategory)[] = ['all', ...ARTICLE_CATEGORIES];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map(cat => {
        const isActive = active === cat;
        const count = cat === 'all' ? total : counts[cat] ?? 0;
        if (cat !== 'all' && count === 0) return null;
        return (
          <Link
            key={cat}
            href={href(cat)}
            className={cn(
              'px-4 py-2 rounded-full font-body text-sm border transition-colors',
              isActive
                ? 'bg-text text-text-inverse border-text'
                : 'border-bg-border text-text-secondary hover:border-text hover:text-text'
            )}
          >
            {LABELS[cat]}
            <span className="ml-2 opacity-50">{count}</span>
          </Link>
        );
      })}
    </div>
  );
}
