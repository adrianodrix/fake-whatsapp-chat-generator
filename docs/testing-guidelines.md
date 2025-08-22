# Testing Guidelines - Fake WhatsApp Chat Generator

## Visão Geral

Este documento define as diretrizes de teste para o Fake WhatsApp Chat Generator, estabelecendo padrões para garantir qualidade, manutenibilidade e consistência dos testes automatizados.

## Arquitetura de Testes

### Stack de Tecnologias

- **Jest**: Framework de teste principal
- **React Testing Library**: Testes de componentes React
- **@testing-library/jest-dom**: Matchers personalizados para DOM
- **@testing-library/user-event**: Simulação de interações do usuário
- **Custom Matchers**: Matchers específicos para WhatsApp UI

### Estrutura de Arquivos

```
src/
├── __tests__/                    # Testes organizados por tipo
│   ├── components/              # Testes de componentes
│   ├── hooks/                   # Testes de hooks customizados
│   ├── contexts/                # Testes de contexts
│   ├── utils/                   # Testes de utilitários
│   └── infrastructure/          # Meta-testes (teste da infraestrutura)
├── components/
│   └── ComponentName/
│       ├── ComponentName.tsx
│       ├── ComponentName.test.tsx  # Teste co-localizado
│       └── index.ts
└── test-utils/                  # Utilitários compartilhados de teste
    ├── index.ts
    ├── render.tsx               # Render customizado com providers
    ├── mocks.ts                 # Mock factories
    └── matchers.ts              # Custom matchers
```

## Padrões de Teste

### 1. Nomenclatura

```typescript
// ✅ Correto - Descrições claras e em português
describe('MessageBubble', () => {
  it('renderiza o texto da mensagem', () => {
    // test implementation
  });

  it('aplica estilo correto para mensagem enviada', () => {
    // test implementation
  });
});

// ❌ Evitar - Descrições genéricas ou em inglês inconsistente
describe('MessageBubble', () => {
  it('works', () => {
    // test implementation
  });
});
```

### 2. Estrutura de Testes

```typescript
describe('ComponentName', () => {
  // Setup comum
  const defaultProps = {
    // props padrão
  };

  // Casos de sucesso primeiro
  it('renderiza corretamente com props padrão', () => {
    // test implementation
  });

  // Casos de borda
  it('lida com propriedades opcionais ausentes', () => {
    // test implementation
  });

  // Casos de erro
  it('exibe fallback quando dados são inválidos', () => {
    // test implementation
  });
});
```

### 3. Testes de Componentes

```typescript
import { renderWithProviders, createMockMessage } from '../../test-utils';
import { MessageBubble } from './MessageBubble';

describe('MessageBubble', () => {
  const mockMessage = createMockMessage({
    text: 'Hello world',
    sender: 'user',
  });

  it('renderiza o texto da mensagem', () => {
    renderWithProviders(<MessageBubble message={mockMessage} />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('aplica classes CSS corretas', () => {
    renderWithProviders(<MessageBubble message={mockMessage} />);
    const messageElement = screen.getByText('Hello world');
    const bubble = messageElement.closest('div[class*="bg-wa-bubble-sent"]');
    expect(bubble).toHaveClass('bg-wa-bubble-sent');
  });
});
```

### 4. Testes de Hooks

```typescript
import { renderHook, act } from '@testing-library/react';
import { useChat } from './useChat';
import { ChatProvider } from '../contexts/ChatContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ChatProvider>{children}</ChatProvider>
);

describe('useChat', () => {
  it('fornece estado inicial correto', () => {
    const { result } = renderHook(() => useChat(), { wrapper });

    expect(result.current.state.messages).toEqual([]);
    expect(result.current.state.currentContact).toBeNull();
  });

  it('adiciona mensagem corretamente', () => {
    const { result } = renderHook(() => useChat(), { wrapper });

    act(() => {
      result.current.actions.addMessage('Test message');
    });

    expect(result.current.state.messages).toHaveLength(1);
    expect(result.current.state.messages[0].text).toBe('Test message');
  });
});
```

### 5. Mock Data Factories

```typescript
// test-utils/mocks.ts
export const createMockMessage = (
  overrides: Partial<Message> = {}
): Message => {
  return {
    id: uuidv4(),
    text: 'Test message',
    sender: 'user',
    timestamp: new Date('2025-01-01T12:00:00'),
    status: 'sent',
    type: 'text',
    createdAt: new Date('2025-01-01T12:00:00'),
    updatedAt: new Date('2025-01-01T12:00:00'),
    ...overrides,
  };
};

export const createMockProfile = (
  overrides: Partial<Profile> = {}
): Profile => {
  return {
    id: uuidv4(),
    name: 'Test User',
    phone: '+1234567890',
    avatar: '',
    isActive: true,
    lastSeen: new Date('2025-01-01T12:00:00'),
    createdAt: new Date('2025-01-01T12:00:00'),
    updatedAt: new Date('2025-01-01T12:00:00'),
    ...overrides,
  };
};
```

## Custom Matchers

### Matchers Disponíveis

```typescript
// Matchers do @testing-library/jest-dom
expect(element).toBeInTheDocument();
expect(element).toHaveClass('className');
expect(element).toHaveTextContent('text');

// Custom matchers para WhatsApp
expect(element).toHaveWhatsAppStyling(); // Verifica classes wa-*
expect(element).toBeMessageBubble(); // Verifica estrutura de bolha
```

### Implementação de Custom Matchers

