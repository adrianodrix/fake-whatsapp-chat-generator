/**
 * Type definitions for user preferences and settings
 * Manages sender preferences, gesture settings, and visual themes
 */

// Color customization for different senders
export interface SenderColors {
  user: string; // Color for user messages
  contact: string; // Color for contact messages
}

// Available shortcut keys for sender toggle
export type ShortcutKey =
  | 'Tab'
  | 'Space'
  | 'Enter'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'KeyQ'
  | 'KeyW'
  | 'KeyE';

// Gesture sensitivity levels
export type GestureSensitivity = 'low' | 'medium' | 'high';

// Auto-toggle timing options
export type AutoToggleDelay =
  | 'immediate'
  | 'short'
  | 'medium'
  | 'long'
  | 'disabled';

// Main sender preferences interface
export interface SenderPreferences {
  // Basic toggle settings
  autoToggle: boolean; // Auto-alternate senders after sending
  autoToggleDelay: AutoToggleDelay; // Delay before auto-toggle

  // Keyboard shortcuts
  customShortcuts: ShortcutKey[]; // User-defined shortcuts
  shortcutsEnabled: boolean; // Enable/disable all shortcuts

  // Visual customization
  senderColors: SenderColors; // Custom colors for message bubbles
  showSenderIndicator: boolean; // Show current sender in input
  animationDuration: number; // Animation duration in ms (50-1000)

  // Gesture settings
  gesturesEnabled: boolean; // Enable touch gestures
  swipeThreshold: number; // Minimum distance for swipe (30-100)
  gestureSensitivity: GestureSensitivity; // Gesture detection sensitivity
  hapticFeedbackEnabled: boolean; // Haptic feedback on devices that support it
  longPressDelay: number; // Long press detection time (200-1000ms)

  // Performance settings
  debounceDelay: number; // Debounce delay for gestures (10-200ms)
  preventScrollDuringSwipe: boolean; // Prevent page scroll during swipe

  // Accessibility settings
  screenReaderAnnouncements: boolean; // Announce sender changes to screen readers
  highContrastMode: boolean; // High contrast colors for better visibility
  reduceMotion: boolean; // Respect prefers-reduced-motion
}

// Default preferences values
export const DEFAULT_SENDER_PREFERENCES: SenderPreferences = {
  // Basic toggle settings
  autoToggle: false,
  autoToggleDelay: 'medium',

  // Keyboard shortcuts
  customShortcuts: ['Tab'],
  shortcutsEnabled: true,

  // Visual customization
  senderColors: {
    user: '#DCF8C6', // WhatsApp green (sent)
    contact: '#FFFFFF', // White (received)
  },
  showSenderIndicator: true,
  animationDuration: 200,

  // Gesture settings
  gesturesEnabled: true,
  swipeThreshold: 50,
  gestureSensitivity: 'medium',
  hapticFeedbackEnabled: true,
  longPressDelay: 500,

  // Performance settings
  debounceDelay: 50,
  preventScrollDuringSwipe: true,

  // Accessibility settings
  screenReaderAnnouncements: true,
  highContrastMode: false,
  reduceMotion: false,
};

// Configuration preset types
export interface PreferencesPreset {
  name: string;
  description: string;
  preferences: Partial<SenderPreferences>;
}

// Built-in presets
export const PREFERENCES_PRESETS: PreferencesPreset[] = [
  {
    name: 'Default',
    description: 'Balanced settings for most users',
    preferences: {},
  },
  {
    name: 'Power User',
    description: 'All features enabled, fast animations',
    preferences: {
      autoToggle: true,
      autoToggleDelay: 'short',
      customShortcuts: ['Tab', 'Space', 'ArrowLeft', 'ArrowRight'],
      gesturesEnabled: true,
      gestureSensitivity: 'high',
      animationDuration: 150,
      debounceDelay: 25,
    },
  },
  {
    name: 'Accessibility',
    description: 'Optimized for screen readers and reduced motion',
    preferences: {
      screenReaderAnnouncements: true,
      highContrastMode: true,
      reduceMotion: true,
      animationDuration: 0,
      gesturesEnabled: false,
      hapticFeedbackEnabled: false,
    },
  },
  {
    name: 'Mobile Optimized',
    description: 'Touch-first experience with gestures',
    preferences: {
      gesturesEnabled: true,
      gestureSensitivity: 'medium',
      hapticFeedbackEnabled: true,
      shortcutsEnabled: false,
      autoToggle: true,
      preventScrollDuringSwipe: true,
    },
  },
  {
    name: 'Performance',
    description: 'Minimal animations for slower devices',
    preferences: {
      animationDuration: 50,
      debounceDelay: 100,
      gesturesEnabled: false,
      hapticFeedbackEnabled: false,
      reduceMotion: true,
    },
  },
];

// Preference validation
export interface PreferenceValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Preference storage key
export const PREFERENCES_STORAGE_KEY = 'whatsapp-generator-sender-preferences';

// Preference change event types
export type PreferenceChangeEvent = {
  key: keyof SenderPreferences;
  oldValue: SenderPreferences[keyof SenderPreferences];
  newValue: SenderPreferences[keyof SenderPreferences];
  timestamp: Date;
};

// Preferences context type
export interface PreferencesContextType {
  preferences: SenderPreferences;
  updatePreference: <K extends keyof SenderPreferences>(
    key: K,
    value: SenderPreferences[K]
  ) => void;
  updatePreferences: (updates: Partial<SenderPreferences>) => void;
  resetPreferences: () => void;
  loadPreset: (preset: PreferencesPreset) => void;
  validatePreferences: (
    prefs: Partial<SenderPreferences>
  ) => PreferenceValidationResult;
  exportPreferences: () => string;
  importPreferences: (json: string) => boolean;
}

// Gesture configuration derived from preferences
export interface GestureConfigFromPreferences {
  minSwipeDistance: number;
  maxSwipeTime: number;
  longPressDelay: number;
  swipeThreshold: number;
  hapticFeedback: boolean;
  debounceDelay: number;
}

// Helper function to convert sensitivity to numeric values
export const getGestureSensitivityValues = (
  sensitivity: GestureSensitivity
): { threshold: number; minDistance: number } => {
  switch (sensitivity) {
    case 'low':
      return { threshold: 70, minDistance: 80 };
    case 'medium':
      return { threshold: 50, minDistance: 60 };
    case 'high':
      return { threshold: 30, minDistance: 40 };
    default:
      return { threshold: 50, minDistance: 60 };
  }
};

// Helper function to convert auto-toggle delay to milliseconds
export const getAutoToggleDelayMs = (delay: AutoToggleDelay): number => {
  switch (delay) {
    case 'immediate':
      return 0;
    case 'short':
      return 500;
    case 'medium':
      return 1000;
    case 'long':
      return 2000;
    case 'disabled':
      return -1; // Indicates disabled
    default:
      return 1000;
  }
};
