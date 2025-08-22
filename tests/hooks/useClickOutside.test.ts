import { renderHook } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { useClickOutside } from '../../src/hooks/useClickOutside';

describe('useClickOutside', () => {
  it('should call callback when clicking outside element', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useClickOutside(callback));

    // Create a test element
    const testElement = document.createElement('div');
    document.body.appendChild(testElement);

    // Assign ref
    (result.current as React.MutableRefObject<HTMLDivElement | null>).current =
      testElement;

    // Click outside
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);
    fireEvent.mouseDown(outsideElement);

    expect(callback).toHaveBeenCalledTimes(1);

    // Cleanup
    document.body.removeChild(testElement);
    document.body.removeChild(outsideElement);
  });

  it('should not call callback when clicking inside element', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useClickOutside(callback));

    // Create a test element
    const testElement = document.createElement('div');
    const childElement = document.createElement('div');
    testElement.appendChild(childElement);
    document.body.appendChild(testElement);

    // Assign ref
    (result.current as React.MutableRefObject<HTMLDivElement | null>).current =
      testElement;

    // Click inside
    fireEvent.mouseDown(childElement);

    expect(callback).not.toHaveBeenCalled();

    // Cleanup
    document.body.removeChild(testElement);
  });

  it('should handle touch events', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useClickOutside(callback));

    // Create a test element
    const testElement = document.createElement('div');
    document.body.appendChild(testElement);

    // Assign ref
    (result.current as React.MutableRefObject<HTMLDivElement | null>).current =
      testElement;

    // Touch outside
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);
    fireEvent.touchStart(outsideElement);

    expect(callback).toHaveBeenCalledTimes(1);

    // Cleanup
    document.body.removeChild(testElement);
    document.body.removeChild(outsideElement);
  });

  it('should not call callback when element is not set', () => {
    const callback = jest.fn();
    renderHook(() => useClickOutside(callback));

    // Click somewhere
    fireEvent.mouseDown(document.body);

    expect(callback).not.toHaveBeenCalled();
  });

  it('should cleanup event listeners on unmount', () => {
    const callback = jest.fn();
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() => useClickOutside(callback));

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function)
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'touchstart',
      expect.any(Function)
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'touchstart',
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
