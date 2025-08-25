import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExportModal } from './ExportModal';
import { EXPORT_PRESETS } from '@/types';

// Mock do hook useExport
jest.mock('@/utils/export', () => ({
  useExport: () => ({
    exportChat: jest.fn().mockResolvedValue({
      blob: new Blob(['test'], { type: 'image/png' }),
      dataUrl: 'data:image/png;base64,test',
      dimensions: { width: 1080, height: 1920 },
      duration: 100,
    }),
    isExporting: false,
  }),
}));

describe('ExportModal', () => {
  const mockOnClose = jest.fn();
  const mockChatContainerRef = React.createRef<HTMLElement>();

  beforeEach(() => {
    mockOnClose.mockClear();
    // Criar elemento mock para o ref
    Object.defineProperty(mockChatContainerRef, 'current', {
      value: document.createElement('div'),
      writable: true,
    });
  });

  it('não renderiza quando isOpen é false', () => {
    render(
      <ExportModal
        isOpen={false}
        onClose={mockOnClose}
        chatContainerRef={mockChatContainerRef}
      />
    );

    expect(screen.queryByText('Exportar Conversa')).not.toBeInTheDocument();
  });

  it('renderiza o modal quando isOpen é true', () => {
    render(
      <ExportModal
        isOpen={true}
        onClose={mockOnClose}
        chatContainerRef={mockChatContainerRef}
      />
    );

    expect(screen.getByText('Exportar Conversa')).toBeInTheDocument();
    expect(
      screen.getByText('Escolha a qualidade da imagem')
    ).toBeInTheDocument();
  });

  it('renderiza todos os presets de qualidade', () => {
    render(
      <ExportModal
        isOpen={true}
        onClose={mockOnClose}
        chatContainerRef={mockChatContainerRef}
      />
    );

    EXPORT_PRESETS.forEach((preset) => {
      expect(screen.getByText(preset.label)).toBeInTheDocument();
      expect(screen.getByText(preset.description)).toBeInTheDocument();
    });
  });

  it('seleciona preset médio por padrão', () => {
    render(
      <ExportModal
        isOpen={true}
        onClose={mockOnClose}
        chatContainerRef={mockChatContainerRef}
      />
    );

    const mediumButton = screen.getByText('Média Qualidade').closest('button');
    expect(mediumButton).toHaveClass('border-wa-primary');
  });

  it('muda seleção ao clicar em outro preset', async () => {
    render(
      <ExportModal
        isOpen={true}
        onClose={mockOnClose}
        chatContainerRef={mockChatContainerRef}
      />
    );

    const highButton = screen.getByText('Alta Qualidade').closest('button');
    fireEvent.click(highButton!);

    await waitFor(() => {
      expect(highButton).toHaveClass('border-wa-primary');
    });
  });

  it('chama onClose ao clicar em Cancelar', () => {
    render(
      <ExportModal
        isOpen={true}
        onClose={mockOnClose}
        chatContainerRef={mockChatContainerRef}
      />
    );

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('mostra loading durante geração de preview', async () => {
    render(
      <ExportModal
        isOpen={true}
        onClose={mockOnClose}
        chatContainerRef={mockChatContainerRef}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Gerando preview...')).toBeInTheDocument();
    });
  });

  it('desabilita botão Baixar quando não há preview', () => {
    // Mock sem preview
    jest.mock('@/utils/export', () => ({
      useExport: () => ({
        exportChat: jest.fn().mockResolvedValue(null),
        isExporting: false,
      }),
    }));

    render(
      <ExportModal
        isOpen={true}
        onClose={mockOnClose}
        chatContainerRef={mockChatContainerRef}
      />
    );

    const downloadButton = screen.getByText('Baixar Imagem');
    expect(downloadButton).toBeDisabled();
  });

  it('formata tamanho de arquivo corretamente', async () => {
    render(
      <ExportModal
        isOpen={true}
        onClose={mockOnClose}
        chatContainerRef={mockChatContainerRef}
      />
    );

    await waitFor(() => {
      // O componente deve mostrar o tamanho formatado
      const fileSizeRegex = /Tamanho:.*KB|MB|B/;
      expect(screen.getByText(fileSizeRegex)).toBeInTheDocument();
    });
  });

  it('mostra dimensões da imagem no preview', async () => {
    render(
      <ExportModal
        isOpen={true}
        onClose={mockOnClose}
        chatContainerRef={mockChatContainerRef}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/1080 × 1920px/)).toBeInTheDocument();
    });
  });

  it('mostra erro quando chatContainerRef não está disponível', async () => {
    const emptyRef = React.createRef<HTMLElement>();

    render(
      <ExportModal
        isOpen={true}
        onClose={mockOnClose}
        chatContainerRef={emptyRef}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Elemento do chat não encontrado/)
      ).toBeInTheDocument();
    });
  });

  it('permite retry após erro', async () => {
    const emptyRef = React.createRef<HTMLElement>();

    render(
      <ExportModal
        isOpen={true}
        onClose={mockOnClose}
        chatContainerRef={emptyRef}
      />
    );

    await waitFor(() => {
      const retryButton = screen.getByText('Tentar novamente');
      expect(retryButton).toBeInTheDocument();
    });
  });
});
