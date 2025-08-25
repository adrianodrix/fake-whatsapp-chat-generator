// Mock implementation for Jest testing
class MockPrivacyFirstAnalytics {
  private config = {
    enabled: true,
    endpoint: '',
    sessionId: 'mock-session-123',
  };

  private consentGiven = false;
  private events: Array<{
    eventName: string;
    properties?: Record<string, unknown>;
    timestamp: Date;
  }> = [];

  constructor() {
    this.loadConsent();
  }

  private loadConsent(): void {
    // Mock localStorage behavior
    this.consentGiven = false;
  }

  public setConsent(consent: boolean): void {
    this.consentGiven = consent;
    if (!consent) {
      this.events = [];
    }
  }

  public hasConsent(): boolean {
    return this.consentGiven;
  }

  public track(eventName: string, properties?: Record<string, unknown>): void {
    if (!this.config.enabled || !this.consentGiven) {
      return;
    }

    const sanitizedProperties = this.sanitizeProperties(properties);

    const event = {
      eventName,
      properties: sanitizedProperties,
      timestamp: new Date(),
    };

    this.events.push(event);

    // Mock console.log for development
    console.log('[Analytics]', eventName, sanitizedProperties);
  }

  private sanitizeProperties(
    properties?: Record<string, unknown>
  ): Record<string, unknown> {
    if (!properties) return {};

    const sanitized: Record<string, unknown> = {};
    const blockedKeys = [
      'email',
      'name',
      'phone',
      'address',
      'ip',
      'message',
      'text',
    ];

    for (const [key, value] of Object.entries(properties)) {
      if (blockedKeys.some((blocked) => key.toLowerCase().includes(blocked))) {
        continue;
      }

      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
      ) {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  public trackPageView(page: string): void {
    this.track('page_view', { page });
  }

  public trackAction(action: string, category?: string, label?: string): void {
    this.track('user_action', { action, category, label });
  }

  public trackTiming(category: string, variable: string, time: number): void {
    this.track('timing', { category, variable, time });
  }

  public trackError(error: string, fatal: boolean = false): void {
    this.track('error', { error: error.substring(0, 100), fatal });
  }
}

export const analytics = new MockPrivacyFirstAnalytics();

export const trackEvent = (
  eventName: string,
  properties?: Record<string, unknown>
) => {
  analytics.track(eventName, properties);
};

export const trackPageView = (page: string) => {
  analytics.trackPageView(page);
};

export const trackAction = (
  action: string,
  category?: string,
  label?: string
) => {
  analytics.trackAction(action, category, label);
};

export const setAnalyticsConsent = (consent: boolean) => {
  analytics.setConsent(consent);
};

export const hasAnalyticsConsent = () => {
  return analytics.hasConsent();
};
