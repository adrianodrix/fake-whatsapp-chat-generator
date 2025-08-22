# Technical Assumptions

## Repository Structure: Monorepo

Estrutura monorepo com packages separados:

- `/packages/ui` - Componentes React reutilizáveis
- `/packages/core` - Lógica de negócio e estado
- `/apps/web` - Aplicação Next.js principal
- `/packages/utils` - Utilitários compartilhados

## Service Architecture

**Serverless com processamento client-side:** Aplicação será uma SPA (Single Page Application) com todo processamento ocorrendo no browser. Backend serverless apenas para:

- Servir assets estáticos via CDN
- Analytics não-invasivos (opcional pós-MVP)
- Futura API para features premium

Escolha baseada em: redução de custos, privacidade total do usuário, performance máxima, facilidade de deploy.

## Testing Requirements

**Full Testing Pyramid** com foco em confiabilidade:

- **Unit Tests:** Componentes React, funções de utilidade (Jest + React Testing Library)
- **Integration Tests:** Fluxos de usuário críticos (Cypress)
- **Visual Regression:** Comparação pixel-perfect com WhatsApp real (Percy/Chromatic)
- **E2E Tests:** Jornadas completas incluindo export (Playwright)
- **Manual Testing:** Checklist de dispositivos/browsers antes de cada release

## Additional Technical Assumptions and Requests

- **Framework:** React 18+ com TypeScript para type safety
- **Bundler:** Vite para desenvolvimento rápido e builds otimizados
- **Styling:** Tailwind CSS + CSS Modules para styling híbrido
- **State Management:** Zustand para estado global simples e performático
- **Image Processing:** Canvas API para manipulação e export de imagens
- **Deployment:** Vercel com preview deployments automáticos
- **CI/CD:** GitHub Actions para testes e deploy automático
- **Monitoring:** Sentry para error tracking em produção
- **Performance:** Lighthouse CI para garantir métricas de performance
- **Linting:** ESLint + Prettier com pre-commit hooks via Husky

## Quality Standards & Gates

### Security Requirements

- **100% client-side processing** - No server uploads, total privacy maintained
- **MIME type validation** for all file uploads (image/jpeg, image/png, image/webp only)
- **XSS prevention** in all user inputs with HTML entity escaping
- **File size limits** enforced (10MB maximum for uploads)
- **Input sanitization** for all user-provided content

### Performance Standards

- **Image processing** < 100ms for files < 5MB
- **Application load time** < 2s on 3G connections
- **Memory usage** < 100MB during image processing operations
- **Bundle size** < 500KB gzipped for initial load
- **Core Web Vitals** meeting Google's "Good" thresholds

### Testing Requirements

- **Unit test coverage** ≥ 80% for core functions and components
- **Integration tests** for all critical user flows
- **Performance tests** for image processing and Canvas operations
- **Security tests** for upload validation and input sanitization
- **Visual regression tests** ensuring WhatsApp-like appearance

### Quality Gates

- **All stories require QA review** before merging to main branch
- **Performance benchmarks must pass** in CI pipeline
- **Security validation must pass** for all user input scenarios
- **Accessibility standards** followed (WCAG 2.1 AA compliance)
- **Browser compatibility** verified across Chrome, Firefox, Safari, Edge
- **Mobile responsiveness** validated on iOS/Android devices

### Monitoring & Alerting

- **Performance monitoring** with real-user metrics
- **Error tracking** with Sentry for production issues
- **Security monitoring** for potential attack vectors
- **Quality metrics** dashboard for continuous improvement
