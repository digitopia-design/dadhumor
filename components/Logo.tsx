import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn('font-display font-bold leading-none tracking-tight', className)}>
      <div className="text-white">DAD</div>
      <div className="text-yellow">HUMOR.</div>
    </div>
  );
}
