'use client';

import { useState, useEffect } from 'react';
import { isCampaignLive } from '@/lib/campaign';

const STORAGE_KEY = 'dh_dad_mode';

export function useDadMode() {
  const [isDadMode, setIsDadMode] = useState(false);
  const campaignActive = isCampaignLive();

  useEffect(() => {
    if (!campaignActive) {
      // Campaign over - clear any stored preference
      localStorage.removeItem(STORAGE_KEY);
      setIsDadMode(false);
      return;
    }
    setIsDadMode(localStorage.getItem(STORAGE_KEY) === 'true');
  }, [campaignActive]);

  function toggleDadMode() {
    if (!campaignActive) return;
    setIsDadMode(prev => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  return { isDadMode, toggleDadMode, campaignActive };
}
