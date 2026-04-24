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
}

const MOOD_MAP: Record<StacheMood, string> = {
  'smug':        '/stache/01-smug-default.png',
  'anticipation':'/stache/02-anticipation.png',
  'laughing':    '/stache/03-laughing.png',
  'groan':       '/stache/04-groan.png',
  'mind-blown':  '/stache/05-mind-blown.png',
  'winking':     '/stache/06-winking.png',
  'sleeping':    '/stache/07-sleeping.png',
  'pointing':    '/stache/08-pointing.png',
  'shrugging':   '/stache/09-shrugging.png',
};

const SIZE_MAP: Record<NonNullable<StacheProps['size']>, number> = {
  sm:  60,
  md: 100,
  lg: 160,
  xl: 240,
};

export function Stache({ mood = 'smug', size = 'md', className, priority }: StacheProps) {
  const px = SIZE_MAP[size];
  return (
    <Image
      src={MOOD_MAP[mood]}
      alt={`Stache is ${mood}`}
      width={px}
      height={px}
      priority={priority}
      className={cn('object-contain', className)}
    />
  );
}
