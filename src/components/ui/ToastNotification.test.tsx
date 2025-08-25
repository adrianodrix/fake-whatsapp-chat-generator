import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastNotification } from './ToastNotification';

describe('ToastNotification', () => {
  const mockOnClose = jest.fn();

  const defaultProps = {
    id: 'test-toast-1',
    message: 'Test message',
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders the toast message', () => {
    render(<ToastNotification {...defaultProps} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders with correct type styling', () => {
    const { rerender } = render(
      <ToastNotification {...defaultProps} type="success" />
    );
    expect(screen.getByRole('alert')).toHaveClass('bg-green-50');

    rerender(<ToastNotification {...defaultProps} type="error" />);
    expect(screen.getByRole('alert')).toHaveClass('bg-red-50');

    rerender(<ToastNotification {...defaultProps} type="warning" />);
    expect(screen.getByRole('alert')).toHaveClass('bg-yellow-50');

    rerender(<ToastNotification {...defaultProps} type="info" />);
    expect(screen.getByRole('alert')).toHaveClass('bg-blue-50');
  });

  it('calls onClose when close button is clicked', () => {
    render(<ToastNotification {...defaultProps} />);

    const closeButton = screen.getByLabelText('Fechar notificação');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledWith('test-toast-1');
  });

  it('auto-dismisses after specified duration', () => {
    render(<ToastNotification {...defaultProps} duration={3000} />);

    expect(mockOnClose).not.toHaveBeenCalled();

    jest.advanceTimersByTime(3000);

    expect(mockOnClose).toHaveBeenCalledWith('test-toast-1');
  });

  it('does not auto-dismiss when duration is 0', () => {
    render(<ToastNotification {...defaultProps} duration={0} />);

    jest.advanceTimersByTime(10000);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('has proper ARIA attributes', () => {
    render(<ToastNotification {...defaultProps} />);

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  it('cleans up timer on unmount', () => {
    const { unmount } = render(
      <ToastNotification {...defaultProps} duration={5000} />
    );

    jest.advanceTimersByTime(2000);
    unmount();
    jest.advanceTimersByTime(3000);

    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
