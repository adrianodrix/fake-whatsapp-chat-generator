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
2. **Long press mobile** ativa modo edição
3. **Popover aparece** com campos texto, hora e status editáveis

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
- **Existing Pattern Reference:** Component editing pattern da arquitetura
- **Key Constraints:** Performance durante edição, UX sem interrupções

## Definition of Done

- ✅ **Hover/long press** ativando edição
- ✅ **Popover inline** com campos funcionais
- ✅ **Tempo real updates** via Context
- ✅ **Validação** timestamp e feedback
- ✅ **Animações suaves** entrada/saída
- ✅ **Keyboard accessibility** completa

## Risk and Compatibility Check

**Minimal Risk Assessment:**
- **Primary Risk:** Popover positioning pode ser complexo em mobile
- **Mitigation:** CSS positioning robusto, fallbacks para diferentes screens
- **Rollback:** Modal editing como fallback, popover pode ser desabilitado

**Compatibility Verification:**
- ✅ **No breaking changes:** Extensão MessageBubble component apenas
- ✅ **Database changes:** Usa updateMessage action existente
- ✅ **UI changes:** Seguem padrões editing estabelecidos
- ✅ **Performance impact:** Otimizado com event delegation

---

*Epic 2: Message Management & Editing*  
*Story 2.2 criada pelo John (PM) - 21/08/2025*