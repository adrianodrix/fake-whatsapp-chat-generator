import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { captureError } from '@/monitoring/sentry';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary para capturar erros em componentes React
 * Integrado com Sentry para monitoramento de erros
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Atualiza o state para mostrar a UI de fallback
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log do erro para Sentry
    captureError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: 'ErrorBoundary',
    });

    // Callback personalizado se fornecido
    this.props.onError?.(error, errorInfo);

    // Log para desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary capturou um erro:', error, errorInfo);
    }

    this.setState({ errorInfo });
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // UI de fallback customizada ou padrão
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
          <div className="mx-auto max-w-max">
            <main className="sm:flex">
              <p className="text-4xl font-bold tracking-tight text-wa-primary sm:text-5xl">
                😵
              </p>
              <div className="sm:ml-6">
                <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Oops! Algo deu errado
                  </h1>
                  <p className="mt-1 text-base text-gray-500">
                    Ocorreu um erro inesperado na aplicação
                  </p>
                </div>
                <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                  <button
                    onClick={this.handleRetry}
                    className="inline-flex items-center rounded-md bg-wa-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-wa-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wa-primary"
                  >
                    Tentar novamente
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Recarregar página
                  </button>
                </div>

                {/* Detalhes do erro apenas em desenvolvimento */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-6 border rounded-lg p-4 bg-red-50">
                    <summary className="cursor-pointer text-sm font-medium text-red-800">
                      Detalhes do erro (desenvolvimento)
                    </summary>
                    <div className="mt-2 text-xs text-red-700 font-mono whitespace-pre-wrap">
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack}
                    </div>
                  </details>
                )}
              </div>
            </main>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook para criar um Error Boundary funcional (React 18+)
 * Para casos simples onde não precisa de classe
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};
