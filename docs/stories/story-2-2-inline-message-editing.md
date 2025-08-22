# Story 2.2: Inline Message Editing - Brownfield Addition

## User Story

**As a** usuário,  
**I want** editar mensagens diretamente clicando nelas,  
**So that** posso fazer ajustes rápidos sem interromper meu fluxo.

## Story Context

**Existing System Integration:**

- **Integrates with:** MessageBubble component, ChatContext.updateMessage action
- **Technology:** React useState para editing state, CSS positioning para popover
- **Follows pattern:** Component extension com event handlers
- **Touch points:** ChatContext.isEditing state, useChat hook, keyboard navigation

## Acceptance Criteria

### Functional Requirements

1. **Hover desktop** mostra botão edição sutil
   - Implementar no MessageBubble com opacity transition
   - Ícone de lápis usando Icon component existente
2. **Long press mobile** ativa modo edição
   - Usar hook useLongPress com 500ms threshold
   - Feedback háptico se disponível
3. **Popover aparece** com campos texto, hora e status editáveis
   - Posicionamento via Floating UI
   - Campos: textarea para texto, input time para hora, select para status

### Integration Requirements

4. **Mudanças tempo real** aplicadas via ChatContext.updateMessage
5. **ESC ou click fora** cancela edição mantendo estado original
6. **Validação timestamp** formato HH:MM com feedback visual

### Quality Requirements

7. **Seletor status** com 3 opções (enviado, entregue, lido)
8. **Animação suave** entrada/saída popover (200ms)
9. **Keyboard navigation** completa com Tab/Enter/Esc

## Technical Notes

- **Integration Approach:** Estender MessageBubble, usar ChatContext.updateMessage existente
- **Pattern Reference:** Ver `src/components/ui/Modal` para padrão de overlay similar
- **Library**: Floating UI para posicionamento do popover
- **Mobile Detection**: Usar hook useIsMobile existente (Story 2.1)
- **Key Constraints:** Performance durante edição, UX sem interrupções
- **Validation**: Reutilizar utils/validation.ts para timestamp

## Technical Implementation Details

### Files to Modify/Create

```typescript
// Arquivos para modificar
src/components/chat/MessageBubble/MessageBubble.tsx       // Adicionar trigger de edição
src/components/chat/MessageBubble/MessageBubble.types.ts  // Props para onEdit
src/contexts/ChatContext.tsx                              // Estado editingMessageId

// Arquivos para criar
src/components/chat/MessageEditPopover/
├── MessageEditPopover.tsx                               // Componente principal
├── MessageEditPopover.types.ts                          // Types e interfaces
└── index.ts                                             // Barrel export

src/hooks/useClickOutside.ts                            // Hook para detectar cliques fora
src/hooks/useLongPress.ts                               // Hook para long press mobile
```

### Library Choice

**Popover Implementation**: Usar **Floating UI** (@floating-ui/react)

- Justificativa: Leve, sem dependências extras, posicionamento robusto
- Alternativa considerada: Radix UI (mais pesado para apenas popover)

### State Structure

```typescript
// Adicionar ao ChatContext
interface EditingState {
  messageId: string | null;
  position?: { x: number; y: number };
  originalMessage?: Message;
}

// Hook para gerenciar edição
const useMessageEdit = () => {
  const { state, actions } = useChat();
  const [editingState, setEditingState] = useState<EditingState>({
    messageId: null,
  });

  const startEdit = (messageId: string, position: DOMRect) => {
    const message = state.messages.find((m) => m.id === messageId);
    setEditingState({
      messageId,
      position: { x: position.x, y: position.y },
      originalMessage: message,
    });
  };

  const cancelEdit = () => {
    setEditingState({ messageId: null });
  };

  const saveEdit = (updates: Partial<Message>) => {
    if (editingState.messageId) {
      actions.updateMessage(editingState.messageId, updates);
      cancelEdit();
    }
  };

  return { editingState, startEdit, cancelEdit, saveEdit };
};
```

### Component Pattern Example

```typescript
// MessageEditPopover.tsx pattern
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/react';

export const MessageEditPopover: React.FC<Props> = ({
  message,
  onSave,
  onCancel,
  anchorEl
}) => {
  const [text, setText] = useState(message.text);
  const [time, setTime] = useState(formatTime(message.timestamp));
  const [status, setStatus] = useState(message.status);

  const { refs, floatingStyles } = useFloating({
    placement: 'top',
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  // Validação de timestamp
  const validateTime = (timeStr: string): boolean => {
    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(timeStr);
  };

  return (
    <div ref={refs.setFloating} style={floatingStyles} className="popover">
      {/* Implementação do formulário */}
    </div>
  );
};
```

## Definition of Done

- ✅ **Hover/long press** ativando edição
- ✅ **Popover inline** com campos funcionais
- ✅ **Tempo real updates** via Context
- ✅ **Validação** timestamp e feedback
- ✅ **Animações suaves** entrada/saída
- ✅ **Keyboard accessibility** completa
- ✅ **Testes unitários** com >80% cobertura
- ✅ **Testes E2E** para fluxos principais
- ✅ **Floating UI** instalado e configurado
- ✅ **Documentação** de hooks criados

## Testing Approach

### Unit Tests

```typescript
// src/components/chat/MessageEditPopover/MessageEditPopover.test.tsx
- Renderização do popover com dados corretos
- Validação de timestamp (formato HH:MM)
- Cancelamento com ESC key
- Salvamento com mudanças aplicadas

// src/hooks/useClickOutside.test.ts
- Detecção de cliques fora do elemento
- Não dispara em cliques dentro

// src/hooks/useLongPress.test.ts
- Ativação após 500ms
- Cancelamento se soltar antes
```

### Integration Tests

```typescript
// tests/integration/message-editing.test.tsx
- Fluxo completo de edição de mensagem
- Integração com ChatContext
- Reordenação após mudança de timestamp
```

### E2E Tests

```typescript
// tests/e2e/inline-editing.spec.ts
- Cenário: Editar texto da mensagem
- Cenário: Mudar timestamp e verificar reordenação
- Cenário: Cancelar edição com ESC
- Cenário: Mobile long press activation
```

## Risk and Compatibility Check

**Minimal Risk Assessment:**

- **Primary Risk:** Popover positioning pode ser complexo em mobile
- **Mitigation:** Floating UI com fallbacks automáticos para diferentes screens
- **Rollback:** Modal editing como fallback, popover pode ser desabilitado

**Compatibility Verification:**

- ✅ **No breaking changes:** Extensão MessageBubble component apenas
- ✅ **Database changes:** Usa updateMessage action existente
- ✅ **UI changes:** Seguem padrões editing estabelecidos
- ✅ **Performance impact:** Otimizado com event delegation

---

_Epic 2: Message Management & Editing_  
_Story 2.2 criada pelo John (PM) - 21/08/2025_
_Story 2.2 revisada pelo John (PM) - 22/08/2025_
