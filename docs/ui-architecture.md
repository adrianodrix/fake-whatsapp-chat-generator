# Fake WhatsApp Chat Generator Frontend Architecture Document

Este documento define a arquitetura frontend técnica **simplificada** para o **Fake WhatsApp Chat Generator**, complementando o documento principal de arquitetura com detalhes específicos para implementação da interface de usuário. Focado em padrões práticos para agentes AI e desenvolvimento eficiente.

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-08-21 | 1.0 | Frontend architecture document criado | Winston (Architect) |

## Frontend Tech Stack

### Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| Framework | React | 18+ | UI framework principal | Component-based architecture, hooks para state management simples |
| Language | TypeScript | 5+ | Type safety e DX | Prevents runtime errors, better IDE support, clear interfaces |
| Build Tool | Vite | 4+ | Dev server e bundling | Fast HMR, optimized builds, simple configuration |
| Styling | Tailwind CSS | 3+ | Utility-first CSS only | Rapid development, consistent design tokens, no CSS-in-JS complexity |
| State Management | React Context | Built-in | Simple state management | Native React solution, adequate for app scope, no external dependencies |
| Routing | None (SPA) | - | Single page application | MVP focused on chat interface, no complex routing needed |
| Testing | Jest + RTL | Latest | Unit e component testing | Standard React testing stack, great component testing support |
| Form Handling | Native React | Built-in | Simple form state | useState adequate for simple message input and profile forms |
| Animation | CSS + Tailwind | Built-in | Micro-interactions | CSS transitions sufficient for WhatsApp-like animations |
| Dev Tools | React DevTools + Vite | Latest | Development experience | Excellent debugging, fast development cycle |

## Project Structure

