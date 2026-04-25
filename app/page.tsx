'use client';

import { useState, useEffect } from 'react';
import { useJoke } from '@/hooks/useJoke';
import { JokeCard } from '@/components/JokeCard';
import { SwipeableCard } from '@/components/SwipeableCard';
import { ActionBar } from '@/components/ActionBar';
import { Logo } from '@/components/Logo';
import { Stache, type StacheMood } from '@/components/Stache';
import { Onboarding } from '@/components/Onboarding';
import { ShareSheet } from '@/components/ShareSheet';
import { DadModeToggle } from '@/components/DadModeToggle';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useDadMode } from '@/hooks/useDadMode';
import { giveProps, giveGroan } from '@/lib/jokes';
import { addToStash, removeFromStash, isStashed } from '@/lib/stash';
import { markProps, markGroaned, markStashed, hasGivenProps, hasGroaned } from '@/lib/reactions';
import { track } from '@/lib/analytics';

export default function Home() {
  const { joke, loading, loadNext } = useJoke();
  const { show: showOnboarding, step: onboardingStep, totalSteps, next: nextStep, skip: skipOnboarding } = useOnboarding();
  const { isDadMode, toggleDadMode, campaignActive } = useDadMode();
  const [isRevealed, setIsRevealed] = useState(false);
  const [stashed, setStashed] = useState(false);
  const [propsGiven, setPropsGiven] = useState(false);
  const [groaned, setGroaned] = useState(false);
  const [lastReaction, setLastReaction] = useState<'props' | 'groaned' | 'stashed' | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const stacheMood: StacheMood = (() => {
    if (loading)                      return 'anticipation';
    if (lastReaction === 'groaned')   return 'groan';
    if (lastReaction === 'props')     return 'laughing';
    if (lastReaction === 'stashed')   return stashed ? 'winking' : 'smug';
    if (isRevealed)                   return 'mind-blown';
    return 'smug';
  })();

  useEffect(() => {
    if (!joke) return;
    setLastReaction(null);
    setStashed(isStashed(joke.id));
    setPropsGiven(hasGivenProps(joke.id));
    setGroaned(hasGroaned(joke.id));
    track('joke_viewed', { joke_id: joke.id, category: joke.category });
  }, [joke]);

  function handleReveal() {
    setIsRevealed(true);
    track('punchline_revealed', { joke_id: joke?.id });
  }

  async function handleNext() {
    setIsRevealed(false);
    await loadNext();
  }

  async function handleProps() {
    if (!joke) return;
    if (!propsGiven) {
      setPropsGiven(true);
      setLastReaction('props');
      markProps(joke.id);
      giveProps(joke.id); // fire and forget
      track('props_given', { joke_id: joke.id, via: 'button' });
    }
    handleNext(); // always auto-advance on swipe right / props button
  }

  async function handleGroan() {
    if (!joke || groaned) return;
    setGroaned(true);
    setLastReaction('groaned');
    markGroaned(joke.id);
    await giveGroan(joke.id);
    track('joke_groaned', { joke_id: joke.id, via: 'button' });
  }

  function handleStash() {
    if (!joke) return;
    setLastReaction('stashed');
    if (stashed) {
      removeFromStash(joke.id);
      markStashed(joke.id, false);
      setStashed(false);
      track('joke_unstashed', { joke_id: joke.id });
    } else {
      addToStash(joke.id);
      markStashed(joke.id, true);
      setStashed(true);
      track('joke_stashed', { joke_id: joke.id, via: 'button' });
    }
  }

  function handleShare() {
    if (!joke) return;
    setShareOpen(true);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.target !== document.body) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (!isRevealed) handleReveal();
        else handleNext();
      }
      if (e.code === 'ArrowLeft')  handleNext();
      if (e.code === 'ArrowRight') handleProps();
      if (e.code === 'ArrowUp')    handleShare();
      if (e.key  === 'g' || e.key === 'G') handleGroan();
      if ((e.key === 's' || e.key === 'S') && e.shiftKey) handleStash();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRevealed, joke, stashed, propsGiven, groaned]);

  if (loading && !joke) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6">
        <Stache mood="anticipation" size="lg" priority />
        <p className="font-body text-smoke animate-pulse">Fetching fresh groans...</p>
      </main>
    );
  }

  if (!joke) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="font-body text-red">Oof. Something broke. Try again?</p>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between px-6 py-8 z-10">
      {showOnboarding && (
        <Onboarding
          step={onboardingStep}
          totalSteps={totalSteps}
          onNext={nextStep}
          onSkip={skipOnboarding}
        />
      )}
      <ShareSheet
        joke={joke}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />
      <header className="w-full max-w-xl flex items-center justify-between">
        <Logo className="text-xl" />
        <div className="flex items-center gap-3">
          <DadModeToggle
            isDadMode={isDadMode}
            onToggle={toggleDadMode}
            campaignActive={campaignActive}
          />
          <span className="font-body text-smoke text-xs uppercase tracking-widest">
            #{joke.id}
          </span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center w-full gap-6 py-8">
        <Stache mood={stacheMood} size="lg" priority dadMode={isDadMode} />
        <SwipeableCard
          onSwipeLeft={handleNext}
          onSwipeRight={handleProps}
          onSwipeUp={handleShare}
          onTap={!isRevealed ? handleReveal : () => {}}
          dragEnabled={isRevealed}
        >
          <JokeCard joke={joke} isRevealed={isRevealed} />
        </SwipeableCard>
      </div>

      <div className="w-full max-w-xl flex flex-col items-center gap-4 pb-4">
        {isRevealed && (
          <ActionBar
            joke={joke}
            onNext={handleNext}
            onProps={handleProps}
            onGroan={handleGroan}
            onStash={handleStash}
            onShare={handleShare}
            isStashed={stashed}
            hasProps={propsGiven}
            hasGroaned={groaned}
          />
        )}
        {!isRevealed && (
          <p className="font-body text-smoke/50 text-xs">
            tap card · space to reveal · ← → ↑ for actions
          </p>
        )}
      </div>
    </main>
  );
}
