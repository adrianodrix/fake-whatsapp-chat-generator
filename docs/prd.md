# Fake WhatsApp Chat Generator Product Requirements Document (PRD)

## Goals and Background Context

### Goals

- Criar uma ferramenta web que replica pixel-perfect a interface do WhatsApp para mockups de conversas
- Atingir 1.000 usuários ativos no primeiro mês com 40% de retenção após 30 dias
- Entregar MVP funcional em 2 semanas com autenticidade visual absoluta
- Permitir criação de conversas completas em menos de 2 minutos
- Estabelecer a ferramenta como padrão de mercado para mockups de conversas

### Background Context

O Fake WhatsApp Chat Generator resolve a necessidade crítica de profissionais de marketing, educadores e criadores de conteúdo que precisam criar mockups realistas de conversas do WhatsApp. Atualmente, as soluções existentes falham em dois aspectos fundamentais: ferramentas profissionais como Photoshop são complexas e demoradas (15-30 min por conversa), enquanto geradores online produzem resultados visivelmente artificiais. Nossa solução oferece autenticidade visual indistinguível do WhatsApp real combinada com edição inline instantânea, permitindo criação de conversas convincentes em segundos.

O momento é crítico pois o formato de conversas como conteúdo está em crescimento exponencial (stories, anúncios, materiais educacionais), criando uma janela de oportunidade para estabelecer o padrão de mercado antes que surja uma solução dominante.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 21/08/2025 | 1.0 | Criação inicial do PRD baseado no Project Brief | John (PM) |

## Requirements

### Functional

- **FR1:** O sistema deve permitir configuração completa de perfis "Você" e "Contato" com nome e upload de foto avatar
- **FR2:** O sistema deve permitir adicionar mensagens de texto com conteúdo editável inline via hover (desktop) ou long press (mobile)
- **FR3:** O sistema deve permitir customização de timestamp em formato 24h para qualquer data/hora
- **FR4:** O sistema deve permitir alternância instantânea entre remetentes "Você" e "Contato" via botão flutuante ou atalho de teclado
- **FR5:** O sistema deve permitir configuração de status de leitura (check simples, duplo, azul) para cada mensagem
- **FR6:** O sistema deve exportar a conversa como imagem PNG de alta qualidade (mínimo 1080px largura)
- **FR7:** O sistema deve replicar exatamente cores, fontes, espaçamentos e elementos visuais do WhatsApp atual
- **FR8:** O sistema deve permitir edição de qualquer elemento da mensagem (texto, hora, status) sem recriar a mensagem
- **FR9:** O sistema deve manter ordem cronológica visual das mensagens independente da ordem de criação
- **FR10:** O sistema deve processar todo conteúdo client-side sem envio de dados para servidor

### Non Functional

- **NFR1:** A interface deve ser 100% responsiva funcionando perfeitamente em desktop (1024px+) e mobile (320px+)
- **NFR2:** O First Contentful Paint deve ocorrer em menos de 1.5 segundos
- **NFR3:** O Time to Interactive deve ser menor que 3 segundos
- **NFR4:** A aplicação deve manter 60fps durante todas as interações e animações
- **NFR5:** A aplicação deve funcionar offline após carregamento inicial (PWA)
- **NFR6:** A aplicação deve suportar Chrome 90+, Safari 14+, Firefox 88+, Edge 90+
- **NFR7:** O visual exportado deve ser pixel-perfect indistinguível de screenshot real do WhatsApp
- **NFR8:** A aplicação deve funcionar adequadamente em conexões 3G
- **NFR9:** Nenhum dado pessoal deve ser coletado ou transmitido para servidores externos
- **NFR10:** Todo processamento de imagem deve ocorrer client-side mantendo privacidade total

## User Interface Design Goals

### Overall UX Vision

Interface minimalista que replica fielmente o WhatsApp, priorizando velocidade de criação sobre quantidade de features. O usuário deve conseguir criar uma conversa completa sem tutoriais ou instruções, com todas as ações principais acessíveis em no máximo 2 cliques. A experiência deve ser tão intuitiva que pareça estar usando o WhatsApp real, mas com superpoderes de edição.

### Key Interaction Paradigms

