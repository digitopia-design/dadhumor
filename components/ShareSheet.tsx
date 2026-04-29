'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { recordShare } from '@/lib/jokes';
import { track } from '@/lib/analytics';
import { isCampaignLive } from '@/lib/campaign';
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

  const [campaignActive] = useState(() => isCampaignLive());

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

  async function handleSendToDad() {
    const text = `Your material is looking thin this year 👔\n\n${joke.setup}\n\n${joke.punchline}\n\n${url}\n\nYou're welcome. (Sorry.)`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    await recordShare(joke.id);
    track('send_to_dad_clicked', { joke_id: joke.id });
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
            className="fixed inset-0 z-40 bg-bg/80 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 inset-x-0 z-50 flex flex-col gap-6 bg-bg-surface border-t border-bg-border rounded-t-3xl px-6 pt-6 pb-10"
          >
            {/* Handle */}
            <div className="w-10 h-1 rounded-full bg-bg-border mx-auto" />

            <h3 className="font-display font-bold text-2xl text-text text-center">
              {campaignActive ? "Send it. He deserves this." : "Share this banger."}
            </h3>

            {/* Joke preview */}
            <div className="bg-bg border border-bg-border rounded-2xl px-6 py-5 flex flex-col gap-3 text-center">
              <p className="font-body text-text-secondary text-sm">{joke.setup}</p>
              <p className="font-display font-bold text-brand-yellow text-lg leading-tight">
                {joke.punchline}
              </p>
              <p className="font-body text-text-secondary/50 text-xs">{url}</p>
            </div>

            {/* Share buttons */}
            <div className="flex flex-col gap-3">
              {/* Send to Dad - campaign priority placement */}
              {campaignActive && (
                <button
                  onClick={handleSendToDad}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-brand-yellow text-midnight font-body font-bold text-base hover:bg-brand-yellow/90 transition-colors"
                >
                  <span>👔</span>
                  Send to Dad
                </button>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl bg-bg border border-bg-border hover:border-reaction-cyan hover:text-reaction-cyan text-text-secondary font-body text-sm transition-colors"
                >
                  <span className="text-2xl">📋</span>
                  Copy link
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl bg-bg border border-bg-border hover:border-reaction-lime hover:text-reaction-lime text-text-secondary font-body text-sm transition-colors"
                >
                  <span className="text-2xl">💬</span>
                  WhatsApp
                </button>

                {hasNativeShare && (
                  <button
                    onClick={handleNativeShare}
                    className="flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl bg-bg border border-bg-border hover:border-brand-yellow hover:text-brand-yellow text-text-secondary font-body text-sm transition-colors"
                  >
                    <span className="text-2xl">↑</span>
                    Share
                  </button>
                )}
              </div>

              <p className="font-body text-text-secondary/40 text-xs text-center">
                Story and image cards coming soon.
              </p>
            </div>

            <button
              onClick={onClose}
              className={cn(
                'w-full py-4 rounded-2xl border border-bg-border',
                'font-body font-bold text-text-secondary hover:text-text transition-colors'
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
