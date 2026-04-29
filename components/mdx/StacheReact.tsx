import { Stache, type StacheMood } from '@/components/Stache';

interface StacheReactProps {
  mood: StacheMood;
  caption?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StacheReact({ mood, caption, size = 'md' }: StacheReactProps) {
  return (
    <figure className="flex flex-col items-center gap-3 my-10">
      <Stache mood={mood} size={size} />
      {caption && (
        <figcaption className="font-body italic text-text-secondary text-sm text-center max-w-md">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
