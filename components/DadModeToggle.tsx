'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DadModeToggleProps {
  isDadMode: boolean;
  onToggle: () => void;
  campaignActive: boolean;
}

export function DadModeToggle({ isDadMode, onToggle, campaignActive }: DadModeToggleProps) {
  if (!campaignActive) return null;

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        onClick={onToggle}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-body text-xs font-bold uppercase tracking-widest transition-colors',
          isDadMode
            ? 'bg-brand-yellow text-midnight border-brand-yellow'
            : 'bg-transparent text-text-secondary border-bg-border hover:border-brand-yellow hover:text-brand-yellow'
        )}
      >
        <span>👔</span>
        <span>Dad Mode</span>
      </motion.button>
    </AnimatePresence>
  );
}
