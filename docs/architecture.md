# Fake WhatsApp Chat Generator - Architecture Foundation Document (Simplified)

## Introduction

Este documento define a arquitetura técnica **simplificada** para o **Fake WhatsApp Chat Generator**, uma aplicação web que replica pixel-perfect a interface do WhatsApp para criação de mockups de conversas. A arquitetura foi refatorada para ser simples e adequada para um MVP, priorizando rapidez de desenvolvimento, facilidade de manutenção e implementação direta.

### Document Scope

Arquitetura simplificada para implementação do MVP, cobrindo:
- Estrutura simples de projeto React
- Stack tecnológico minimalista e eficaz
- Organização clara de componentes
- State management com React nativo
- Estratégias de performance e deployment

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-08-21 | 1.0 | Initial architecture foundation | Winston (Architect) |
| 2025-08-21 | 1.1 | Simplified architecture: removed monorepo, Zustand, CSS Modules | Winston (Architect) |

## Quick Reference - Key Implementation Areas

### Critical Implementation Order (Based on Epics)

**Epic 1 - Foundation & Core Chat Interface:**
- Simple React + Vite setup
- Core components with Tailwind styling
- Basic state with React Context
- Message data structure

**Epic 2 - Message Management & Editing:**
- Message creation and editing
- Inline editing system
- Sender toggle functionality
- Timestamp and status management

**Epic 3 - Export & Polish:**
- Canvas-based image export
- Mobile optimization
- Performance tuning
- Final UX refinements

### Core Technology Decisions (Simplified for MVP)

- **Framework:** React 18+ com TypeScript
- **Build Tool:** Vite para desenvolvimento rápido
- **Styling:** Tailwind CSS (pure utility-first)
- **State Management:** React Context + useState
- **Image Processing:** Canvas API para export
- **Deployment:** Vercel com preview deployments

## High Level Architecture

### Technical Summary

**Arquitetura:** Single Page Application (SPA) com processamento 100% client-side
**Padrão:** Simple component-based architecture com React Context
**Deployment:** Static site generation com CDN global via Vercel
**Data Strategy:** Local storage com export via Canvas API

### Simplified Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Runtime | Node.js | 18+ | Build e desenvolvimento |
| Framework | React | 18+ | UI framework principal |
| Language | TypeScript | 5+ | Type safety e DX |
| Build Tool | Vite | 4+ | Dev server e bundling |
| Styling | Tailwind CSS | 3+ | Utility-first CSS only |
| State | React Context | Built-in | Simple state management |
| Testing | Jest + RTL | Latest | Unit e integration tests |
| E2E Testing | Playwright | Latest | End-to-end testing |
| Linting | ESLint + Prettier | Latest | Code quality |
| CI/CD | GitHub Actions | - | Automated testing/deploy |
| Deployment | Vercel | - | Static hosting com CDN |
| Monitoring | Sentry | Latest | Error tracking |

### Repository Structure Strategy

**Type:** Simple single-package React application
**Organization:** Feature-based component organization

