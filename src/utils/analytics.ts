interface AnalyticsEvent {
  eventName: string;
  properties?: Record<string, unknown>;
  timestamp: Date;
}

interface AnalyticsConfig {
  enabled: boolean;
  endpoint?: string;
  userId?: string;
  sessionId: string;
}

class PrivacyFirstAnalytics {
  private config: AnalyticsConfig;
  private events: AnalyticsEvent[] = [];
  private consentGiven: boolean = false;
  private localStorage =
    typeof window !== 'undefined' ? window.localStorage : null;

  constructor() {
    this.config = {
      enabled:
        typeof import.meta !== 'undefined'
          ? import.meta.env.VITE_ANALYTICS_ENABLED === 'true'
          : process.env.VITE_ANALYTICS_ENABLED === 'true',
      endpoint:
        typeof import.meta !== 'undefined'
          ? import.meta.env.VITE_ANALYTICS_ENDPOINT || ''
          : process.env.VITE_ANALYTICS_ENDPOINT || '',
      sessionId: this.generateSessionId(),
    };

    this.loadConsent();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadConsent(): void {
    if (this.localStorage) {
      const consent = this.localStorage.getItem('analytics_consent');
      this.consentGiven = consent === 'true';
    }
  }

  public setConsent(consent: boolean): void {
    this.consentGiven = consent;
    if (this.localStorage) {
      this.localStorage.setItem('analytics_consent', String(consent));
    }

    if (!consent) {
      // Clear any queued events if consent is revoked
      this.events = [];
    }
  }

  public hasConsent(): boolean {
    return this.consentGiven;
  }

  public track(eventName: string, properties?: Record<string, unknown>): void {
    // Only track if analytics is enabled and consent is given
    if (!this.config.enabled || !this.consentGiven) {
      return;
    }

    // Sanitize properties to remove any personal data
    const sanitizedProperties = this.sanitizeProperties(properties);

    const event: AnalyticsEvent = {
      eventName,
      properties: sanitizedProperties,
      timestamp: new Date(),
    };

    this.events.push(event);

    // In a real implementation, you would batch and send events
    // For now, just log to console in development
    const isDev =
      typeof import.meta !== 'undefined'
        ? import.meta.env.DEV
        : process.env.NODE_ENV === 'development';

    if (isDev) {
      console.log('[Analytics]', eventName, sanitizedProperties);
    }
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
      // Skip any keys that might contain personal data
      if (blockedKeys.some((blocked) => key.toLowerCase().includes(blocked))) {
        continue;
      }

      // Only include primitive types and sanitized values
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

  // Common events
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

// Export singleton instance
export const analytics = new PrivacyFirstAnalytics();

// Export common tracking functions
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
