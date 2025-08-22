/**
 * Tests for preferences types and helper functions
 */

import {
  DEFAULT_SENDER_PREFERENCES,
  PREFERENCES_PRESETS,
  getGestureSensitivityValues,
  getAutoToggleDelayMs,
  type SenderPreferences,
  type GestureSensitivity,
  type AutoToggleDelay,
} from '../preferences';

describe('preferences types', () => {
  describe('DEFAULT_SENDER_PREFERENCES', () => {
    it('has all required properties', () => {
      expect(DEFAULT_SENDER_PREFERENCES).toHaveProperty('autoToggle');
      expect(DEFAULT_SENDER_PREFERENCES).toHaveProperty('customShortcuts');
      expect(DEFAULT_SENDER_PREFERENCES).toHaveProperty('senderColors');
      expect(DEFAULT_SENDER_PREFERENCES).toHaveProperty('gesturesEnabled');
      expect(DEFAULT_SENDER_PREFERENCES).toHaveProperty(
        'hapticFeedbackEnabled'
      );
    });

    it('has valid default values', () => {
      expect(
        DEFAULT_SENDER_PREFERENCES.animationDuration
      ).toBeGreaterThanOrEqual(50);
      expect(DEFAULT_SENDER_PREFERENCES.animationDuration).toBeLessThanOrEqual(
        1000
      );
      expect(DEFAULT_SENDER_PREFERENCES.swipeThreshold).toBeGreaterThanOrEqual(
        30
      );
      expect(DEFAULT_SENDER_PREFERENCES.longPressDelay).toBeGreaterThanOrEqual(
        200
      );
      expect(DEFAULT_SENDER_PREFERENCES.debounceDelay).toBeGreaterThanOrEqual(
        10
      );
    });

    it('has valid color values', () => {
      expect(DEFAULT_SENDER_PREFERENCES.senderColors.user).toMatch(
        /^#[0-9A-Fa-f]{6}$/
      );
      expect(DEFAULT_SENDER_PREFERENCES.senderColors.contact).toMatch(
        /^#[0-9A-Fa-f]{6}$/
      );
    });

    it('has at least one default shortcut', () => {
      expect(DEFAULT_SENDER_PREFERENCES.customShortcuts.length).toBeGreaterThan(
        0
      );
    });
  });

  describe('PREFERENCES_PRESETS', () => {
    it('has at least the basic presets', () => {
      const presetNames = PREFERENCES_PRESETS.map((preset) => preset.name);
      expect(presetNames).toContain('Default');
      expect(presetNames).toContain('Power User');
      expect(presetNames).toContain('Accessibility');
      expect(presetNames).toContain('Mobile Optimized');
      expect(presetNames).toContain('Performance');
    });

    it('has valid preset structure', () => {
      PREFERENCES_PRESETS.forEach((preset) => {
        expect(preset).toHaveProperty('name');
        expect(preset).toHaveProperty('description');
        expect(preset).toHaveProperty('preferences');
        expect(typeof preset.name).toBe('string');
        expect(typeof preset.description).toBe('string');
        expect(typeof preset.preferences).toBe('object');
      });
    });

    it('accessibility preset reduces motion', () => {
      const accessibilityPreset = PREFERENCES_PRESETS.find(
        (p) => p.name === 'Accessibility'
      );
      expect(accessibilityPreset?.preferences.reduceMotion).toBe(true);
      expect(accessibilityPreset?.preferences.highContrastMode).toBe(true);
    });

    it('mobile preset enables gestures', () => {
      const mobilePreset = PREFERENCES_PRESETS.find(
        (p) => p.name === 'Mobile Optimized'
      );
      expect(mobilePreset?.preferences.gesturesEnabled).toBe(true);
      expect(mobilePreset?.preferences.hapticFeedbackEnabled).toBe(true);
    });

    it('performance preset reduces animations', () => {
      const performancePreset = PREFERENCES_PRESETS.find(
        (p) => p.name === 'Performance'
      );
      expect(
        performancePreset?.preferences.animationDuration
      ).toBeLessThanOrEqual(100);
      expect(performancePreset?.preferences.reduceMotion).toBe(true);
    });
  });

  describe('getGestureSensitivityValues', () => {
    it('returns correct values for low sensitivity', () => {
      const values = getGestureSensitivityValues('low');
      expect(values.threshold).toBe(70);
      expect(values.minDistance).toBe(80);
    });

    it('returns correct values for medium sensitivity', () => {
      const values = getGestureSensitivityValues('medium');
      expect(values.threshold).toBe(50);
      expect(values.minDistance).toBe(60);
    });

    it('returns correct values for high sensitivity', () => {
      const values = getGestureSensitivityValues('high');
      expect(values.threshold).toBe(30);
      expect(values.minDistance).toBe(40);
    });

    it('handles invalid sensitivity gracefully', () => {
      const values = getGestureSensitivityValues(
        'invalid' as GestureSensitivity
      );
      expect(values.threshold).toBe(50);
      expect(values.minDistance).toBe(60);
    });

    it('high sensitivity is more sensitive than low', () => {
      const low = getGestureSensitivityValues('low');
      const high = getGestureSensitivityValues('high');

      expect(high.threshold).toBeLessThan(low.threshold);
      expect(high.minDistance).toBeLessThan(low.minDistance);
    });
  });

  describe('getAutoToggleDelayMs', () => {
    it('returns correct values for all delay types', () => {
      expect(getAutoToggleDelayMs('immediate')).toBe(0);
      expect(getAutoToggleDelayMs('short')).toBe(500);
      expect(getAutoToggleDelayMs('medium')).toBe(1000);
      expect(getAutoToggleDelayMs('long')).toBe(2000);
      expect(getAutoToggleDelayMs('disabled')).toBe(-1);
    });

    it('handles invalid delay gracefully', () => {
      const result = getAutoToggleDelayMs('invalid' as AutoToggleDelay);
      expect(result).toBe(1000);
    });

    it('has reasonable progression of delay values', () => {
      const immediate = getAutoToggleDelayMs('immediate');
      const short = getAutoToggleDelayMs('short');
      const medium = getAutoToggleDelayMs('medium');
      const long = getAutoToggleDelayMs('long');

      expect(immediate).toBeLessThan(short);
      expect(short).toBeLessThan(medium);
      expect(medium).toBeLessThan(long);
    });
  });

  describe('type safety', () => {
    it('allows valid SenderPreferences object', () => {
      const validPrefs: SenderPreferences = {
        ...DEFAULT_SENDER_PREFERENCES,
        autoToggle: true,
        customShortcuts: ['Tab', 'Space'],
        gestureSensitivity: 'high',
      };

      expect(validPrefs).toBeDefined();
    });

    it('requires all properties in SenderPreferences', () => {
      // This test ensures TypeScript compilation catches missing properties
      const requiredProps = [
        'autoToggle',
        'autoToggleDelay',
        'customShortcuts',
        'shortcutsEnabled',
        'senderColors',
        'showSenderIndicator',
        'animationDuration',
        'gesturesEnabled',
        'swipeThreshold',
        'gestureSensitivity',
        'hapticFeedbackEnabled',
        'longPressDelay',
        'debounceDelay',
        'preventScrollDuringSwipe',
        'screenReaderAnnouncements',
        'highContrastMode',
        'reduceMotion',
      ];

      requiredProps.forEach((prop) => {
        expect(DEFAULT_SENDER_PREFERENCES).toHaveProperty(prop);
      });
    });
  });
});
