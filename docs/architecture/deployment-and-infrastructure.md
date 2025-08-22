# Deployment and Infrastructure

## Simplified Vercel Deployment

### Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2020',
  },
  server: {
    port: 5173,
    host: true,
  },
});
```

### Environment Configuration
```bash