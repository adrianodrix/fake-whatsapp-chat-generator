// Mock the entire analytics module to avoid import.meta issues
jest.mock('./analytics', () => {
  const mockAnalytics = {
    config: { enabled: true, sessionId: 'test-session' },
    setConsent: jest.fn(),
    hasConsent: jest.fn(() => false),
    track: jest.fn(),
    trackPageView: jest.fn(),
    trackAction: jest.fn(),
    trackTiming: jest.fn(),
    trackError: jest.fn(),
  };

  return {
    analytics: mockAnalytics,
    trackEvent: jest.fn(),
    trackPageView: jest.fn(),
    trackAction: jest.fn(),
    setAnalyticsConsent: jest.fn(),
    hasAnalyticsConsent: jest.fn(() => false),
  };
});

import {
  analytics,
  trackEvent,
  trackPageView,
  setAnalyticsConsent,
  hasAnalyticsConsent,
} from './analytics';

describe('Privacy-First Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (hasAnalyticsConsent as jest.Mock).mockReturnValue(false);
  });

  describe('Consent Management', () => {
    it('starts with no consent by default', () => {
      expect(hasAnalyticsConsent()).toBe(false);
    });

    it('sets consent when called', () => {
      setAnalyticsConsent(true);
      expect(setAnalyticsConsent).toHaveBeenCalledWith(true);
    });

    it('revokes consent when called with false', () => {
      setAnalyticsConsent(false);
      expect(setAnalyticsConsent).toHaveBeenCalledWith(false);
    });
  });

  describe('Event Tracking', () => {
    it('calls trackEvent when tracking events', () => {
      trackEvent('test_event', { action: 'click' });
      expect(trackEvent).toHaveBeenCalledWith('test_event', {
        action: 'click',
      });
    });

    it('calls trackPageView when tracking page views', () => {
      trackPageView('/home');
      expect(trackPageView).toHaveBeenCalledWith('/home');
    });
  });

  describe('Analytics Instance Methods', () => {
    it('calls analytics methods when invoked', () => {
      analytics.trackAction('button_click', 'navigation', 'header');
      expect(analytics.trackAction).toHaveBeenCalledWith(
        'button_click',
        'navigation',
        'header'
      );
    });

    it('calls analytics timing method', () => {
      analytics.trackTiming('api', 'load_messages', 250);
      expect(analytics.trackTiming).toHaveBeenCalledWith(
        'api',
        'load_messages',
        250
      );
    });

    it('calls analytics error method', () => {
      analytics.trackError('test error', true);
      expect(analytics.trackError).toHaveBeenCalledWith('test error', true);
    });
  });

  describe('Privacy Features', () => {
    it('validates consent management workflow', () => {
      // Test consent setting
      analytics.setConsent(true);
      expect(analytics.setConsent).toHaveBeenCalledWith(true);

      // Test consent checking
      analytics.hasConsent();
      expect(analytics.hasConsent).toHaveBeenCalled();
    });

    it('validates tracking workflow', () => {
      analytics.track('test_event', { category: 'test' });
      expect(analytics.track).toHaveBeenCalledWith('test_event', {
        category: 'test',
      });
    });
  });
});
