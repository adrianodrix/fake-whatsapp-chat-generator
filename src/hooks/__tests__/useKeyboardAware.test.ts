import { renderHook, act } from '@testing-library/react';
import { useKeyboardAware } from '../useKeyboardAware';

// Mock window properties
const mockWindow = {
  innerHeight: 800,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  scrollBy: jest.fn(),
};

// Mock document
const mockDocument = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 800,
});

Object.defineProperty(window, 'addEventListener', {
  writable: true,
  configurable: true,
  value: mockWindow.addEventListener,
});

Object.defineProperty(window, 'removeEventListener', {
  writable: true,
  configurable: true,
  value: mockWindow.removeEventListener,
});

Object.defineProperty(window, 'scrollBy', {
  writable: true,
  configurable: true,
  value: mockWindow.scrollBy,
});

Object.defineProperty(document, 'addEventListener', {
  writable: true,
  configurable: true,
  value: mockDocument.addEventListener,
});

Object.defineProperty(document, 'removeEventListener', {
  writable: true,
  configurable: true,
  value: mockDocument.removeEventListener,
});

describe('useKeyboardAware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      configurable: true,
    });
  });

  it('should initialize with keyboard not visible', () => {
    const { result } = renderHook(() => useKeyboardAware());

    expect(result.current.isKeyboardVisible).toBe(false);
    expect(result.current.keyboardHeight).toBe(0);
    expect(result.current.adjustedViewportHeight).toBe(800);
  });

  it('should register event listeners when enabled', () => {
    renderHook(() => useKeyboardAware({ enabled: true }));

    expect(mockWindow.addEventListener).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );
    expect(mockWindow.addEventListener).toHaveBeenCalledWith(
      'orientationchange',
      expect.any(Function)
    );
    expect(mockDocument.addEventListener).toHaveBeenCalledWith(
      'focusin',
      expect.any(Function)
    );
    expect(mockDocument.addEventListener).toHaveBeenCalledWith(
      'focusout',
      expect.any(Function)
    );
  });

  it('should not register event listeners when disabled', () => {
    renderHook(() => useKeyboardAware({ enabled: false }));

    expect(mockWindow.addEventListener).not.toHaveBeenCalled();
    expect(mockDocument.addEventListener).not.toHaveBeenCalled();
  });

  it('should detect keyboard visibility based on viewport height change', () => {
    const { result } = renderHook(() => useKeyboardAware({ enabled: true }));

    // Simulate viewport height decrease (keyboard appearing)
    Object.defineProperty(window, 'innerHeight', {
      value: 500,
      configurable: true,
    });

    // Get the resize handler and call it
    const resizeHandler = mockWindow.addEventListener.mock.calls.find(
      (call) => call[0] === 'resize'
    )?.[1];

    if (resizeHandler) {
      act(() => {
        resizeHandler();
      });
    }

    expect(result.current.isKeyboardVisible).toBe(true);
    expect(result.current.keyboardHeight).toBe(300);
    expect(result.current.adjustedViewportHeight).toBe(500);
  });

  it('should cleanup event listeners on unmount', () => {
    const { unmount } = renderHook(() => useKeyboardAware({ enabled: true }));

    unmount();

    expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );
    expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
      'orientationchange',
      expect.any(Function)
    );
    expect(mockDocument.removeEventListener).toHaveBeenCalledWith(
      'focusin',
      expect.any(Function)
    );
    expect(mockDocument.removeEventListener).toHaveBeenCalledWith(
      'focusout',
      expect.any(Function)
    );
  });

  it('should handle target element adjustment when keyboard appears', () => {
    const mockElement = {
      getBoundingClientRect: jest.fn().mockReturnValue({
        bottom: 600,
      }),
    };

    const mockTargetRef = {
      current: mockElement as unknown as HTMLElement,
    };

    renderHook(() =>
      useKeyboardAware({
        targetRef: mockTargetRef,
        offset: 16,
        enabled: true,
      })
    );

    // Simulate viewport height decrease
    Object.defineProperty(window, 'innerHeight', {
      value: 400,
      configurable: true,
    });

    const resizeHandler = mockWindow.addEventListener.mock.calls.find(
      (call) => call[0] === 'resize'
    )?.[1];

    if (resizeHandler) {
      act(() => {
        resizeHandler();
      });
    }

    expect(mockWindow.scrollBy).toHaveBeenCalledWith({
      top: 216, // 600 - 400 + 16
      behavior: 'smooth',
    });
  });
});
