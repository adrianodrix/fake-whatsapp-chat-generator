# Tech Stack - Fake WhatsApp Chat Generator

## Visão Geral

Este documento detalha a stack tecnológica simplificada do Fake WhatsApp Chat Generator, baseada na arquitetura refatorada para MVP eficiente com React + TypeScript + Tailwind CSS.

## Stack Principal

### Runtime & Framework Core

| Tecnologia | Versão | Propósito | Justificativa |
|------------|--------|-----------|---------------|
| **Node.js** | 18+ | Runtime de desenvolvimento | LTS estável, suporte nativo ESM |
| **React** | 18+ | Framework UI principal | Context nativo, Suspense, performance |
| **TypeScript** | 5+ | Type safety | DX superior, detecção precoce de erros |
| **Vite** | 4+ | Build tool e dev server | HMR ultra-rápido, bundling otimizado |

### Styling & UI

| Tecnologia | Versão | Propósito | Justificativa |
|------------|--------|-----------|---------------|
| **Tailwind CSS** | 3+ | Utility-first CSS | Prototipagem rápida, consistency |
| **PostCSS** | Latest | CSS processing | Autoprefixer, otimizações |

### State Management

| Tecnologia | Versão | Propósito | Justificativa |
|------------|--------|-----------|---------------|
| **React Context** | Built-in | Estado global | Nativo, sem dependências extras |
| **React Hooks** | Built-in | Estado local | useState, useReducer, custom hooks |

### Development Tools

| Tecnologia | Versão | Propósito | Justificativa |
|------------|--------|-----------|---------------|
| **ESLint** | Latest | Linting de código | Padrões de qualidade |
| **Prettier** | Latest | Formatação de código | Consistência visual |
| **Husky** | Latest | Git hooks | Pre-commit checks automáticos |
| **lint-staged** | Latest | Staged files linting | Performance em commits |

### Testing

| Tecnologia | Versão | Propósito | Justificativa |
|------------|--------|-----------|---------------|
| **Jest** | Latest | Unit test runner | Padrão da indústria, configuração zero |
| **React Testing Library** | Latest | Component testing | Testing best practices |
| **Playwright** | Latest | E2E testing | Cross-browser, reliability |
| **@testing-library/jest-dom** | Latest | DOM assertions | Matchers semânticos |

### Build & Deployment

| Tecnologia | Versão | Propósito | Justificativa |
|------------|--------|-----------|---------------|
| **Vercel** | - | Static hosting + CDN | Zero-config, preview deployments |
| **GitHub Actions** | - | CI/CD pipeline | Integração nativa GitHub |

### Monitoring & Analytics

| Tecnologia | Versão | Propósito | Justificativa |
|------------|--------|-----------|---------------|
| **Sentry** | Latest | Error tracking | Monitoramento produção |
| **Lighthouse CI** | Latest | Performance monitoring | Métricas automatizadas |

## Arquitetura de Dependencies

### Package.json Estrutura

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "date-fns": "^2.29.3",
    "clsx": "^1.2.1"
  },
  "devDependencies": {
    "@types/react": "^18.0.26",
    "@types/react-dom": "^18.0.9",
    "@types/node": "^18.11.18",
    "@typescript-eslint/eslint-plugin": "^5.48.1",
    "@typescript-eslint/parser": "^5.48.1",
    "@vitejs/plugin-react": "^3.0.1",
    "autoprefixer": "^10.4.13",
    "eslint": "^8.31.0",
    "eslint-plugin-react": "^7.32.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "husky": "^8.0.3",
    "jest": "^29.3.1",
    "lint-staged": "^13.1.0",
    "postcss": "^8.4.21",
    "prettier": "^2.8.2",
    "tailwindcss": "^3.2.4",
    "typescript": "^4.9.4",
    "vite": "^4.0.4"
  }
}
```

### Dependências Justificadas

#### Core Dependencies

- **date-fns**: Manipulação de datas (timestamps das mensagens)
- **clsx**: Conditional classes Tailwind de forma limpa
- **@types/***: Type definitions para TypeScript

#### Dependências Removidas (Simplificação)

- ~~Zustand~~ → React Context (nativo)
- ~~CSS Modules~~ → Pure Tailwind
- ~~React Router~~ → Single page (não necessário)
- ~~Framer Motion~~ → CSS animations básicas

## Configurações de Build

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
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['date-fns', 'clsx']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true,
    open: true
  },
  preview: {
    port: 4173
  }
});
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/contexts/*": ["./src/contexts/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  },
  "include": ["src", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
```

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wa: {
          primary: '#075E54',
          secondary: '#128C7E', 
          accent: '#25D366',
          bg: {
            chat: '#E5DDD5',
            pattern: '#F0F0F0',
          },
          bubble: {
            sent: '#DCF8C6',
            received: '#FFFFFF',
          },
          text: {
            primary: '#000000',
            secondary: '#667781',
            meta: '#8696A0',
          },
          check: {
            default: '#919191',
            read: '#4FC3F7',
          }
        }
      },
      fontFamily: {
        sans: [
          '-apple-system', 
          'BlinkMacSystemFont', 
          '"Segoe UI"', 
          'Helvetica', 
          'Arial', 
          'sans-serif'
        ],
      },
      spacing: {
        '15': '3.75rem', // 60px header height
      },
      maxWidth: {
        'bubble': '65%', // Max width for message bubbles
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
};
```

## Environment Configuration

### Variáveis de Ambiente

```bash
# .env.example
# Application
VITE_APP_NAME="Fake WhatsApp Chat Generator"
VITE_APP_VERSION="1.0.0"

