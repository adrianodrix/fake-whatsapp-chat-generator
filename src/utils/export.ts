/**
 * Canvas Export Utilities com Performance Monitoring
 * Sistema de export de chat para imagem com monitoramento integrado
 */

import React from 'react';
import html2canvas from 'html2canvas';
import { measureCanvasOperation } from './performance';

export interface ExportOptions {
  format: 'png' | 'jpeg';
  quality?: number; // Para JPEG
  width?: number;
  height?: number;
  pixelRatio?: number;
  backgroundColor?: string;
  onProgress?: (progress: number) => void;
}

export interface ExportResult {
  blob: Blob;
  dataUrl: string;
  duration: number;
  dimensions: { width: number; height: number };
}

/**
 * Classe principal para export de chat
 */
export class ChatExporter {
  private static instance: ChatExporter;

  static getInstance(): ChatExporter {
    if (!ChatExporter.instance) {
      ChatExporter.instance = new ChatExporter();
    }
    return ChatExporter.instance;
  }

  /**
   * Exporta elemento DOM para imagem com performance monitoring
   */
  async exportToImage(
    element: HTMLElement,
    options: ExportOptions = { format: 'png' }
  ): Promise<ExportResult> {
    return measureCanvasOperation('chat_export', () =>
      this.performExport(element, options)
    );
  }

