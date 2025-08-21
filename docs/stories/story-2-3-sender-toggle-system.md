# Story 2.3: Sender Toggle System - Brownfield Addition

## User Story

**As a** usuário,  
**I want** alternar rapidamente entre remetentes criando mensagens,  
**So that** posso criar fluxos naturais de conversa.

## Story Context

**Existing System Integration:**
- **Integrates with:** ChatContext.activeSender, MessageInput component, keyboard handling
- **Technology:** React useEffect para shortcuts, CSS transitions para feedback
- **Follows pattern:** Context actions + keyboard shortcuts pattern
- **Touch points:** ChatContext.toggleSender action, visual indicators, mobile gestures

## Acceptance Criteria

### Functional Requirements
1. **Botão flutuante** aparece ao lado input em desktop
2. **Tab alterna** remetentes (atalho teclado) mantendo texto input
3. **Indicador visual** mostra remetente ativo atual claramente

### Integration Requirements
4. **Última mensagem** mostra indicador de quem enviará próxima
5. **Toggle mantém** texto digitado no input preservado
6. **Integração ChatContext** usando toggleSender action existente

### Quality Requirements
7. **Swipe gesture** mobile para alternar (opcional nice-to-have)
8. **Feedback visual** imediato na mudança (animação 200ms)
9. **Preferência auto-alternância** configurável e persistida

## Technical Notes

- **Integration Approach:** Usar ChatContext.toggleSender, keyboard event listeners
- **Existing Pattern Reference:** Keyboard shortcuts pattern da arquitetura
- **Key Constraints:** Performance gestures, feedback visual imediato

## Definition of Done

- ✅ **Tab shortcut** funcionando para toggle
- ✅ **Botão flutuante** desktop com visual clear
- ✅ **Indicador visual** remetente ativo
- ✅ **Texto input** preservado durante toggle
- ✅ **Animação feedback** 200ms suave
- ✅ **Mobile gestures** implementados ou documentados

## Risk and Compatibility Check

**Minimal Risk Assessment:**
- **Primary Risk:** Keyboard shortcuts podem conflitar com browser/OS
- **Mitigation:** Usar shortcuts não conflitantes, permitir customização
- **Rollback:** Usar apenas botão visual, remover shortcuts

**Compatibility Verification:**
- ✅ **No breaking changes:** Usa ChatContext state existente
- ✅ **Database changes:** Preferências em localStorage apenas
- ✅ **UI changes:** Seguem padrões visual feedback estabelecidos
- ✅ **Performance impact:** Minimal, apenas event listeners

---

*Epic 2: Message Management & Editing*  
*Story 2.3 criada pelo John (PM) - 21/08/2025*