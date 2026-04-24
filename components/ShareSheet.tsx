'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { recordShare } from '@/lib/jokes';
import { track } from '@/lib/analytics';
import type { Joke } from '@/lib/jokes';

interface ShareSheetProps {
  joke: Joke;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareSheet({ joke, isOpen, onClose }: ShareSheetProps) {
  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/j/${joke.slug}`
    : `/j/${joke.slug}`;

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    await recordShare(joke.id);
    track('joke_shared', { joke_id: joke.id, platform: 'copy' });
    onClose();
  }

  async function handleWhatsApp() {
    const text = `${joke.setup}\n\n${joke.punchline}\n\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    await recordShare(joke.id);
    track('joke_shared', { joke_id: joke.id, platform: 'whatsapp' });
    onClose();
  }

  async function handleNativeShare() {
    try {
      await navigator.share({ title: joke.setup, text: joke.punchline, url });
      await recordShare(joke.id);
      track('joke_shared', { joke_id: joke.id, platform: 'native' });
    } catch {
      // user cancelled
    }
    onClose();
  }

  const hasNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-midnight/80 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 inset-x-0 z-50 flex flex-col gap-6 bg-charcoal border-t border-graphite rounded-t-3xl px-6 pt-6 pb-10"
          >
            {/* Handle */}
            <div className="w-10 h-1 rounded-full bg-graphite mx-auto" />

            <h3 className="font-display font-bold text-2xl text-white text-center">
              Share this banger.
            </h3>

            {/* Joke preview */}
            <div className="bg-midnight border border-graphite rounded-2xl px-6 py-5 flex flex-col gap-3 text-center">
              <p className="font-body text-smoke text-sm">{joke.setup}</p>
              <p className="font-display font-bold text-yellow text-lg leading-tight">
                {joke.punchline}
              </p>
              <p className="font-body text-smoke/50 text-xs">{url}</p>
            </div>

            {/* Share buttons */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl bg-midnight border border-graphite hover:border-cyan hover:text-cyan text-smoke font-body text-sm transition-colors"
                >
                  <span className="text-2xl">📋</span>
                  Copy link
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl bg-midnight border border-graphite hover:border-lime hover:text-lime text-smoke font-body text-sm transition-colors"
                >
                  <span className="text-2xl">💬</span>
                  WhatsApp
                </button>

                {hasNativeShare && (
                  <button
                    onClick={handleNativeShare}
                    className="flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl bg-midnight border border-graphite hover:border-yellow hover:text-yellow text-smoke font-body text-sm transition-colors"
                  >
                    <span className="text-2xl">↑</span>
                    Share
                  </button>
                )}
              </div>

              <p className="font-body text-smoke/40 text-xs text-center">
                Story and image cards coming soon.
              </p>
            </div>

            <button
              onClick={onClose}
              className={cn(
                'w-full py-4 rounded-2xl border border-graphite',
                'font-body font-bold text-smoke hover:text-white transition-colors'
              )}
            >
              Cancel
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
