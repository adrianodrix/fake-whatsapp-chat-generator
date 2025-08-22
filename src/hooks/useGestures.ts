/**
 * Custom hook for handling touch gestures
 * Manages swipe detection, long press, and gesture callbacks
 */

import { useState, useCallback, useRef, useMemo } from 'react';
import {
  getTouchPoint,
  processGesture,
  isValidSwipe,
  triggerHapticFeedback,
  debounceGesture,
  measureGesturePerformance,
  type TouchPoint,
  type SwipeGesture,
  type GestureConfig,
  DEFAULT_GESTURE_CONFIG,
} from '../utils/gestures';

export interface GestureHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onLongPress?: () => void;
  onTap?: () => void;
}

export interface UseGesturesOptions {
  config?: Partial<GestureConfig>;
  hapticFeedback?: boolean;
  preventScrollDuringSwipe?: boolean;
  debounceDelay?: number;
}

export interface UseGesturesReturn {
  // Touch event handlers for React components
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;

  // Gesture state
  isGesturing: boolean;
  currentGesture: SwipeGesture | null;

  // Utility methods
  resetGesture: () => void;
  isEnabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

/**
 * Custom hook for gesture handling
 */
export const useGestures = (
  handlers: GestureHandlers,
  options: UseGesturesOptions = {}
): UseGesturesReturn => {
  const {
    config = {},
    hapticFeedback = true,
    preventScrollDuringSwipe = false,
    debounceDelay = 50,
  } = options;

  // Merge default config with user options - memoized to prevent hook dependency issues
  const gestureConfig = useMemo(
    (): GestureConfig => ({
      ...DEFAULT_GESTURE_CONFIG,
      ...config,
    }),
    [config]
  );

  // State management
  const [isGesturing, setIsGesturing] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<SwipeGesture | null>(
    null
  );
  const [isEnabled, setEnabled] = useState(true);

  // Refs for gesture tracking
  const touchStartRef = useRef<TouchPoint | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggedLongPressRef = useRef(false);

  // Debounced handlers to prevent excessive firing
  const debouncedOnSwipeLeft = useMemo(
    () => debounceGesture(() => handlers.onSwipeLeft?.(), debounceDelay),
    [handlers, debounceDelay]
  );

  const debouncedOnSwipeRight = useMemo(
    () => debounceGesture(() => handlers.onSwipeRight?.(), debounceDelay),
    [handlers, debounceDelay]
  );

  const debouncedOnSwipeUp = useMemo(
    () => debounceGesture(() => handlers.onSwipeUp?.(), debounceDelay),
    [handlers, debounceDelay]
  );

  const debouncedOnSwipeDown = useMemo(
    () => debounceGesture(() => handlers.onSwipeDown?.(), debounceDelay),
    [handlers, debounceDelay]
  );

  // Clear long press timer
  const clearLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  // Handle gesture completion
  const handleGestureComplete = useCallback(
    (gesture: SwipeGesture) => {
      measureGesturePerformance('handleGestureComplete', () => {
        if (!isValidSwipe(gesture, gestureConfig)) {
          return;
        }

        // Trigger haptic feedback
        if (hapticFeedback) {
          triggerHapticFeedback('light');
        }

        // Execute appropriate handler
        switch (gesture.direction) {
          case 'left':
            debouncedOnSwipeLeft();
            break;
          case 'right':
            debouncedOnSwipeRight();
            break;
          case 'up':
            debouncedOnSwipeUp();
            break;
          case 'down':
            debouncedOnSwipeDown();
            break;
        }
      });
    },
    [
      gestureConfig,
      hapticFeedback,
      debouncedOnSwipeLeft,
      debouncedOnSwipeRight,
      debouncedOnSwipeUp,
      debouncedOnSwipeDown,
    ]
  );

  // Reset gesture state
  const resetGesture = useCallback(() => {
    setIsGesturing(false);
    setCurrentGesture(null);
    touchStartRef.current = null;
    clearLongPressTimer();
    hasTriggedLongPressRef.current = false;
  }, [clearLongPressTimer]);

  // Touch start handler
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!isEnabled) return;

      measureGesturePerformance('onTouchStart', () => {
        const touchPoint = getTouchPoint(e);
        touchStartRef.current = touchPoint;
        setIsGesturing(true);
        hasTriggedLongPressRef.current = false;

        // Start long press timer
        if (handlers.onLongPress) {
          longPressTimerRef.current = setTimeout(() => {
            if (touchStartRef.current && !hasTriggedLongPressRef.current) {
              hasTriggedLongPressRef.current = true;

              if (hapticFeedback) {
                triggerHapticFeedback('medium');
              }

              handlers.onLongPress?.();
            }
          }, gestureConfig.longPressDelay);
        }
      });
    },
    [isEnabled, handlers, gestureConfig.longPressDelay, hapticFeedback]
  );

  // Touch move handler
  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isEnabled || !touchStartRef.current || !isGesturing) return;

      measureGesturePerformance('onTouchMove', () => {
        const touchPoint = getTouchPoint(e);
        const gesture = processGesture(
          touchStartRef.current!,
          touchPoint,
          gestureConfig
        );

        setCurrentGesture(gesture);

        // Clear long press if touch moves too much
        if (gesture.distance > 10) {
          clearLongPressTimer();
        }

        // Prevent scroll during swipe if requested
        if (
          preventScrollDuringSwipe &&
          gesture.distance > gestureConfig.minSwipeDistance / 2
        ) {
          e.preventDefault();
        }
      });
    },
    [
      isEnabled,
      isGesturing,
      gestureConfig,
      preventScrollDuringSwipe,
      clearLongPressTimer,
    ]
  );

  // Touch end handler
  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!isEnabled || !touchStartRef.current) {
        resetGesture();
        return;
      }

      measureGesturePerformance('onTouchEnd', () => {
        const touchPoint = getTouchPoint(e);
        const gesture = processGesture(
          touchStartRef.current!,
          touchPoint,
          gestureConfig
        );

        clearLongPressTimer();

        // Handle tap gesture if no long press was triggered and minimal movement
        if (
          !hasTriggedLongPressRef.current &&
          gesture.distance < 10 &&
          handlers.onTap
        ) {
          handlers.onTap();
        }

        // Handle swipe gesture
        else if (isValidSwipe(gesture, gestureConfig)) {
          handleGestureComplete(gesture);
        }

        resetGesture();
      });
    },
    [
      isEnabled,
      gestureConfig,
      clearLongPressTimer,
      handlers,
      handleGestureComplete,
      resetGesture,
    ]
  );

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isGesturing,
    currentGesture,
    resetGesture,
    isEnabled,
    setEnabled,
  };
};

/**
 * Convenience hook for simple swipe-to-toggle functionality
 */
export const useSwipeToggle = (
  onToggle: () => void,
  options: UseGesturesOptions = {}
) => {
  const handlers: GestureHandlers = {
    onSwipeLeft: onToggle,
    onSwipeRight: onToggle,
  };

  return useGestures(handlers, options);
};

/**
 * Hook for long press configuration
 */
export const useLongPressConfig = (
  onLongPress: () => void,
  options: UseGesturesOptions = {}
) => {
  const handlers: GestureHandlers = {
    onLongPress,
  };

  return useGestures(handlers, {
    ...options,
    hapticFeedback: true, // Always enable haptic feedback for config
  });
};
