import * as Sentry from '@sentry/react';

/**
 * Configuração do Sentry para monitoramento de erros
 */
// Types para import.meta compatível com Jest
interface ImportMeta {
  env?: Record<string, string | boolean>;
}

interface WindowWithImportMeta extends Window {
  import?: {
    meta?: ImportMeta;
  };
}

// Helper para verificar ambiente de forma compatível com Jest
const getEnvVar = (key: string, fallback = '') => {
  if (typeof window !== 'undefined' && 'import' in window) {
    const windowWithMeta = window as WindowWithImportMeta;
    const envValue = windowWithMeta.import?.meta?.env?.[key];
    return (typeof envValue === 'string' ? envValue : undefined) || fallback;
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || fallback;
  }
  return fallback;
};

const isProd = () => {
  if (typeof window !== 'undefined' && 'import' in window) {
    const windowWithMeta = window as WindowWithImportMeta;
    return Boolean(windowWithMeta.import?.meta?.env?.PROD);
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV === 'production';
  }
  return false;
};

export const initializeSentry = () => {
  // Só inicializar em produção e com DSN configurado
  if (isProd() && getEnvVar('VITE_SENTRY_DSN')) {
    Sentry.init({
      dsn: getEnvVar('VITE_SENTRY_DSN'),
      environment: getEnvVar('VITE_SENTRY_ENVIRONMENT') || 'production',
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          // Capture 10% of all sessions,
          // plus 100% of sessions with an error
          sampleRate: 0.1,
          errorSampleRate: 1.0,
        }),
      ],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,

      beforeSend(event) {
        // Filtrar erros conhecidos e não importantes
        if (event.exception) {
          const error = event.exception.values?.[0];

          // Filtrar erros comuns do browser que não são bugs da aplicação
          const ignoredErrors = [
            'ResizeObserver loop limit exceeded',
            'Non-Error promise rejection captured',
            'ChunkLoadError',
            'Loading chunk',
          ];

          if (
            error?.value &&
            ignoredErrors.some((ignored) => error.value?.includes(ignored))
          ) {
            return null;
          }
        }

        return event;
      },

      // Configuração para performance monitoring
      profilesSampleRate: 0.1,

      // Release tracking
      release: getEnvVar('VITE_APP_VERSION') || '1.0.0',
    });

    console.log('[Monitoring] Sentry inicializado');
  } else {
    console.log('[Monitoring] Sentry desabilitado (desenvolvimento)');
  }
};

/**
 * Helper para capturar erros manuais
 */
export const captureError = (
  error: Error,
  context?: Record<string, unknown>
) => {
  if (isProd() && getEnvVar('VITE_SENTRY_DSN')) {
    Sentry.captureException(error, {
      extra: context,
    });
  } else {
    console.error('[Error]', error, context);
  }
};

/**
 * Helper para capturar mensagens/logs importantes
 */
export const captureMessage = (
  message: string,
  level: 'info' | 'warning' | 'error' = 'info'
) => {
  if (isProd() && getEnvVar('VITE_SENTRY_DSN')) {
    Sentry.captureMessage(message, level);
  } else {
    console.log(`[${level.toUpperCase()}]`, message);
  }
};

/**
 * HOC para criar error boundaries com Sentry
 */
export const withErrorBoundary = Sentry.withErrorBoundary;

/**
 * Hook para profiling de performance
 */
export const usePerformanceTrace = (name: string) => {
  if (isProd() && getEnvVar('VITE_SENTRY_DSN')) {
    return Sentry.startSpan({ name }, () => {
      // Span será fechado automaticamente
    });
  }

  return null;
};
