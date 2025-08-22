import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

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
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          performance: ['src/utils/performance.ts'],
        },
      },
    },
    // Performance budgets
    chunkSizeWarningLimit: 200, // 200KB warning
  },
  define: {
    // Garantir que env vars sejam disponibilizadas
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
  },
  server: {
    port: 5173,
    host: true,
    open: true,
  },
  preview: {
    port: 4173,
  },
});
