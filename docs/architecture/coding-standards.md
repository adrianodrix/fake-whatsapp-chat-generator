# Coding Standards - Fake WhatsApp Chat Generator

## Visão Geral

Este documento define os padrões de código para o Fake WhatsApp Chat Generator, baseado na arquitetura simplificada React + TypeScript + Tailwind CSS. Estes padrões garantem consistência, manutenibilidade e qualidade do código.

## Estrutura de Arquivos

### Organização de Componentes

```text
src/components/
├── ui/                  # Componentes base reutilizáveis
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.types.ts
│   │   └── index.ts
│   └── Input/
├── chat/               # Componentes específicos do WhatsApp
│   ├── MessageBubble/
│   │   ├── MessageBubble.tsx
│   │   ├── MessageBubble.types.ts
│   │   └── index.ts
│   └── ChatHeader/
└── layout/             # Componentes de layout
```

### Nomenclatura de Arquivos

- **Componentes:** PascalCase (`MessageBubble.tsx`)
- **Hooks:** camelCase com prefixo `use` (`useChat.ts`)
- **Types:** PascalCase com sufixo `.types.ts` (`Message.types.ts`)
- **Utils:** camelCase (`validation.ts`)
- **Contexts:** PascalCase com sufixo `Context` (`ChatContext.tsx`)

## Padrões TypeScript

### Interfaces e Types

```typescript
// ✅ Correto - Interface para props de componente
interface MessageBubbleProps {
  message: Message;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isEditing?: boolean;
}

// ✅ Correto - Type para união de valores
type MessageStatus = 'sent' | 'delivered' | 'read';

// ✅ Correto - Interface para dados de domínio
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'contact';
  timestamp: Date;
  status: MessageStatus;
  type: 'text' | 'system';
  createdAt: Date;
  updatedAt: Date;
}
```

### Exportação de Types

```typescript
// ✅ Correto - Arquivo de types dedicado
// src/types/message.ts
export interface Message {
  /* ... */
}
export type MessageStatus = 'sent' | 'delivered' | 'read';
export interface ChatProfiles {
  /* ... */
}

// ✅ Correto - Re-exportação em index
// src/types/index.ts
export type { Message, MessageStatus, ChatProfiles } from './message';
```

## Padrões React

### Estrutura de Componentes

```typescript
// ✅ Padrão para componentes funcionais
import React, { memo } from 'react';
import { MessageBubbleProps } from './MessageBubble.types';
import { formatTime } from '../../utils/formatting';

export const MessageBubble: React.FC<MessageBubbleProps> = memo(({
  message,
  onEdit,
  onDelete,
  isEditing = false
}) => {
  // 1. Early returns
  if (!message.text) return null;

  // 2. Computed values
  const bubbleStyles = message.sender === 'user'
    ? 'bg-wa-bubble-sent ml-auto'
    : 'bg-wa-bubble-received mr-auto';

  // 3. Event handlers
  const handleEdit = () => {
    onEdit?.(message.id);
  };

  // 4. Render
  return (
    <div className={`max-w-sm p-2 rounded-lg ${bubbleStyles}`}>
      <p className="text-wa-text-primary text-sm">
        {message.text}
      </p>
      <div className="flex items-center justify-end mt-1">
        <span className="text-wa-text-meta text-xs">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';
```

### Custom Hooks

```typescript
// ✅ Padrão para hooks customizados
import { useContext } from 'react';
import { ChatContext } from '../contexts/ChatContext';

export const useChat = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useChat deve ser usado dentro de ChatProvider');
  }

  return context;
};

// ✅ Hook com lógica complexa
export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setStoredValue = useCallback(
    (newValue: T) => {
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    [key]
  );

  return [value, setStoredValue] as const;
};
```

### Context Providers

```typescript
// ✅ Padrão para Context
interface ChatContextType {
  state: ChatState;
  actions: {
    addMessage: (text: string) => void;
    updateMessage: (id: string, updates: Partial<Message>) => void;
    deleteMessage: (id: string) => void;
  };
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ChatState>(initialState);

  const actions = useMemo(() => ({
    addMessage: (text: string) => {
      // Implementação...
    },
    updateMessage: (id: string, updates: Partial<Message>) => {
      // Implementação...
    },
    deleteMessage: (id: string) => {
      // Implementação...
    },
  }), []);

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
```

## Padrões de Styling (Tailwind)

### Classes Tailwind

```typescript
// ✅ Correto - Classes organizadas logicamente
const messageStyles = `
  max-w-sm p-3 rounded-lg shadow-sm mb-2
  ${message.sender === 'user'
    ? 'bg-wa-bubble-sent ml-auto'
    : 'bg-wa-bubble-received mr-auto'
  }
`;

// ✅ Correto - Uso de design tokens personalizados
const headerStyles = "bg-wa-primary text-white h-15 px-4 flex items-center";

// ❌ Evitar - Classes inline muito longas
<div className="max-w-sm p-3 rounded-lg shadow-sm mb-2 bg-green-100 ml-auto flex flex-col items-end justify-between">
```

### Design Tokens

```typescript
// tailwind.config.js - Tokens do WhatsApp
module.exports = {
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
        },
      },
    },
  },
};
```

## Padrões de Validação

### Input Validation

