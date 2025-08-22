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

## Dev Agent Record

### Tasks Completed

- [x] Instalar dependency @floating-ui/react
- [x] Criar hook useClickOutside para detecção de cliques fora
- [x] Criar hook useLongPress para mobile touch handling
- [x] Criar componente Icon reutilizável
- [x] Implementar componente MessageEditPopover completo
- [x] Modificar MessageBubble para adicionar triggers de edição
- [x] Modificar ChatContainer para integrar popover
- [x] Adicionar validação de timestamp em utils/validation.ts
- [x] Implementar hook useMessageEdit para state management
- [x] Criar testes unitários para hooks (13 testes)
- [x] Criar testes para MessageEditPopover (12 testes)
- [x] Criar testes de integração (4 testes)
- [x] Criar testes E2E (8 cenários)
- [x] Executar validações de tipo e lint

### Agent Model Used

Claude Sonnet 4 (claude-sonnet-4-20250514)

### File List

#### Files Created:

- `src/hooks/useClickOutside.ts` - Hook para detectar cliques fora de elemento
- `src/hooks/useLongPress.ts` - Hook para long press em mobile
- `src/hooks/useMessageEdit.ts` - Hook para gerenciar estado de edição
- `src/hooks/index.ts` - Barrel exports para hooks
- `src/components/ui/Icon/Icon.tsx` - Componente de ícone reutilizável
- `src/components/ui/Icon/Icon.types.ts` - Types para Icon component
- `src/components/ui/Icon/index.ts` - Export para Icon
- `src/components/chat/MessageEditPopover/MessageEditPopover.tsx` - Componente principal de edição
- `src/components/chat/MessageEditPopover/MessageEditPopover.types.ts` - Types para popover
- `src/components/chat/MessageEditPopover/index.ts` - Export para popover
- `src/utils/formatting.ts` - Utilitários de formatação de data/hora
- `tests/hooks/useClickOutside.test.ts` - Testes para useClickOutside (5 testes)
- `tests/hooks/useLongPress.test.ts` - Testes para useLongPress (8 testes)
- `tests/components/chat/MessageEditPopover.test.tsx` - Testes para popover (12 testes)
- `tests/components/chat/MessageBubble-linebreaks.test.tsx` - Testes para quebras de linha (4 testes)
- `tests/integration/message-editing.test.tsx` - Testes de integração (4 testes)
- `tests/e2e/inline-editing.spec.ts` - Testes E2E (8 cenários)

#### Files Modified:

- `src/components/ui/index.ts` - Added Icon exports
- `src/components/chat/index.ts` - Added MessageEditPopover exports
- `src/components/chat/MessageBubble/MessageBubble.tsx` - Added edit triggers and hover state
- `src/components/chat/ChatContainer/ChatContainer.tsx` - Integrated editing functionality
- `src/utils/validation.ts` - Added validateTime function
- `src/hooks/index.ts` - Added new hook exports
- `vite.config.ts` - Added path aliases configuration
- `package.json` - Added @floating-ui/react dependency

### Completion Notes

- ✅ Todos os acceptance criteria foram implementados
- ✅ Funcionalidade testada com >80% cobertura
- ✅ Integration with existing ChatContext mantida
- ✅ Mobile e desktop behaviors funcionando
- ✅ Keyboard accessibility implementada
- ✅ Validação robusta de inputs
- ✅ Error handling apropriado
- ✅ Performance otimizada com memoization

### Change Log

- **22/08/2025**: Story implementation completa
  - Floating UI integration para positioning robusto
  - Hook composition pattern para interactions complexas
  - Comprehensive testing strategy com unit, integration, e E2E
  - Full accessibility support com keyboard navigation
  - Responsive design para mobile e desktop
- **22/08/2025**: Bug fixes aplicados
  - Fix: Path aliases configuration no vite.config.ts
  - Fix: Barrel export hooks corrigido para incluir apenas hooks existentes
  - Fix: ESLint warnings removidos com tipos específicos
  - Fix: Line breaks preservation em mensagens com classe whitespace-pre-wrap

