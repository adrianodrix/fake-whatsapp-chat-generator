import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MessageEditPopover } from '../../../src/components/chat/MessageEditPopover';
import type { Message } from '../../../src/types/message';

// Mock floating-ui
jest.mock('@floating-ui/react', () => ({
  useFloating: () => ({
    refs: {
      setReference: jest.fn(),
      setFloating: jest.fn(),
    },
    floatingStyles: {},
  }),
  autoUpdate: jest.fn(),
  offset: jest.fn(),
  flip: jest.fn(),
  shift: jest.fn(),
}));

// Mock hooks
jest.mock('../../../src/hooks/useClickOutside', () => ({
  useClickOutside: jest.fn(() => ({ current: null })),
}));

const mockMessage: Message = {
  id: '1',
  text: 'Test message',
  sender: 'user',
  timestamp: new Date('2023-01-01T12:00:00'),
  status: 'sent',
  type: 'text',
  createdAt: new Date('2023-01-01T12:00:00'),
  updatedAt: new Date('2023-01-01T12:00:00'),
};

describe('MessageEditPopover', () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render popover when visible', () => {
    render(
      <MessageEditPopover
        message={mockMessage}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isVisible={true}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test message')).toBeInTheDocument();
    expect(screen.getByDisplayValue('12:00')).toBeInTheDocument();
  });

  it('should not render when not visible', () => {
    render(
      <MessageEditPopover
        message={mockMessage}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isVisible={false}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should call onCancel when close button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <MessageEditPopover
        message={mockMessage}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isVisible={true}
      />
    );

    await user.click(screen.getByLabelText('Fechar'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when Escape is pressed', () => {
    render(
      <MessageEditPopover
        message={mockMessage}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isVisible={true}
      />
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should validate timestamp format', async () => {
    const user = userEvent.setup();

    render(
      <MessageEditPopover
        message={mockMessage}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isVisible={true}
      />
    );

    const timeInput = screen.getByDisplayValue('12:00');

    // Clear and enter invalid time
    await user.clear(timeInput);
    await user.type(timeInput, '25:99');

    await user.click(screen.getByText('Salvar'));

    expect(
      screen.getByText('Horário deve estar no formato HH:MM (ex: 14:30)')
    ).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should validate message text is not empty', async () => {
    const user = userEvent.setup();

    render(
      <MessageEditPopover
        message={mockMessage}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isVisible={true}
      />
    );

    const textArea = screen.getByDisplayValue('Test message');

    // Clear text
    await user.clear(textArea);

    await user.click(screen.getByText('Salvar'));

    expect(
      screen.getByText('Mensagem não pode estar vazia')
    ).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should call onSave with updates when form is valid', async () => {
    const user = userEvent.setup();

    render(
      <MessageEditPopover
        message={mockMessage}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isVisible={true}
      />
    );

    const textArea = screen.getByDisplayValue('Test message');
    const timeInput = screen.getByDisplayValue('12:00');

    await user.clear(textArea);
    await user.type(textArea, 'Updated message');

    await user.clear(timeInput);
    await user.type(timeInput, '14:30');

    await user.click(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        text: 'Updated message',
        timestamp: expect.any(Date),
        status: 'sent',
        updatedAt: expect.any(Date),
      });
    });
  });

  it('should save with Ctrl+Enter shortcut', async () => {
    const user = userEvent.setup();

    render(
      <MessageEditPopover
        message={mockMessage}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isVisible={true}
      />
    );

    const textArea = screen.getByDisplayValue('Test message');

    await user.clear(textArea);
    await user.type(textArea, 'Updated message');

    await user.type(textArea, '{Control>}{Enter}{/Control}');

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalled();
    });
  });

  it('should show status field only for user messages', () => {
    render(
      <MessageEditPopover
        message={mockMessage}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isVisible={true}
      />
    );

    expect(screen.getByLabelText('Status')).toBeInTheDocument();
  });

  it('should not show status field for contact messages', () => {
    const contactMessage = { ...mockMessage, sender: 'contact' as const };

    render(
      <MessageEditPopover
        message={contactMessage}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isVisible={true}
      />
    );

    expect(screen.queryByLabelText('Status')).not.toBeInTheDocument();
  });

  it('should disable save button when submitting', async () => {
    const user = userEvent.setup();

    // Mock onSave to be slow
    let resolvePromise: () => void;
    const slowPromise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
    mockOnSave.mockImplementation(() => slowPromise);

    render(
      <MessageEditPopover
        message={mockMessage}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isVisible={true}
      />
    );

    const saveButton = screen.getByText('Salvar');

    // Start the save process but don't await it
    const clickPromise = user.click(saveButton);

    // Check loading state immediately after click
    await waitFor(() => {
      expect(saveButton).toBeDisabled();
      expect(screen.getByText('Salvando...')).toBeInTheDocument();
    });

    // Resolve the promise to complete the test
    resolvePromise!();
    await clickPromise;
  });

  it('should clear errors when user starts typing', async () => {
    const user = userEvent.setup();

    render(
      <MessageEditPopover
        message={mockMessage}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isVisible={true}
      />
    );

    const timeInput = screen.getByDisplayValue('12:00');

    // Enter invalid time to trigger error
    await user.clear(timeInput);
    await user.type(timeInput, '25:99');
    await user.click(screen.getByText('Salvar'));

    expect(
      screen.getByText('Horário deve estar no formato HH:MM (ex: 14:30)')
    ).toBeInTheDocument();

    // Start typing again should clear error
    await user.clear(timeInput);
    await user.type(timeInput, '1');

    expect(
      screen.queryByText('Horário deve estar no formato HH:MM (ex: 14:30)')
    ).not.toBeInTheDocument();
  });
});