```typescript
// ✅ Padrão para validação
export const validateMessage = (text: string): ValidationResult => {
  if (!text.trim()) {
    return { isValid: false, error: 'Mensagem não pode estar vazia' };
  }

  if (text.length > 4096) {
    return {
      isValid: false,
      error: 'Mensagem muito longa (máximo 4096 caracteres)',
    };
  }

  return { isValid: true, error: null };
};

export const sanitizeMessage = (text: string): string => {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .trim();
};
```

## Padrões de Error Handling

### Error Boundaries

```typescript
// ✅ Error Boundary padrão
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log para Sentry em produção
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h3 className="text-red-800">Algo deu errado</h3>
          <p className="text-red-600">Tente recarregar a página</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Async Error Handling

```typescript
// ✅ Pattern para async operations
const useAsyncOperation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async <T>(operation: () => Promise<T>): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await operation();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};
```

## Padrões de Testes

### Component Testing

```typescript
// ✅ Padrão para testes de componente
import { render, screen, fireEvent } from '@testing-library/react';
import { MessageBubble } from './MessageBubble';

describe('MessageBubble', () => {
  const mockMessage = {
    id: '1',
    text: 'Hello world',
    sender: 'user' as const,
    timestamp: new Date('2025-01-01T12:00:00'),
    status: 'sent' as const,
    type: 'text' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('renderiza o texto da mensagem', () => {
    render(<MessageBubble message={mockMessage} />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('aplica estilo correto para mensagem enviada', () => {
    render(<MessageBubble message={mockMessage} />);
    const bubble = screen.getByRole('article');
    expect(bubble).toHaveClass('bg-wa-bubble-sent');
  });
});
```

## Padrões de Performance

### Memoização

```typescript
// ✅ Uso correto de memo
export const MessageBubble = memo<MessageBubbleProps>(({ message }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison se necessário
  return prevProps.message.id === nextProps.message.id &&
         prevProps.message.updatedAt === nextProps.message.updatedAt;
});

// ✅ Uso correto de useMemo/useCallback
const MessageList = ({ messages }: { messages: Message[] }) => {
  const sortedMessages = useMemo(() => {
    return messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [messages]);

  const handleMessageEdit = useCallback((id: string) => {
    // Handle edit
  }, []);

  return (
    <div>
      {sortedMessages.map(message => (
        <MessageBubble
          key={message.id}
          message={message}
          onEdit={handleMessageEdit}
        />
      ))}
    </div>
  );
};
```

## Story Documentation Standards

### Referências Arquiteturais

```markdown
# ✅ Correto - Referências específicas

- **Data Model Reference:** Message interface especificada em `docs/architecture/data-models-and-state-management.md#message-interface`
- **Pattern Reference:** Context pattern definido em `docs/architecture/data-models-and-state-management.md#react-context-architecture`
- **Component Reference:** Styling patterns em `docs/architecture/component-architecture-and-design-system.md#whatsapp-ui-components`

# ❌ Evitar - Referências genéricas

- **Pattern Reference:** Context pattern definido na arquitetura
- **Reference:** Conforme documentação arquitetural
- **See:** Architecture document
```

### Formato Padrão de Referências

```markdown
# Template para Story Documentation

## Technical Notes

- **Integration Approach:** [Descrição da abordagem]
- **Existing Pattern Reference:** `docs/architecture/[file].md#[section-specific]`
- **Data Model Reference:** `docs/architecture/[file].md#[interface-name]`
- **Component Reference:** `docs/architecture/[file].md#[component-pattern]`
- **Key Constraints:** [Limitações técnicas específicas]

## Story Context

- **Architecture Reference:** `docs/architecture/[relevant-doc].md#[specific-section]`
- **Dependencies:** [Histórias ou componentes dependentes]
```

### Princípios para Referências

1. **Especificidade:** Sempre referencie seções específicas com `#section-name`
2. **Relevância:** Inclua apenas referências diretamente relevantes para a implementação
3. **Consistência:** Use o formato padrão `docs/architecture/[file].md#[section]`
4. **Contexto:** Explique brevemente por que a referência é relevante
5. **Atualização:** Mantenha referências atualizadas quando arquitetura mudar

### Validação de Referências

Antes de finalizar uma história, verifique:

- [ ] Todas as referências apontam para seções específicas
- [ ] Links seguem o formato padrão
- [ ] Referências são necessárias para implementação
- [ ] Nenhuma referência genérica ou vaga foi incluída

## Documentação

### JSDoc Padrão

````typescript
/**
 * Componente de bolha de mensagem que replica o visual do WhatsApp
 *
 * @example
 * ```tsx
 * <MessageBubble
 *   message={message}
 *   onEdit={handleEdit}
 *   isEditing={isEditing}
 * />
 * ```
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onEdit,
  isEditing = false,
}) => {
  // Implementation
};

/**
 * Valida e sanitiza texto de mensagem
 *
 * @param text - Texto da mensagem para validar
 * @returns Resultado da validação com erro se inválido
 *
 * @example
 * ```ts
 * const result = validateMessage("Hello world");
 * if (!result.isValid) {
 *   console.error(result.error);
 * }
 * ```
 */
export const validateMessage = (text: string): ValidationResult => {
  // Implementation
};
````

## Regras de ESLint/Prettier

### Configuração Base

```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_" }
    ],
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

---

_Documento mantido por Winston (Architect) - Atualizado em 22/08/2025_
