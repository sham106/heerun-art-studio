import { motion, MotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { useInteractions } from '@/hooks/use-interactions';

interface InteractiveCardProps extends Omit<MotionProps, 'whileHover' | 'whileTap'> {
  children: ReactNode;
  hoverAnimation?: {
    y?: number;
    scale?: number;
    rotate?: number;
    opacity?: number;
  };
  tapAnimation?: {
    scale?: number;
    y?: number;
  };
  className?: string;
  disabled?: boolean;
}

export function InteractiveCard({
  children,
  hoverAnimation = { y: -8 },
  tapAnimation = { scale: 0.95 },
  className = '',
  disabled = false,
  ...motionProps
}: InteractiveCardProps) {
  const { interactionState, handlers, isMobile } = useInteractions();

  // Determine which animation to use based on device and interaction state
  const getAnimationProps = () => {
    if (disabled) return {};

    if (isMobile) {
      // On mobile, use tap animations and simulate hover on press
      return {
        whileTap: tapAnimation,
        animate: interactionState.isPressed ? hoverAnimation : {},
        transition: { duration: 0.2, ease: 'easeOut' },
      };
    } else {
      // On desktop, use traditional hover animations
      return {
        whileHover: hoverAnimation,
        whileTap: tapAnimation,
        transition: { duration: 0.3, ease: 'easeOut' },
      };
    }
  };

  return (
    <motion.div
      {...motionProps}
      {...getAnimationProps()}
      {...handlers}
      className={`${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      style={{
        ...motionProps.style,
        // Add subtle shadow on mobile when pressed
        boxShadow: isMobile && interactionState.isPressed 
          ? '0 8px 25px rgba(0, 0, 0, 0.15)' 
          : undefined,
      }}
    >
      {children}
    </motion.div>
  );
}

// Specialized components for common use cases
export function InteractiveImageCard({
  children,
  className = '',
  ...props
}: Omit<InteractiveCardProps, 'hoverAnimation' | 'tapAnimation'>) {
  return (
    <InteractiveCard
      hoverAnimation={{ y: -8, scale: 1.02 }}
      tapAnimation={{ scale: 0.98 }}
      className={`group relative overflow-hidden rounded-xl ${className}`}
      {...props}
    >
      {children}
    </InteractiveCard>
  );
}

export function InteractiveServiceCard({
  children,
  className = '',
  ...props
}: Omit<InteractiveCardProps, 'hoverAnimation' | 'tapAnimation'>) {
  return (
    <InteractiveCard
      hoverAnimation={{ y: -8 }}
      tapAnimation={{ scale: 0.98 }}
      className={`h-full ${className}`}
      {...props}
    >
      {children}
    </InteractiveCard>
  );
}
