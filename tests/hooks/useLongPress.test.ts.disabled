import { renderHook, act } from '@testing-library/react';
import { useLongPress } from '../../src/hooks/useLongPress';

// Mock setTimeout and clearTimeout
jest.useFakeTimers();

describe('useLongPress', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should activate after threshold time', () => {
    const callback = jest.fn();
    const { result } = renderHook(() =>
      useLongPress(callback, { threshold: 500 })
    );

    act(() => {
      result.current.onMouseDown();
    });

    expect(result.current.isPressed).toBe(true);
    expect(callback).not.toHaveBeenCalled();

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(result.current.isPressed).toBe(false);
  });

  it('should cancel if released before threshold', () => {
    const callback = jest.fn();
    const onCancel = jest.fn();
    const { result } = renderHook(() =>
      useLongPress(callback, { threshold: 500, onCancel })
    );

    act(() => {
      result.current.onMouseDown();
    });

    expect(result.current.isPressed).toBe(true);

    // Release before threshold
    act(() => {
      jest.advanceTimersByTime(300);
      result.current.onMouseUp();
    });

    expect(callback).not.toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(result.current.isPressed).toBe(false);

    // Fast forward past threshold
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should cancel on mouse leave', () => {
    const callback = jest.fn();
    const onCancel = jest.fn();
    const { result } = renderHook(() =>
      useLongPress(callback, { threshold: 500, onCancel })
    );

    act(() => {
      result.current.onMouseDown();
    });

    act(() => {
      result.current.onMouseLeave();
    });

    expect(callback).not.toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(result.current.isPressed).toBe(false);
  });

  it('should handle touch events', () => {
    const callback = jest.fn();
    const { result } = renderHook(() =>
      useLongPress(callback, { threshold: 500 })
    );

    act(() => {
      result.current.onTouchStart();
    });

    expect(result.current.isPressed).toBe(true);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should cancel on touch move', () => {
    const callback = jest.fn();
    const onCancel = jest.fn();
    const { result } = renderHook(() =>
      useLongPress(callback, { threshold: 500, onCancel })
    );

    act(() => {
      result.current.onTouchStart();
    });

    act(() => {
      result.current.onTouchMove();
    });

    expect(callback).not.toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(result.current.isPressed).toBe(false);
  });

  it('should call onStart and onFinish callbacks', () => {
    const callback = jest.fn();
    const onStart = jest.fn();
    const onFinish = jest.fn();
    const { result } = renderHook(() =>
      useLongPress(callback, { threshold: 500, onStart, onFinish })
    );

    act(() => {
      result.current.onMouseDown();
    });

    expect(onStart).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('should use default threshold of 500ms', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useLongPress(callback));

    act(() => {
      result.current.onMouseDown();
    });

    // Should not activate before 500ms
    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(callback).not.toHaveBeenCalled();

    // Should activate at 500ms
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not start if already running', () => {
    const callback = jest.fn();
    const onStart = jest.fn();
    const { result } = renderHook(() =>
      useLongPress(callback, { threshold: 500, onStart })
    );

    act(() => {
      result.current.onMouseDown();
      result.current.onMouseDown(); // Second call should be ignored
    });

    expect(onStart).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
