import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div
      className={cn('font-display font-bold uppercase leading-none', className)}
      style={{ letterSpacing: '-0.04em', lineHeight: 0.85 }}
    >
      <div className="text-text">DAD</div>
      <div className="text-brand-yellow">HUMOR.</div>
    </div>
  );
}