- **Direct Manipulation:** Clicar/tocar diretamente nos elementos para editar (sem modais ou formulários separados)
- **Contextual Actions:** Ações aparecem no hover/long press exatamente onde necessário
- **Keyboard First:** Atalhos de teclado para ações frequentes (Tab para alternar remetente, Enter para nova mensagem)
- **Progressive Disclosure:** Features avançadas reveladas conforme necessidade, não sobrecarregando interface inicial
- **Instant Feedback:** Toda ação tem resposta visual imediata sem delays perceptíveis

### Core Screens and Views

- **Main Chat View:** Tela principal replicando conversa do WhatsApp com header, área de mensagens e input
- **Profile Setup Panel:** Painel lateral/modal para configurar nome e foto dos participantes
- **Message Editor Popover:** Popover inline para editar texto, hora e status da mensagem
- **Export Preview:** Preview da imagem antes do download com opções de qualidade

### Accessibility: WCAG AA

A aplicação deve atender padrões WCAG AA com navegação completa por teclado, suporte a screen readers, contraste adequado (4.5:1 mínimo) e áreas de toque de no mínimo 44x44px em mobile.

### Branding

Replicação exata do visual do WhatsApp incluindo:
- Cor de fundo do chat (#E5DDD5 com pattern)
- Cores das bolhas de mensagem (enviadas: #DCF8C6, recebidas: #FFFFFF)
- Tipografia (Helvetica Neue ou fallback para system fonts)
- Ícones e elementos visuais (checks, relógio, câmera)
- Sombras e bordas arredondadas idênticas

### Target Device and Platforms: Web Responsive

Aplicação web responsiva funcionando em:
- Desktop: Windows, macOS, Linux (todos browsers modernos)
- Mobile: iOS Safari, Chrome Android, Samsung Internet
- Tablet: iPad Safari, Android tablets
- Progressive Web App para instalação em dispositivos

## Technical Assumptions

### Repository Structure: Monorepo

Estrutura monorepo com packages separados:
- `/packages/ui` - Componentes React reutilizáveis
- `/packages/core` - Lógica de negócio e estado
- `/apps/web` - Aplicação Next.js principal
- `/packages/utils` - Utilitários compartilhados

### Service Architecture

**Serverless com processamento client-side:** Aplicação será uma SPA (Single Page Application) com todo processamento ocorrendo no browser. Backend serverless apenas para:
- Servir assets estáticos via CDN
- Analytics não-invasivos (opcional pós-MVP)
- Futura API para features premium

Escolha baseada em: redução de custos, privacidade total do usuário, performance máxima, facilidade de deploy.

### Testing Requirements

**Full Testing Pyramid** com foco em confiabilidade:
- **Unit Tests:** Componentes React, funções de utilidade (Jest + React Testing Library)
- **Integration Tests:** Fluxos de usuário críticos (Cypress)
- **Visual Regression:** Comparação pixel-perfect com WhatsApp real (Percy/Chromatic)
- **E2E Tests:** Jornadas completas incluindo export (Playwright)
- **Manual Testing:** Checklist de dispositivos/browsers antes de cada release

### Additional Technical Assumptions and Requests

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

## Epic List

**Epic 1: Foundation & Core Chat Interface**
Estabelecer infraestrutura do projeto e interface básica do chat com autenticidade visual

**Epic 2: Message Management & Editing**
Implementar criação, edição inline e gerenciamento completo de mensagens

**Epic 3: Export & Polish**
Adicionar exportação de alta qualidade e refinamentos finais de UX

## Epic 1: Foundation & Core Chat Interface

**Goal:** Estabelecer a base técnica do projeto com CI/CD, criar a interface visual do WhatsApp pixel-perfect, e implementar a estrutura básica de dados para mensagens. Este épico entrega a "casca" visual autêntica do WhatsApp com uma mensagem de exemplo, provando que conseguimos replicar o visual com perfeição.

### Story 1.1: Project Setup & Infrastructure

**As a** developer,
**I want** a fully configured development environment with CI/CD,
**so that** we can develop efficiently with automated testing and deployment.

#### Acceptance Criteria
1. Repository criado com estrutura monorepo usando npm workspaces
2. React + TypeScript + Vite configurados com hot reload funcional
3. Tailwind CSS configurado com design tokens do WhatsApp
4. ESLint + Prettier configurados com pre-commit hooks via Husky
5: GitHub Actions configurado para rodar testes em PRs
6: Deploy automático para Vercel em pushes para main
7: Ambiente de desenvolvimento rodando localmente em http://localhost:5173
8: README com instruções de setup e desenvolvimento

### Story 1.2: WhatsApp Visual Foundation

**As a** user,
**I want** to see an authentic WhatsApp chat interface,
**so that** the mockups I create look indistinguishable from real screenshots.

#### Acceptance Criteria
1: Header do chat renderizado com cor #075E54 e altura de 60px
2: Background do chat com cor #E5DDD5 e pattern de fundo
3: Área de input inferior com ícones de emoji, anexo e microfone
4: Fonte Helvetica Neue ou system font apropriada aplicada
5: Layout responsivo que adapta para mobile (< 768px) e desktop
6: Uma mensagem de exemplo mostrando bolha verde (#DCF8C6) para enviada
7: Uma mensagem de exemplo mostrando bolha branca para recebida
8: Timestamps e checks renderizados com cores e tamanhos corretos

### Story 1.3: Profile Configuration System

**As a** user,
**I want** to configure names and avatars for both participants,
**so that** my mockup conversations have realistic identities.

#### Acceptance Criteria
1: Componente de configuração de perfil com campos de nome e upload de avatar
2: Avatar padrão (iniciais) gerado quando foto não fornecida
3: Upload de imagem funcional com preview imediato
4: Imagens redimensionadas para 40x40px automaticamente
5: Estado dos perfis persistido durante a sessão
6: Nome do contato aparece no header do chat
7: Avatars aparecem ao lado das mensagens quando em grupos (preparação futura)
8: Validação de nome (mínimo 1 caractere, máximo 25)

### Story 1.4: Message Data Structure

**As a** developer,
**I want** a robust data structure for messages,
**so that** we can efficiently manage and render conversations.

#### Acceptance Criteria
1: Interface TypeScript definida para Message com todos campos necessários
2: Store Zustand criado para gerenciar estado das mensagens
3: Funções para adicionar, editar e deletar mensagens implementadas
4: Mensagens mantêm ordem cronológica baseada em timestamp
5: Identificador único (UUID) para cada mensagem
6: Suporte para diferentes status (enviado, entregue, lido)
7: Sistema de re-renderização eficiente usando React.memo
8: Testes unitários para todas operações do store

## Epic 2: Message Management & Editing

**Goal:** Implementar o sistema completo de criação e edição de mensagens com a revolucionária edição inline, alternância rápida de remetentes e controle total sobre timestamps e status. Este épico transforma a interface estática em uma ferramenta funcional de criação de conversas.

### Story 2.1: Message Creation Flow

**As a** user,
**I want** to create new messages quickly using the input field,
**so that** I can build conversations efficiently.

#### Acceptance Criteria
1: Campo de input funcional que adiciona mensagem ao pressionar Enter
2: Shift+Enter cria nova linha dentro da mensagem
3: Mensagem é adicionada com timestamp atual por padrão
4: Novo remetente alterna automaticamente após enviar (configurável)
5: Input é limpo após envio bem-sucedido
6: Botão de envio visível em mobile, oculto em desktop
7: Contador de caracteres aparece após 1000 caracteres
8: Suporte para copiar/colar texto com formatação preservada

### Story 2.2: Inline Message Editing

**As a** user,
**I want** to edit messages directly by clicking on them,
**so that** I can make quick adjustments without disrupting my workflow.

#### Acceptance Criteria
1: Hover em desktop mostra botão de edição sutil
2: Long press em mobile ativa modo de edição
3: Popover aparece com campos para texto, hora e status
4: Mudanças são aplicadas em tempo real (sem save button)
5: ESC ou clicar fora cancela edição
6: Timestamp editável com validação de formato (HH:MM)
7: Seletor de status com as 3 opções (enviado, entregue, lido)
8: Animação suave de entrada/saída do popover

### Story 2.3: Sender Toggle System

**As a** user,
**I want** to quickly switch between senders while creating messages,
**so that** I can create natural conversation flows.

#### Acceptance Criteria
1: Botão flutuante aparece ao lado do input em desktop
2: Tab alterna entre remetentes (atalho de teclado)
3: Indicador visual mostra remetente ativo atual
4: Swipe gesture em mobile para alternar (opcional)
5: Última mensagem mostra indicador de quem enviará próxima
6: Toggle mantém texto digitado no input
7: Preferência de auto-alternância configurável
8: Feedback visual imediato na mudança (animação de 200ms)

### Story 2.4: Timestamp & Status Management

**As a** user,
**I want** full control over message timestamps and read status,
**so that** I can create realistic conversation timelines.

#### Acceptance Criteria
1: Date picker para selecionar dia da mensagem
2: Time picker para horário específico (formato 24h)
3: Opção "agora" para timestamp atual
4: Mensagens reordenam automaticamente por timestamp
5: Indicador visual de "dia" quando muda a data entre mensagens
6: Status checks renderizam corretamente (✓ ✓✓ ✓✓azul)
7: Lógica impede status "lido" em horário futuro
8: Agrupamento visual de mensagens do mesmo remetente em sequência

## Epic 3: Export & Polish

**Goal:** Implementar o sistema de exportação de alta qualidade e adicionar os refinamentos finais de UX que tornam a ferramenta verdadeiramente profissional. Este épico completa o MVP com a capacidade de gerar imagens prontas para uso.

### Story 3.1: High-Quality Image Export

**As a** user,
**I want** to export my conversation as a high-quality image,
**so that** I can use it in my projects and presentations.

#### Acceptance Criteria
1: Botão de export prominente e sempre visível
2: Conversão da conversa para Canvas mantendo qualidade
3: Resolução mínima de 1080px de largura
4: Opção de qualidade (baixa, média, alta) para tamanho do arquivo
5: Preview da imagem antes do download
6: Download automático com nome "whatsapp-chat-[timestamp].png"
7: Progresso visual durante geração de imagens grandes
8: Suporte para conversas longas (scroll capturado completamente)

### Story 3.2: Mobile Experience Optimization

**As a** user on mobile,
**I want** a seamless experience creating conversations on my phone,
**so that** I can work from anywhere.

#### Acceptance Criteria
1: Interface 100% funcional em telas de 320px largura
2: Teclado virtual não cobre elementos importantes
3: Gestos touch otimizados (long press, swipe)
4: Viewport configurado para prevenir zoom indesejado
5: Menu de ações adaptado para mobile (bottom sheet)
6: Performance mantida em dispositivos mid-range
7: Instalável como PWA com ícone e splash screen
8: Orientação portrait e landscape suportadas

### Story 3.3: Performance & Polish

**As a** developer,
**I want** the application to be fast and polished,
**so that** users have a professional experience.

#### Acceptance Criteria
1: Lighthouse score > 90 em todas categorias
2: Bundle size < 200KB gzipped
3: Lazy loading de componentes não críticos
4: Animações desabilitadas se prefers-reduced-motion
5: Error boundaries implementados com mensagens amigáveis
6: Loading states para todas ações assíncronas
7: Cache de assets com service worker
8: Testes E2E cobrindo fluxos críticos de usuário

### Story 3.4: Final UX Refinements

**As a** user,
**I want** helpful features that improve my experience,
**so that** creating mockups is effortless and enjoyable.

#### Acceptance Criteria
1: Botão de limpar conversa com confirmação
2: Atalhos de teclado documentados (? mostra ajuda)
3: Indicadores visuais de área clicável/editável
4: Feedback de ação concluída (toast notifications sutis)
5: Estado vazio com instruções de como começar
6: Favicon e meta tags para compartilhamento social
7: Modo de demonstração com conversa de exemplo
8: Analytics básicos (sem dados pessoais) para melhorias futuras

## Checklist Results Report

_Esta seção será preenchida após execução do pm-checklist para validação final do PRD_

## Next Steps

### UX Expert Prompt

"Por favor, revise este PRD do Fake WhatsApp Chat Generator e crie mockups de alta fidelidade para as telas principais, focando na autenticidade visual absoluta e na experiência de edição inline. Use o modo 'create architecture' com este documento como input."

### Architect Prompt

"Por favor, analise este PRD do Fake WhatsApp Chat Generator e crie a arquitetura técnica detalhada, incluindo estrutura de componentes React, fluxo de dados, e estratégia de implementação. Use o modo 'create architecture' com este documento como input."

---

*Documento gerado por John (Product Manager) - 21/08/2025*