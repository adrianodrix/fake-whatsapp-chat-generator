# Source Tree Structure - Fake WhatsApp Chat Generator

## Visão Geral

Este documento detalha a estrutura completa de diretórios e arquivos do projeto, baseada na arquitetura simplificada React + TypeScript + Tailwind CSS. A organização segue princípios de separação de responsabilidades e escalabilidade.

## Estrutura Completa do Projeto

```text
fake-whatsapp-chat-generator/
├── 📁 .github/                     # GitHub workflows e templates
│   ├── 📁 workflows/
│   │   ├── 📄 main.yml             # CI/CD pipeline principal
│   │   ├── 📄 pr-checks.yml        # Verificações em PRs
│   │   └── 📄 lighthouse.yml       # Performance monitoring
│   ├── 📄 ISSUE_TEMPLATE.md        # Template para issues
│   └── 📄 PULL_REQUEST_TEMPLATE.md # Template para PRs
├── 📁 docs/                        # Documentação do projeto
│   ├── 📁 architecture/            # Documentação técnica
│   │   ├── 📄 coding-standards.md  # Padrões de código
│   │   ├── 📄 tech-stack.md        # Stack tecnológico
│   │   └── 📄 source-tree.md       # Esta estrutura
│   ├── 📁 prd/                     # Product Requirements
│   ├── 📁 stories/                 # User Stories
│   ├── 📁 qa/                      # Quality Assurance
│   ├── 📄 architecture.md          # Arquitetura principal
│   ├── 📄 prd.md                   # PRD principal
│   └── 📄 README.md                # Documentação geral
├── 📁 public/                      # Assets estáticos
│   ├── 📁 icons/                   # Ícones e favicons
│   │   ├── 🖼️ favicon.ico
│   │   ├── 🖼️ icon-192.png
│   │   ├── 🖼️ icon-512.png
│   │   └── 🖼️ apple-touch-icon.png
│   ├── 📄 manifest.json            # PWA manifest
│   ├── 📄 robots.txt               # SEO robots
│   └── 📄 index.html               # HTML template
├── 📁 src/                         # Código fonte principal
│   ├── 📁 components/              # Componentes React
│   │   ├── 📁 ui/                  # Componentes base reutilizáveis
│   │   │   ├── 📁 Button/
│   │   │   │   ├── 📄 Button.tsx
│   │   │   │   ├── 📄 Button.types.ts
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 Input/
│   │   │   │   ├── 📄 Input.tsx
│   │   │   │   ├── 📄 Input.types.ts
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 Avatar/
│   │   │   │   ├── 📄 Avatar.tsx
│   │   │   │   ├── 📄 Avatar.types.ts
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 Icon/
│   │   │   │   ├── 📄 Icon.tsx
│   │   │   │   ├── 📄 Icon.types.ts
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 Modal/
│   │   │   │   ├── 📄 Modal.tsx
│   │   │   │   ├── 📄 Modal.types.ts
│   │   │   │   └── 📄 index.ts
│   │   │   └── 📄 index.ts          # Barrel exports
│   │   ├── 📁 chat/                # Componentes específicos do WhatsApp
│   │   │   ├── 📁 ChatContainer/
│   │   │   │   ├── 📄 ChatContainer.tsx
│   │   │   │   ├── 📄 ChatContainer.types.ts
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 MessageBubble/
│   │   │   │   ├── 📄 MessageBubble.tsx
│   │   │   │   ├── 📄 MessageBubble.types.ts
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 ChatHeader/
│   │   │   │   ├── 📄 ChatHeader.tsx
│   │   │   │   ├── 📄 ChatHeader.types.ts
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 MessageInput/
│   │   │   │   ├── 📄 MessageInput.tsx
│   │   │   │   ├── 📄 MessageInput.types.ts
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 StatusIndicator/
│   │   │   │   ├── 📄 StatusIndicator.tsx
│   │   │   │   ├── 📄 StatusIndicator.types.ts
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 ProfilePanel/
│   │   │   │   ├── 📄 ProfilePanel.tsx
│   │   │   │   ├── 📄 ProfilePanel.types.ts
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 ExportModal/
│   │   │   │   ├── 📄 ExportModal.tsx
│   │   │   │   ├── 📄 ExportModal.types.ts
│   │   │   │   └── 📄 index.ts
│   │   │   └── 📄 index.ts          # Barrel exports
│   │   ├── 📁 layout/              # Componentes de layout
│   │   │   ├── 📁 Header/
│   │   │   │   ├── 📄 Header.tsx
│   │   │   │   ├── 📄 Header.types.ts
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 Footer/
│   │   │   │   ├── 📄 Footer.tsx
│   │   │   │   ├── 📄 Footer.types.ts
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 Container/
│   │   │   │   ├── 📄 Container.tsx
│   │   │   │   ├── 📄 Container.types.ts
│   │   │   │   └── 📄 index.ts
│   │   │   └── 📄 index.ts          # Barrel exports
│   │   ├── 📁 common/              # Componentes comuns (ErrorBoundary, etc)
│   │   │   ├── 📁 ErrorBoundary/
│   │   │   │   ├── 📄 ErrorBoundary.tsx
│   │   │   │   ├── 📄 ErrorBoundary.types.ts
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 LoadingSpinner/
│   │   │   │   ├── 📄 LoadingSpinner.tsx
│   │   │   │   ├── 📄 LoadingSpinner.types.ts
│   │   │   │   └── 📄 index.ts
│   │   │   └── 📄 index.ts          # Barrel exports
│   │   └── 📄 index.ts              # Barrel exports principais
│   ├── 📁 contexts/                # React Context providers
│   │   ├── 📄 ChatContext.tsx       # Estado do chat (mensagens, perfis)
│   │   ├── 📄 UIContext.tsx         # Estado da UI (modais, loading)
│   │   └── 📄 index.ts              # Barrel exports
│   ├── 📁 hooks/                   # Custom React hooks
│   │   ├── 📄 useChat.ts            # Hook para operações de chat
│   │   ├── 📄 useExport.ts          # Hook para funcionalidades de export
│   │   ├── 📄 useLocalStorage.ts    # Hook para persistência local
│   │   ├── 📄 useDebounce.ts        # Hook para debouncing
│   │   ├── 📄 useKeyboard.ts        # Hook para atalhos de teclado
│   │   └── 📄 index.ts              # Barrel exports
│   ├── 📁 types/                   # TypeScript interfaces e types
│   │   ├── 📄 message.ts            # Types de mensagem e chat
│   │   ├── 📄 profile.ts            # Types de perfil de usuário
│   │   ├── 📄 export.ts             # Types de configuração de export
│   │   ├── 📄 ui.ts                 # Types de estado da UI
│   │   ├── 📄 env.d.ts              # Types de environment variables
│   │   └── 📄 index.ts              # Barrel exports
│   ├── 📁 utils/                   # Funções utilitárias
│   │   ├── 📄 validation.ts         # Validação de inputs
│   │   ├── 📄 export.ts             # Lógica de export Canvas
│   │   ├── 📄 storage.ts            # Helpers de Local Storage
│   │   ├── 📄 formatting.ts         # Formatação de data/hora
│   │   ├── 📄 constants.ts          # Constantes da aplicação
│   │   ├── 📄 security.ts           # Sanitização e segurança
│   │   ├── 📄 performance.ts        # Utilitários de performance
│   │   └── 📄 index.ts              # Barrel exports
│   ├── 📁 styles/                  # Estilos globais e configurações
│   │   ├── 📄 globals.css           # CSS global e reset
│   │   └── 📄 tailwind.config.js    # Configuração do Tailwind
│   ├── 📄 App.tsx                  # Componente principal da aplicação
│   ├── 📄 main.tsx                 # Entry point com providers
│   └── 📄 vite-env.d.ts            # Types do Vite
├── 📁 tests/                       # Testes automatizados
│   ├── 📁 __mocks__/               # Mocks para testes
│   │   ├── 📄 localStorage.ts
│   │   ├── 📄 canvas.ts
│   │   └── 📄 fileReader.ts
│   ├── 📁 components/              # Testes de componentes
│   │   ├── 📁 ui/
│   │   │   ├── 📄 Button.test.tsx
│   │   │   ├── 📄 Input.test.tsx
│   │   │   └── 📄 Avatar.test.tsx
│   │   ├── 📁 chat/
│   │   │   ├── 📄 MessageBubble.test.tsx
│   │   │   ├── 📄 ChatHeader.test.tsx
│   │   │   └── 📄 MessageInput.test.tsx
│   │   └── 📁 layout/
│   ├── 📁 contexts/                # Testes de contexts
│   │   ├── 📄 ChatContext.test.tsx
│   │   └── 📄 UIContext.test.tsx
│   ├── 📁 hooks/                   # Testes de hooks
│   │   ├── 📄 useChat.test.ts
│   │   ├── 📄 useExport.test.ts
│   │   └── 📄 useLocalStorage.test.ts
│   ├── 📁 utils/                   # Testes de utilitários
│   │   ├── 📄 validation.test.ts
│   │   ├── 📄 export.test.ts
│   │   └── 📄 storage.test.ts
│   ├── 📁 e2e/                     # Testes end-to-end
│   │   ├── 📄 chat-creation.spec.ts
│   │   ├── 📄 message-editing.spec.ts
│   │   └── 📄 export-flow.spec.ts
│   ├── 📄 setup.ts                 # Setup dos testes
│   └── 📄 test-utils.tsx           # Utilitários para testes
├── 📄 .env.example                 # Template de variáveis de ambiente
├── 📄 .env.local                   # Variáveis locais (gitignored)
├── 📄 .eslintrc.json               # Configuração ESLint
├── 📄 .gitignore                   # Arquivos ignorados pelo Git
├── 📄 .prettierrc.json             # Configuração Prettier
├── 📄 .prettierignore              # Arquivos ignorados pelo Prettier
├── 📄 jest.config.js               # Configuração Jest
├── 📄 package.json                 # Dependencies e scripts
├── 📄 package-lock.json            # Lock file das dependências
├── 📄 playwright.config.ts         # Configuração Playwright
├── 📄 postcss.config.js            # Configuração PostCSS
├── 📄 README.md                    # Documentação principal
├── 📄 tailwind.config.js           # Configuração Tailwind CSS
├── 📄 tsconfig.json                # Configuração TypeScript
├── 📄 tsconfig.node.json           # TypeScript config para Node
└── 📄 vite.config.ts               # Configuração Vite
```