```text
fake-whatsapp-chat-generator/
├── public/
│   ├── vite.svg                    # Vite default icon
│   ├── whatsapp-favicon.ico        # WhatsApp-style favicon
│   └── icons/                      # WhatsApp UI icons (SVG)
│       ├── check-single.svg
│       ├── check-double.svg
│       ├── check-read.svg
│       ├── send.svg
│       ├── emoji.svg
│       └── attachment.svg
├── src/
│   ├── main.tsx                    # Entry point with React.StrictMode
│   ├── App.tsx                     # Main app component with providers
│   ├── index.css                   # Global styles + Tailwind imports
│   ├── components/
│   │   ├── ui/                     # Generic reusable components
│   │   │   ├── Button/
│   │   │   │   ├── index.ts        # Export: export { Button } from './Button'
│   │   │   │   ├── Button.tsx      # Implementation
│   │   │   │   └── Button.types.ts # interface ButtonProps
│   │   │   ├── Input/
│   │   │   │   ├── index.ts
│   │   │   │   ├── Input.tsx
│   │   │   │   └── Input.types.ts
│   │   │   ├── Avatar/
│   │   │   │   ├── index.ts
│   │   │   │   ├── Avatar.tsx
│   │   │   │   └── Avatar.types.ts
│   │   │   ├── Modal/
│   │   │   │   ├── index.ts
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── Modal.types.ts
│   │   │   └── Icon/
│   │   │       ├── index.ts
│   │   │       ├── Icon.tsx
│   │   │       └── Icon.types.ts
│   │   ├── chat/                   # WhatsApp-specific components
│   │   │   ├── ChatContainer/
│   │   │   │   ├── index.ts
│   │   │   │   ├── ChatContainer.tsx
│   │   │   │   └── ChatContainer.types.ts
│   │   │   ├── MessageBubble/
│   │   │   │   ├── index.ts
│   │   │   │   ├── MessageBubble.tsx
│   │   │   │   └── MessageBubble.types.ts
│   │   │   ├── ChatHeader/
│   │   │   │   ├── index.ts
│   │   │   │   ├── ChatHeader.tsx
│   │   │   │   └── ChatHeader.types.ts
│   │   │   ├── MessageInput/
│   │   │   │   ├── index.ts
│   │   │   │   ├── MessageInput.tsx
│   │   │   │   └── MessageInput.types.ts
│   │   │   ├── StatusIndicator/
│   │   │   │   ├── index.ts
│   │   │   │   ├── StatusIndicator.tsx
│   │   │   │   └── StatusIndicator.types.ts
│   │   │   ├── ProfilePanel/
│   │   │   │   ├── index.ts
│   │   │   │   ├── ProfilePanel.tsx
│   │   │   │   └── ProfilePanel.types.ts
│   │   │   └── ExportModal/
│   │   │       ├── index.ts
│   │   │       ├── ExportModal.tsx
│   │   │       └── ExportModal.types.ts
│   │   └── layout/                 # Layout components
│   │       ├── Container/
│   │       │   ├── index.ts
│   │       │   ├── Container.tsx
│   │       │   └── Container.types.ts
│   │       └── ErrorBoundary/
│   │           ├── index.ts
│   │           ├── ErrorBoundary.tsx
│   │           └── ErrorBoundary.types.ts
│   ├── contexts/                   # React Context providers
│   │   ├── index.ts                # Export all contexts
│   │   ├── ChatContext.tsx         # Chat state management
│   │   ├── ChatContext.types.ts    # Chat context interfaces
│   │   ├── UIContext.tsx           # UI state (modals, loading)
│   │   └── UIContext.types.ts      # UI context interfaces
│   ├── hooks/                      # Custom React hooks
│   │   ├── index.ts                # Export all hooks
│   │   ├── useChat.ts              # Chat operations wrapper
│   │   ├── useUI.ts                # UI operations wrapper
│   │   ├── useLocalStorage.ts      # Local storage persistence
│   │   ├── useExport.ts            # Canvas export functionality
│   │   └── useKeyboardShortcuts.ts # Keyboard shortcuts (Tab, Enter, etc)
│   ├── types/                      # TypeScript type definitions
│   │   ├── index.ts                # Export all types
│   │   ├── message.ts              # Message, MessageStatus types
│   │   ├── profile.ts              # Profile, ChatProfiles types
│   │   ├── chat.ts                 # Chat state related types
│   │   └── export.ts               # Export options and configuration
│   ├── utils/                      # Utility functions
│   │   ├── index.ts                # Export all utilities
│   │   ├── validation.ts           # Input validation functions
│   │   ├── export.ts               # Canvas rendering and export logic
│   │   ├── storage.ts              # Local storage helpers
│   │   ├── format.ts               # Date/time formatting, text utilities
│   │   └── constants.ts            # App constants (colors, limits, etc)
│   └── styles/                     # Global styles and configuration
│       └── whatsapp-tokens.css     # WhatsApp design tokens as CSS variables
├── tests/                          # Test files (mirrors src structure)
│   ├── components/
│   │   ├── ui/
│   │   └── chat/
│   ├── contexts/
│   ├── hooks/
│   └── utils/
├── docs/                           # Documentation
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── eslint.config.js               # ESLint configuration
├── index.html                      # HTML entry point
├── package.json                    # Dependencies and scripts
├── postcss.config.js              # PostCSS configuration
├── tailwind.config.js             # Tailwind configuration with WhatsApp tokens
├── tsconfig.json                  # TypeScript configuration
├── tsconfig.node.json             # TypeScript config for build tools
└── vite.config.ts                 # Vite configuration
```

## Component Standards

### Component Template

```typescript
// src/components/[category]/[ComponentName]/[ComponentName].tsx
import React from 'react';
import clsx from 'clsx';
import { ComponentNameProps } from './ComponentName.types';

/**
 * ComponentName - Brief description of what this component does
 * 
 * @example
 * <ComponentName 
 *   prop1="value" 
 *   prop2={true}
 *   onAction={() => console.log('action')}
 * />
 */
export const ComponentName: React.FC<ComponentNameProps> = ({
  // Destructure props with defaults
  className,
  children,
  variant = 'default',
  disabled = false,
  onClick,
  ...rest
}) => {
  // Component logic here
  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  // Build className using clsx for conditional styles
  const componentClasses = clsx(
    // Base styles
    'inline-flex items-center justify-center',
    'rounded-lg font-medium transition-colors',
    
    // Variant styles
    {
      'bg-wa-accent text-white hover:bg-wa-accent/90': variant === 'primary',
      'bg-gray-100 text-gray-900 hover:bg-gray-200': variant === 'secondary',
      'bg-transparent text-wa-primary hover:bg-wa-primary/10': variant === 'ghost',
    },
    
    // State styles
    {
      'opacity-50 cursor-not-allowed': disabled,
      'cursor-pointer': !disabled,
    },
    
    // Custom className override
    className
  );

  return (
    <button
      className={componentClasses}
      disabled={disabled}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
};

ComponentName.displayName = 'ComponentName';
```

### Naming Conventions

