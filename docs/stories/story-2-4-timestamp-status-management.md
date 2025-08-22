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

*Epic 2: Message Management & Editing*  
*Story 2.4 criada pelo John (PM) - 21/08/2025*