```text
fake-whatsapp-chat-generator/
├── src/
│   ├── components/          # Todos os componentes
│   │   ├── ui/             # Componentes base (Button, Input, Avatar, etc)
│   │   ├── chat/           # Componentes específicos do WhatsApp
│   │   │   ├── MessageBubble/
│   │   │   ├── ChatHeader/
│   │   │   ├── MessageInput/
│   │   │   └── StatusIndicator/
│   │   └── layout/         # Layout components
│   ├── contexts/           # React Context providers
│   │   ├── ChatContext.tsx # Chat state (messages, profiles)
│   │   └── UIContext.tsx   # UI state (modals, loading)
│   ├── hooks/              # Custom React hooks
│   │   ├── useChat.ts      # Chat operations
│   │   ├── useExport.ts    # Canvas export functionality
│   │   └── useLocalStorage.ts # Persistence
│   ├── types/              # TypeScript interfaces
│   │   ├── message.ts      # Message, Profile, Chat types
│   │   └── export.ts       # Export configuration types
│   ├── utils/              # Utility functions
│   │   ├── validation.ts   # Input validation
│   │   ├── export.ts       # Canvas rendering logic
│   │   └── storage.ts      # Local storage helpers
│   ├── styles/             # Global styles e Tailwind config
│   │   ├── globals.css
│   │   └── tailwind.config.js
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
│   ├── icons/              # WhatsApp icons e favicons
│   └── index.html
├── docs/                   # Documentation
├── tests/                  # Test files
├── .env.example           # Environment variables template
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## Source Tree and Module Organization

### Core Application Structure

```text
src/
├── App.tsx                 # Main application component
├── main.tsx               # Entry point with providers
├── components/            # All React components
│   ├── ui/               # Reusable base components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Avatar/
│   │   ├── Icon/
│   │   └── Modal/
│   ├── chat/             # WhatsApp-specific components
│   │   ├── ChatContainer/
│   │   ├── MessageBubble/
│   │   ├── ChatHeader/
│   │   ├── MessageInput/
│   │   ├── StatusIndicator/
│   │   └── ProfilePanel/
│   └── layout/           # Layout components
│       ├── Header/
│       ├── Footer/
│       └── Container/
├── contexts/             # React Context providers
│   ├── ChatContext.tsx   # Chat state management
│   └── UIContext.tsx     # UI state management
└── hooks/                # Custom React hooks
    ├── useChat.ts        # Chat operations
    ├── useExport.ts      # Canvas export
    └── useLocalStorage.ts # Persistence
```

### Component Organization Strategy

#### Base Components (`src/components/ui/`)

**Purpose:** Componentes reutilizáveis sem conhecimento do domínio WhatsApp

```text
ui/
├── Button/
│   ├── Button.tsx        # Component implementation
│   ├── Button.types.ts   # TypeScript interfaces
│   └── index.ts          # Export
├── Input/
│   ├── Input.tsx
│   ├── Input.types.ts
│   └── index.ts
└── Avatar/
    ├── Avatar.tsx
    ├── Avatar.types.ts
    └── index.ts
```

#### WhatsApp Components (`src/components/chat/`)

**Purpose:** Componentes específicos para replicar interface do WhatsApp

```text
chat/
├── MessageBubble/
│   ├── MessageBubble.tsx   # Bolha de mensagem
│   ├── MessageBubble.types.ts
│   └── index.ts
├── ChatHeader/
│   ├── ChatHeader.tsx      # Header com avatar e nome
│   ├── ChatHeader.types.ts
│   └── index.ts
└── MessageInput/
    ├── MessageInput.tsx    # Input de nova mensagem
    ├── MessageInput.types.ts
    └── index.ts
```

## Data Models and State Management

### React Context Architecture

#### Chat Context (Primary State)
```typescript
interface ChatState {
  messages: Message[];           // All messages in chronological order
  profiles: ChatProfiles;        // User and contact profiles
  activeSender: 'user' | 'contact'; // Current sender
  isEditing: string | null;      // ID of message being edited
  lastActivity: Date;            // Last user interaction
}

interface ChatContextType {
  state: ChatState;
  actions: {
    addMessage: (text: string) => void;
    updateMessage: (id: string, updates: Partial<Message>) => void;
    deleteMessage: (id: string) => void;
    toggleSender: () => void;
    updateProfile: (type: 'user' | 'contact', profile: Partial<Profile>) => void;
    clearChat: () => void;
  };
}
```

#### UI Context (Interface State)
```typescript
interface UIState {
  modals: {
    profilePanel: boolean;
    exportModal: boolean;
    helpModal: boolean;
  };
  loading: {
    exporting: boolean;
    uploadingImage: boolean;
  };
}

interface UIContextType {
  state: UIState;
  actions: {
    toggleModal: (modal: keyof UIState['modals']) => void;
    setLoading: (key: keyof UIState['loading'], value: boolean) => void;
    showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  };
}
```

### Core Data Interfaces

#### Message Interface
```typescript
interface Message {
  id: string;                    // UUID v4
  text: string;                  // Message content
  sender: 'user' | 'contact';    // Who sent the message
  timestamp: Date;               // When message was sent
  status: MessageStatus;         // Read/delivery status
  type: 'text' | 'system';      // Message type
  createdAt: Date;               // When created in editor
  updatedAt: Date;               // Last modified
}

