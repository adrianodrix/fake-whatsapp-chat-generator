# Epic 2: Message Management & Editing

**Goal:** Implementar o sistema completo de criação e edição de mensagens com a revolucionária edição inline, alternância rápida de remetentes e controle total sobre timestamps e status. Este épico transforma a interface estática em uma ferramenta funcional de criação de conversas.

## Story 2.1: Message Creation Flow

**As a** user,
**I want** to create new messages quickly using the input field,
**so that** I can build conversations efficiently.

### Acceptance Criteria

1: Campo de input funcional que adiciona mensagem ao pressionar Enter
2: Shift+Enter cria nova linha dentro da mensagem
3: Mensagem é adicionada com timestamp atual por padrão
4: Novo remetente alterna automaticamente após enviar (configurável)
5: Input é limpo após envio bem-sucedido
6: Botão de envio visível em mobile, oculto em desktop
7: Contador de caracteres aparece após 1000 caracteres
8: Suporte para copiar/colar texto com formatação preservada

## Story 2.2: Inline Message Editing

**As a** user,
**I want** to edit messages directly by clicking on them,
**so that** I can make quick adjustments without disrupting my workflow.

### Acceptance Criteria

1: Hover em desktop mostra botão de edição sutil
2: Long press em mobile ativa modo de edição
3: Popover aparece com campos para texto, hora e status
4: Mudanças são aplicadas em tempo real (sem save button)
5: ESC ou clicar fora cancela edição
6: Timestamp editável com validação de formato (HH:MM)
7: Seletor de status com as 3 opções (enviado, entregue, lido)
8: Animação suave de entrada/saída do popover

## Story 2.3: Advanced Sender Features & Mobile Gestures

**As a** user,
**I want** advanced sender switching capabilities with mobile gestures,
**so that** I can create conversations more efficiently on all devices.

### Acceptance Criteria

1: Swipe gestures na área do input para alternar remetente
2: Long press no botão toggle para configurações rápidas
3: Haptic feedback em dispositivos compatíveis (opcional)
4: Auto-toggle preference configurável e persistida
5: Configuração de shortcuts personalizáveis pelo usuário
6: Visual themes para diferentes senders (cores personalizáveis)
7: Enhanced testing para touch interactions
8: Performance monitoring para gestures
9: Accessibility improvements para screen readers

**Note:** Basic toggle functionality (Tab key, visual button, sender indicator) already implemented in Story 2.1

## Story 2.4: Timestamp & Status Management

**As a** user,
**I want** full control over message timestamps and read status,
**so that** I can create realistic conversation timelines.

### Acceptance Criteria

1: Date picker para selecionar dia da mensagem
2: Time picker para horário específico (formato 24h)
3: Opção "agora" para timestamp atual
4: Mensagens reordenam automaticamente por timestamp
5: Indicador visual de "dia" quando muda a data entre mensagens
6: Status checks renderizam corretamente (✓ ✓✓ ✓✓azul)
7: Lógica impede status "lido" em horário futuro
8: Agrupamento visual de mensagens do mesmo remetente em sequência
