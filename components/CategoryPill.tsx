import { cn } from '@/lib/utils';

interface CategoryPillProps {
  category: string;
  className?: string;
}

const CATEGORY_COLOURS: Record<string, string> = {
  pun:           'text-brand-yellow  border-brand-yellow/30',
  wordplay:      'text-reaction-cyan    border-reaction-cyan/30',
  'anti-humour': 'text-reaction-pink    border-reaction-pink/30',
  observational: 'text-reaction-lime    border-reaction-lime/30',
  'so-bad':      'text-text-secondary   border-smoke/30',
};

export function CategoryPill({ category, className }: CategoryPillProps) {
  const colours = CATEGORY_COLOURS[category] ?? 'text-text-secondary border-smoke/30';
  return (
    <span
      className={cn(
        'inline-block px-3 py-1 rounded-full border text-xs font-body uppercase tracking-widest',
        colours,
        className
      )}
    >
      {category}
    </span>
  );
}
