/**
 * Touch gesture utilities for sender toggle system
 * Handles swipe detection, long press, and haptic feedback
 */

// Types for gesture detection
export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: number;
  duration: number;
  velocity: number;
}

export interface GestureConfig {
  minSwipeDistance: number;
  maxSwipeTime: number;
  longPressDelay: number;
  swipeThreshold: number;
}

// Default gesture configuration
export const DEFAULT_GESTURE_CONFIG: GestureConfig = {
  minSwipeDistance: 50, // Minimum distance to register as swipe
  maxSwipeTime: 500, // Maximum time for valid swipe (ms)
  longPressDelay: 500, // Long press detection time (ms)
  swipeThreshold: 30, // Perpendicular movement threshold
};

/**
 * Calculate distance between two points
 */
export const getDistance = (start: TouchPoint, end: TouchPoint): number => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate swipe velocity (pixels per millisecond)
 */
export const getVelocity = (distance: number, duration: number): number => {
  return duration > 0 ? distance / duration : 0;
};

/**
 * Determine swipe direction based on touch points
 */
export const getSwipeDirection = (
  start: TouchPoint,
  end: TouchPoint,
  config: GestureConfig = DEFAULT_GESTURE_CONFIG
): SwipeGesture['direction'] => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  // Check if movement is significant enough
  if (absDx < config.minSwipeDistance && absDy < config.minSwipeDistance) {
    return null;
  }

  // Determine primary direction
  if (absDx > absDy) {
    // Horizontal swipe - check if vertical movement is within threshold
    if (absDy > config.swipeThreshold) {
      return null; // Too much vertical movement
    }
    return dx > 0 ? 'right' : 'left';
  } else {
    // Vertical swipe - check if horizontal movement is within threshold
    if (absDx > config.swipeThreshold) {
      return null; // Too much horizontal movement
    }
    return dy > 0 ? 'down' : 'up';
  }
};

/**
 * Process touch gesture and return gesture info
 */
export const processGesture = (
  start: TouchPoint,
  end: TouchPoint,
  config: GestureConfig = DEFAULT_GESTURE_CONFIG
): SwipeGesture => {
  const distance = getDistance(start, end);
  const duration = end.timestamp - start.timestamp;
  const velocity = getVelocity(distance, duration);
  const direction = getSwipeDirection(start, end, config);

  return {
    direction,
    distance,
    duration,
    velocity,
  };
};

/**
 * Check if gesture is a valid swipe
 */
export const isValidSwipe = (
  gesture: SwipeGesture,
  config: GestureConfig = DEFAULT_GESTURE_CONFIG
): boolean => {
  return (
    gesture.direction !== null &&
    gesture.distance >= config.minSwipeDistance &&
    gesture.duration <= config.maxSwipeTime &&
    gesture.velocity > 0.05 // Minimum velocity threshold
  );
};

/**
 * Extract touch point from React TouchEvent
 */
export const getTouchPoint = (e: React.TouchEvent): TouchPoint => {
  const touch = e.touches[0] || e.changedTouches[0];
  return {
    x: touch.clientX,
    y: touch.clientY,
    timestamp: Date.now(),
  };
};

/**
 * Haptic feedback for mobile devices
 * Falls back gracefully on unsupported devices
 */
export const triggerHapticFeedback = (
  type: 'light' | 'medium' | 'heavy' = 'light'
): void => {
  try {
    // iOS Haptic Feedback
    if (
      'vibrate' in navigator &&
      /iPhone|iPad|iPod/.test(navigator.userAgent)
    ) {
      const patterns = {
        light: [50],
        medium: [100],
        heavy: [150],
      };
      navigator.vibrate(patterns[type]);
      return;
    }

    // Android Haptic Feedback
    if ('vibrate' in navigator) {
      const patterns = {
        light: [25],
        medium: [50],
        heavy: [75],
      };
      navigator.vibrate(patterns[type]);
      return;
    }

    // Web Vibration API fallback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  } catch (error) {
    // Silently fail on unsupported devices
    console.debug('Haptic feedback not supported:', error);
  }
};

/**
 * Debounce function for gesture handling
 */
export const debounceGesture = <T extends (...args: never[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Check if device supports touch events
 */
export const isTouchDevice = (): boolean => {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};

/**
 * Performance monitoring for gesture processing
 */
export const measureGesturePerformance = <T>(name: string, fn: () => T): T => {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now();
    const result = fn();
    const end = performance.now();

    if (end - start > 16) {
      // > 1 frame at 60fps
      console.warn(
        `Gesture processing '${name}' took ${(end - start).toFixed(2)}ms`
      );
    }

    return result;
  }

  return fn();
};
