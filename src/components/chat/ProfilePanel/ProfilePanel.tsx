import React, { useState, useRef, useCallback } from 'react';
import type { ProfilePanelProps, ProfileFormState } from './ProfilePanel.types';
import { Avatar } from '../../ui/Avatar';
import {
  validateName,
  validateUploadFile,
  sanitizeString,
} from '../../../utils/validation';
import {
  resizeImageToAvatar,
  generateInitialsAvatar,
  isCanvasSupported,
} from '../../../utils/image-processing';

/**
 * Componente para configuração de perfis de usuário
 * Permite editar nome e avatar com validação e preview
 */
export const ProfilePanel: React.FC<ProfilePanelProps> = ({
  profile,
  label,
  onProfileUpdate,
  className = '',
}) => {
  const [formState, setFormState] = useState<ProfileFormState>({
    name: profile.name,
    avatar: profile.avatar,
    isUploading: false,
    errors: {},
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProfile = useCallback((updates: Partial<ProfileFormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.value;
      const validation = validateName(name);

      updateProfile({
        name,
        errors: { ...formState.errors, name: validation.error },
      });

      // Atualiza profile se válido
      if (validation.isValid) {
        const sanitizedName = sanitizeString(name.trim());
        const initials = sanitizedName
          .split(' ')
          .map((word) => word.charAt(0))
          .join('')
          .substring(0, 2)
          .toUpperCase();

        onProfileUpdate({
          ...profile,
          name: sanitizedName,
          initials,
        });
      }
    },
    [profile, onProfileUpdate, formState.errors, updateProfile]
  );

  const handleAvatarUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      console.log('ProfilePanel: Iniciando upload de arquivo', file.name);

      // Validação do arquivo
      const validation = validateUploadFile(file);
      if (!validation.isValid) {
        console.error('ProfilePanel: Arquivo inválido', validation.error);
        updateProfile({
          errors: { ...formState.errors, upload: validation.error },
        });
        return;
      }

      console.log('ProfilePanel: Arquivo válido, processando...');

      // Define isUploading = true
      setFormState((prev) => ({
        ...prev,
        isUploading: true,
        errors: { ...prev.errors, upload: undefined },
      }));

      // Usar setTimeout para evitar bloqueio da UI
      setTimeout(async () => {
        try {
          const result = await resizeImageToAvatar(file);
          console.log('ProfilePanel: Imagem processada com sucesso');

          // Verifica se processamento foi rápido o suficiente
          if (result.processingTime > 100) {
            console.warn(
              `Processamento demorou ${result.processingTime.toFixed(2)}ms`
            );
          }

          // Atualiza estado com nova imagem e garante que isUploading seja false
          setFormState((prev) => ({
            ...prev,
            avatar: result.dataUrl,
            isUploading: false,
          }));

          console.log('ProfilePanel: isUploading definido como false');

          // Chama callback do parent apenas se houve mudança
          if (profile.avatar !== result.dataUrl) {
            onProfileUpdate({
              ...profile,
              avatar: result.dataUrl,
            });
          }

          // Limpa o input para permitir reenvio do mesmo arquivo
          if (e.target) {
            e.target.value = '';
          }
        } catch (error) {
          console.error('Erro ao processar imagem:', error);
          setFormState((prev) => ({
            ...prev,
            isUploading: false,
            errors: {
              ...prev.errors,
              upload: 'Erro ao processar imagem. Tente novamente.',
            },
          }));
        }
      }, 10); // Pequeno delay para permitir atualização da UI
    },
    [profile, onProfileUpdate, formState.errors, updateProfile]
  );

  const handleAvatarClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemoveAvatar = useCallback(() => {
    updateProfile({ avatar: undefined });
    onProfileUpdate({
      ...profile,
      avatar: undefined,
    });
  }, [profile, onProfileUpdate, updateProfile]);

  const currentAvatar =
    formState.avatar ||
    (formState.name ? generateInitialsAvatar(formState.name) : undefined);

  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm border ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">{label}</h3>

      {/* Avatar Section */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative">
          <Avatar
            name={formState.name || profile.name}
            src={currentAvatar}
            size="lg"
            onClick={handleAvatarClick}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          />
          {formState.isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <div className="flex-1">
          <button
            type="button"
            onClick={handleAvatarClick}
            disabled={formState.isUploading}
            className="text-sm text-wa-primary hover:text-wa-primary-dark disabled:opacity-50"
          >
            {currentAvatar ? 'Alterar foto' : 'Adicionar foto'}
          </button>

          {currentAvatar && (
            <button
              type="button"
              onClick={handleRemoveAvatar}
              className="ml-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Remover
            </button>
          )}

          {!isCanvasSupported() && (
            <p className="text-xs text-amber-600 mt-1">
              ⚠️ Redimensionamento não disponível neste navegador
            </p>
          )}
        </div>
      </div>

      {/* Upload Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleAvatarUpload}
        className="hidden"
      />

      {/* Upload Error */}
      {formState.errors.upload && (
        <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {formState.errors.upload}
        </div>
      )}

      {/* Name Input */}
      <div>
        <label
          htmlFor={`name-${profile.id}`}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nome
        </label>
        <input
          id={`name-${profile.id}`}
          type="text"
          value={formState.name}
          onChange={handleNameChange}
          maxLength={25}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-wa-primary ${
            formState.errors.name
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300'
          }`}
          placeholder="Digite o nome..."
        />

        {/* Character count */}
        <div className="flex justify-between items-center mt-1">
          {formState.errors.name ? (
            <span className="text-sm text-red-600">
              {formState.errors.name}
            </span>
          ) : (
            <span className="text-sm text-gray-500">
              {formState.name.length}/25 caracteres
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
