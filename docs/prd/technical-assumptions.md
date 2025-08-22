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