#### Files and Directories
- **Components:** PascalCase - `MessageBubble/MessageBubble.tsx`
- **Types:** PascalCase + `.types.ts` - `MessageBubble.types.ts`
- **Hooks:** camelCase + `use` prefix - `useChat.ts`
- **Utilities:** camelCase - `validation.ts`
- **Constants:** camelCase - `constants.ts`
- **Contexts:** PascalCase + `Context` suffix - `ChatContext.tsx`

#### Code Naming
- **Interfaces:** PascalCase + descriptive suffix - `MessageBubbleProps`, `ChatState`
- **Types:** PascalCase - `MessageStatus`, `ExportFormat`
- **Functions:** camelCase + descriptive verb - `addMessage`, `validateInput`
- **Constants:** SCREAMING_SNAKE_CASE - `MAX_MESSAGE_LENGTH`, `WHATSAPP_COLORS`
- **CSS Classes:** Tailwind utilities + custom wa- prefix - `bg-wa-bubble-sent`

## State Management

### Store Structure

```text
src/contexts/
├── index.ts                    # Export all contexts and providers
├── ChatContext.tsx             # Chat state management
├── ChatContext.types.ts        # Chat-related interfaces
├── UIContext.tsx              # UI state (modals, loading, notifications)
├── UIContext.types.ts         # UI-related interfaces
└── providers/                 # Provider composition
    ├── AppProviders.tsx       # Root provider wrapper
    └── AppProviders.types.ts  # Provider configuration types
```

### State Management Template

```typescript
// src/contexts/ChatContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ChatContextType, ChatState, Message, Profile } from './ChatContext.types';
import { useLocalStorage } from '../hooks/useLocalStorage';

const INITIAL_CHAT_STATE: ChatState = {
  messages: [],
  profiles: {
    user: {
      name: 'Você',
      avatar: null,
      avatarColor: '#25D366',
      initials: 'VO',
      phone: undefined,
    },
    contact: {
      name: 'Contato',
      avatar: null,
      avatarColor: '#075E54',
      initials: 'CO',
      phone: undefined,
    },
  },
  activeSender: 'user',
  isEditing: null,
  lastActivity: new Date(),
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatData, setChatData] = useLocalStorage('whatsapp-chat-data', INITIAL_CHAT_STATE);
  const [state, setState] = useState<ChatState>(chatData);

  // Sync state with localStorage on changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setChatData(state);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [state, setChatData]);

  const addMessage = useCallback((text: string) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      text: text.trim(),
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
      lastActivity: new Date(),
    }));
  }, [state.activeSender]);

  // ... other actions

  const contextValue: ChatContextType = {
    state,
    actions: { addMessage, /* ... other actions */ },
    computed: { 
      messagesCount: state.messages.length,
      canExport: () => state.messages.length > 0,
    },
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
```

## API Integration (Client-Side Services)

### Storage Service

```typescript
// src/utils/storage.ts
export class StorageService {
  private static prefix = 'whatsapp-chat-';
  
  static setItem<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serialized);
      return true;
    } catch (error) {
      console.error('Failed to store data:', error);
      return false;
    }
  }
  
  static getItem<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(this.prefix + key);
      if (stored === null) return defaultValue;
      return JSON.parse(stored) as T;
    } catch (error) {
      console.error('Failed to retrieve data:', error);
      return defaultValue;
    }
  }
  
  static isAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
}
```

### Canvas Export Service

```typescript
// src/utils/export.ts
export class CanvasExportService {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  
  constructor() {
    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D context not supported');
    }
    this.ctx = ctx;
  }
  
  async exportChat(
    messages: Message[],
    profiles: { user: Profile; contact: Profile },
    options: ExportOptions
  ): Promise<Blob> {
    // Implementation for pixel-perfect WhatsApp rendering
    // Includes background, header, messages, status indicators
    // Returns high-quality PNG/JPEG blob
  }
}
```

## Routing

Simple SPA routing without external router:

```typescript
// src/App.tsx
export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'chat'>('landing');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onStartChat={() => setCurrentView('chat')} />;
      case 'chat':
        return <ChatContainer onBackToLanding={() => setCurrentView('landing')} />;
      default:
        return <ChatContainer />;
    }
  };

  return (
    <ErrorBoundary>
      <AppProviders>
        <div className="min-h-screen bg-wa-bg-chat">
          {renderCurrentView()}
        </div>
      </AppProviders>
    </ErrorBoundary>
  );
};
```