## Organização por Responsabilidade

### Componentes (`src/components/`)

#### Base Components (`ui/`)
**Responsabilidade:** Componentes reutilizáveis sem conhecimento de domínio

```text
ui/
├── Button/           # Botões de ação (primary, secondary, icon)
├── Input/            # Campos de input (text, textarea, file)
├── Avatar/           # Avatar com foto ou iniciais
├── Icon/             # Ícones SVG do WhatsApp
└── Modal/            # Modal/dialog base
```

**Características:**
- Zero conhecimento sobre WhatsApp ou chat
- Props genéricas e flexíveis
- Styling com Tailwind variants
- Completamente testáveis isoladamente

#### Chat Components (`chat/`)
**Responsabilidade:** Componentes específicos do domínio WhatsApp

```text
chat/
├── ChatContainer/    # Container principal do chat
├── MessageBubble/    # Bolha de mensagem com visual WA
├── ChatHeader/       # Header com nome e avatar
├── MessageInput/     # Input de nova mensagem
├── StatusIndicator/  # Checks de status (✓✓✓)
├── ProfilePanel/     # Painel de configuração de perfil
└── ExportModal/      # Modal de export de imagem
```

**Características:**
- Conhecimento específico do domínio WhatsApp
- Uso extensivo dos design tokens WhatsApp
- Integração com contexts de estado
- Visual pixel-perfect com WhatsApp real