type MessageStatus = 'sent' | 'delivered' | 'read';
```

#### Profile Interface
```typescript
interface Profile {
  name: string;                  // Display name (max 25 chars)
  avatar?: string;               // Base64 image or null
  avatarColor: string;           // Background color for initials
  initials: string;              // Generated from name
  phone?: string;                // Optional phone number
}

interface ChatProfiles {
  user: Profile;                 // "Você" profile
  contact: Profile;              // Contact profile
}
```

### Data Persistence Strategy

**Local Storage:** Persistir estado do chat durante a sessão
**Session Strategy:** Auto-save a cada mudança com debounce de 500ms
**Export Only:** Não há backend - dados nunca saem do browser

## Component Architecture and Design System

### Tailwind-Only Styling Strategy

#### Design Tokens Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
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
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

#### Component Styling Pattern

```typescript
// MessageBubble component example
const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const bubbleStyles = message.sender === 'user' 
    ? 'bg-wa-bubble-sent ml-auto' 
    : 'bg-wa-bubble-received mr-auto';
    
  return (
    <div className={`
      max-w-sm p-2 rounded-lg shadow-sm mb-1
      ${bubbleStyles}
    `}>
      <p className="text-wa-text-primary text-sm">
        {message.text}
      </p>
      <div className="flex items-center justify-end mt-1 space-x-1">
        <span className="text-wa-text-meta text-xs">
          {formatTime(message.timestamp)}
        </span>
        <StatusIndicator status={message.status} />
      </div>
    </div>
  );
};
```

### Core Components

#### MessageBubble Component
```typescript
interface MessageBubbleProps {
  message: Message;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isEditing?: boolean;
  showActions?: boolean;
}

// Usage: Renderiza mensagem com visual pixel-perfect do WhatsApp
// States: default, hover (desktop), active (editing), long-press (mobile)
// Styling: Pure Tailwind classes with WhatsApp color tokens
```

#### ChatHeader Component
```typescript
interface ChatHeaderProps {
  profile: Profile;
  onProfileEdit?: () => void;
  onBack?: () => void;
  showOnlineStatus?: boolean;
}

// Usage: Header do chat com avatar, nome e ações
// States: default, with online indicator
// Responsive: Full width mobile, fixed width desktop
```

#### MessageInput Component
```typescript
interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onSenderToggle: () => void;
  activeSender: 'user' | 'contact';
  disabled?: boolean;
}

// Usage: Input de nova mensagem com toggle de remetente
// Features: Auto-resize, keyboard shortcuts
// Responsive: Fixed bottom mobile, natural flow desktop
```

## Core Features Implementation Strategy

### Message Management System

#### React Context Implementation
```typescript
// src/contexts/ChatContext.tsx
const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ChatState>(initialState);
  
  const addMessage = useCallback((text: string) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      text,
      sender: state.activeSender,
      timestamp: new Date(),
      status: 'sent',
      type: 'text',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage].sort((a, b) => 
        a.timestamp.getTime() - b.timestamp.getTime()
      ),
    }));
  }, [state.activeSender]);
  
  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(msg => 
        msg.id === id ? { ...msg, ...updates, updatedAt: new Date() } : msg
      ),
    }));
  }, []);
  
  // ... other actions
  
  return (
    <ChatContext.Provider value={{ state, actions: { addMessage, updateMessage, ... } }}>
      {children}
    </ChatContext.Provider>
  );
};
```

#### Custom Hooks
```typescript
// src/hooks/useChat.ts
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

// src/hooks/useLocalStorage.ts
export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue] as const;
};
```

### Export System Architecture

#### Canvas-Based Export Implementation
```typescript
// src/utils/export.ts
interface ExportOptions {
  quality: 'low' | 'medium' | 'high';
  format: 'png' | 'jpeg';
  width: number;
  includeHeader: boolean;
}

