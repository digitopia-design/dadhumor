'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const COOKIE_KEY = 'dh_cookies';

type Consent = 'accepted' | 'essential';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_KEY)) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    setVisible(false);
  }

  function essential() {
    localStorage.setItem(COOKIE_KEY, 'essential');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 px-4 pb-4 pointer-events-none">
      <div
        className={cn(
          'pointer-events-auto mx-auto max-w-xl',
          'bg-charcoal border border-graphite rounded-2xl px-5 py-4',
          'flex flex-col sm:flex-row items-start sm:items-center gap-4'
        )}
      >
        <p className="font-body text-smoke text-sm flex-1">
          We use cookies — nothing weird, just analytics to know which jokes
          land hardest.{' '}
          <Link href="/privacy" className="text-cyan underline underline-offset-2 hover:text-cyan/80">
            Privacy policy
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={essential}
            className="px-4 py-2 rounded-xl border border-graphite font-body text-smoke text-sm hover:text-white transition-colors"
          >
            Essential only
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 rounded-xl bg-yellow text-midnight font-body font-bold text-sm hover:bg-yellow/90 transition-colors"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}

export function getCookieConsent(): Consent | null {
  if (typeof window === 'undefined') return null;
  return (localStorage.getItem(COOKIE_KEY) as Consent) ?? null;
}
