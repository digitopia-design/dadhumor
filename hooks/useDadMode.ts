'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'dh_dad_mode';
const CAMPAIGN_START = new Date('2026-01-01T00:00:00Z');
const CAMPAIGN_END = new Date('2026-06-26T00:00:00Z'); // auto-disables 26 June

function isCampaignLive(): boolean {
  const now = new Date();
  return now >= CAMPAIGN_START && now < CAMPAIGN_END;
}

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