export class ChatExporter {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  
  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d')!;
  }
  
  async exportChat(messages: Message[], profiles: ChatProfiles, options: ExportOptions): Promise<Blob> {
    // 1. Calculate total height needed
    const totalHeight = this.calculateHeight(messages, options);
    
    // 2. Setup canvas
    this.canvas.width = options.width;
    this.canvas.height = totalHeight;
    
    // 3. Render background
    this.renderBackground();
    
    // 4. Render header if needed
    if (options.includeHeader) {
      this.renderHeader(profiles.contact);
    }
    
    // 5. Render messages
    let currentY = options.includeHeader ? 60 : 20;
    for (const message of messages) {
      currentY += this.renderMessage(message, currentY);
    }
    
    // 6. Convert to blob
    return new Promise(resolve => {
      this.canvas.toBlob(resolve, `image/${options.format}`, this.getQuality(options.quality));
    });
  }
  
  private renderMessage(message: Message, y: number): number {
    // Canvas API calls to replicate exact WhatsApp message rendering
    // Returns height consumed
  }
}
```

## Performance and Optimization Strategy

### Performance Goals (Maintained from PRD)

- **First Contentful Paint:** < 1.5 segundos
- **Time to Interactive:** < 3 segundos  
- **Animation Performance:** 60fps constante
- **Bundle Size:** < 200KB gzipped
- **Lighthouse Score:** > 90 em todas categorias

### Simplified Optimization Techniques

#### Code Splitting with React.lazy
```typescript
// Lazy loading de componentes pesados
const ExportModal = lazy(() => import('./components/chat/ExportModal'));
const ProfilePanel = lazy(() => import('./components/chat/ProfilePanel'));

// Component wrapping with Suspense
const App = () => (
  <ChatProvider>
    <UIProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <ChatContainer />
        {/* Lazy components rendered conditionally */}
      </Suspense>
    </UIProvider>
  </ChatProvider>
);
```

#### Optimized Re-rendering
```typescript
// Memoized components for performance
const MessageBubble = memo<MessageBubbleProps>(({ message, onEdit }) => {
  return (
    <div className="message-bubble">
      {/* Component content */}
    </div>
  );
});

// Custom comparison function if needed
const MessageList = memo<MessageListProps>(({ messages }) => {
  return (
    <div className="message-list">
      {messages.map(message => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.messages.length === nextProps.messages.length &&
         prevProps.messages.every((msg, i) => msg.id === nextProps.messages[i].id);
});
```

#### Image Optimization
```typescript
// Avatar processing pipeline
const processAvatar = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Resize to 40x40px, optimize quality
      canvas.width = 40;
      canvas.height = 40;
      ctx.drawImage(img, 0, 0, 40, 40);
      resolve(canvas.toDataURL('image/webp', 0.8));
    };
    
    img.src = URL.createObjectURL(file);
  });
};
```

## Testing Strategy

### Simplified Testing Approach

#### Component Testing with RTL
```typescript
// tests/components/MessageBubble.test.tsx
import { render, screen } from '@testing-library/react';
import { MessageBubble } from '../src/components/chat/MessageBubble';

describe('MessageBubble', () => {
  const mockMessage: Message = {
    id: '1',
    text: 'Hello world',
    sender: 'user',
    timestamp: new Date(),
    status: 'sent',
    type: 'text',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  it('renders message text correctly', () => {
    render(<MessageBubble message={mockMessage} />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });
  
  it('applies correct styling for sent messages', () => {
    render(<MessageBubble message={mockMessage} />);
    const bubble = screen.getByRole('article');
    expect(bubble).toHaveClass('bg-wa-bubble-sent');
  });
});
```

#### Context Testing
```typescript
// tests/contexts/ChatContext.test.tsx
import { renderHook, act } from '@testing-library/react';
import { ChatProvider } from '../src/contexts/ChatContext';
import { useChat } from '../src/hooks/useChat';

describe('ChatContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ChatProvider>{children}</ChatProvider>
  );
  
  it('adds message correctly', () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    
    act(() => {
      result.current.actions.addMessage('Test message');
    });
    
    expect(result.current.state.messages).toHaveLength(1);
    expect(result.current.state.messages[0].text).toBe('Test message');
  });
});
```

## Deployment and Infrastructure

### Simplified Vercel Deployment

#### Vite Configuration
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

#### Environment Configuration
```bash
# .env.example
# Application
VITE_APP_NAME="Fake WhatsApp Chat Generator"
VITE_APP_VERSION="1.0.0"