```typescript
// test-utils/matchers.ts
export const customMatchers = {
  toHaveWhatsAppStyling: (element: HTMLElement) => {
    const allElements = [element, ...element.querySelectorAll('*')];
    const hasWhatsAppColors = allElements.some(
      (el) =>
        el.className &&
        (el.className.includes('bg-wa-') ||
          el.className.includes('text-wa-') ||
          el.className.includes('border-wa-'))
    );

    return {
      message: () =>
        hasWhatsAppColors
          ? 'Element has WhatsApp styling'
          : 'Element does not have WhatsApp styling classes',
      pass: hasWhatsAppColors,
    };
  },
};
```

## Padrões de Performance

### 1. Performance de Testes

```typescript
describe('Performance Tests', () => {
  it('executa em tempo aceitável', async () => {
    const startTime = Date.now();

    // Test operation
    renderWithProviders(<LargeComponent />);

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should complete within 100ms
    expect(duration).toBeLessThan(100);
  });
});
```

### 2. Memory Usage

```typescript
it('não deve causar vazamentos de memória', () => {
  const initialMemory = process.memoryUsage();

  // Test operations
  for (let i = 0; i < 100; i++) {
    render(<Component />);
    cleanup();
  }

  const finalMemory = process.memoryUsage();
  const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;

  // Memory increase should be reasonable
  expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // 10MB
});
```

## Coverage Requirements

### Thresholds Mínimos

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80,
  },
}
```

### Files Excluídos de Coverage

```javascript
collectCoverageFrom: [
  'src/**/*.{ts,tsx}',
  '!src/**/*.d.ts', // Type definitions
  '!src/main.tsx', // Entry point
  '!src/vite-env.d.ts', // Vite types
  '!src/**/*.stories.tsx', // Storybook files
  '!src/test-utils/**', // Test utilities
];
```

## CI/CD Integration

### GitHub Actions

O pipeline de CI executa:

1. **Lint**: `npm run lint`
2. **Type Check**: `npm run type-check`
3. **Tests**: `npm test`
4. **Coverage**: `npm run test:coverage`
5. **Build**: `npm run build`

### Performance Monitoring

```yaml
# .github/workflows/performance.yml
- name: Check test execution time
  run: |
    START_TIME=$(date +%s)
    npm test
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))

    if [ $DURATION -gt 300 ]; then
      echo "❌ Test execution time exceeded 5 minutes"
      exit 1
    fi
```

## Pre-commit Hooks

### Configuração Husky

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run lint-staged for staged files
npx lint-staged

# Run type check
npm run type-check

# Run tests for changed files
if git diff --cached --name-only | grep -E '\.(ts|tsx)$' > /dev/null; then
  npm test
fi
```

### Lint-staged

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{js,jsx,css,md}": ["prettier --write"]
  }
}
```

## Debugging de Testes

### Debugging com VS Code

```json
// .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Jest Tests",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Debug de Testes Específicos

```bash
# Executar teste específico
npm test -- --testNamePattern="renderiza o texto da mensagem"

# Executar testes em modo watch
npm run test:watch

# Executar com debugging
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Melhores Práticas

### 1. AAA Pattern (Arrange, Act, Assert)

```typescript
it('adiciona mensagem ao chat', () => {
  // Arrange
  const { result } = renderHook(() => useChat(), { wrapper });

  // Act
  act(() => {
    result.current.actions.addMessage('New message');
  });

  // Assert
  expect(result.current.state.messages).toHaveLength(1);
});
```

### 2. Testes Determinísticos

```typescript
// ✅ Correto - Data fixa
const mockMessage = createMockMessage({
  timestamp: new Date('2025-01-01T12:00:00'),
});

// ❌ Evitar - Data variável
const mockMessage = createMockMessage({
  timestamp: new Date(), // Pode falhar dependendo do momento
});
```

### 3. Isolamento de Testes

```typescript
describe('Component', () => {
  beforeEach(() => {
    // Reset state antes de cada teste
    jest.clearAllMocks();
    localStorage.clear();
  });
});
```

### 4. Testes Legíveis

```typescript
// ✅ Correto - Intenção clara
it('exibe ícone de status para mensagens do usuário', () => {
  const userMessage = createMockMessage({
    sender: 'user',
    status: 'sent'
  });

  renderWithProviders(<MessageBubble message={userMessage} />);

  const statusIcon = document.querySelector('svg');
  expect(statusIcon).toBeInTheDocument();
});

// ❌ Evitar - Muito genérico
it('works correctly', () => {
  // test implementation
});
```

## Troubleshooting

### Problemas Comuns

1. **Testes lentos**: Verificar se há operações assíncronas desnecessárias
2. **Memory leaks**: Usar `cleanup()` após renderizações
3. **Mock issues**: Verificar se mocks estão sendo resetados
4. **Flaky tests**: Usar dados determinísticos e awaits apropriados

### Performance Issues

```typescript
// ✅ Correto - Mock heavy operations
jest.mock('./heavy-utility', () => ({
  expensiveFunction: jest.fn(() => 'mocked result'),
}));

// ✅ Correto - Use fake timers para delays
jest.useFakeTimers();
```

## Métricas de Qualidade

### Success Criteria

- **Test Execution Time**: < 5 minutos para suite completa
- **Coverage**: > 80% para statements, branches, functions, lines
- **CI Pipeline**: < 10 minutos end-to-end
- **Pre-commit Hooks**: < 30 segundos

### Monitoring

- Track test execution time trends
- Monitor coverage trends
- Alert on CI failure rates > 10%
- Monitor hook bypass frequency

---

_Documento mantido por James (Dev) - Atualizado em 22/08/2025_
