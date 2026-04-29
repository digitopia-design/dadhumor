'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';

type State = 'idle' | 'loading' | 'success' | 'error';

export function EmailCapture() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || state === 'loading') return;
    setState('loading');

    try {
      const res = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tag: 'fathers_day_2026' }),
      });

      if (!res.ok) throw new Error();

      setState('success');
      track('fathers_day_lead_capture', { email_domain: email.split('@')[1] });
    } catch {
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="font-display font-bold text-2xl text-brand-yellow">
          Check your inbox.
        </p>
        <p className="font-body text-text-secondary">
          20 fresh groans, incoming. He'll never see them coming.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        className={cn(
          'flex-1 px-4 py-3 rounded-xl bg-bg-surface border font-body text-text placeholder:text-text-secondary/50',
          'focus:outline-none focus:border-brand-yellow transition-colors',
          state === 'error' ? 'border-reaction-red' : 'border-bg-border'
        )}
      />
      <button
        type="submit"
        disabled={state === 'loading'}
        className="px-6 py-3 rounded-xl bg-brand-yellow text-midnight font-body font-bold hover:bg-brand-yellow/90 transition-colors disabled:opacity-50 shrink-0"
      >
        {state === 'loading' ? 'Sending…' : 'Send me the jokes'}
      </button>
      {state === 'error' && (
        <p className="text-reaction-red font-body text-sm w-full">
          Oof. Something went wrong. Try again?
        </p>
      )}
    </form>
  );
}
