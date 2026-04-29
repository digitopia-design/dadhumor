'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { haptic } from '@/lib/haptic';
import type { Joke } from '@/lib/jokes';

interface ActionBarProps {
  joke: Joke;
  onNext: () => void;
  onProps: () => void;
  onGroan: () => void;
  onStash: () => void;
  onShare: () => void;
  isStashed: boolean;
  hasProps: boolean;
  hasGroaned: boolean;
}

const GROAN_DURATION = 800;

export function ActionBar({
  joke: _joke,
  onNext,
  onProps,
  onGroan,
  onStash,
  onShare,
  isStashed,
  hasProps,
  hasGroaned,
}: ActionBarProps) {
  const [groanProgress, setGroanProgress] = useState(0);
  const groanTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const groanStart = useRef<number | null>(null);

  function startGroan(e: React.PointerEvent<HTMLButtonElement>) {
    // capture pointer so onPointerLeave doesn't fire if mouse drifts off button
    e.currentTarget.setPointerCapture(e.pointerId);
    haptic.groanBuild();
    groanStart.current = Date.now();
    groanTimer.current = setInterval(() => {
      const elapsed = Date.now() - (groanStart.current ?? 0);
      const progress = Math.min(elapsed / GROAN_DURATION, 1);
      setGroanProgress(progress);
      if (progress >= 1) {
        endGroan(true);
      }
    }, 16);
  }

  function endGroan(completed: boolean) {
    if (!groanTimer.current) return; // already ended, no-op
    clearInterval(groanTimer.current);
    groanTimer.current = null;
    groanStart.current = null;
    setGroanProgress(0);
    if (completed) {
      haptic.groanHit();
      onGroan();
    } else {
      haptic.stop();
    }
  }

  return (
    <div className="w-full max-w-xl flex items-center gap-3">
      <button
        onPointerDown={hasGroaned || hasProps ? undefined : startGroan}
        onPointerUp={() => endGroan(false)}
        onPointerLeave={() => endGroan(false)}
        disabled={hasProps}
        className={cn(
          'relative flex-1 py-4 rounded-2xl border font-body font-bold text-sm transition-colors overflow-hidden',
          hasGroaned && 'bg-reaction-pink/20 border-reaction-pink text-reaction-pink',
          hasProps && 'border-bg-border text-text-secondary/30 cursor-not-allowed',
          !hasGroaned && !hasProps && 'bg-bg-surface border-bg-border text-text-secondary hover:border-reaction-pink hover:text-reaction-pink cursor-pointer'
        )}
      >
        {groanProgress > 0 && (
          <span
            className="absolute inset-0 bg-reaction-pink/20 origin-left transition-none"
            style={{ transform: `scaleX(${groanProgress})` }}
          />
        )}
        <span className="relative flex flex-col items-center leading-tight">
          <span>🙄 Groan</span>
          {!hasGroaned && !hasProps && (
            <span className="text-[10px] font-normal opacity-50">hold</span>
          )}
        </span>
      </button>

      <button
        onClick={() => { haptic.medium(); onProps(); }}
        disabled={hasGroaned}
        className={cn(
          'flex-1 py-4 rounded-2xl border font-body font-bold text-sm transition-colors',
          hasProps && 'bg-reaction-lime/20 border-reaction-lime text-reaction-lime',
          hasGroaned && 'border-bg-border text-text-secondary/30 cursor-not-allowed',
          !hasProps && !hasGroaned && 'bg-bg-surface border-bg-border text-text-secondary hover:border-reaction-lime hover:text-reaction-lime cursor-pointer'
        )}
      >
        🤝 Props
      </button>

      <button
        onClick={() => { haptic.double(); onStash(); }}
        className={cn(
          'px-4 py-4 rounded-2xl border font-body font-bold text-base transition-colors',
          isStashed
            ? 'bg-brand-yellow/20 border-brand-yellow text-brand-yellow'
            : 'bg-bg-surface border-bg-border text-text-secondary hover:border-brand-yellow hover:text-brand-yellow'
        )}
        aria-label={isStashed ? 'Unstash joke' : 'Stash joke'}
      >
        {isStashed ? '📌' : '🔖'}
      </button>

      <button
        onClick={() => { haptic.light(); onShare(); }}
        className="px-4 py-4 rounded-2xl border border-bg-border bg-bg-surface text-text-secondary hover:border-reaction-cyan hover:text-reaction-cyan font-body font-bold text-base transition-colors"
        aria-label="Share joke"
      >
        ↑
      </button>

      <button
        onClick={() => { haptic.light(); onNext(); }}
        className="flex-1 py-4 rounded-2xl bg-brand-yellow hover:bg-brand-yellow/90 text-midnight font-body font-bold text-base transition-colors shadow-[0_0_15px_rgba(227,255,0,0.25)]"
      >
        Next →
      </button>
    </div>
  );
}
