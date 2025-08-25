import { render, screen, fireEvent } from '@testing-library/react';
import { ExportButton } from './ExportButton';

describe('ExportButton', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renderiza o botão com ícone de download', () => {
    render(<ExportButton onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: /exportar conversa/i });
    expect(button).toBeInTheDocument();

    // Verifica se tem o SVG do ícone
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('chama onClick quando clicado', () => {
    render(<ExportButton onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: /exportar conversa/i });
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('desabilita o botão quando disabled é true', () => {
    render(<ExportButton onClick={mockOnClick} disabled={true} />);

    const button = screen.getByRole('button', { name: /exportar conversa/i });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('aplica classes customizadas', () => {
    const customClass = 'custom-test-class';
    render(<ExportButton onClick={mockOnClick} className={customClass} />);

    const button = screen.getByRole('button', { name: /exportar conversa/i });
    expect(button).toHaveClass(customClass);
  });

  it('tem o title correto para tooltip', () => {
    render(<ExportButton onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: /exportar conversa/i });
    expect(button).toHaveAttribute('title', 'Exportar conversa como imagem');
  });

  it('aplica classes de hover corretamente', () => {
    render(<ExportButton onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: /exportar conversa/i });
    expect(button).toHaveClass('hover:bg-white/10');
    expect(button).toHaveClass('transition-colors');
  });

  it('mostra opacity reduzida quando desabilitado', () => {
    render(<ExportButton onClick={mockOnClick} disabled={true} />);

    const button = screen.getByRole('button', { name: /exportar conversa/i });
    expect(button).toHaveClass('disabled:opacity-50');
    expect(button).toHaveClass('disabled:cursor-not-allowed');
  });
});
