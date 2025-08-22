/**
 * Custom hook for managing sender preferences
 * Handles localStorage persistence, validation, and preference management
 */

import { useState, useCallback, useEffect } from 'react';
import {
  SenderPreferences,
  DEFAULT_SENDER_PREFERENCES,
  PREFERENCES_STORAGE_KEY,
  PreferenceValidationResult,
  PreferencesPreset,
  PreferenceChangeEvent,
  type PreferencesContextType,
} from '../types/preferences';

/**
 * Validation functions for preferences
 */
const validatePreferences = (
  prefs: Partial<SenderPreferences>
): PreferenceValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate animation duration
  if (prefs.animationDuration !== undefined) {
    if (prefs.animationDuration < 0 || prefs.animationDuration > 2000) {
      errors.push('Animation duration must be between 0 and 2000ms');
    } else if (prefs.animationDuration > 1000) {
      warnings.push('Animation duration above 1000ms may feel sluggish');
    }
  }

  // Validate swipe threshold
  if (prefs.swipeThreshold !== undefined) {
    if (prefs.swipeThreshold < 20 || prefs.swipeThreshold > 150) {
      errors.push('Swipe threshold must be between 20 and 150 pixels');
    }
  }

  // Validate long press delay
  if (prefs.longPressDelay !== undefined) {
    if (prefs.longPressDelay < 100 || prefs.longPressDelay > 2000) {
      errors.push('Long press delay must be between 100 and 2000ms');
    } else if (prefs.longPressDelay < 300) {
      warnings.push('Long press delay below 300ms may trigger accidentally');
    }
  }

  // Validate debounce delay
  if (prefs.debounceDelay !== undefined) {
    if (prefs.debounceDelay < 0 || prefs.debounceDelay > 500) {
      errors.push('Debounce delay must be between 0 and 500ms');
    }
  }

  // Validate color values
  if (prefs.senderColors) {
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (
      prefs.senderColors.user &&
      !hexColorRegex.test(prefs.senderColors.user)
    ) {
      errors.push('User color must be a valid hex color (#RRGGBB)');
    }
    if (
      prefs.senderColors.contact &&
      !hexColorRegex.test(prefs.senderColors.contact)
    ) {
      errors.push('Contact color must be a valid hex color (#RRGGBB)');
    }
  }

  // Validate shortcuts array
  if (prefs.customShortcuts !== undefined) {
    if (prefs.customShortcuts.length === 0 && prefs.shortcutsEnabled) {
      warnings.push('Shortcuts are enabled but no shortcuts are defined');
    }
    if (prefs.customShortcuts.length > 5) {
      warnings.push('More than 5 shortcuts may be confusing for users');
    }
  }

  // Accessibility warnings
  if (
    prefs.animationDuration !== undefined &&
    prefs.animationDuration > 0 &&
    prefs.reduceMotion
  ) {
    warnings.push('Animations are enabled but reduce motion is also enabled');
  }

  if (prefs.gesturesEnabled && prefs.reduceMotion) {
    warnings.push('Gestures may conflict with reduce motion preference');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Load preferences from localStorage with fallback to defaults
 */
const loadPreferencesFromStorage = (): SenderPreferences => {
  try {
    const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!stored) {
      return DEFAULT_SENDER_PREFERENCES;
    }

    const parsed = JSON.parse(stored);

    // Merge with defaults to handle missing properties from older versions
    const merged = {
      ...DEFAULT_SENDER_PREFERENCES,
      ...parsed,
      // Ensure nested objects are merged correctly
      senderColors: {
        ...DEFAULT_SENDER_PREFERENCES.senderColors,
        ...parsed.senderColors,
      },
    };

    // Validate loaded preferences
    const validation = validatePreferences(merged);
    if (!validation.isValid) {
      console.warn(
        'Invalid preferences loaded, using defaults:',
        validation.errors
      );
      return DEFAULT_SENDER_PREFERENCES;
    }

    return merged;
  } catch (error) {
    console.error('Failed to load preferences from storage:', error);
    return DEFAULT_SENDER_PREFERENCES;
  }
};

/**
 * Save preferences to localStorage
 */
const savePreferencesToStorage = (preferences: SenderPreferences): void => {
  try {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save preferences to storage:', error);
  }
};

/**
 * Hook for managing sender preferences
 */
