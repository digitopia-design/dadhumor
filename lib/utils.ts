import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getSetupSize(setup: string): string {
  return setup.length > 40
    ? 'text-[20px] md:text-[28px]'
    : 'text-[24px] md:text-[36px]';
}

export function getPunchlineSize(punchline: string): string {
  if (punchline.length < 10) return 'text-[48px] md:text-[72px]';
  if (punchline.length > 60) return 'text-[28px] md:text-[44px]';
  return 'text-[36px] md:text-[56px]';
}