#### Layout Components (`layout/`)
**Responsabilidade:** Estrutura e layout da aplicação

```text
layout/
├── Header/           # Header da aplicação (não do chat)
├── Footer/           # Footer com links/info
└── Container/        # Container responsivo principal
```

### State Management (`src/contexts/`)

#### ChatContext
**Responsabilidade:** Estado das mensagens e perfis
```typescript
// Dados gerenciados:
- messages: Message[]
- profiles: ChatProfiles  
- activeSender: 'user' | 'contact'
- isEditing: string | null
```

#### UIContext  
**Responsabilidade:** Estado da interface
```typescript
// Dados gerenciados:
- modals: { profilePanel, exportModal, helpModal }
- loading: { exporting, uploadingImage }
- notifications: Toast[]
```

### Custom Hooks (`src/hooks/`)

#### Hook Responsibilities

| Hook | Responsabilidade | Retorno |
|------|------------------|---------|
| `useChat` | Operações de chat | `{ state, actions }` |
| `useExport` | Canvas export | `{ exportChat, loading }` |
| `useLocalStorage` | Persistência | `[value, setValue]` |
| `useDebounce` | Debouncing | `debouncedValue` |
| `useKeyboard` | Atalhos | `registerShortcut` |

### Types (`src/types/`)

#### Type Organization

```text
types/
├── message.ts        # Message, MessageStatus, ChatState
├── profile.ts        # Profile, ChatProfiles  
├── export.ts         # ExportOptions, ExportResult
├── ui.ts             # UIState, ModalState, LoadingState
└── env.d.ts          # Environment variables
```

### Utilities (`src/utils/`)

#### Utility Responsibilities

| Utility | Responsabilidade | Exemplo |
|---------|------------------|---------|
| `validation.ts` | Input validation | `validateMessage()` |
| `export.ts` | Canvas rendering | `ChatExporter.exportChat()` |
| `storage.ts` | LocalStorage helpers | `getStoredData()` |
| `formatting.ts` | Date/time formatting | `formatTime()` |
| `constants.ts` | App constants | `MAX_MESSAGE_LENGTH` |
| `security.ts` | Sanitization | `sanitizeInput()` |

