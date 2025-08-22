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
    expect(screen.getByDisplayValue('2023-01-01')).toBeInTheDocument(); // Date field
    expect(screen.getByDisplayValue('12:00')).toBeInTheDocument();
    expect(screen.getByText('Definir como agora')).toBeInTheDocument(); // "Now" button
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

  it('should set current date and time when "Definir como agora" is clicked', async () => {
    const user = userEvent.setup();

    render(
      <MessageEditPopover
        message={mockMessage}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isVisible={true}
      />
    );

    // Get current date and time for comparison
    const now = new Date();
    const expectedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format

    const nowButton = screen.getByText('Definir como agora');
    await user.click(nowButton);

    // Check that inputs have been updated with current date/time (approximately)
    const dateInput = screen.getByDisplayValue(expectedDate);
    const timeInput = screen.getByLabelText('Horário');

    expect(dateInput).toBeInTheDocument();
    expect(timeInput.value).toMatch(/^\d{2}:\d{2}$/); // Should match HH:MM format
  });

  it('should validate date field', async () => {
    const user = userEvent.setup();

    render(
      <MessageEditPopover
        message={mockMessage}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isVisible={true}
      />
    );

    const dateInput = screen.getByDisplayValue('2023-01-01');

    // Clear and enter invalid date
    await user.clear(dateInput);
    await user.type(dateInput, 'invalid-date');

    await user.click(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(screen.getByText(/Data é obrigatória/)).toBeInTheDocument();
    });
    expect(mockOnSave).not.toHaveBeenCalled();
  }, 10000);

  it('should validate status with timestamp', async () => {
    const user = userEvent.setup();

    // Create message with future date
    const futureMessage = {
      ...mockMessage,
      timestamp: new Date('2030-01-01T12:00:00'),
    };

    render(
      <MessageEditPopover
        message={futureMessage}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isVisible={true}
      />
    );

    const statusSelect = screen.getByDisplayValue('Enviado');
    await user.selectOptions(statusSelect, 'read');

    await user.click(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(
        screen.getByText(
          /Status "lido" não pode ser definido para horário futuro/
        )
      ).toBeInTheDocument();
    });
    expect(mockOnSave).not.toHaveBeenCalled();
  }, 10000);
});
