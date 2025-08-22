import React, { memo } from 'react';
import type { AvatarProps } from './Avatar.types';

/**
 * Componente Avatar que mostra foto ou iniciais
 * Replica o visual dos avatars do WhatsApp
 */
export const Avatar: React.FC<AvatarProps> = memo(
  ({ name, src, size = 'md', className = '', onClick }) => {
    const getInitials = (name: string): string => {
      return name
        .split(' ')
        .map((word) => word.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase();
    };

    const sizeClasses = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
    };

    const baseClasses = `
    ${sizeClasses[size]}
    rounded-full
    bg-wa-secondary
    text-white
    flex
    items-center
    justify-center
    font-medium
    overflow-hidden
    select-none
    ${onClick ? 'cursor-pointer hover:bg-wa-primary transition-colors' : ''}
    ${className}
  `
      .trim()
      .replace(/\s+/g, ' ');

    if (src) {
      return (
        <div className={baseClasses} onClick={onClick}>
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback para iniciais se imagem falhar
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <span className="absolute inset-0 flex items-center justify-center">
            {getInitials(name)}
          </span>
        </div>
      );
    }

    return (
      <div className={baseClasses} onClick={onClick}>
        {getInitials(name)}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
