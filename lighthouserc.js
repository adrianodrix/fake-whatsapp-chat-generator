module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Local:.*:4173',
      startServerReadyTimeout: 20000,
      url: ['http://localhost:4173'],
      numberOfRuns: 3,
      settings: {
        // Configurações específicas para o Lighthouse
        chromeFlags: '--no-sandbox --headless',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.8 }],

        // Performance específico
        'first-contentful-paint': ['error', { maxNumericValue: 1500 }],
        interactive: ['error', { maxNumericValue: 3000 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],

        // Bundle size
        'resource-summary:script:size': ['warn', { maxNumericValue: 200000 }], // 200KB
        'unused-javascript': ['warn', { maxLength: 5 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    server: {
      port: 9001,
      storage: '.lighthouseci',
    },
  },
};
