import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer - apenas quando VITE_BUNDLE_ANALYZER=true
    ...(process.env.VITE_BUNDLE_ANALYZER === 'true'
      ? [
          visualizer({
            filename: 'dist/stats.html',
            open: true,
            gzipSize: true,
            brotliSize: true,
            template: 'treemap', // sunburst, treemap, network
          }),
        ]
      : []),
    // Sentry plugin para sourcemaps em produção
    ...(process.env.NODE_ENV === 'production' && process.env.VITE_SENTRY_DSN
      ? [
          sentryVitePlugin({
            org: 'fake-whatsapp',
            project: 'chat-generator',
            authToken: process.env.SENTRY_AUTH_TOKEN,
            sourcemaps: {
              assets: './dist/**',
            },
            release: {
              name: process.env.VITE_APP_VERSION || '1.0.0',
            },
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/contexts': path.resolve(__dirname, './src/contexts'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/monitoring': path.resolve(__dirname, './src/monitoring'),
    },
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libs
          vendor: ['react', 'react-dom'],
          // Heavy components para lazy loading
          'lazy-components': [
            'src/components/modals/ExportModal/ExportModal.tsx',
            'src/components/chat/ProfilePanel/ProfilePanel.tsx',
          ],
          // Utilities separados
          utils: ['html2canvas', '@floating-ui/react'],
          // Monitoring separado
          monitoring: ['@sentry/react'],
        },
      },
    },
    // Performance budgets rigorosos
    chunkSizeWarningLimit: 150, // 150KB warning
    assetsInlineLimit: 4096, // 4KB inline limit
  },
  define: {
    // Garantir que env vars sejam disponibilizadas
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    // Fix para CommonJS modules no browser
    global: 'globalThis',
  },
  server: {
    port: 5173,
    host: true,
    open: true,
  },
  preview: {
    port: 4173,
  },
  // Otimizações de dev
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@floating-ui/react',
      'hoist-non-react-statics',
    ],
    exclude: ['@sentry/react'], // Não otimizar Sentry no dev
    force: true, // Forçar re-bundling de deps
    esbuildOptions: {
      // Resolver CommonJS modules
      mainFields: ['module', 'main'],
      conditions: ['import', 'module', 'browser', 'default'],
    },
  },
});
