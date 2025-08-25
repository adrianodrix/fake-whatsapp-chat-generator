import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { initializeSentry } from '@/monitoring/sentry';

// Inicializar Sentry antes de renderizar a aplicação
initializeSentry();

// Inicializar monitoramento de performance
import { observeWebVitals } from '@/utils/performance';
observeWebVitals();

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('[PWA] Service Worker registrado:', registration);

      // Atualizar automaticamente quando nova versão estiver disponível
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              // Nova versão disponível, notificar usuário ou atualizar automaticamente
              console.log('[PWA] Nova versão disponível');

              // Auto-update para melhor UX mobile
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        }
      });
    } catch (error) {
      console.error('[PWA] Erro ao registrar Service Worker:', error);
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
