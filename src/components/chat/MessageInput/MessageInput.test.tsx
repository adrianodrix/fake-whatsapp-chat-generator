import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MessageInput } from './MessageInput';
import type { MessageInputProps } from './MessageInput.types';

// Mock dos hooks
jest.mock('../../../hooks/useDebounce', () => ({
  useDebounce: (value: string) => value,
}));

jest.mock('../../../hooks/useIsMobile', () => ({
  useIsMobile: () => false,
}));

describe('MessageInput', () => {
  const defaultProps: MessageInputProps = {
    value: '',
    onChange: jest.fn(),
    onSend: jest.fn(),
    onSenderToggle: jest.fn(),
    activeSender: 'user',
    disabled: false,
    placeholder: 'Digite uma mensagem',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente', () => {
    render(<MessageInput {...defaultProps} />);

    const textarea = screen.getByPlaceholderText('Digite uma mensagem');
    expect(textarea).toBeInTheDocument();
  });

  it('chama onChange quando o texto é digitado', async () => {
    const onChange = jest.fn();
    render(<MessageInput {...defaultProps} onChange={onChange} />);

    const textarea = screen.getByPlaceholderText('Digite uma mensagem');
    await userEvent.type(textarea, 'Olá');

    // userEvent.type chama onChange para cada caractere digitado
    expect(onChange).toHaveBeenCalledTimes(3);
    // Como onChange recebe e.target.value, cada chamada recebe o caractere individual
    expect(onChange).toHaveBeenCalledWith('O');
    expect(onChange).toHaveBeenCalledWith('l');
    expect(onChange).toHaveBeenCalledWith('á');
  });

  it('envia mensagem ao pressionar Enter', () => {
    const onSend = jest.fn();
    render(<MessageInput {...defaultProps} value="Teste" onSend={onSend} />);

    const textarea = screen.getByPlaceholderText('Digite uma mensagem');
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

    expect(onSend).toHaveBeenCalled();
  });

  it('não envia mensagem ao pressionar Shift+Enter', () => {
    const onSend = jest.fn();
    render(<MessageInput {...defaultProps} value="Teste" onSend={onSend} />);

    const textarea = screen.getByPlaceholderText('Digite uma mensagem');
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });

    expect(onSend).not.toHaveBeenCalled();
  });

  it('alterna remetente ao pressionar Tab', () => {
    const onSenderToggle = jest.fn();
    render(<MessageInput {...defaultProps} onSenderToggle={onSenderToggle} />);

    const textarea = screen.getByPlaceholderText('Digite uma mensagem');
    fireEvent.keyDown(textarea, { key: 'Tab' });

    expect(onSenderToggle).toHaveBeenCalled();
  });

  it('mostra contador de caracteres após 1000 caracteres', () => {
    const longText = 'a'.repeat(1001);
    render(<MessageInput {...defaultProps} value={longText} />);

    expect(screen.getByText('1001/4096')).toBeInTheDocument();
  });

  it('não mostra contador para textos curtos', () => {
    render(<MessageInput {...defaultProps} value="Texto curto" />);

    expect(screen.queryByText(/\/4096/)).not.toBeInTheDocument();
  });

  it('mostra erro de validação para mensagens muito longas', async () => {
    const longText = 'a'.repeat(4097);
    render(<MessageInput {...defaultProps} value={longText} />);

    await waitFor(() => {
      expect(screen.getByText(/muito longa/i)).toBeInTheDocument();
    });
  });

  it('desabilita envio quando há erro de validação', async () => {
    const longText = 'a'.repeat(4097);
    const onSend = jest.fn();
    render(<MessageInput {...defaultProps} value={longText} onSend={onSend} />);

    const textarea = screen.getByPlaceholderText('Digite uma mensagem');
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

    expect(onSend).not.toHaveBeenCalled();
  });

  it('mostra indicador do remetente ativo', () => {
    render(<MessageInput {...defaultProps} activeSender="user" />);
    expect(screen.getByText(/Enviando como: Você/)).toBeInTheDocument();

    render(<MessageInput {...defaultProps} activeSender="contact" />);
    expect(screen.getByText(/Enviando como: Contato/)).toBeInTheDocument();
  });

  it('desabilita todos os controles quando disabled=true', () => {
    render(<MessageInput {...defaultProps} disabled={true} value="Teste" />);

    const textarea = screen.getByPlaceholderText('Digite uma mensagem');
    expect(textarea).toBeDisabled();

    // Botão de envio deve estar desabilitado
    const sendButton = screen.getByLabelText('Enviar mensagem');
    expect(sendButton).toBeDisabled();
  });

  it('botão de envio funciona ao clicar', () => {
    const onSend = jest.fn();
    render(<MessageInput {...defaultProps} value="Teste" onSend={onSend} />);

    const sendButton = screen.getByLabelText('Enviar mensagem');
    fireEvent.click(sendButton);

    expect(onSend).toHaveBeenCalled();
  });

  it('não envia mensagem vazia', () => {
    const onSend = jest.fn();
    render(<MessageInput {...defaultProps} value="   " onSend={onSend} />);

    const textarea = screen.getByPlaceholderText('Digite uma mensagem');
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

    expect(onSend).not.toHaveBeenCalled();
  });
});
