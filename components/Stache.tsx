import Image from 'next/image';
import { cn } from '@/lib/utils';

export type StacheMood =
  | 'smug'
  | 'anticipation'
  | 'laughing'
  | 'groan'
  | 'mind-blown'
  | 'winking'
  | 'sleeping'
  | 'pointing'
  | 'shrugging';

interface StacheProps {
  mood?: StacheMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  priority?: boolean;
  // Set true during Father's Day campaign - swaps to Premium Dad Stache assets.
  // Replace files in /public/stache/dad/ with Midjourney-generated variants before 1 June.
  dadMode?: boolean;
}

const MOOD_MAP: Record<StacheMood, string> = {
  'smug':         '/stache/01-smug-default.png',
  'anticipation': '/stache/02-anticipation.png',
  'laughing':     '/stache/03-laughing.png',
  'groan':        '/stache/04-groan.png',
  'mind-blown':   '/stache/05-mind-blown.png',
  'winking':      '/stache/06-winking.png',
  'sleeping':     '/stache/07-sleeping.png',
  'pointing':     '/stache/08-pointing.png',
  'shrugging':    '/stache/09-shrugging.png',
};

const DAD_MOOD_MAP: Record<StacheMood, string> = {
  'smug':         '/stache/dad/01-smug-default.png',
  'anticipation': '/stache/dad/02-anticipation.png',
  'laughing':     '/stache/dad/03-laughing.png',
  'groan':        '/stache/dad/04-groan.png',
  'mind-blown':   '/stache/dad/05-mind-blown.png',
  'winking':      '/stache/dad/06-winking.png',
  'sleeping':     '/stache/dad/07-sleeping.png',
  'pointing':     '/stache/dad/08-pointing.png',
  'shrugging':    '/stache/dad/09-shrugging.png',
};

const SIZE_MAP: Record<NonNullable<StacheProps['size']>, number> = {
  sm:  60,
  md: 100,
  lg: 160,
  xl: 240,
};

export function Stache({ mood = 'smug', size = 'md', className, priority, dadMode = false }: StacheProps) {
  const px  = SIZE_MAP[size];
  const map = dadMode ? DAD_MOOD_MAP : MOOD_MAP;

  return (
    <Image
      src={map[mood]}
      alt={`Stache is ${mood}`}
      width={px}
      height={px}
      priority={priority}
      className={cn('object-contain transition-opacity duration-300', className)}
    />
  );
}
