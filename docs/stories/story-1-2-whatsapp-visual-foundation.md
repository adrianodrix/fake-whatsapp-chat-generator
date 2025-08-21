# Story 1.2: WhatsApp Visual Foundation - Brownfield Addition

## User Story

**As a** usuário,  
**I want** ver uma interface autêntica do WhatsApp chat,  
**So that** os mockups que criar sejam indistinguíveis de screenshots reais.

## Story Context

**Existing System Integration:**
- **Integrates with:** Tailwind CSS configuration, component structure base
- **Technology:** Tailwind CSS com tokens wa-*, React functional components
- **Follows pattern:** Estrutura de componentes /ui e /chat definida
- **Touch points:** tailwind.config.js, CSS tokens, component exports

## Acceptance Criteria

### Functional Requirements
1. **Header do chat renderizado** com cor #075E54 e altura de 60px
2. **Background chat** com cor #E5DDD5 e pattern de fundo autêntico
3. **Mensagens exemplo** mostrando bolhas verde (#DCF8C6) e branca com styling correto

### Integration Requirements
4. **Fonte Helvetica Neue** ou system font apropriada aplicada
5. **Layout responsivo** adaptando para mobile (< 768px) e desktop
6. **Tokens wa-*** funcionando em toda aplicação via Tailwind

### Quality Requirements
7. **Timestamps e checks** renderizados com cores e tamanhos corretos
8. **Área de input inferior** com ícones de emoji, anexo e microfone
9. **Visual pixel-perfect** comparado com WhatsApp real

## Technical Notes

- **Integration Approach:** Estender Tailwind config com tokens, criar componentes base
- **Existing Pattern Reference:** Estrutura definida em docs/ui-architecture.md
- **Key Constraints:** Visual deve ser indistinguível do WhatsApp real

## Definition of Done

- ✅ **Interface visual** replicando WhatsApp com precisão
- ✅ **Componentes base** (Header, MessageBubble, Input) funcionando
- ✅ **Tokens wa-*** configurados** e funcionando no Tailwind
- ✅ **Responsividade** funcionando em mobile e desktop
- ✅ **Exemplo de mensagens** renderizando corretamente
- ✅ **Performance 60fps** mantida durante navegação

## Risk and Compatibility Check

**Minimal Risk Assessment:**
- **Primary Risk:** Diferenças visuais podem comprometer autenticidade
- **Mitigation:** Usar screenshots reais como referência, testes visuais
- **Rollback:** Reverter tokens CSS, usar styling básico temporário

**Compatibility Verification:**
- ✅ **No breaking changes:** Adição de tokens CSS apenas
- ✅ **Database changes:** Não aplicável
- ✅ **UI changes:** Seguem design tokens establecidos
- ✅ **Performance impact:** CSS otimizado para performance

---

*Epic 1: Foundation & Core Chat Interface*  
*Story 1.2 criada pelo John (PM) - 21/08/2025*