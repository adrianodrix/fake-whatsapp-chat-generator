# Story 3.1: High-Quality Image Export - Brownfield Addition

## User Story

**As a** usuário,  
**I want** exportar minha conversa como imagem alta qualidade,  
**So that** posso usá-la em meus projetos e apresentações.

## Story Context

**Existing System Integration:**

- **Integrates with:** ChatContext.messages, todos componentes visuais renderizados
- **Existing Code Base:** Reutilizar `ChatExporter` class em `src/utils/export.ts` que já implementa:
  - Canvas rendering com `exportToImage()` método
  - Hook `useExport()` para integração React
  - Suporte para diferentes formatos (PNG/JPEG) e qualidades
  - Performance monitoring integrado
- **Technology:** Canvas API, HTML5 download, blob processing, Web Workers
- **Follows pattern:** Service utilities pattern da arquitetura
- **Touch points:** ChatExporter service, ExportModal component, ExportButton no ChatHeader, progress indicators

## Acceptance Criteria

### Functional Requirements

1. **Botão export** no ChatHeader (ícone download ao lado do menu de opções)
2. **Conversão Canvas** mantendo qualidade pixel-perfect usando ChatExporter existente
3. **Resolução mínima** 1080px largura garantida (configurável via ExportOptions)

### Integration Requirements

4. **Opções qualidade** Modal com 3 presets:
   - Baixa: JPEG 60% quality, max 800px width
   - Média: JPEG 80% quality, max 1080px width
   - Alta: PNG, min 1440px width
5. **Preview imagem** no modal antes do download com:
   - Thumbnail da imagem gerada
   - Tamanho do arquivo estimado
   - Dimensões finais (largura x altura)
6. **Download automático** nome `whatsapp-chat-${timestamp}.${format}`

### Quality Requirements

7. **Progresso visual** usando ProgressBar component durante geração
8. **Suporte conversas** longas através de virtual scrolling no canvas
9. **Performance otimizada** processamento em Web Worker para não bloquear UI

## Technical Implementation Guide

### Data Structures & Interfaces

```typescript
// src/types/export.types.ts
export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatContainerRef: React.RefObject<HTMLElement>;
}

export interface ExportPreset {
  id: 'low' | 'medium' | 'high';
  label: string;
  format: 'jpeg' | 'png';
  quality?: number;
  maxWidth: number;
  estimatedSize: string; // e.g., "~200KB"
}

export interface ExportModalState {
  selectedPreset: ExportPreset['id'];
  isGenerating: boolean;
  preview: {
    dataUrl: string;
    dimensions: { width: number; height: number };
    fileSize: number;
  } | null;
  error: string | null;
}
```

### Component Integration Flow

1. **ExportButton Component** (`src/components/chat/ExportButton/`)
   - Adicionar ao ChatHeader, entre search e menu buttons
   - OnClick: abre ExportModal
   - Disabled state durante exportação

2. **ExportModal Component** (`src/components/modals/ExportModal/`)
   - Overlay escuro com modal centralizado
   - 3 cards de preset de qualidade (radio buttons)
   - Preview area com loading/thumbnail
   - Botões: "Cancelar" e "Baixar Imagem"

3. **Integration with ChatExporter**

   ```typescript
   // No ExportModal
   const { exportChat, isExporting, lastExport } = useExport();

   const handleGenerate = async () => {
     const options = presetToExportOptions(selectedPreset);
     const result = await exportChat(chatContainerRef.current, options);
     // Update preview state
   };
   ```

### UI/UX Flow Detalhado

1. **Trigger**: Usuário clica no botão export (ícone download) no header
2. **Modal Opens**:
   - Título: "Exportar Conversa"
   - Subtítulo: "Escolha a qualidade da imagem"
3. **Quality Selection**:
   - 3 cards lado a lado (mobile: stacked)
   - Cada card mostra: ícone, título, descrição, tamanho estimado
   - Seleção gera preview automaticamente
4. **Preview Generation**:
   - Loading spinner com texto "Gerando preview..."
   - Mostra thumbnail quando pronto
   - Info: dimensões, tamanho real do arquivo
5. **Download Action**:
   - Botão "Baixar" fica habilitado após preview
   - Click inicia download automático
   - Modal fecha após download iniciar
6. **Error Handling**:
   - Toast notification para erros
   - Botão retry no modal se falhar

## Test Scenarios

### Unit Tests (`src/utils/export.test.ts`)

1. **ChatExporter Core**
   - `exportToImage()` com elemento vazio retorna imagem blank
   - `exportToImage()` com mensagens gera canvas correto
   - Diferentes formatos (PNG/JPEG) geram outputs corretos
   - Quality settings afetam tamanho do arquivo

2. **Export Hook**
   - `useExport()` gerencia estado isExporting corretamente
   - `downloadLastExport()` cria link download com nome correto
   - Error handling quando canvas falha

### Component Tests (`src/components/**/*.test.tsx`)

3. **ExportButton**
   - Renderiza no ChatHeader na posição correta
   - Click abre ExportModal
   - Disabled durante exportação ativa

4. **ExportModal**
   - Renderiza 3 preset cards
   - Seleção de preset atualiza preview
   - Preview mostra loading state
   - Download button habilitado apenas após preview
   - Error state com retry option

### Integration Tests (`tests/integration/export.test.ts`)

5. **Fluxo Completo Export**
   - Conversa vazia: mensagem "Nada para exportar"
   - Conversa com 5 mensagens: export bem-sucedido
   - Conversa com 100+ mensagens: progress bar funciona
   - Diferentes presets geram tamanhos diferentes

### E2E Tests (`tests/e2e/export.spec.ts`)

6. **User Journey**
   - Criar conversa → Export → Download verificado
   - Mobile: modal responsivo, touch gestures
   - Cancelar export não quebra estado
   - Download múltiplos formatos sequencialmente

### Performance Tests

7. **Limites e Edge Cases**
   - Export com 1000+ mensagens não trava browser
   - Memória liberada após export completo
   - Canvas > 10MB handled gracefully
   - Fallback quando WebWorker não disponível

## Definition of Done

- ✅ **Export funcionando** com ChatExporter existente integrado
- ✅ **ExportButton** adicionado ao ChatHeader com ícone apropriado
- ✅ **ExportModal** implementado com 3 presets de qualidade
- ✅ **Preview funcional** com thumbnail, dimensões e tamanho
- ✅ **Download automático** com timestamp no nome do arquivo
- ✅ **Progress indicator** para conversas grandes (>50 mensagens)
- ✅ **Performance** via Web Worker, UI não trava
- ✅ **Testes** cobrindo unit, integration e E2E scenarios
- ✅ **Error handling** com feedback visual e retry
- ✅ **Mobile responsive** modal e interações touch

## Risk and Compatibility Check

**Minimal Risk Assessment:**

- **Primary Risk:** Canvas rendering pode ser lento para conversas longas
- **Mitigation:** Web workers, progressive rendering, progress feedback
- **Rollback:** Export simples sem preview, reduzir qualidade se necessário

**Compatibility Verification:**

- ✅ **No breaking changes:** Feature aditiva, não modifica existente
- ✅ **Database changes:** Preferências export em localStorage apenas
- ✅ **UI changes:** Seguem padrões modal e button estabelecidos
- ✅ **Performance impact:** Isolado em web worker, não afeta UI principal

**Browser Compatibility:**

- Chrome 90+: Full support
- Safari 14+: Canvas toBlob polyfill needed
- Firefox 88+: Full support
- Edge 90+: Full support

---

_Epic 3: Export & Polish_  
_Story 3.1 revisada pelo John (PM) - 22/08/2025_