## File Naming Conventions

### Componentes
```text
✅ Correto:
MessageBubble/
├── MessageBubble.tsx      # Implementação
├── MessageBubble.types.ts # Types específicos
└── index.ts              # Barrel export

❌ Incorreto:
message-bubble.tsx         # kebab-case
messageBubble.tsx          # camelCase
Message_Bubble.tsx         # snake_case
```

### Hooks
```text
✅ Correto:
useChat.ts                 # camelCase com 'use'
useLocalStorage.ts
useDebounce.ts

❌ Incorreto:
chat-hook.ts              # sem prefixo 'use'
UseChat.ts                # PascalCase
use-chat.ts               # kebab-case
```

### Types
```text
✅ Correto:
message.ts                # domínio específico
ui.ts                     # categoria de types
index.ts                  # barrel exports

❌ Incorreto:
Message.ts                # PascalCase para arquivo
messageTypes.ts           # redundante
types.ts                  # muito genérico
```

## Import/Export Patterns

### Barrel Exports
```typescript
// src/components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Avatar } from './Avatar';
export { Icon } from './Icon';
export { Modal } from './Modal';

// src/components/index.ts
export * from './ui';
export * from './chat';
export * from './layout';
export * from './common';
```

### Component Imports
```typescript
// ✅ Correto - Import via barrel
import { Button, Input, Avatar } from '@/components/ui';
import { MessageBubble, ChatHeader } from '@/components/chat';

// ✅ Correto - Import direto quando necessário
import { MessageBubble } from '@/components/chat/MessageBubble';

// ❌ Evitar - Import aninhado
import { MessageBubble } from '@/components/chat/MessageBubble/MessageBubble';
```

### Type Imports
```typescript
// ✅ Correto - Type-only imports
import type { Message, MessageStatus } from '@/types/message';
import type { ChatContextType } from '@/contexts/ChatContext';

// ✅ Correto - Mixed imports
import { validateMessage, type ValidationResult } from '@/utils/validation';
```

## Path Aliases

### Configuração TypeScript
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/contexts/*": ["./src/contexts/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/styles/*": ["./src/styles/*"]
    }
  }
}
```

### Uso dos Aliases
```typescript
// ✅ Imports com aliases
import { ChatProvider } from '@/contexts/ChatContext';
import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui';
import type { Message } from '@/types/message';

// ❌ Evitar - Relative imports longos
import { ChatProvider } from '../../../contexts/ChatContext';
```

## Testing Structure

### Test Co-location
```text
# Opção 1: Tests em pasta dedicada (ATUAL)
tests/
├── components/
│   ├── ui/
│   └── chat/
├── hooks/
└── utils/

# Opção 2: Co-location (FUTURO)
src/components/ui/Button/
├── Button.tsx
├── Button.types.ts
├── Button.test.tsx        # Teste co-localizado
└── index.ts
```

### Test Naming
```text
✅ Correto:
MessageBubble.test.tsx      # Component test
useChat.test.ts            # Hook test
validation.test.ts         # Utility test
chat-creation.spec.ts      # E2E test

❌ Incorreto:
MessageBubble.spec.tsx     # Usar .test para unit
messageBubble.test.tsx     # camelCase
test-message-bubble.tsx    # prefixo test
```

## Build Output Structure

### Dist Directory
```text
dist/
├── assets/                # Hashed static assets
│   ├── index-[hash].js    # App bundle
│   ├── vendor-[hash].js   # Vendor chunk
│   └── style-[hash].css   # Compiled CSS
├── icons/                 # Copied from public/icons
├── manifest.json          # PWA manifest
├── robots.txt            # SEO robots
└── index.html            # Generated HTML
```

## Development Guidelines

### Criação de Novos Componentes

1. **Escolher categoria correta** (`ui`, `chat`, `layout`)
2. **Criar pasta com nome PascalCase**
3. **Arquivos obrigatórios:**
   - `Component.tsx` (implementação)
   - `Component.types.ts` (interfaces)
   - `index.ts` (export)
4. **Arquivos opcionais:**
   - `Component.test.tsx` (testes)
   - `Component.stories.tsx` (storybook - futuro)

### Adição de Novos Types

1. **Escolher arquivo correto** baseado no domínio
2. **Usar interfaces para objetos**, types para unions
3. **Documentar com JSDoc** quando necessário
4. **Exportar via barrel** em `index.ts`

### Criação de Utilities

1. **Função única por arquivo** quando possível
2. **Nome descritivo** da responsabilidade
3. **Pure functions** sempre que possível
4. **Testes obrigatórios** para lógica complexa

---

*Documento mantido por Winston (Architect) - Atualizado em 22/08/2025*