  /**
   * Execução do export usando html2canvas
   */
  private async performExport(
    element: HTMLElement,
    options: ExportOptions
  ): Promise<ExportResult> {
    const startTime = performance.now();

    try {
      // Progress: 10% - Iniciando
      options.onProgress?.(10);

      // Configurar opções do html2canvas
      // const scale = options.pixelRatio || window.devicePixelRatio || 2; // Not used anymore

      // Progress: 30% - Preparando captura
      options.onProgress?.(30);

      // Obter dimensões exatas do elemento sem espaços laterais
      const rect = element.getBoundingClientRect();

      // Para mobile, usar largura fixa de 375px (iPhone padrão)
      // Para desktop, usar largura real mas limitada
      const isMobileWidth = window.innerWidth <= 768;
      const targetWidth = isMobileWidth ? 375 : Math.min(rect.width, 428);
      const actualHeight = element.scrollHeight;

      // Usar html2canvas para capturar o elemento
      const canvas = await html2canvas(element, {
        // scale: scale, // Deprecated - using transform instead
        width: targetWidth,
        height: actualHeight,
        useCORS: true,
        allowTaint: true,
        // backgroundColor: '#E5DDD5', // Background do WhatsApp - not supported
        logging: false,
        // windowWidth: targetWidth, // Not supported in current html2canvas version
        // windowHeight: actualHeight, // Not supported in current html2canvas version
        // onclone: (_clonedDoc: Document, clonedElement: HTMLElement) => {
        //   // Garantir que o clone mantenha as dimensões exatas
        //   if (clonedElement) {
        //     clonedElement.style.margin = '0';
        //     clonedElement.style.padding = '0';
        //     clonedElement.style.width = `${targetWidth}px`;
        //     clonedElement.style.maxWidth = `${targetWidth}px`;

        //     // Remover scrollbars se houver
        //     const messagesArea =
        //       clonedElement.querySelector('.overflow-y-auto');
        //     if (messagesArea instanceof HTMLElement) {
        //       messagesArea.style.overflow = 'hidden';
        //     }

        //     // Ocultar botão de toggle sender (botão verde no MessageInput)
        //     const toggleButton = clonedElement.querySelector(
        //       '[data-sender-toggle]'
        //     );
        //     if (toggleButton instanceof HTMLElement) {
        //       toggleButton.style.display = 'none';
        //     }

        //     // Ocultar texto indicador de sender (texto verde no MessageInput)
        //     const senderIndicator = clonedElement.querySelector(
        //       '[data-sender-indicator]'
        //     );
        //     if (senderIndicator instanceof HTMLElement) {
        //       senderIndicator.style.display = 'none';
        //     }

        //     // Garantir que o nome no header não seja cortado
        //     const headerName = clonedElement.querySelector('.truncate');
        //     if (headerName instanceof HTMLElement) {
        //       headerName.style.overflow = 'visible';
        //       headerName.style.textOverflow = 'initial';
        //       headerName.style.whiteSpace = 'nowrap';
        //     }
        //   }
        // },
      });

      // Progress: 70% - Canvas gerado
      options.onProgress?.(70);

      // Ajustar tamanho se necessário
      let finalCanvas = canvas;
      if (options.width && options.width !== canvas.width) {
        finalCanvas = this.resizeCanvas(canvas, options.width);
      }

      // Progress: 80% - Processamento completo
      options.onProgress?.(80);

      // Gerar blob e data URL
      const { blob, dataUrl } = await this.generateImageData(
        finalCanvas,
        options
      );

      // Progress: 100% - Completo
      options.onProgress?.(100);

      const duration = performance.now() - startTime;

      return {
        blob,
        dataUrl,
        duration,
        dimensions: { width: finalCanvas.width, height: finalCanvas.height },
      };
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }

  /**
   * Redimensiona canvas mantendo proporção e qualidade
   */
  private resizeCanvas(
    originalCanvas: HTMLCanvasElement,
    targetWidth: number
  ): HTMLCanvasElement {
    const aspectRatio = originalCanvas.height / originalCanvas.width;
    const targetHeight = Math.round(targetWidth * aspectRatio);

    const newCanvas = document.createElement('canvas');
    newCanvas.width = targetWidth * 2; // 2x para retina
    newCanvas.height = targetHeight * 2;

    // Definir o tamanho CSS para display correto
    newCanvas.style.width = targetWidth + 'px';
    newCanvas.style.height = targetHeight + 'px';

    const ctx = newCanvas.getContext('2d');
    if (ctx) {
      ctx.scale(2, 2); // Aplicar scale 2x
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      // Desenhar com scale aplicado
      ctx.drawImage(originalCanvas, 0, 0, targetWidth, targetHeight);
    }

    return newCanvas;
  }

  /**
   * Gera blob e data URL a partir do canvas
   */
  private async generateImageData(
    canvas: HTMLCanvasElement,
    options: ExportOptions
  ): Promise<{ blob: Blob; dataUrl: string }> {
    // Criar um novo canvas para remover qualquer espaço em branco extra
    const trimmedCanvas = this.trimCanvas(canvas);

    return new Promise((resolve, reject) => {
      trimmedCanvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Falha ao gerar blob'));
            return;
          }

          const dataUrl = trimmedCanvas.toDataURL(
            `image/${options.format}`,
            options.format === 'jpeg' ? options.quality || 0.9 : undefined
          );

          resolve({ blob, dataUrl });
        },
        `image/${options.format}`,
        options.format === 'jpeg' ? options.quality || 0.9 : undefined
      );
    });
  }

  /**
   * Remove espaços em branco extras do canvas
   */
  private trimCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    let minX = canvas.width;
    let minY = canvas.height;
    let maxX = 0;
    let maxY = 0;

    // Encontrar os limites do conteúdo não-transparente
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4;
        const alpha = pixels[index + 3];

        // Se o pixel tem algum conteúdo (não é totalmente transparente)
        if (alpha > 0) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }

    // Se não encontrou conteúdo, retorna o canvas original
    if (minX > maxX || minY > maxY) {
      return canvas;
    }

    // Criar novo canvas com o tamanho trimado
    const trimmedWidth = maxX - minX + 1;
    const trimmedHeight = maxY - minY + 1;

    const trimmedCanvas = document.createElement('canvas');
    trimmedCanvas.width = trimmedWidth;
    trimmedCanvas.height = trimmedHeight;

    const trimmedCtx = trimmedCanvas.getContext('2d');
    if (trimmedCtx) {
      trimmedCtx.drawImage(
        canvas,
        minX,
        minY,
        trimmedWidth,
        trimmedHeight,
        0,
        0,
        trimmedWidth,
        trimmedHeight
      );
    }

    return trimmedCanvas;
  }

  /**
   * Export rápido para desenvolvimento/testes
   */
  async quickExport(element: HTMLElement): Promise<string> {
    try {
      const result = await this.exportToImage(element, { format: 'png' });
      return result.dataUrl;
    } catch (error) {
      console.error('Quick export failed:', error);
      return '';
    }
  }
}

/**
 * Função de conveniência para export simples
 */
export const exportChatToImage = async (
  element: HTMLElement,
  options?: ExportOptions
): Promise<ExportResult> => {
  const exporter = ChatExporter.getInstance();
  return exporter.exportToImage(element, options);
};

/**
 * Hook React para funcionalidades de export
 */
export const useExport = () => {
  const [isExporting, setIsExporting] = React.useState(false);
  const [lastExport, setLastExport] = React.useState<ExportResult | null>(null);

  const exportChat = React.useCallback(
    async (
      element: HTMLElement,
      options?: ExportOptions
    ): Promise<ExportResult | null> => {
      setIsExporting(true);

      try {
        const result = await exportChatToImage(element, options);
        setLastExport(result);
        return result;
      } catch (error) {
        console.error('Export failed:', error);
        return null;
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  const downloadLastExport = React.useCallback(
    (filename = 'whatsapp-chat.png') => {
      if (!lastExport) return;

      const link = document.createElement('a');
      link.download = filename;
      link.href = lastExport.dataUrl;
      link.click();
    },
    [lastExport]
  );

  return {
    exportChat,
    downloadLastExport,
    isExporting,
    lastExport,
  };
};
