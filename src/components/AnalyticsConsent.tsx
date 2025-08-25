import React, { useState, useEffect } from 'react';
import { setAnalyticsConsent } from '../utils/analytics';

interface AnalyticsConsentProps {
  onConsentChange?: (consent: boolean) => void;
}

export const AnalyticsConsent: React.FC<AnalyticsConsentProps> = ({
  onConsentChange,
}) => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already responded to consent
    const consentStatus = localStorage.getItem('analytics_consent_responded');
    if (!consentStatus) {
      setShowBanner(true);
    } else {
      setHasResponded(true);
    }
  }, []);

  const handleAccept = () => {
    setAnalyticsConsent(true);
    localStorage.setItem('analytics_consent_responded', 'true');
    setShowBanner(false);
    onConsentChange?.(true);
  };

  const handleDecline = () => {
    setAnalyticsConsent(false);
    localStorage.setItem('analytics_consent_responded', 'true');
    setShowBanner(false);
    onConsentChange?.(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 animate-slide-up">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Privacidade em primeiro lugar 🔒
            </h3>
            <p className="text-sm text-gray-600">
              Gostaríamos de coletar dados anônimos de uso para melhorar sua
              experiência. Nenhum dado pessoal ou conteúdo de mensagens é
              coletado. Você pode mudar isso a qualquer momento.
            </p>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={handleDecline}
              className="flex-1 sm:flex-initial px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              aria-label="Recusar analytics"
            >
              Não, obrigado
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 sm:flex-initial px-4 py-2 text-sm font-medium text-white bg-wa-primary rounded-md hover:bg-wa-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wa-primary"
              aria-label="Aceitar analytics"
            >
              Aceitar
            </button>
          </div>
        </div>

        <div className="mt-3">
          <details className="text-xs text-gray-500">
            <summary className="cursor-pointer hover:text-gray-700">
              Saiba mais sobre nossos dados
            </summary>
            <div className="mt-2 space-y-1">
              <p>• Coletamos apenas: cliques, páginas visitadas e erros</p>
              <p>
                • Nunca coletamos: mensagens, nomes, fotos ou dados pessoais
              </p>
              <p>• Todos os dados são anonimizados e agregados</p>
              <p>• Nenhum cookie de terceiros é usado</p>
              <p>• Dados são usados apenas para melhorar a ferramenta</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

AnalyticsConsent.displayName = 'AnalyticsConsent';
