'use client';

import { useState, useEffect } from 'react';

const FATHERS_DAY = new Date('2026-06-21T00:00:00Z');

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(): TimeLeft {
  const diff = Math.max(0, FATHERS_DAY.getTime() - Date.now());
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-display font-bold text-yellow text-5xl md:text-7xl leading-none tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="font-body text-smoke text-xs uppercase tracking-widest">{label}</span>
    </div>
  );
}

export function CountdownTimer() {
  const [time, setTime] = useState<TimeLeft>(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (FATHERS_DAY <= new Date()) {
    return (
      <p className="font-display font-bold text-yellow text-3xl">
        Happy Father's Day! 🎉
      </p>
    );
  }

  return (
    <div className="flex items-start gap-6 md:gap-10">
      <Unit value={time.days}    label="days"    />
      <Unit value={time.hours}   label="hours"   />
      <Unit value={time.minutes} label="minutes" />
      <Unit value={time.seconds} label="seconds" />
    </div>
  );
}
