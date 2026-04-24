'use client';

import { useState, useEffect } from 'react';

const ONBOARDING_KEY = 'dh_onboarded';
const TOTAL_STEPS = 3;

export function useOnboarding() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem(ONBOARDING_KEY)) setShow(true);
  }, []);

  function next() {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    } else {
      complete();
    }
  }

  function skip() {
    complete();
  }

  function complete() {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShow(false);
  }

  return { show, step, totalSteps: TOTAL_STEPS, next, skip };
}
