'use client';

import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
  type PanInfo,
} from 'framer-motion';
import { haptic } from '@/lib/haptic';

const SWIPE_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 500;

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp: () => void;
  onTap: () => void;
  dragEnabled?: boolean;
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onTap,
  dragEnabled = true,
}: SwipeableCardProps) {
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-12, 12]);

  const rightOpacity = useTransform(x, [20, SWIPE_THRESHOLD], [0, 1]);
  const leftOpacity  = useTransform(x, [-SWIPE_THRESHOLD, -20], [1, 0]);
  const upOpacity    = useTransform(y, [-SWIPE_THRESHOLD, -20], [1, 0]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    const { offset, velocity } = info;
    const swipedRight = offset.x >  SWIPE_THRESHOLD || velocity.x >  VELOCITY_THRESHOLD;
    const swipedLeft  = offset.x < -SWIPE_THRESHOLD || velocity.x < -VELOCITY_THRESHOLD;
    const swipedUp    = offset.y < -SWIPE_THRESHOLD || velocity.y < -VELOCITY_THRESHOLD;

    if (swipedUp)         { haptic.light();  onSwipeUp(); }
    else if (swipedRight) { haptic.medium(); onSwipeRight(); }
    else if (swipedLeft)  { haptic.light();  onSwipeLeft(); }
  }

  // Respect reduced motion - render a plain tappable wrapper
  if (prefersReducedMotion) {
    return (
      <div className="w-full max-w-xl" onClick={onTap}>
        {children}
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-xl select-none">
      {/* Swipe direction indicators */}
      <motion.div
        style={{ opacity: rightOpacity }}
        className="absolute inset-y-0 left-6 flex items-center pointer-events-none z-10"
      >
        <span className="font-display font-bold text-xl text-reaction-lime drop-shadow-lg">
          PROPS 🤝
        </span>
      </motion.div>

      <motion.div
        style={{ opacity: leftOpacity }}
        className="absolute inset-y-0 right-6 flex items-center pointer-events-none z-10"
      >
        <span className="font-display font-bold text-xl text-brand-yellow drop-shadow-lg">
          NEXT →
        </span>
      </motion.div>

      <motion.div
        style={{ opacity: upOpacity }}
        className="absolute inset-x-0 top-6 flex justify-center pointer-events-none z-10"
      >
        <span className="font-display font-bold text-xl text-reaction-cyan drop-shadow-lg">
          ↑ SHARE
        </span>
      </motion.div>

      <motion.div
        style={{ x, y, rotate }}
        drag={dragEnabled}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={{ top: 0.4, left: 0.4, right: 0.4, bottom: 0.1 }}
        dragMomentum={false}
        onDragEnd={dragEnabled ? handleDragEnd : undefined}
        onTap={onTap}
        className={dragEnabled ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}
      >
        {children}
      </motion.div>
    </div>
  );
}
