# Story 2.4: Timestamp & Status Management - Brownfield Addition

## User Story

**As a** usuário,  
**I want** controle total sobre timestamps e status de leitura,  
**So that** posso criar timelines realistas de conversa.

## Story Context

**Existing System Integration:**

- **Integrates with:** Message editing popover, ChatContext.updateMessage, message ordering
- **Technology:** Date/time input controls, validation logic, automatic reordering
- **Follows pattern:** Form controls + validation + Context updates
- **Touch points:** Message.timestamp, Message.status, chronological ordering

## Acceptance Criteria

### Functional Requirements

1. **Date picker** para selecionar dia da mensagem
2. **Time picker** para horário específico (formato 24h)
3. **Opção "agora"** para timestamp atual com um clique

### Integration Requirements

4. **Mensagens reordenam** automaticamente por timestamp
5. **Indicador visual** "dia" quando muda data entre mensagens
6. **Status checks** renderizam corretamente (✓ ✓✓ ✓✓azul)

### Quality Requirements

7. **Lógica impede** status "lido" em horário futuro
8. **Agrupamento visual** mensagens mesmo remetente em sequência
9. **Validação timestamp** com feedback claro de erros

## Technical Notes

- **Integration Approach:** Estender message editing popover, usar validation utilities
- **Existing Pattern Reference:** Form validation pattern da arquitetura
- **Key Constraints:** Ordenação automática, validação lógica temporal

## Definition of Done

- ✅ **Date/time pickers** funcionais no popover
- ✅ **Reordenação automática** por timestamp
- ✅ **Validação status** vs timestamp
- ✅ **Indicadores visuais** mudança de dia
- ✅ **Agrupamento visual** mensagens sequenciais
- ✅ **Feedback validação** claro e útil

## Risk and Compatibility Check

**Minimal Risk Assessment:**

- **Primary Risk:** Reordenação automática pode confundir usuário
- **Mitigation:** Feedback visual claro, opção de desfazer, validação prévia
- **Rollback:** Manter ordem original, permitir reordenação manual

**Compatibility Verification:**

- ✅ **No breaking changes:** Usa Message interface existente
- ✅ **Database changes:** Campos timestamp já existem
- ✅ **UI changes:** Seguem padrões form control estabelecidos
- ✅ **Performance impact:** Reordenação otimizada, validation eficiente

---

## Dev Agent Record

### Tasks Status

- [x] **Date/time pickers** funcionais no popover - ✅ Implementados date e time inputs com validação
- [x] **Reordenação automática** por timestamp - ✅ Implementado no ChatContext.updateMessage
- [x] **Validação status** vs timestamp - ✅ Implementado validateStatusWithTimestamp
- [x] **Indicadores visuais** mudança de dia - ✅ Implementado DateSeparator component
- [x] **Agrupamento visual** mensagens sequenciais - ✅ Implementado grouping metadata no MessageBubble
- [x] **Feedback validação** claro e útil - ✅ Implementado error messages em tempo real

### Debug Log References

- Utilizou message editing popover existente como base
- Integrou com ChatContext.updateMessage para reordering automático
- Criou DateSeparator component para indicar mudanças de dia
- Implementou agrupamento visual baseado em sender e intervalo temporal (<5min)

### File List

**Created:**

- `src/components/chat/DateSeparator/DateSeparator.tsx`
- `src/components/chat/DateSeparator/DateSeparator.types.ts`
- `src/components/chat/DateSeparator/index.ts`
- `src/utils/__tests__/timestamp-validation.test.ts`
- `src/components/chat/DateSeparator/DateSeparator.test.tsx`
- `src/utils/performance-monitor.ts` - Performance monitoring utility for critical operations
- `src/components/ui/DateTimeInput/DateTimeInput.tsx` - Browser-compatible date/time input component
- `src/components/ui/DateTimeInput/index.ts`

**Modified:**

- `src/components/chat/MessageEditPopover/MessageEditPopover.tsx` - Added date picker, "agora" button, temporal validation, DateTimeInput integration
- `src/components/chat/MessageEditPopover/MessageEditPopover.types.ts` - Added date field to form data
- `src/components/chat/ChatContainer/ChatContainer.tsx` - Added date separators and message grouping
- `src/components/chat/MessageBubble/MessageBubble.tsx` - Added visual grouping support
- `src/utils/validation.ts` - Added validateDate, validateStatusWithTimestamp functions
- `src/utils/formatting.ts` - Added formatDateInput, combineDateAndTime, groupMessagesByDate functions with performance monitoring
- `src/types/message.ts` - Added MessageGrouping interface and version field for optimistic locking
- `src/components/chat/index.ts` - Added DateSeparator export
- `src/contexts/ChatContext.tsx` - Implemented atomic reordering, rollback mechanism, optimistic locking, comprehensive temporal validation
- `tests/components/chat/MessageEditPopover.test.tsx` - Updated tests for new functionality and browser compatibility

### Completion Notes

- Implementação completa das funcionalidades de timestamp e status management
- Date/time pickers funcionais com validação temporal e browser compatibility fallbacks
- Reordenação automática funcional via ChatContext com atomic operations e rollback
- Indicadores visuais de mudança de dia implementados
- Agrupamento visual de mensagens sequenciais implementado com performance monitoring
- Validação de status vs timestamp impedindo lógica inconsistente
- Optimistic locking implementado para prevenir concurrent modification conflicts
- Performance monitoring adicionado para operações críticas
- Comprehensive temporal validation implementada em múltiplas camadas
- Testes criados e corrigidos para validar nova funcionalidade
- Todos os riscos críticos identificados no QA assessment foram mitigados

### Change Log

- 22/08/2025 - Implementação completa das features de timestamp & status management por James (Developer)
- Adicionado date picker, time picker e botão "agora" no popover
- Implementada validação temporal para status "lido"
- Criado sistema de separadores de data e agrupamento visual
- Integrado com reordenação automática existente
- 22/08/2025 - Aplicação de correções QA baseadas em risk assessment por Claude (AI Assistant)
- Implementado atomic message reordering com rollback capability (TECH-001)
- Adicionado comprehensive temporal validation no ChatContext (DATA-001)
- Implementado optimistic locking para concurrent updates (DATA-002)
- Adicionado performance monitoring para message grouping (PERF-001)
- Criado DateTimeInput component com browser compatibility fallbacks (TECH-002)
- Corrigidos testes falhos de validação e timeout

### Status

✅ **Ready for Done** - QA fixes aplicadas, riscos críticos mitigados

---

_Epic 2: Message Management & Editing_  
_Story 2.4 criada pelo John (PM) - 21/08/2025_
