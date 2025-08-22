# Epic 1: Foundation & Core Chat Interface

**Goal:** Estabelecer a base técnica do projeto com CI/CD, criar a interface visual do WhatsApp pixel-perfect, e implementar a estrutura básica de dados para mensagens. Este épico entrega a "casca" visual autêntica do WhatsApp com uma mensagem de exemplo, provando que conseguimos replicar o visual com perfeição.

## Story 1.1: Project Setup & Infrastructure

**As a** developer,
**I want** a fully configured development environment with CI/CD,
**so that** we can develop efficiently with automated testing and deployment.

### Acceptance Criteria

1. Repository criado com estrutura monorepo usando npm workspaces
2. React + TypeScript + Vite configurados com hot reload funcional
3. Tailwind CSS configurado com design tokens do WhatsApp
4. ESLint + Prettier configurados com pre-commit hooks via Husky
   5: GitHub Actions configurado para rodar testes em PRs
   6: Deploy automático para Vercel em pushes para main
   7: Ambiente de desenvolvimento rodando localmente em http://localhost:5173
   8: README com instruções de setup e desenvolvimento

## Story 1.2: WhatsApp Visual Foundation

**As a** user,
**I want** to see an authentic WhatsApp chat interface,
**so that** the mockups I create look indistinguishable from real screenshots.

### Acceptance Criteria

1: Header do chat renderizado com cor #075E54 e altura de 60px
2: Background do chat com cor #E5DDD5 e pattern de fundo
3: Área de input inferior com ícones de emoji, anexo e microfone
4: Fonte Helvetica Neue ou system font apropriada aplicada
5: Layout responsivo que adapta para mobile (< 768px) e desktop
6: Uma mensagem de exemplo mostrando bolha verde (#DCF8C6) para enviada
7: Uma mensagem de exemplo mostrando bolha branca para recebida
8: Timestamps e checks renderizados com cores e tamanhos corretos

## Story 1.3: Profile Configuration System

**As a** user,
**I want** to configure names and avatars for both participants,
**so that** my mockup conversations have realistic identities.

### Acceptance Criteria

1: Componente de configuração de perfil com campos de nome e upload de avatar
2: Avatar padrão (iniciais) gerado quando foto não fornecida
3: Upload de imagem funcional com preview imediato
4: Imagens redimensionadas para 40x40px automaticamente
5: Estado dos perfis persistido durante a sessão
6: Nome do contato aparece no header do chat
7: Avatars aparecem ao lado das mensagens quando em grupos (preparação futura)
8: Validação de nome (mínimo 1 caractere, máximo 25)

## Story 1.4: Message Data Structure

**As a** developer,
**I want** a robust data structure for messages,
**so that** we can efficiently manage and render conversations.

### Acceptance Criteria

1: Interface TypeScript definida para Message com todos campos necessários
2: Store Zustand criado para gerenciar estado das mensagens
3: Funções para adicionar, editar e deletar mensagens implementadas
4: Mensagens mantêm ordem cronológica baseada em timestamp
5: Identificador único (UUID) para cada mensagem
6: Suporte para diferentes status (enviado, entregue, lido)
7: Sistema de re-renderização eficiente usando React.memo
8: Testes unitários para todas operações do store

## Story 1.5: Testing Infrastructure Setup

**As a** developer,
**I want** automated testing infrastructure configured,
**so that** code quality is validated consistently across the project.

### Acceptance Criteria

1: Jest + React Testing Library configurado e funcional
2: Coverage reports com threshold mínimo de 80%
3: GitHub Actions CI pipeline executando testes automaticamente
4: Pre-commit hooks prevenindo commits com falhas
5: Estrutura de test files seguindo hierarquia de componentes
6: Documentação de guidelines de testes para o time

## Story 1.6: Security Validation Framework

**As a** developer,
**I want** security validation framework for file uploads,
**so that** user uploads are processed safely and securely.

### Acceptance Criteria

1: Validação MIME type rigorosa (image/jpeg, image/png, image/webp)
2: Limite de tamanho arquivo com feedback de erro (10MB max)
3: Sanitização de inputs para prevenir XSS
4: Verificação de assinatura de arquivo (não apenas extensão)
5: Suite de testes de segurança para cenários maliciosos
6: Documentação de práticas de segurança para uploads

## Story 1.7: Performance Monitoring Setup

**As a** developer,
**I want** performance monitoring and measurement tools,
**so that** I can validate optimizations and catch performance regressions.

### Acceptance Criteria

1: Utilities de performance usando Performance.now() APIs
2: Benchmarks para operações de Canvas e resize de imagem
3: Monitoramento de uso de memória durante processamento
4: Performance regression tests no pipeline CI
5: Dashboard básico mostrando métricas chave
6: Orçamentos de performance definidos para operações críticas