### Status

**Ready for Review**

---

_Epic 2: Message Management & Editing_  
_Story 2.2 criada pelo John (PM) - 21/08/2025_
_Story 2.2 revisada pelo John (PM) - 22/08/2025_
_Story 2.2 implementada pelo James (Dev) - 22/08/2025_

## QA Results

### Review Date: 2025-08-22

### Reviewed By: Quinn (Test Architect)

### Code Quality Assessment

Exemplary implementation demonstrating excellent React architecture patterns. The code shows:

- **Proper separation of concerns** with dedicated hooks (useMessageEdit, useClickOutside, useLongPress)
- **Robust error handling** with comprehensive validation and user feedback
- **Accessibility compliance** with ARIA labels, keyboard navigation, and focus management
- **Performance optimization** using React.memo, proper cleanup, and efficient state updates
- **Type safety** with comprehensive TypeScript interfaces and proper error boundaries

### Refactoring Performed

No refactoring was necessary - the implementation already follows best practices with clean architecture and proper patterns.

### Compliance Check

- Coding Standards: ✓ Excellent compliance with TypeScript patterns, component structure, and naming conventions
- Project Structure: ✓ Perfect adherence to component organization and file structure
- Testing Strategy: ✓ Comprehensive test coverage across unit, integration, and E2E levels
- All ACs Met: ✓ All 9 acceptance criteria fully implemented and validated

### Requirements Traceability

**AC 1 (Hover desktop):** ✓ Implemented with opacity transition and proper event handling

- Tests: MessageBubble hover state, edit button visibility

**AC 2 (Long press mobile):** ✓ 500ms threshold with haptic feedback

- Tests: useLongPress hook covers activation, cancellation, and timeout scenarios

**AC 3 (Popover editing):** ✓ Floating UI integration with text/time/status fields

- Tests: MessageEditPopover comprehensive form testing

**AC 4 (Real-time updates):** ✓ ChatContext.updateMessage with message reordering

- Tests: Integration tests verify context updates and message reordering

**AC 5 (ESC/click outside):** ✓ Proper event handling with state preservation

- Tests: ESC key cancellation and click outside behavior

**AC 6 (Timestamp validation):** ✓ HH:MM validation with visual feedback

- Tests: validateTime function and error display validation

**AC 7 (Status selector):** ✓ Three-option select for user messages only

- Tests: Status field rendering and value updates

**AC 8 (Smooth animations):** ✓ 200ms transitions with CSS classes

- Tests: Animation classes and transitions verified

**AC 9 (Keyboard navigation):** ✓ Complete Tab/Enter/ESC support with Ctrl+Enter save

- Tests: Keyboard event handling and navigation

### Security Review

**Input Validation:** All user inputs properly validated with specific error messages
**XSS Prevention:** Text content safely handled through React's built-in protection
**State Management:** No security vulnerabilities in state handling or persistence
**User Messages:** Proper validation prevents malformed message injection

### Performance Considerations

**Component Optimization:** MessageEditPopover uses React.memo for efficient re-renders  
**Event Management:** Proper cleanup of event listeners prevents memory leaks
**State Updates:** Efficient state batching and minimal re-renders
**Bundle Size:** Floating UI adds minimal overhead compared to heavier alternatives

### Test Architecture Excellence

**Coverage Metrics:**

- MessageEditPopover: 93.33% statements, 89.13% branches
- Integration Tests: 4 comprehensive scenarios covering full workflows
- Hook Tests: 13 unit tests for useClickOutside/useLongPress
- E2E Tests: 8 scenarios covering desktop/mobile interactions

**Test Quality:** Excellent use of testing patterns with proper mocking, async handling, and edge case coverage

### Gate Status

Gate: **PASS** → docs/qa/gates/2.2-inline-message-editing.yml

### Recommended Status

✓ **Ready for Done** - Implementation exceeds quality expectations with comprehensive testing and excellent architecture patterns.
