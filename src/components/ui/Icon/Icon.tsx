import React, { memo } from 'react';
import type { IconProps } from './Icon.types';

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const icons = {
  edit: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
    />
  ),
  check: (
    <path d="M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" />
  ),
  'check-double': (
    <>
      <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-1.181-1.158a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l1.714 1.677c.143.14.361.125.484-.033L15.073 3.379a.365.365 0 0 0-.063-.51z" />
      <path d="M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" />
    </>
  ),
  close: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18 18 6M6 6l12 12"
    />
  ),
  'arrow-down': (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m19.5 8.25-7.5 7.5-7.5-7.5"
    />
  ),
};

/**
 * Componente de ícone reutilizável
 *
 * @example
 * ```tsx
 * <Icon name="edit" size="md" onClick={handleEdit} />
 * ```
 */
export const Icon: React.FC<IconProps> = memo(
  ({ name, size = 'md', className = '', onClick, 'aria-label': ariaLabel }) => {
    const baseClasses = sizeClasses[size];

    const combinedClasses = `${baseClasses} ${className}`.trim();

    const isClickable = Boolean(onClick);

    return (
      <svg
        className={combinedClasses}
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={name.startsWith('check') ? 0 : 1.5}
        viewBox={name.startsWith('check') ? '0 0 16 15' : '0 0 24 24'}
        xmlns="http://www.w3.org/2000/svg"
        onClick={onClick}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        aria-label={ariaLabel || name}
        style={{ cursor: isClickable ? 'pointer' : undefined }}
      >
        {icons[name]}
      </svg>
    );
  }
);

Icon.displayName = 'Icon';
