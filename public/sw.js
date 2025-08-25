// WhatsApp Chat Generator - Service Worker
// Versão simplificada focada em cache de assets essenciais

const CACHE_NAME = 'whatsapp-chat-v1';
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  // Assets serão adicionados dinamicamente pelo build
];

// Cache runtime para assets do Vite
const RUNTIME_CACHE = 'whatsapp-chat-runtime-v1';

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
  
  // Força a ativação imediata
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Remove caches antigos
              return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
            })
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
  );
  
  // Assume controle imediato de todas as páginas
  self.clients.claim();
});

// Estratégia de cache para requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip cross-origin requests (except for known CDNs)
  if (url.origin !== location.origin && !isAllowedOrigin(url.origin)) {
    return;
  }
  
  event.respondWith(handleRequest(request));
});

// Função para verificar origens permitidas
function isAllowedOrigin(origin) {
  const allowedOrigins = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdn.jsdelivr.net',
  ];
  return allowedOrigins.includes(origin);
}

// Handler principal para requests
async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // 1. Assets estáticos (JS, CSS, imagens) - Cache First
    if (isStaticAsset(url.pathname)) {
      return handleStaticAsset(request);
    }
    
    // 2. Páginas HTML - Network First com fallback
    if (isHTMLRequest(request)) {
      return handleHTMLRequest(request);
    }
    
    // 3. API calls - Network Only (sem cache para dados dinâmicos)
    if (url.pathname.startsWith('/api/')) {
      return fetch(request);
    }
    
    // 4. Default - Network First
    return handleNetworkFirst(request);
    
  } catch (error) {
    console.error('[SW] Request failed:', error);
    
    // Fallback para navegação
    if (isHTMLRequest(request)) {
      const cache = await caches.open(CACHE_NAME);
      return cache.match('/index.html') || new Response('Offline', { status: 503 });
    }
    
    return new Response('Network error', { status: 503 });
  }
}

// Cache First para assets estáticos
async function handleStaticAsset(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  
  if (cached) {
    console.log('[SW] Cache hit:', request.url);
    return cached;
  }
  
  console.log('[SW] Cache miss, fetching:', request.url);
  const response = await fetch(request);
  
  // Cache apenas respostas válidas
  if (response.ok) {
    cache.put(request, response.clone());
  }
  
  return response;
}

// Network First para HTML
async function handleHTMLRequest(request) {
  try {
    const response = await fetch(request);
    
    // Cache páginas válidas
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Fallback para cache
    const cache = await caches.open(RUNTIME_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Última opção: index.html
    return cache.match('/index.html');
  }
}

// Network First genérico
async function handleNetworkFirst(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    const cache = await caches.open(RUNTIME_CACHE);
    return cache.match(request);
  }
}

// Helpers
function isStaticAsset(pathname) {
  return /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i.test(pathname);
}

function isHTMLRequest(request) {
  return request.headers.get('accept')?.includes('text/html');
}

// Comunicação com a aplicação
self.addEventListener('message', (event) => {
  const { type, data } = event.data || {};
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_SIZE':
      getCacheSize().then((size) => {
        event.ports[0].postMessage({ type: 'CACHE_SIZE', size });
      });
      break;
      
    case 'CLEAR_CACHE':
      clearCaches().then(() => {
        event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
      });
      break;
  }
});

// Utilitários para gerenciamento de cache
async function getCacheSize() {
  try {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      totalSize += keys.length;
    }
    
    return totalSize;
  } catch (error) {
    console.error('[SW] Error getting cache size:', error);
    return 0;
  }
}

async function clearCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map((cacheName) => caches.delete(cacheName))
    );
    console.log('[SW] All caches cleared');
  } catch (error) {
    console.error('[SW] Error clearing caches:', error);
  }
}

// Logs de debug (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  console.log('[SW] Service Worker loaded in development mode');
}