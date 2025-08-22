/**
 * Tests for useSenderPreferences hook
 */

import { renderHook, act } from '@testing-library/react';
import {
  useSenderPreferences,
  usePreference,
  useGesturePreferences,
} from '../useSenderPreferences';
import {
  DEFAULT_SENDER_PREFERENCES,
  PREFERENCES_PRESETS,
} from '../../types/preferences';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useSenderPreferences', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('initializes with default preferences', () => {
    const { result } = renderHook(() => useSenderPreferences());

    expect(result.current.preferences).toEqual(DEFAULT_SENDER_PREFERENCES);
  });

  it('saves preferences to localStorage on change', () => {
    const { result } = renderHook(() => useSenderPreferences());

    act(() => {
      result.current.updatePreference('autoToggle', true);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'whatsapp-generator-sender-preferences',
      expect.stringContaining('"autoToggle":true')
    );
  });

  it('updates a single preference correctly', () => {
    const { result } = renderHook(() => useSenderPreferences());

    act(() => {
      result.current.updatePreference('animationDuration', 300);
    });

    expect(result.current.preferences.animationDuration).toBe(300);
    expect(result.current.preferences.autoToggle).toBe(
      DEFAULT_SENDER_PREFERENCES.autoToggle
    );
  });

  it('updates multiple preferences at once', () => {
    const { result } = renderHook(() => useSenderPreferences());

    const updates = {
      autoToggle: true,
      animationDuration: 150,
      gesturesEnabled: false,
    };

    act(() => {
      result.current.updatePreferences(updates);
    });

    expect(result.current.preferences.autoToggle).toBe(true);
    expect(result.current.preferences.animationDuration).toBe(150);
    expect(result.current.preferences.gesturesEnabled).toBe(false);
  });

  it('resets preferences to defaults', () => {
    const { result } = renderHook(() => useSenderPreferences());

    // First change some preferences
    act(() => {
      result.current.updatePreferences({
        autoToggle: true,
        animationDuration: 500,
      });
    });

    // Then reset
    act(() => {
      result.current.resetPreferences();
    });

    expect(result.current.preferences).toEqual(DEFAULT_SENDER_PREFERENCES);
  });

  it('validates preferences and rejects invalid values', () => {
    const { result } = renderHook(() => useSenderPreferences());
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    act(() => {
      result.current.updatePreference('animationDuration', -100); // Invalid
    });

    expect(result.current.preferences.animationDuration).toBe(
      DEFAULT_SENDER_PREFERENCES.animationDuration
    );
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('loads preset correctly', () => {
    const { result } = renderHook(() => useSenderPreferences());
    const powerUserPreset = PREFERENCES_PRESETS.find(
      (p) => p.name === 'Power User'
    )!;

    act(() => {
      result.current.loadPreset(powerUserPreset);
    });

    expect(result.current.preferences.autoToggle).toBe(
      powerUserPreset.preferences.autoToggle
    );
  });

  it('exports preferences as JSON', () => {
    const { result } = renderHook(() => useSenderPreferences());

    const exported = result.current.exportPreferences();
    const parsed = JSON.parse(exported);

    expect(parsed).toEqual(result.current.preferences);
  });

  it('imports valid preferences', () => {
    const { result } = renderHook(() => useSenderPreferences());

    const importData = JSON.stringify({
      autoToggle: true,
      animationDuration: 250,
    });

    let success = false;
    act(() => {
      success = result.current.importPreferences(importData);
    });

    expect(success).toBe(true);
    expect(result.current.preferences.autoToggle).toBe(true);
    expect(result.current.preferences.animationDuration).toBe(250);
  });

  it('rejects invalid imported preferences', () => {
    const { result } = renderHook(() => useSenderPreferences());
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const invalidData = JSON.stringify({
      animationDuration: -500, // Invalid value
    });

    let success = false;
    act(() => {
      success = result.current.importPreferences(invalidData);
    });

    expect(success).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('handles localStorage errors gracefully', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const { result } = renderHook(() => useSenderPreferences());

    act(() => {
      result.current.updatePreference('autoToggle', true);
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to save preferences to storage:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});

describe('usePreference', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('returns specific preference value and setter', () => {
    const { result } = renderHook(() => usePreference('autoToggle'));

    expect(result.current[0]).toBe(DEFAULT_SENDER_PREFERENCES.autoToggle);

    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
  });

  it('updates only the specified preference', () => {
    const { result } = renderHook(() => ({
      autoToggle: usePreference('autoToggle'),
      animationDuration: usePreference('animationDuration'),
    }));

    act(() => {
      result.current.autoToggle[1](true);
    });

    expect(result.current.autoToggle[0]).toBe(true);
    expect(result.current.animationDuration[0]).toBe(
      DEFAULT_SENDER_PREFERENCES.animationDuration
    );
  });
});

describe('useGesturePreferences', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('returns gesture-specific preferences', () => {
    const { result } = renderHook(() => useGesturePreferences());

    expect(result.current.gesturePreferences.enabled).toBe(
      DEFAULT_SENDER_PREFERENCES.gesturesEnabled
    );
    expect(result.current.gesturePreferences.sensitivity).toBe(
      DEFAULT_SENDER_PREFERENCES.gestureSensitivity
    );
    expect(result.current.gesturePreferences.swipeThreshold).toBe(
      DEFAULT_SENDER_PREFERENCES.swipeThreshold
    );
  });

  it('updates gesture preferences correctly', () => {
    const { result } = renderHook(() => useGesturePreferences());

    act(() => {
      result.current.updateGesturePreferences({
        enabled: false,
        sensitivity: 'high',
        swipeThreshold: 75,
      });
    });

    expect(result.current.gesturePreferences.enabled).toBe(false);
    expect(result.current.gesturePreferences.sensitivity).toBe('high');
    expect(result.current.gesturePreferences.swipeThreshold).toBe(75);
  });
});
