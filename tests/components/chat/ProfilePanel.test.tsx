/**
 * Testes para componente ProfilePanel
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfilePanel } from '../../../src/components/chat/ProfilePanel';
import type { Profile } from '../../../src/types/profile';

// Mock para utilitários
jest.mock('../../../src/utils/validation', () => ({
  validateName: jest.fn((name: string) => ({
    isValid: name.length > 0 && name.length <= 25,
    error:
      name.length === 0
        ? 'Nome é obrigatório.'
        : name.length > 25
          ? 'Nome deve ter no máximo 25 caracteres.'
          : undefined,
  })),
  validateUploadFile: jest.fn(() => ({ isValid: true })),
  sanitizeString: jest.fn((str: string) => str),
}));

jest.mock('../../../src/utils/image-processing', () => ({
  resizeImageToAvatar: jest.fn(() =>
    Promise.resolve({
      dataUrl: 'data:image/jpeg;base64,test',
      processingTime: 50,
    })
  ),
  generateInitialsAvatar: jest.fn(() => 'data:image/jpeg;base64,initials'),
  isCanvasSupported: jest.fn(() => true),
}));

describe('ProfilePanel', () => {
  const mockProfile: Profile = {
    id: 'user',
    name: 'João Silva',
    initials: 'JS',
    isOnline: true,
  };

  const mockOnProfileUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar corretamente', () => {
    render(
      <ProfilePanel
        profile={mockProfile}
        label="Teste"
        onProfileUpdate={mockOnProfileUpdate}
      />
    );

    expect(screen.getByText('Teste')).toBeInTheDocument();
    expect(screen.getByDisplayValue('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Alterar foto')).toBeInTheDocument();
  });

  it('deve mostrar avatar quando perfil tem foto', () => {
    const profileWithAvatar = {
      ...mockProfile,
      avatar: 'data:image/jpeg;base64,test',
    };

    render(
      <ProfilePanel
        profile={profileWithAvatar}
        label="Teste"
        onProfileUpdate={mockOnProfileUpdate}
      />
    );

    expect(screen.getByText('Alterar foto')).toBeInTheDocument();
    expect(screen.getByText('Remover')).toBeInTheDocument();
  });

  it('deve atualizar nome quando usuário digita', async () => {
    const user = userEvent.setup();

    render(
      <ProfilePanel
        profile={mockProfile}
        label="Teste"
        onProfileUpdate={mockOnProfileUpdate}
      />
    );

    const input = screen.getByDisplayValue('João Silva');
    await user.clear(input);
    await user.type(input, 'Maria Santos');

    await waitFor(() => {
      expect(mockOnProfileUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Maria Santos',
          initials: 'MS',
        })
      );
    });
  });

  it('deve mostrar erro para nome inválido', async () => {
    const user = userEvent.setup();

    render(
      <ProfilePanel
        profile={mockProfile}
        label="Teste"
        onProfileUpdate={mockOnProfileUpdate}
      />
    );

    const input = screen.getByDisplayValue('João Silva');
    await user.clear(input);

    await waitFor(() => {
      expect(screen.getByText('Nome é obrigatório.')).toBeInTheDocument();
    });
  });

  it('deve mostrar contador de caracteres', () => {
    render(
      <ProfilePanel
        profile={mockProfile}
        label="Teste"
        onProfileUpdate={mockOnProfileUpdate}
      />
    );

    expect(screen.getByText('10/25 caracteres')).toBeInTheDocument();
  });

  it('deve processar upload de arquivo', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    render(
      <ProfilePanel
        profile={mockProfile}
        label="Teste"
        onProfileUpdate={mockOnProfileUpdate}
      />
    );

    const input = screen.getByRole('button', { name: /alterar foto/i });
    fireEvent.click(input);

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockOnProfileUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          avatar: 'data:image/jpeg;base64,test',
        })
      );
    });
  });

  it('deve remover avatar quando solicitado', () => {
    const profileWithAvatar = {
      ...mockProfile,
      avatar: 'data:image/jpeg;base64,test',
    };

    render(
      <ProfilePanel
        profile={profileWithAvatar}
        label="Teste"
        onProfileUpdate={mockOnProfileUpdate}
      />
    );

    const removeButton = screen.getByText('Remover');
    fireEvent.click(removeButton);

    expect(mockOnProfileUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        avatar: undefined,
      })
    );
  });

  it('deve mostrar aviso quando Canvas não está disponível', async () => {
    const imageProcessing = await import('../../../src/utils/image-processing');
    const mockIsCanvasSupported =
      imageProcessing.isCanvasSupported as jest.MockedFunction<
        typeof imageProcessing.isCanvasSupported
      >;
    mockIsCanvasSupported.mockReturnValue(false);

    render(
      <ProfilePanel
        profile={mockProfile}
        label="Teste"
        onProfileUpdate={mockOnProfileUpdate}
      />
    );

    expect(
      screen.getByText(/redimensionamento não disponível/i)
    ).toBeInTheDocument();
  });

  it('deve mostrar loading durante upload', async () => {
    const imageProcessing = await import('../../../src/utils/image-processing');
    const mockResizeImageToAvatar =
      imageProcessing.resizeImageToAvatar as jest.MockedFunction<
        typeof imageProcessing.resizeImageToAvatar
      >;
    mockResizeImageToAvatar.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () =>
              resolve({
                dataUrl: 'data:image/jpeg;base64,test',
                processingTime: 50,
              }),
            100
          );
        })
    );

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    render(
      <ProfilePanel
        profile={mockProfile}
        label="Teste"
        onProfileUpdate={mockOnProfileUpdate}
      />
    );

    const input = screen.getByRole('button', { name: /alterar foto/i });
    fireEvent.click(input);

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Deve mostrar loading
    await waitFor(() => {
      expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });
  });
});
