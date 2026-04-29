import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div
      className={cn('font-display font-bold uppercase leading-none inline-block', className)}
      style={{ letterSpacing: '-0.04em', lineHeight: 0.85 }}
    >
      <div className="text-text">DAD</div>
      <div className="text-brand-yellow theme-light:bg-charcoal theme-light:inline-block theme-light:px-1.5 theme-light:rounded-sm">
        HUMOR.
      </div>
    </div>
  );
}
