/**
 * Testes de integração simplificados para funcionalidade de export
 * Foco em verificar a integração básica sem complexidade desnecessária
 */

import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../test-utils/providers';
import { ChatContainer } from '@/components/chat/ChatContainer';

describe('Export Integration - Testes Simplificados', () => {
  const mockProfiles = {
    user: { id: 'user', name: 'User', initials: 'U', isOnline: true },
    contact: { id: 'contact', name: 'Contact', initials: 'C', isOnline: true },
  };

  const mockHandlers = {
    onInputChange: jest.fn(),
    onSendMessage: jest.fn(),
    onSenderToggle: jest.fn(),
    onProfileEdit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('UI Integration', () => {
    it('renderiza botão de export no header', () => {
      render(
        <ChatContainer
          messages={[]}
          profiles={mockProfiles}
          activeSender="user"
          inputValue=""
          {...mockHandlers}
        />,
        { initialMessages: [], initialProfiles: mockProfiles }
      );

      const exportButton = screen.getByRole('button', {
        name: /exportar conversa/i,
      });
      expect(exportButton).toBeInTheDocument();
    });

    it('abre modal de export quando botão é clicado', () => {
      render(
        <ChatContainer
          messages={[]}
          profiles={mockProfiles}
          activeSender="user"
          inputValue=""
          {...mockHandlers}
        />,
        { initialMessages: [], initialProfiles: mockProfiles }
      );

      const exportButton = screen.getByRole('button', {
        name: /exportar conversa/i,
      });

      fireEvent.click(exportButton);

      // Verificar se modal abriu (procurando elementos típicos do modal)
      expect(screen.getByText(/exportar conversa/i)).toBeInTheDocument();
    });

    it('modal contém os presets de qualidade', () => {
      render(
        <ChatContainer
          messages={[]}
          profiles={mockProfiles}
          activeSender="user"
          inputValue=""
          {...mockHandlers}
        />,
        { initialMessages: [], initialProfiles: mockProfiles }
      );

      const exportButton = screen.getByRole('button', {
        name: /exportar conversa/i,
      });

      fireEvent.click(exportButton);

      // Verificar se os presets estão presentes
      expect(screen.getByText(/baixa qualidade/i)).toBeInTheDocument();
      expect(screen.getByText(/média qualidade/i)).toBeInTheDocument();
      expect(screen.getByText(/alta qualidade/i)).toBeInTheDocument();
    });

    it('modal contém botões de ação', () => {
      render(
        <ChatContainer
          messages={[]}
          profiles={mockProfiles}
          activeSender="user"
          inputValue=""
          {...mockHandlers}
        />,
        { initialMessages: [], initialProfiles: mockProfiles }
      );

      const exportButton = screen.getByRole('button', {
        name: /exportar conversa/i,
      });

      fireEvent.click(exportButton);

      // Verificar botões do modal
      expect(
        screen.getByRole('button', { name: /cancelar/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /baixar imagem/i })
      ).toBeInTheDocument();
    });

    it('fecha modal quando botão cancelar é clicado', () => {
      render(
        <ChatContainer
          messages={[]}
          profiles={mockProfiles}
          activeSender="user"
          inputValue=""
          {...mockHandlers}
        />,
        { initialMessages: [], initialProfiles: mockProfiles }
      );

      const exportButton = screen.getByRole('button', {
        name: /exportar conversa/i,
      });

      fireEvent.click(exportButton);

      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      fireEvent.click(cancelButton);

      // Modal deve ter fechado - não devemos encontrar mais os presets
      expect(screen.queryByText(/baixa qualidade/i)).not.toBeInTheDocument();
    });
  });

  describe('Comportamento com Mensagens', () => {
    const sampleMessages = [
      {
        id: '1',
        text: 'Mensagem de teste',
        sender: 'user' as const,
        timestamp: new Date(),
        status: 'read' as const,
        type: 'text' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('renderiza mensagens no chat antes do export', () => {
      render(
        <ChatContainer
          messages={sampleMessages}
          profiles={mockProfiles}
          activeSender="user"
          inputValue=""
          {...mockHandlers}
        />,
        { initialMessages: sampleMessages, initialProfiles: mockProfiles }
      );

      expect(screen.getByText('Mensagem de teste')).toBeInTheDocument();
    });

    it('mantém mensagens visíveis quando modal é aberto', () => {
      render(
        <ChatContainer
          messages={sampleMessages}
          profiles={mockProfiles}
          activeSender="user"
          inputValue=""
          {...mockHandlers}
        />,
        { initialMessages: sampleMessages, initialProfiles: mockProfiles }
      );

      const exportButton = screen.getByRole('button', {
        name: /exportar conversa/i,
      });

      fireEvent.click(exportButton);

      // Mensagem ainda deve estar visível
      expect(screen.getByText('Mensagem de teste')).toBeInTheDocument();

      // E modal também deve estar aberto
      expect(screen.getByText(/exportar conversa/i)).toBeInTheDocument();
    });
  });
});
