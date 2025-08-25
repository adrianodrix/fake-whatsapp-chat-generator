import React, { memo } from 'react';
import type { ChatHeaderProps } from './ChatHeader.types';
import { Avatar } from '../../ui/Avatar';
import { ExportButton } from '../ExportButton';

/**
 * Header do chat com avatar, nome e ações
 * Replica o header do WhatsApp com precisão pixel-perfect
 */
export const ChatHeader: React.FC<ChatHeaderProps> = memo(
  ({ profile, onProfileEdit, onBack, onExport, showOnlineStatus = false }) => {
    return (
      <header className="bg-wa-primary text-white h-15 px-4 flex items-center shadow-md">
        {/* Back button (mobile) */}
        {onBack && (
          <button
            onClick={onBack}
            className="mr-3 p-1 rounded-full hover:bg-white/10 transition-colors md:hidden"
            aria-label="Voltar"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}

        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar
            name={profile.name}
            src={profile.avatar}
            size="md"
            onClick={onProfileEdit}
            className={onProfileEdit ? 'cursor-pointer' : ''}
          />
        </div>

        {/* Profile info */}
        <div className="ml-3 flex-1 min-w-0">
          <div
            className={`
            font-medium text-white truncate
            ${onProfileEdit ? 'cursor-pointer hover:text-white/90' : ''}
          `}
            onClick={onProfileEdit}
          >
            {profile.name}
          </div>

          {showOnlineStatus && profile.isOnline && (
            <div className="text-white/70 text-sm">online</div>
          )}
        </div>

        {/* Menu/Options */}
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Buscar"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Export Button */}
          {onExport && <ExportButton onClick={onExport} />}

          <button
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Mais opções"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </header>
    );
  }
);

ChatHeader.displayName = 'ChatHeader';