# Analytics (Optional)
VITE_GA_ID=""

# Sentry (Error Monitoring)
VITE_SENTRY_DSN=""

# Development
NODE_ENV="development"
```

#### Simplified CI/CD
```yaml
# .github/workflows/main.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: vercel/action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

## Security and Privacy Considerations

### Client-Side Security (Simplified)

#### Input Sanitization
```typescript
// src/utils/validation.ts
export const sanitizeMessage = (text: string): string => {
  // Basic HTML sanitization for message content
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
};

export const validateMessageLength = (text: string): boolean => {
  return text.length > 0 && text.length <= 4096; // WhatsApp limit
};

export const validateProfileName = (name: string): boolean => {
  return name.length > 0 && name.length <= 25 && /^[a-zA-Z0-9\s\u00C0-\u017F]+$/.test(name);
};
```

#### Privacy Implementation
- **No Server Communication:** Todo processamento client-side
- **No Data Collection:** Nenhum dado pessoal coletado ou transmitido  
- **Local Storage Only:** Dados persistem apenas localmente
- **Secure Canvas Processing:** Export sem upload de dados

## Implementation Roadmap (Updated for Simplified Architecture)

### Phase 1: Foundation (Week 1)
- [x] **Simple Project Setup**: Vite + React + TypeScript
- [x] **Basic Infrastructure**: ESLint, Prettier, basic CI
- [x] **Core Components**: Base UI components com Tailwind
- [x] **Layout Structure**: Main app layout e routing básico

### Phase 2: Core Features (Week 1-2)
- [ ] **React Context Setup**: Chat e UI contexts
- [ ] **Message System**: Creation, editing, deletion com hooks
- [ ] **Profile Management**: User e contact configuration
- [ ] **Visual Polish**: Pixel-perfect WhatsApp styling

### Phase 3: Advanced Features (Week 2)
- [ ] **Export System**: Canvas-based image generation
- [ ] **Mobile Optimization**: Touch interactions, responsive design
- [ ] **Local Storage**: Persistence com custom hooks
- [ ] **Testing**: Component e integration tests

### Phase 4: Production Ready (Week 2-3)
- [ ] **Performance**: Code splitting, optimization
- [ ] **Monitoring**: Sentry integration, error boundaries
- [ ] **Deployment**: Vercel production deployment
- [ ] **Documentation**: User guide, component docs

## Success Metrics and Validation

### Technical Metrics (Maintained)
- **Performance**: Lighthouse score > 90 todas categorias
- **Quality**: 80%+ test coverage, 0 critical vulnerabilities  
- **User Experience**: < 2min para criar primeira conversa
- **Reliability**: 99.9% uptime, < 1% error rate

### Business Metrics (From PRD)
- **User Adoption**: 1.000 usuários ativos no primeiro mês
- **Retention**: 40% retenção após 30 dias
- **Usage**: Conversas criadas em < 2 minutos  
- **Quality**: Visual indistinguível de WhatsApp real

## Next Steps

### Immediate Implementation Actions

1. **Setup Simplified Project Structure**
   ```bash
   npm create vite@latest fake-whatsapp-chat-generator -- --template react-ts
   cd fake-whatsapp-chat-generator
   npm install
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **Install Core Dependencies**
   ```bash
   npm install date-fns clsx
   npm install -D @types/react @types/node
   ```

3. **Configure Tailwind with WhatsApp Tokens**
   - Setup tailwind.config.js com cores do WhatsApp
   - Configure design tokens como CSS custom properties

4. **Implement Core Contexts**
   - ChatContext para state de mensagens e perfis
   - UIContext para state de modais e loading

### Architecture Validation Checklist

- [x] **Simplified Structure**: Removed monorepo complexity
- [x] **Pure Tailwind**: Removed CSS Modules hybrid approach  
- [x] **React Context**: Replaced Zustand with native React state
- [x] **Single Package**: Standard Vite React project structure
- [x] **Maintained Goals**: All PRD requirements still addressed
- [x] **Performance Targets**: Same performance goals with simpler stack

---

*Documento atualizado por Winston (Architect) - 21/08/2025*  
*Refatorado para arquitetura simplificada baseada em feedback do usuário*