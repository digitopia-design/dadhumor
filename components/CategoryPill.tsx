import { cn } from '@/lib/utils';

interface CategoryPillProps {
  category: string;
  className?: string;
}

const CATEGORY_COLOURS: Record<string, string> = {
  pun:           'text-yellow  border-yellow/30',
  wordplay:      'text-cyan    border-cyan/30',
  'anti-humour': 'text-pink    border-pink/30',
  observational: 'text-lime    border-lime/30',
  'so-bad':      'text-smoke   border-smoke/30',
};

export function CategoryPill({ category, className }: CategoryPillProps) {
  const colours = CATEGORY_COLOURS[category] ?? 'text-smoke border-smoke/30';
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