## Styling Guidelines

### Styling Approach

**Pure Tailwind CSS Strategy** com design tokens customizados para WhatsApp.

### Global Theme Variables

```css
/* src/styles/whatsapp-tokens.css */
:root {
  /* Primary Colors */
  --wa-primary: #075E54;
  --wa-secondary: #128C7E;
  --wa-accent: #25D366;
  
  /* Background Colors */
  --wa-bg-chat: #E5DDD5;
  --wa-bg-pattern: #F0F0F0;
  --wa-bg-input: #F0F0F0;
  
  /* Message Bubble Colors */
  --wa-bubble-sent: #DCF8C6;
  --wa-bubble-received: #FFFFFF;
  --wa-bubble-system: #F0F0F0;
  
  /* Text Colors */
  --wa-text-primary: #000000;
  --wa-text-secondary: #667781;
  --wa-text-meta: #8696A0;
  --wa-text-inverse: #FFFFFF;
  
  /* Status Colors */
  --wa-check-default: #919191;
  --wa-check-read: #4FC3F7;
  --wa-online: #4FC3F7;
  --wa-typing: #25D366;
  
  /* Component Specific */
  --wa-header-height: 60px;
  --wa-input-height: 50px;
  --wa-avatar-size: 40px;
  --wa-message-max-width: 65%;
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
          primary: 'var(--wa-primary)',
          secondary: 'var(--wa-secondary)',
          accent: 'var(--wa-accent)',
          bg: {
            chat: 'var(--wa-bg-chat)',
            pattern: 'var(--wa-bg-pattern)',
            input: 'var(--wa-bg-input)',
          },
          bubble: {
            sent: 'var(--wa-bubble-sent)',
            received: 'var(--wa-bubble-received)',
            system: 'var(--wa-bubble-system)',
          },
          text: {
            primary: 'var(--wa-text-primary)',
            secondary: 'var(--wa-text-secondary)',
            meta: 'var(--wa-text-meta)',
            inverse: 'var(--wa-text-inverse)',
          },
          check: {
            default: 'var(--wa-check-default)',
            read: 'var(--wa-check-read)',
          },
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.wa-message-sent': {
          backgroundColor: 'var(--wa-bubble-sent)',
          marginLeft: 'auto',
          marginRight: '16px',
        },
        '.wa-message-received': {
          backgroundColor: 'var(--wa-bubble-received)',
          marginLeft: '16px',
          marginRight: 'auto',
        },
      });
    },
  ],
};
```

## Testing Requirements

### Component Test Template

```typescript
// tests/components/chat/MessageBubble.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MessageBubble } from '../../../src/components/chat/MessageBubble';

describe('MessageBubble', () => {
  const mockMessage = {
    id: '1',
    text: 'Hello, this is a test message!',
    sender: 'user' as const,
    timestamp: new Date('2025-08-21T10:30:00'),
    status: 'sent' as const,
    type: 'text' as const,
    createdAt: new Date('2025-08-21T10:30:00'),
    updatedAt: new Date('2025-08-21T10:30:00'),
  };

  it('renders message text correctly', () => {
    render(<MessageBubble message={mockMessage} />);
    expect(screen.getByText('Hello, this is a test message!')).toBeInTheDocument();
  });

  it('applies correct classes for sent messages', () => {
    render(<MessageBubble message={mockMessage} />);
    const bubble = screen.getByRole('button');
    expect(bubble).toHaveClass('wa-message-sent');
  });

  it('handles keyboard navigation', () => {
    const mockOnEdit = jest.fn();
    render(<MessageBubble message={mockMessage} onEdit={mockOnEdit} />);
    
    const bubble = screen.getByRole('button');
    fireEvent.keyDown(bubble, { key: 'Enter' });
    expect(mockOnEdit).toHaveBeenCalledWith('1');
  });
});
```

### Testing Best Practices

1. **Component Testing**: Test component behavior, styling, and interactions
2. **Context Testing**: Test state management logic and side effects
3. **Hook Testing**: Test custom hooks in isolation when possible
4. **Integration Testing**: Test component interactions with contexts
5. **Accessibility Testing**: Ensure keyboard navigation and screen reader support
6. **Edge Case Testing**: Handle empty states, long content, special characters

## Environment Configuration

### Environment Variables

