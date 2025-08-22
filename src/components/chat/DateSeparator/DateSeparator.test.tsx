import { render, screen } from '@testing-library/react';
import { DateSeparator } from './DateSeparator';

// Mock the formatting functions
jest.mock('@/utils/formatting', () => ({
  formatDateTime: jest.fn((date: Date) => date.toLocaleDateString('pt-BR')),
  isToday: jest.fn((date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }),
}));

describe('DateSeparator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock current date for consistent testing
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-08-22T12:00:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders date separator with formatted date', () => {
    const testDate = new Date('2025-08-20T14:30:00');
    render(<DateSeparator date={testDate} />);

    expect(screen.getByText('20/08/2025')).toBeInTheDocument();
  });

  it('displays "Hoje" for today\'s date', async () => {
    const today = new Date('2025-08-22T14:30:00');

    // Mock isToday to return true
    const formattingModule = await import('@/utils/formatting');
    (formattingModule.isToday as jest.Mock).mockReturnValue(true);

    render(<DateSeparator date={today} />);

    expect(screen.getByText('Hoje')).toBeInTheDocument();
  });

  it('displays "Ontem" for yesterday\'s date', async () => {
    const yesterday = new Date('2025-08-21T14:30:00'); // One day before mocked "today"

    // Mock isToday to return false (not today)
    const formattingModule = await import('@/utils/formatting');
    (formattingModule.isToday as jest.Mock).mockReturnValue(false);

    render(<DateSeparator date={yesterday} />);

    expect(screen.getByText('Ontem')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const testDate = new Date('2025-08-20T14:30:00');
    const { container } = render(<DateSeparator date={testDate} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass(
      'flex',
      'items-center',
      'justify-center',
      'py-2',
      'mx-auto'
    );

    const badge = wrapper.firstElementChild as HTMLElement;
    expect(badge).toHaveClass(
      'bg-wa-bg-pattern/80',
      'backdrop-blur-sm',
      'px-3',
      'py-1',
      'rounded-full',
      'shadow-sm'
    );

    const text = badge.firstElementChild as HTMLElement;
    expect(text).toHaveClass(
      'text-xs',
      'text-wa-text-secondary',
      'font-medium'
    );
  });

  it('has correct display name', () => {
    expect(DateSeparator.displayName).toBe('DateSeparator');
  });

  it('handles edge case dates correctly', async () => {
    // Test with a date at year boundary
    const newYearDate = new Date('2026-01-01T00:00:00');

    const formattingModule = await import('@/utils/formatting');
    (formattingModule.isToday as jest.Mock).mockReturnValue(false);
    (formattingModule.formatDateTime as jest.Mock).mockReturnValue(
      '01/01/2026'
    );

    render(<DateSeparator date={newYearDate} />);

    expect(screen.getByText('01/01/2026')).toBeInTheDocument();
  });
});