# Analytics (Optional)
VITE_GA_ID=""

# Monitoring
VITE_SENTRY_DSN=""
VITE_SENTRY_ENVIRONMENT="development"

# Development
NODE_ENV="development"
VITE_DEBUG="false"

# Build
GENERATE_SOURCEMAP="true"
```

### Environment Types

```typescript
// src/types/env.d.ts
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_GA_ID?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_SENTRY_ENVIRONMENT: string;
  readonly VITE_DEBUG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## Browser Support

### Target Browsers

| Browser | Version | Market Share | Notes |
|---------|---------|--------------|-------|
| **Chrome** | 90+ | ~65% | Primary target |
| **Safari** | 14+ | ~19% | iOS compatibility |
| **Firefox** | 88+ | ~8% | Standards compliance |
| **Edge** | 90+ | ~4% | Chromium-based |
| **Samsung Internet** | 14+ | ~2% | Mobile Android |

### Polyfills & Fallbacks

```typescript
// src/utils/polyfills.ts
// Canvas API fallback para browsers antigos
export const hasCanvasSupport = (): boolean => {
  const canvas = document.createElement('canvas');
  return !!(canvas.getContext && canvas.getContext('2d'));
};

// Local Storage fallback
export const hasLocalStorageSupport = (): boolean => {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch {
    return false;
  }
};
```

## Performance Targets

### Bundle Size Targets

| Metric | Target | Current | Notes |
|--------|--------|---------|-------|
| **Initial Bundle** | < 150KB | - | Gzipped |
| **Vendor Chunk** | < 100KB | - | React + deps |
| **App Chunk** | < 50KB | - | Application code |
| **Total Size** | < 200KB | - | All chunks combined |

### Performance Metrics

| Metric | Target | Tools |
|--------|--------|-------|
| **First Contentful Paint** | < 1.5s | Lighthouse |
| **Time to Interactive** | < 3s | Lighthouse |
| **Cumulative Layout Shift** | < 0.1 | Lighthouse |
| **Animation Frame Rate** | 60fps | DevTools |

## Development Workflow

### Scripts Package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,css,md}\"",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "prepare": "husky install"
  }
}
```

### Git Workflow

```bash
# Desenvolvimento local
npm run dev          # Start dev server
npm run type-check   # Verificar types
npm run lint         # Verificar code quality
npm run test         # Rodar testes

# Build e deploy
npm run build        # Build para produção
npm run preview      # Preview do build

# Qualidade
npm run test:coverage # Coverage report
npm run test:e2e     # E2E tests
```

## Monitoring & Observability

### Sentry Configuration

```typescript
// src/utils/monitoring.ts
import * as Sentry from '@sentry/react';

if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
    tracesSampleRate: 0.1,
    integrations: [
      new Sentry.BrowserTracing(),
    ],
    beforeSend(event) {
      // Filtrar erros não importantes
      if (event.exception) {
        const error = event.exception.values?.[0];
        if (error?.value?.includes('ResizeObserver loop limit exceeded')) {
          return null;
        }
      }
      return event;
    },
  });
}
```

### Performance Monitoring

```typescript
// src/utils/performance.ts
export const measurePerformance = (name: string, fn: () => void) => {
  if (import.meta.env.DEV) {
    performance.mark(`${name}-start`);
    fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name)[0];
    console.log(`${name}: ${measure.duration.toFixed(2)}ms`);
  } else {
    fn();
  }
};
```

## Security Considerations

### Content Security Policy

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self';
  connect-src 'self';
">
```

### Input Sanitization

```typescript
// src/utils/security.ts
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
```

## Future Considerations

### Potential Upgrades

- **React 19**: Concurrent features, Server Components
- **Vite 5**: Improved HMR, better tree-shaking
- **Tailwind 4**: CSS-in-JS, better performance
- **WebAssembly**: Canvas processing performance

### Architecture Evolution

- **Micro-frontends**: Escalar para features complexas
- **Service Worker**: Caching inteligente
- **Web Components**: Interoperabilidade
- **Progressive Enhancement**: Graceful degradation

---

*Documento mantido por Winston (Architect) - Atualizado em 22/08/2025*