```bash
# .env.example
# Application Configuration
VITE_APP_NAME="Fake WhatsApp Chat Generator"
VITE_APP_VERSION="1.0.0"
VITE_APP_DESCRIPTION="Create pixel-perfect WhatsApp chat mockups"

# Feature Flags
VITE_ENABLE_DARK_MODE=false
VITE_ENABLE_EXPORT_FORMATS=png,jpeg
VITE_ENABLE_KEYBOARD_SHORTCUTS=true

# Analytics (Optional - privacy-first)
VITE_GA_MEASUREMENT_ID=""
VITE_ENABLE_ANALYTICS=false

# Error Monitoring
VITE_SENTRY_DSN=""
VITE_ENABLE_ERROR_REPORTING=false

# Export Configuration
VITE_MAX_EXPORT_WIDTH=1200
VITE_MAX_EXPORT_HEIGHT=2000
VITE_DEFAULT_EXPORT_QUALITY=medium

# Storage Configuration  
VITE_STORAGE_KEY_PREFIX="wa-chat-"
VITE_MAX_STORAGE_SIZE=5242880  # 5MB
```

### Environment Configuration Utility

```typescript
// src/utils/env.ts
interface EnvironmentConfig {
  app: {
    name: string;
    version: string;
    description: string;
  };
  features: {
    darkMode: boolean;
    exportFormats: string[];
    keyboardShortcuts: boolean;
  };
  export: {
    maxWidth: number;
    maxHeight: number;
    defaultQuality: 'low' | 'medium' | 'high';
  };
}

function parseEnvConfig(): EnvironmentConfig {
  return {
    app: {
      name: import.meta.env.VITE_APP_NAME || 'Fake WhatsApp Chat Generator',
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
      description: import.meta.env.VITE_APP_DESCRIPTION || 'Create WhatsApp chat mockups',
    },
    features: {
      darkMode: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
      exportFormats: (import.meta.env.VITE_ENABLE_EXPORT_FORMATS || 'png,jpeg').split(','),
      keyboardShortcuts: import.meta.env.VITE_ENABLE_KEYBOARD_SHORTCUTS !== 'false',
    },
    export: {
      maxWidth: parseInt(import.meta.env.VITE_MAX_EXPORT_WIDTH || '1200', 10),
      maxHeight: parseInt(import.meta.env.VITE_MAX_EXPORT_HEIGHT || '2000', 10),
      defaultQuality: (import.meta.env.VITE_DEFAULT_EXPORT_QUALITY as any) || 'medium',
    },
  };
}

export const env = parseEnvConfig();
```

## Frontend Developer Standards

### Critical Coding Rules

1. **Type Safety**: Always use TypeScript interfaces, never `any`
2. **Component Structure**: Follow folder pattern: `Component.tsx`, `Component.types.ts`, `index.ts`
3. **Styling**: Use only Tailwind classes with `wa-` prefix for WhatsApp-specific styling
4. **State Management**: Use Context only, avoid prop drilling beyond 2 levels
5. **Error Handling**: Always wrap async operations in try-catch
6. **Accessibility**: Include proper ARIA labels and keyboard navigation
7. **Performance**: Use React.memo for expensive components
8. **Testing**: Test component behavior, not implementation details

### Quick Reference

#### Common Commands
```bash
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Run ESLint
npm run type-check   # TypeScript check
```

#### Key Import Patterns
```typescript
// Context hooks
import { useChat } from '@/contexts/ChatContext';
import { useUI } from '@/contexts/UIContext';

// Components
import { Button } from '@/components/ui';
import { MessageBubble } from '@/components/chat';

// Utilities
import { StorageService } from '@/utils/storage';
import { CanvasExportService } from '@/utils/export';

// Types
import type { Message, Profile, ExportOptions } from '@/types';
```

#### File Naming Conventions
- Components: `MessageBubble.tsx`, `MessageBubble.types.ts`
- Hooks: `useChat.ts`, `useLocalStorage.ts`
- Utils: `validation.ts`, `export.ts`
- Types: `message.ts`, `profile.ts`

#### Project-Specific Patterns
- WhatsApp colors: Use `bg-wa-bubble-sent`, `text-wa-primary`
- Message handling: Always use Context actions, never direct state mutation
- Export functionality: Use CanvasExportService for all image generation
- Testing: Mirror src structure in tests folder

---

*Frontend Architecture Document criado por Winston (Architect) - 21/08/2025*  
*Documentação técnica específica para implementação da interface do usuário*