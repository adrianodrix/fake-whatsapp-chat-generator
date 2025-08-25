import { renderHook, act } from '@testing-library/react';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  let mockHandler: jest.Mock;

  beforeEach(() => {
    mockHandler = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('registers keyboard event listener when enabled', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    renderHook(() =>
      useKeyboardShortcuts([{ key: 'a', handler: mockHandler }], true)
    );

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    );
    addEventListenerSpy.mockRestore();
  });

  it('does not register listener when disabled', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    renderHook(() =>
      useKeyboardShortcuts([{ key: 'a', handler: mockHandler }], false)
    );

    expect(addEventListenerSpy).not.toHaveBeenCalled();
    addEventListenerSpy.mockRestore();
  });

  it('calls handler when matching key is pressed', () => {
    renderHook(() =>
      useKeyboardShortcuts([{ key: 'a', handler: mockHandler }], true)
    );

    const event = new KeyboardEvent('keydown', { key: 'a' });
    act(() => {
      window.dispatchEvent(event);
    });

    expect(mockHandler).toHaveBeenCalledWith(event);
  });

  it('respects modifier keys', () => {
    renderHook(() =>
      useKeyboardShortcuts(
        [{ key: 'a', ctrlKey: true, handler: mockHandler }],
        true
      )
    );

    // Without Ctrl
    const eventWithoutCtrl = new KeyboardEvent('keydown', {
      key: 'a',
      ctrlKey: false,
    });
    act(() => {
      window.dispatchEvent(eventWithoutCtrl);
    });
    expect(mockHandler).not.toHaveBeenCalled();

    // With Ctrl
    const eventWithCtrl = new KeyboardEvent('keydown', {
      key: 'a',
      ctrlKey: true,
    });
    act(() => {
      window.dispatchEvent(eventWithCtrl);
    });
    expect(mockHandler).toHaveBeenCalledWith(eventWithCtrl);
  });

  it('prevents default when specified', () => {
    const preventDefault = jest.fn();

    renderHook(() =>
      useKeyboardShortcuts(
        [{ key: 'a', handler: mockHandler, preventDefault: true }],
        true
      )
    );

    const event = new KeyboardEvent('keydown', { key: 'a' });
    Object.defineProperty(event, 'preventDefault', { value: preventDefault });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(preventDefault).toHaveBeenCalled();
  });

  it('does not prevent default when preventDefault is false', () => {
    const preventDefault = jest.fn();

    renderHook(() =>
      useKeyboardShortcuts(
        [{ key: 'a', handler: mockHandler, preventDefault: false }],
        true
      )
    );

    const event = new KeyboardEvent('keydown', { key: 'a' });
    Object.defineProperty(event, 'preventDefault', { value: preventDefault });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(preventDefault).not.toHaveBeenCalled();
  });

  it('ignores shortcuts when input is focused', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    renderHook(() =>
      useKeyboardShortcuts([{ key: 'a', handler: mockHandler }], true)
    );

    const event = new KeyboardEvent('keydown', { key: 'a' });
    act(() => {
      window.dispatchEvent(event);
    });

    expect(mockHandler).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });

  it('allows Escape key even when input is focused', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    renderHook(() =>
      useKeyboardShortcuts([{ key: 'Escape', handler: mockHandler }], true)
    );

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    act(() => {
      window.dispatchEvent(event);
    });

    expect(mockHandler).toHaveBeenCalled();

    document.body.removeChild(input);
  });

  it('removes event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useKeyboardShortcuts([{ key: 'a', handler: mockHandler }], true)
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    );
    removeEventListenerSpy.mockRestore();
  });
});
