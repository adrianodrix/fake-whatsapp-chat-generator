import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HelpOverlay } from './HelpOverlay';

describe('HelpOverlay', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when closed', () => {
    const { container } = render(
      <HelpOverlay isOpen={false} onClose={mockOnClose} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the overlay when open', () => {
    render(<HelpOverlay isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Atalhos de Teclado')).toBeInTheDocument();
  });

  it('displays all keyboard shortcuts', () => {
    render(<HelpOverlay isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Mostrar esta ajuda')).toBeInTheDocument();
    expect(screen.getByText('Limpar conversa')).toBeInTheDocument();
    expect(screen.getByText('Nova mensagem')).toBeInTheDocument();
    expect(
      screen.getByText('Alternar entre remetente e destinatário')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Exportar conversa como imagem')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Carregar conversa de demonstração')
    ).toBeInTheDocument();
    expect(screen.getByText('Fechar modais e overlays')).toBeInTheDocument();
  });

  it('displays keyboard shortcut keys', () => {
    render(<HelpOverlay isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('?')).toBeInTheDocument();
    expect(screen.getByText('Ctrl + Shift + Delete')).toBeInTheDocument();
    expect(screen.getByText('Ctrl + N')).toBeInTheDocument();
    expect(screen.getByText('Tab')).toBeInTheDocument();
    expect(screen.getByText('Ctrl + E')).toBeInTheDocument();
    expect(screen.getByText('Ctrl + D')).toBeInTheDocument();
    expect(screen.getByText('Escape')).toBeInTheDocument();
  });

  it('displays additional tips', () => {
    render(<HelpOverlay isOpen={true} onClose={mockOnClose} />);

    expect(
      screen.getByText(/Clique em qualquer mensagem para editá-la inline/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Arraste e solte imagens para adicionar fotos de perfil/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Use o botão de toggle para alternar rapidamente o remetente/
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Todas as conversas são salvas automaticamente no navegador/
      )
    ).toBeInTheDocument();
  });

  it('closes when close button is clicked', () => {
    render(<HelpOverlay isOpen={true} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText('Fechar ajuda');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('closes when clicking outside the modal', () => {
    render(<HelpOverlay isOpen={true} onClose={mockOnClose} />);

    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking inside the modal content', () => {
    render(<HelpOverlay isOpen={true} onClose={mockOnClose} />);

    const modalContent = screen.getByText('Atalhos de Teclado');
    fireEvent.click(modalContent);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('closes when Escape key is pressed', () => {
    render(<HelpOverlay isOpen={true} onClose={mockOnClose} />);

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('has proper ARIA attributes', () => {
    render(<HelpOverlay isOpen={true} onClose={mockOnClose} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'help-title');
  });

  it('removes event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(
      <HelpOverlay isOpen={true} onClose={mockOnClose} />
    );
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    );
    removeEventListenerSpy.mockRestore();
  });
});
