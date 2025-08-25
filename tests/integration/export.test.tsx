import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { ChatExporter } from '@/utils/export';

describe('Export Integration Tests', () => {
  const mockProfiles = {
    user: { id: '1', name: 'User', avatar: '', phone: '+123456789' },
    contact: { id: '2', name: 'Contact', avatar: '', phone: '+987654321' },
  };

  describe('Fluxo Completo de Export', () => {
    it('mostra mensagem quando conversa está vazia', async () => {
      render(
        <ChatContainer
          messages={[]}
          profiles={mockProfiles}
          activeSender="user"
          inputValue=""
          onInputChange={() => {}}
          onSendMessage={() => {}}
          onSenderToggle={() => {}}
        />
      );

      // Abrir modal de export
      const exportButton = screen.getByRole('button', {
        name: /exportar conversa/i,
      });
      fireEvent.click(exportButton);

      await waitFor(() => {
        expect(screen.getByText(/nada para exportar/i)).toBeInTheDocument();
      });
    });

    it('exporta conversa com 5 mensagens com sucesso', async () => {
      const messages = Array.from({ length: 5 }, (_, i) => ({
        id: `msg-${i}`,
        text: `Mensagem ${i + 1}`,
        sender: (i % 2 === 0 ? 'user' : 'contact') as 'user' | 'contact',
        timestamp: new Date(),
        status: 'read' as const,
        type: 'text' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      render(
        <ChatContainer
          messages={messages}
          profiles={mockProfiles}
          activeSender="user"
          inputValue=""
          onInputChange={() => {}}
          onSendMessage={() => {}}
          onSenderToggle={() => {}}
        />
      );

      // Abrir modal
      const exportButton = screen.getByRole('button', {
        name: /exportar conversa/i,
      });
      fireEvent.click(exportButton);

      // Aguardar modal abrir
      await waitFor(() => {
        expect(screen.getByText('Exportar Conversa')).toBeInTheDocument();
      });

      // Selecionar qualidade média
      const mediumQuality = screen
        .getByText('Média Qualidade')
        .closest('button');
      fireEvent.click(mediumQuality!);

      // Aguardar preview
      await waitFor(
        () => {
          expect(
            screen.getByAltText('Preview da conversa')
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Verificar dimensões
      expect(screen.getByText(/1080.*px/)).toBeInTheDocument();
    });

    it('mostra progress bar para conversas com 100+ mensagens', async () => {
      const messages = Array.from({ length: 100 }, (_, i) => ({
        id: `msg-${i}`,
        text: `Mensagem ${i + 1}`,
        sender: (i % 2 === 0 ? 'user' : 'contact') as 'user' | 'contact',
        timestamp: new Date(),
        status: 'read' as const,
        type: 'text' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const { container } = render(
        <ChatContainer
          messages={messages}
          profiles={mockProfiles}
          activeSender="user"
          inputValue=""
          onInputChange={() => {}}
          onSendMessage={() => {}}
          onSenderToggle={() => {}}
        />
      );

      // Abrir modal
      const exportButton = screen.getByRole('button', {
        name: /exportar conversa/i,
      });
      fireEvent.click(exportButton);

      // Aguardar loading
      await waitFor(() => {
        expect(screen.getByText('Gerando preview...')).toBeInTheDocument();
      });

      // Verificar se progress é mostrado
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('gera diferentes tamanhos de arquivo para diferentes presets', async () => {
      const messages = Array.from({ length: 10 }, (_, i) => ({
        id: `msg-${i}`,
        text: `Mensagem ${i + 1}`,
        sender: 'user' as const,
        timestamp: new Date(),
        status: 'read' as const,
        type: 'text' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      render(
        <ChatContainer
          messages={messages}
          profiles={mockProfiles}
          activeSender="user"
          inputValue=""
          onInputChange={() => {}}
          onSendMessage={() => {}}
          onSenderToggle={() => {}}
        />
      );

      // Abrir modal
      const exportButton = screen.getByRole('button', {
        name: /exportar conversa/i,
      });
      fireEvent.click(exportButton);

      // Testar preset baixa qualidade
      const lowQuality = screen.getByText('Baixa Qualidade').closest('button');
      fireEvent.click(lowQuality!);

      await waitFor(() => {
        const fileSizeText = screen.getByText(/Tamanho:/);
        expect(fileSizeText).toBeInTheDocument();
      });

      // Testar preset alta qualidade
      const highQuality = screen.getByText('Alta Qualidade').closest('button');
      fireEvent.click(highQuality!);

      await waitFor(() => {
        expect(screen.getByText(/PNG/)).toBeInTheDocument();
      });
    });
  });

  describe('ChatExporter Service', () => {
    let exporter: ChatExporter;

    beforeEach(() => {
      exporter = ChatExporter.getInstance();
    });

    it('exporta elemento vazio retorna imagem em branco', async () => {
      const element = document.createElement('div');
      const result = await exporter.exportToImage(element, { format: 'png' });

      expect(result.blob).toBeInstanceOf(Blob);
      expect(result.dataUrl).toContain('data:image/png');
      expect(result.dimensions.width).toBeGreaterThan(0);
      expect(result.dimensions.height).toBeGreaterThan(0);
    });

    it('diferentes formatos geram outputs corretos', async () => {
      const element = document.createElement('div');
      element.textContent = 'Test content';

      // Test PNG
      const pngResult = await exporter.exportToImage(element, {
        format: 'png',
      });
      expect(pngResult.dataUrl).toContain('data:image/png');

      // Test JPEG
      const jpegResult = await exporter.exportToImage(element, {
        format: 'jpeg',
        quality: 0.8,
      });
      expect(jpegResult.dataUrl).toContain('data:image/jpeg');
    });

    it('quality settings afetam tamanho do arquivo', async () => {
      const element = document.createElement('div');
      element.innerHTML = '<p>Test content with some text</p>'.repeat(10);

      const lowQuality = await exporter.exportToImage(element, {
        format: 'jpeg',
        quality: 0.3,
      });

      const highQuality = await exporter.exportToImage(element, {
        format: 'jpeg',
        quality: 1.0,
      });

      expect(lowQuality.blob.size).toBeLessThan(highQuality.blob.size);
    });

    it('progress callback é chamado durante export', async () => {
      const element = document.createElement('div');
      const progressValues: number[] = [];

      await exporter.exportToImage(element, {
        format: 'png',
        onProgress: (progress) => progressValues.push(progress),
      });

      expect(progressValues).toContain(10);
      expect(progressValues).toContain(30);
      expect(progressValues).toContain(50);
      expect(progressValues).toContain(80);
      expect(progressValues).toContain(100);
    });
  });
});
