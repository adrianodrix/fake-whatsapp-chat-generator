/**
 * Tests for gesture utilities
 */

import {
  getTouchPoint,
  getDistance,
  getVelocity,
  getSwipeDirection,
  processGesture,
  isValidSwipe,
  triggerHapticFeedback,
  debounceGesture,
  isTouchDevice,
  measureGesturePerformance,
  type TouchPoint,
} from '../gestures';

// Mock navigator.vibrate
Object.defineProperty(navigator, 'vibrate', {
  writable: true,
  value: jest.fn(),
});

// Mock performance.now
Object.defineProperty(performance, 'now', {
  writable: true,
  value: jest.fn(),
});

describe('gestures utilities', () => {
  const mockTouchPoint1: TouchPoint = {
    x: 100,
    y: 100,
    timestamp: 1000,
  };

  const mockTouchPoint2: TouchPoint = {
    x: 200,
    y: 100,
    timestamp: 1200,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDistance', () => {
    it('calculates distance correctly', () => {
      const distance = getDistance(mockTouchPoint1, mockTouchPoint2);
      expect(distance).toBe(100);
    });

    it('handles zero distance', () => {
      const distance = getDistance(mockTouchPoint1, mockTouchPoint1);
      expect(distance).toBe(0);
    });

    it('calculates diagonal distance', () => {
      const point2 = { x: 103, y: 104, timestamp: 1200 };
      const distance = getDistance(mockTouchPoint1, point2);
      expect(distance).toBe(5);
    });
  });

  describe('getVelocity', () => {
    it('calculates velocity correctly', () => {
      const velocity = getVelocity(100, 200);
      expect(velocity).toBe(0.5);
    });

    it('handles zero duration', () => {
      const velocity = getVelocity(100, 0);
      expect(velocity).toBe(0);
    });
  });

  describe('getSwipeDirection', () => {
    it('detects right swipe', () => {
      const direction = getSwipeDirection(mockTouchPoint1, mockTouchPoint2);
      expect(direction).toBe('right');
    });

    it('detects left swipe', () => {
      const point2 = { x: 0, y: 100, timestamp: 1200 };
      const direction = getSwipeDirection(mockTouchPoint1, point2);
      expect(direction).toBe('left');
    });

    it('detects down swipe', () => {
      const point2 = { x: 100, y: 200, timestamp: 1200 };
      const direction = getSwipeDirection(mockTouchPoint1, point2);
      expect(direction).toBe('down');
    });

    it('detects up swipe', () => {
      const point2 = { x: 100, y: 0, timestamp: 1200 };
      const direction = getSwipeDirection(mockTouchPoint1, point2);
      expect(direction).toBe('up');
    });

    it('returns null for insufficient distance', () => {
      const point2 = { x: 110, y: 105, timestamp: 1200 };
      const direction = getSwipeDirection(mockTouchPoint1, point2);
      expect(direction).toBe(null);
    });

    it('returns null for too much perpendicular movement', () => {
      const point2 = { x: 200, y: 150, timestamp: 1200 };
      const direction = getSwipeDirection(mockTouchPoint1, point2);
      expect(direction).toBe(null);
    });
  });

  describe('processGesture', () => {
    it('processes gesture correctly', () => {
      const gesture = processGesture(mockTouchPoint1, mockTouchPoint2);

      expect(gesture.direction).toBe('right');
      expect(gesture.distance).toBe(100);
      expect(gesture.duration).toBe(200);
      expect(gesture.velocity).toBe(0.5);
    });
  });

  describe('isValidSwipe', () => {
    it('validates correct swipe', () => {
      const gesture = {
        direction: 'right' as const,
        distance: 100,
        duration: 200,
        velocity: 0.5,
      };

      expect(isValidSwipe(gesture)).toBe(true);
    });

    it('rejects swipe with no direction', () => {
      const gesture = {
        direction: null,
        distance: 100,
        duration: 200,
        velocity: 0.5,
      };

      expect(isValidSwipe(gesture)).toBe(false);
    });

    it('rejects swipe with insufficient distance', () => {
      const gesture = {
        direction: 'right' as const,
        distance: 30,
        duration: 200,
        velocity: 0.5,
      };

      expect(isValidSwipe(gesture)).toBe(false);
    });

    it('rejects swipe that is too slow', () => {
      const gesture = {
        direction: 'right' as const,
        distance: 100,
        duration: 600,
        velocity: 0.02,
      };

      expect(isValidSwipe(gesture)).toBe(false);
    });
  });

  describe('getTouchPoint', () => {
    it('extracts touch point from touch event', () => {
      const mockTouchEvent = {
        touches: [
          {
            clientX: 150,
            clientY: 250,
          },
        ],
      } as React.TouchEvent;

      jest.spyOn(Date, 'now').mockReturnValue(1500);

      const point = getTouchPoint(mockTouchEvent);

      expect(point.x).toBe(150);
      expect(point.y).toBe(250);
      expect(point.timestamp).toBe(1500);
    });

    it('falls back to changedTouches', () => {
      const mockTouchEvent = {
        touches: [],
        changedTouches: [
          {
            clientX: 150,
            clientY: 250,
          },
        ],
      } as React.TouchEvent;

      jest.spyOn(Date, 'now').mockReturnValue(1500);

      const point = getTouchPoint(mockTouchEvent);

      expect(point.x).toBe(150);
      expect(point.y).toBe(250);
    });
  });

  describe('triggerHapticFeedback', () => {
    it('calls vibrate on supported devices', () => {
      triggerHapticFeedback('light');
      expect(navigator.vibrate).toHaveBeenCalledWith([25]);
    });

    it('uses different patterns for different types', () => {
      triggerHapticFeedback('medium');
      expect(navigator.vibrate).toHaveBeenCalledWith([50]);

      triggerHapticFeedback('heavy');
      expect(navigator.vibrate).toHaveBeenCalledWith([75]);
    });

    it('handles vibrate errors gracefully', () => {
      (navigator.vibrate as jest.Mock).mockImplementation(() => {
        throw new Error('Not supported');
      });

      expect(() => triggerHapticFeedback()).not.toThrow();
    });
  });

  describe('debounceGesture', () => {
    jest.useFakeTimers();

    it('debounces function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounceGesture(mockFn, 100);

      debouncedFn('arg1');
      debouncedFn('arg2');
      debouncedFn('arg3');

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('arg3');
    });
  });

  describe('isTouchDevice', () => {
    it('detects touch support via ontouchstart', () => {
      Object.defineProperty(window, 'ontouchstart', {
        value: {},
        writable: true,
      });

      expect(isTouchDevice()).toBe(true);
    });

    it('detects touch support via maxTouchPoints', () => {
      Object.defineProperty(navigator, 'maxTouchPoints', {
        value: 5,
        writable: true,
      });

      expect(isTouchDevice()).toBe(true);
    });
  });

  describe('measureGesturePerformance', () => {
    it('measures performance in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const performanceSpy = jest
        .spyOn(performance, 'now')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(20);

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = measureGesturePerformance('test', () => 'result');

      expect(result).toBe('result');
      expect(consoleSpy).toHaveBeenCalledWith(
        "Gesture processing 'test' took 20.00ms"
      );

      process.env.NODE_ENV = originalEnv;
      performanceSpy.mockRestore();
      consoleSpy.mockRestore();
    });

    it('skips measurement in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const result = measureGesturePerformance('test', () => 'result');

      expect(result).toBe('result');

      process.env.NODE_ENV = originalEnv;
    });
  });
});
