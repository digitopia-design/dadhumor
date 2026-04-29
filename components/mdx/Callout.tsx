import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type CalloutType = 'data' | 'warning' | 'tip' | 'joke';

interface CalloutProps {
  type?: CalloutType;
  children: ReactNode;
}

const TYPE_CONFIG: Record<CalloutType, { label: string; icon: string; border: string; iconColor: string }> = {
  data: {
    label: 'Data',
    icon: '📊',
    border: 'border-l-reaction-cyan',
    iconColor: 'text-reaction-cyan',
  },
  warning: {
    label: 'Heads up',
    icon: '⚠️',
    border: 'border-l-reaction-red',
    iconColor: 'text-reaction-red',
  },
  tip: {
    label: 'Tip',
    icon: '💡',
    border: 'border-l-reaction-lime',
    iconColor: 'text-reaction-lime',
  },
  joke: {
    label: 'Joke',
    icon: '🎭',
    border: 'border-l-brand-yellow',
    iconColor: 'text-brand-yellow',
  },
};

export function Callout({ type = 'tip', children }: CalloutProps) {
  const config = TYPE_CONFIG[type];

  return (
    <aside
      className={cn(
        'my-8 bg-bg-surface rounded-r-2xl rounded-l-md border-l-4 border-y border-r border-bg-border px-6 py-5',
        config.border
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={cn('text-base', config.iconColor)}>{config.icon}</span>
        <span className={cn('font-display font-bold text-xs uppercase tracking-widest', config.iconColor)}>
          {config.label}
        </span>
      </div>
      <div className="font-body text-text leading-relaxed [&>p]:m-0 [&>p+p]:mt-3">
        {children}
      </div>
    </aside>
  );
}
