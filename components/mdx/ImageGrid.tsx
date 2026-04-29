import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ImageGridProps {
  columns?: 2 | 3 | 4;
  children: ReactNode;
}

const COLUMN_CLASSES: Record<NonNullable<ImageGridProps['columns']>, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
};

export function ImageGrid({ columns = 3, children }: ImageGridProps) {
  return (
    <div
      className={cn(
        'grid gap-3 my-8 [&_img]:rounded-xl [&_img]:w-full [&_img]:h-full [&_img]:object-cover',
        COLUMN_CLASSES[columns]
      )}
    >
      {children}
    </div>
  );
}
