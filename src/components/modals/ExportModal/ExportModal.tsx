import React, { memo, useState, useCallback, useEffect } from 'react';
import type { ExportModalProps } from './ExportModal.types';
import type { ExportModalState, ExportPreset } from '@/types/export.types';
import { EXPORT_PRESETS } from '@/types/export.types';
import { useExport } from '@/utils/export';
import type { ExportOptions } from '@/utils/export';

/**
 * Modal para exportar conversa como imagem com diferentes qualidades
 */
export const ExportModal: React.FC<ExportModalProps> = memo(
  ({ isOpen, onClose }) => {
    const { exportChat } = useExport();

    const [state, setState] = useState<ExportModalState>({
      selectedPreset: 'medium',
      isGenerating: false,
      preview: null,
      error: null,
    });

    // Limpar estado ao fechar
    useEffect(() => {
      if (!isOpen) {
        setState({
          selectedPreset: 'medium',
          isGenerating: false,
          preview: null,
          error: null,
        });
      }
    }, [isOpen]);

    // Converter preset para opções do ChatExporter
    const presetToExportOptions = (
      presetId: ExportPreset['id']
    ): ExportOptions => {
      const preset = EXPORT_PRESETS.find((p) => p.id === presetId)!;

      // Para alta qualidade, não redimensionar se já estiver no tamanho certo
      const chatElement = document.getElementById('chat-container');
      const currentWidth = chatElement?.offsetWidth || 0;
      const shouldResize = currentWidth > preset.maxWidth;

      return {
        format: preset.format,
        quality: preset.quality,
        width: shouldResize ? preset.maxWidth : undefined,
        pixelRatio: 2, // Sempre usar 2x para qualidade retina
      };
    };

    // Gerar preview quando preset muda
    const handlePresetChange = useCallback(
      async (presetId: ExportPreset['id']) => {
        setState((prev) => ({
          ...prev,
          selectedPreset: presetId,
          error: null,
        }));

        // Buscar o elemento completo do chat (incluindo header e input)
        const chatElement = document.getElementById('chat-container');
        if (!chatElement) {
          setState((prev) => ({
            ...prev,
            error: 'Elemento do chat não encontrado',
          }));
          return;
        }

        setState((prev) => ({ ...prev, isGenerating: true }));

        try {
          const options = presetToExportOptions(presetId);
          const result = await exportChat(chatElement as HTMLElement, options);

          if (result) {
            setState((prev) => ({
              ...prev,
              preview: {
                dataUrl: result.dataUrl,
                dimensions: result.dimensions,
                fileSize: result.blob.size,
              },
              isGenerating: false,
            }));
          }
        } catch {
          setState((prev) => ({
            ...prev,
            error: 'Erro ao gerar preview',
            isGenerating: false,
          }));
        }
      },
      [exportChat]
    );

    // Gerar preview inicial ao abrir
    useEffect(() => {
      if (isOpen) {
        // Pequeno delay para garantir que o modal está renderizado
        setTimeout(() => {
          handlePresetChange(state.selectedPreset);
        }, 100);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    // Download da imagem
    const handleDownload = useCallback(() => {
      if (!state.preview) return;

      const preset = EXPORT_PRESETS.find((p) => p.id === state.selectedPreset)!;
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, '-')
        .slice(0, -5);
      const filename = `whatsapp-chat-${timestamp}.${preset.format}`;

      const link = document.createElement('a');
      link.download = filename;
      link.href = state.preview.dataUrl;
      link.click();

      onClose();
    }, [state.preview, state.selectedPreset, onClose]);

    // Formatar tamanho de arquivo
    const formatFileSize = (bytes: number): string => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Exportar Conversa
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Escolha a qualidade da imagem
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Quality Presets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {EXPORT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetChange(preset.id)}
                  className={`
                    p-4 rounded-lg border-2 text-left transition-all
                    ${
                      state.selectedPreset === preset.id
                        ? 'border-wa-primary bg-wa-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  disabled={state.isGenerating}
                >
                  <div className="font-medium text-gray-900">
                    {preset.label}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {preset.description}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    {preset.format.toUpperCase()} • {preset.estimatedSize}
                  </div>
                </button>
              ))}
            </div>

            {/* Preview Area */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium text-gray-900 mb-3">Preview</h3>

              {state.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {state.error}
                  <button
                    onClick={() => handlePresetChange(state.selectedPreset)}
                    className="ml-2 underline"
                  >
                    Tentar novamente
                  </button>
                </div>
              )}

              {state.isGenerating && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wa-primary"></div>
                  <p className="mt-3 text-sm text-gray-500">
                    Gerando preview...
                  </p>
                </div>
              )}

              {state.preview && !state.isGenerating && (
                <div>
                  <div className="mb-3 max-h-64 overflow-auto bg-white rounded border">
                    <img
                      src={state.preview.dataUrl}
                      alt="Preview da conversa"
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      Dimensões: {state.preview.dimensions.width} ×{' '}
                      {state.preview.dimensions.height}px
                    </span>
                    <span>
                      Tamanho: {formatFileSize(state.preview.fileSize)}
                    </span>
                  </div>
                </div>
              )}

              {!state.preview && !state.isGenerating && !state.error && (
                <div className="py-8 text-center text-gray-500">
                  Selecione uma qualidade para gerar o preview
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleDownload}
              disabled={!state.preview || state.isGenerating}
              className="px-4 py-2 bg-wa-primary text-white rounded-lg hover:bg-wa-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Baixar Imagem
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ExportModal.displayName = 'ExportModal';
