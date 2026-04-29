'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  targetId?: string;
}

export function TableOfContents({ targetId = 'article-body' }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const nodes = target.querySelectorAll<HTMLElement>('h2[id], h3[id]');
    const list: Heading[] = Array.from(nodes).map(node => ({
      id: node.id,
      text: node.textContent?.replace(/[#¶]/g, '').trim() ?? '',
      level: node.tagName === 'H2' ? 2 : 3,
    }));
    setHeadings(list);

    if (list.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the heading nearest the top of the viewport
          const topMost = visible.reduce((best, e) =>
            e.boundingClientRect.top < best.boundingClientRect.top ? e : best
          );
          setActiveId(topMost.target.id);
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: [0, 1] }
    );

    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [targetId]);

  if (headings.length < 3) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-20 hidden lg:block w-56 self-start print:hidden"
    >
      <p className="font-display font-bold text-text text-xs uppercase tracking-widest mb-3">
        On this page
      </p>
      <ul className="flex flex-col gap-2 border-l border-bg-border">
        {headings.map(h => (
          <li key={h.id} className={cn(h.level === 3 && 'pl-3')}>
            <a
              href={`#${h.id}`}
              className={cn(
                'block pl-4 -ml-px border-l-2 font-body text-sm leading-snug py-1 transition-colors',
                activeId === h.id
                  ? 'border-brand-yellow text-text'
                  : 'border-transparent text-text-secondary hover:text-text'
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
