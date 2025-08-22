/**
 * Canvas Export Utilities com Performance Monitoring
 * Sistema de export de chat para imagem com monitoramento integrado
 */

import React from 'react';
import { measureCanvasOperation } from './performance';

export interface ExportOptions {
  format: 'png' | 'jpeg';
  quality?: number; // Para JPEG
  width?: number;
  height?: number;
  pixelRatio?: number;
  backgroundColor?: string;
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
   * Execução do export (sem monitoring para usar como fallback)
   */
  private async performExport(
    element: HTMLElement,
    options: ExportOptions
  ): Promise<ExportResult> {
    const startTime = performance.now();

    try {
      // Criar canvas com dimensões baseadas no elemento
      const canvas = this.createCanvas(element, options);
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Não foi possível criar contexto 2D do canvas');
      }

      // Configurar canvas
      this.setupCanvas(ctx, canvas, options);

      // Renderizar elemento no canvas
      await this.renderElementToCanvas(ctx, element, canvas);

      // Gerar blob e data URL
      const { blob, dataUrl } = await this.generateImageData(canvas, options);

      const duration = performance.now() - startTime;

      return {
        blob,
        dataUrl,
        duration,
        dimensions: { width: canvas.width, height: canvas.height },
      };
    } catch (error) {
      // Log error mas não quebrar a aplicação
      console.error('Export failed:', error);
      throw error;
    }
  }

  /**
   * Cria canvas com dimensões adequadas
   */
  private createCanvas(
    element: HTMLElement,
    options: ExportOptions
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const rect = element.getBoundingClientRect();
    const pixelRatio = options.pixelRatio || window.devicePixelRatio || 1;

    // Dimensões baseadas no elemento ou opções
    const width = options.width || rect.width;
    const height = options.height || rect.height;

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    return canvas;
  }

  /**
   * Configura canvas com background e scaling
   */
  private setupCanvas(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    options: ExportOptions
  ): void {
    const pixelRatio = options.pixelRatio || window.devicePixelRatio || 1;

    // Configurar scaling para alta resolução
    ctx.scale(pixelRatio, pixelRatio);

    // Configurar qualidade
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Background color
    const bgColor = options.backgroundColor || '#E5DDD5'; // WhatsApp chat background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width / pixelRatio, canvas.height / pixelRatio);
  }

  /**
   * Renderiza elemento DOM no canvas usando html2canvas-like approach
   */
  private async renderElementToCanvas(
    ctx: CanvasRenderingContext2D,
    element: HTMLElement,
    canvas: HTMLCanvasElement
  ): Promise<void> {
    // Para MVP, usar uma abordagem simplificada
    // Em produção, isso seria substituído por html2canvas ou similar

    return new Promise((resolve) => {
      // Capturar estilos computados
      // const computedStyle = window.getComputedStyle(element);

      // Para esta implementação MVP, vamos usar foreign object (quando suportado)
      if (this.supportsForeignObject()) {
        this.renderViaSVGForeignObject(ctx, element, canvas, resolve);
      } else {
        // Fallback: renderização manual básica
        this.renderManually(ctx, element, resolve);
      }
    });
  }

  /**
   * Verifica suporte para SVG foreignObject
   */
  private supportsForeignObject(): boolean {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const foreignObject = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'foreignObject'
    );
    svg.appendChild(foreignObject);

    return typeof foreignObject.appendChild === 'function';
  }

  /**
   * Renderiza usando SVG foreignObject (método mais preciso)
   */
  private renderViaSVGForeignObject(
    ctx: CanvasRenderingContext2D,
    element: HTMLElement,
    canvas: HTMLCanvasElement,
    onComplete: () => void
  ): void {
    const rect = element.getBoundingClientRect();
    // const pixelRatio = window.devicePixelRatio || 1;

    // Criar SVG com foreignObject
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${rect.width}" height="${rect.height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="width: ${rect.width}px; height: ${rect.height}px;">
            ${element.outerHTML}
          </div>
        </foreignObject>
      </svg>
    `;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      onComplete();
    };

    img.onerror = () => {
      console.warn('SVG foreignObject failed, using manual rendering');
      this.renderManually(ctx, element, onComplete);
    };

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    img.src = URL.createObjectURL(blob);
  }

  /**
   * Renderização manual básica (fallback)
   */
  private renderManually(
    ctx: CanvasRenderingContext2D,
    element: HTMLElement,
    onComplete: () => void
  ): void {
    // Implementação básica - apenas renderizar texto das mensagens
    const messages = element.querySelectorAll('[data-message-text]');
    let y = 20;

    ctx.font = '14px Arial, sans-serif';
    ctx.fillStyle = '#000000';

    messages.forEach((msg) => {
      const text = msg.textContent || '';
      const isUser = msg.closest('[data-sender="user"]') !== null;

      ctx.fillStyle = isUser ? '#DCF8C6' : '#FFFFFF';
      ctx.fillRect(isUser ? 200 : 20, y, 200, 40);

      ctx.fillStyle = '#000000';
      ctx.fillText(text, isUser ? 210 : 30, y + 25);

      y += 50;
    });

    onComplete();
  }

  /**
   * Gera blob e data URL a partir do canvas
   */
  private async generateImageData(
    canvas: HTMLCanvasElement,
    options: ExportOptions
  ): Promise<{ blob: Blob; dataUrl: string }> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Falha ao gerar blob'));
            return;
          }

          const dataUrl = canvas.toDataURL(
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
