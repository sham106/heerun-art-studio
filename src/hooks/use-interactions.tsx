import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

export interface InteractionState {
  isHovered: boolean;
  isPressed: boolean;
  isFocused: boolean;
}

export function useInteractions() {
  const isMobile = useIsMobile();
  const [interactionState, setInteractionState] = useState<InteractionState>({
    isHovered: false,
    isPressed: false,
    isFocused: false,
  });

  const handleMouseEnter = () => {
    if (!isMobile) {
      setInteractionState(prev => ({ ...prev, isHovered: true }));
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setInteractionState(prev => ({ ...prev, isHovered: false }));
    }
  };

  const handleMouseDown = () => {
    setInteractionState(prev => ({ ...prev, isPressed: true }));
  };

  const handleMouseUp = () => {
    setInteractionState(prev => ({ ...prev, isPressed: false }));
  };

  const handleFocus = () => {
    setInteractionState(prev => ({ ...prev, isFocused: true }));
  };

  const handleBlur = () => {
    setInteractionState(prev => ({ ...prev, isFocused: false }));
  };

  const handleTouchStart = () => {
    if (isMobile) {
      setInteractionState(prev => ({ ...prev, isPressed: true }));
    }
  };

  const handleTouchEnd = () => {
    if (isMobile) {
      setInteractionState(prev => ({ ...prev, isPressed: false }));
    }
  };

  // For mobile, simulate hover effect on touch
  useEffect(() => {
    if (isMobile && interactionState.isPressed) {
      const timer = setTimeout(() => {
        setInteractionState(prev => ({ ...prev, isHovered: true }));
      }, 100);
      return () => clearTimeout(timer);
    } else if (isMobile && !interactionState.isPressed) {
      const timer = setTimeout(() => {
        setInteractionState(prev => ({ ...prev, isHovered: false }));
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isMobile, interactionState.isPressed]);

  return {
    interactionState,
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
    },
    isMobile,
  };
}