export const useSenderPreferences = (): PreferencesContextType => {
  const [preferences, setPreferences] = useState<SenderPreferences>(
    loadPreferencesFromStorage
  );

  // Save to localStorage whenever preferences change
  useEffect(() => {
    savePreferencesToStorage(preferences);
  }, [preferences]);

  // Update a single preference
  const updatePreference = useCallback(
    <K extends keyof SenderPreferences>(
      key: K,
      value: SenderPreferences[K]
    ): void => {
      setPreferences((prev) => {
        const updated = { ...prev, [key]: value };

        // Validate the change
        const validation = validatePreferences({ [key]: value });
        if (!validation.isValid) {
          console.warn(
            `Invalid preference update for ${String(key)}:`,
            validation.errors
          );
          return prev; // Don't update if invalid
        }

        // Emit change event for debugging/analytics
        const changeEvent: PreferenceChangeEvent = {
          key,
          oldValue: prev[key],
          newValue: value,
          timestamp: new Date(),
        };

        if (process.env.NODE_ENV === 'development') {
          console.log('Preference changed:', changeEvent);
        }

        return updated;
      });
    },
    []
  );

  // Update multiple preferences at once
  const updatePreferences = useCallback(
    (updates: Partial<SenderPreferences>): void => {
      // Validate all updates first
      const validation = validatePreferences(updates);
      if (!validation.isValid) {
        console.warn('Invalid preferences update:', validation.errors);
        return;
      }

      setPreferences((prev) => {
        const updated = {
          ...prev,
          ...updates,
          // Handle nested objects specially
          senderColors: updates.senderColors
            ? {
                ...prev.senderColors,
                ...updates.senderColors,
              }
            : prev.senderColors,
        };

        return updated;
      });
    },
    []
  );

  // Reset preferences to defaults
  const resetPreferences = useCallback((): void => {
    setPreferences(DEFAULT_SENDER_PREFERENCES);
  }, []);

  // Load a preset
  const loadPreset = useCallback(
    (preset: PreferencesPreset): void => {
      updatePreferences(preset.preferences);
    },
    [updatePreferences]
  );

  // Export preferences as JSON string
  const exportPreferences = useCallback((): string => {
    return JSON.stringify(preferences, null, 2);
  }, [preferences]);

  // Import preferences from JSON string
  const importPreferences = useCallback(
    (json: string): boolean => {
      try {
        const imported = JSON.parse(json) as Partial<SenderPreferences>;

        // Validate imported preferences
        const validation = validatePreferences(imported);
        if (!validation.isValid) {
          console.error('Invalid imported preferences:', validation.errors);
          return false;
        }

        updatePreferences(imported);
        return true;
      } catch (error) {
        console.error('Failed to import preferences:', error);
        return false;
      }
    },
    [updatePreferences]
  );

  return {
    preferences,
    updatePreference,
    updatePreferences,
    resetPreferences,
    loadPreset,
    validatePreferences,
    exportPreferences,
    importPreferences,
  };
};

/**
 * Hook for accessing specific preference values with type safety
 */
export const usePreference = <K extends keyof SenderPreferences>(
  key: K
): [SenderPreferences[K], (value: SenderPreferences[K]) => void] => {
  const { preferences, updatePreference } = useSenderPreferences();

  const setValue = useCallback(
    (value: SenderPreferences[K]) => {
      updatePreference(key, value);
    },
    [key, updatePreference]
  );

  return [preferences[key], setValue];
};

/**
 * Hook for gesture-specific preferences
 */
export const useGesturePreferences = () => {
  const { preferences, updatePreferences } = useSenderPreferences();

  const gesturePrefs = {
    enabled: preferences.gesturesEnabled,
    sensitivity: preferences.gestureSensitivity,
    swipeThreshold: preferences.swipeThreshold,
    longPressDelay: preferences.longPressDelay,
    hapticFeedback: preferences.hapticFeedbackEnabled,
    debounceDelay: preferences.debounceDelay,
    preventScrollDuringSwipe: preferences.preventScrollDuringSwipe,
  };

  const updateGesturePrefs = useCallback(
    (updates: Partial<typeof gesturePrefs>) => {
      const prefUpdates: Partial<SenderPreferences> = {};

      if (updates.enabled !== undefined)
        prefUpdates.gesturesEnabled = updates.enabled;
      if (updates.sensitivity !== undefined)
        prefUpdates.gestureSensitivity = updates.sensitivity;
      if (updates.swipeThreshold !== undefined)
        prefUpdates.swipeThreshold = updates.swipeThreshold;
      if (updates.longPressDelay !== undefined)
        prefUpdates.longPressDelay = updates.longPressDelay;
      if (updates.hapticFeedback !== undefined)
        prefUpdates.hapticFeedbackEnabled = updates.hapticFeedback;
      if (updates.debounceDelay !== undefined)
        prefUpdates.debounceDelay = updates.debounceDelay;
      if (updates.preventScrollDuringSwipe !== undefined)
        prefUpdates.preventScrollDuringSwipe = updates.preventScrollDuringSwipe;

      updatePreferences(prefUpdates);
    },
    [updatePreferences]
  );

  return {
    gesturePreferences: gesturePrefs,
    updateGesturePreferences: updateGesturePrefs,
  };
};

/**
 * Hook for visual/theme preferences
 */
export const useThemePreferences = () => {
  const { preferences, updatePreferences } = useSenderPreferences();

  const themePrefs = {
    senderColors: preferences.senderColors,
    showSenderIndicator: preferences.showSenderIndicator,
    animationDuration: preferences.animationDuration,
    highContrastMode: preferences.highContrastMode,
    reduceMotion: preferences.reduceMotion,
  };

  const updateThemePrefs = useCallback(
    (updates: Partial<typeof themePrefs>) => {
      const prefUpdates: Partial<SenderPreferences> = {};

      if (updates.senderColors !== undefined)
        prefUpdates.senderColors = updates.senderColors;
      if (updates.showSenderIndicator !== undefined)
        prefUpdates.showSenderIndicator = updates.showSenderIndicator;
      if (updates.animationDuration !== undefined)
        prefUpdates.animationDuration = updates.animationDuration;
      if (updates.highContrastMode !== undefined)
        prefUpdates.highContrastMode = updates.highContrastMode;
      if (updates.reduceMotion !== undefined)
        prefUpdates.reduceMotion = updates.reduceMotion;

      updatePreferences(prefUpdates);
    },
    [updatePreferences]
  );

  return {
    themePreferences: themePrefs,
    updateThemePreferences: updateThemePrefs,
  };
};
