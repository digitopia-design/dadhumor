'use client';

import { useEffect, useState } from 'react';

interface ReadingProgressProps {
  targetId?: string;
}

export function ReadingProgress({ targetId = 'article-body' }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    function update() {
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const start = window.scrollY + rect.top;
      const end = start + target.offsetHeight - window.innerHeight;
      const distance = Math.max(end - start, 1);
      const current = window.scrollY - start;
      const ratio = Math.min(Math.max(current / distance, 0), 1);
      setProgress(ratio * 100);
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [targetId]);

  return (
    <div
      className="fixed top-0 inset-x-0 z-30 h-0.5 bg-transparent print:hidden"
      aria-hidden="true"
    >
      <div
        className="h-full bg-brand-yellow transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
