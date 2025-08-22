/**
 * Utilitários de validação para uploads e inputs
 */

// MIME types permitidos para upload de imagem
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB em bytes

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Valida MIME type do arquivo
 */
export function validateMimeType(file: File): ValidationResult {
  if (
    !ALLOWED_MIME_TYPES.includes(
      file.type as (typeof ALLOWED_MIME_TYPES)[number]
    )
  ) {
    return {
      isValid: false,
      error: 'Formato de arquivo não suportado. Use apenas JPEG, PNG ou WebP.',
    };
  }
  return { isValid: true };
}

/**
 * Valida tamanho do arquivo
 */
export function validateFileSize(file: File): ValidationResult {
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'Arquivo muito grande. O tamanho máximo permitido é 10MB.',
    };
  }
  return { isValid: true };
}

/**
 * Valida nome do usuário
 */
export function validateName(name: string): ValidationResult {
  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: 'Nome é obrigatório.',
    };
  }

  if (trimmed.length > 25) {
    return {
      isValid: false,
      error: 'Nome deve ter no máximo 25 caracteres.',
    };
  }

  return { isValid: true };
}

/**
 * Sanitiza string para prevenir XSS
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validação completa do arquivo de upload
 */
export function validateUploadFile(file: File): ValidationResult {
  const mimeValidation = validateMimeType(file);
  if (!mimeValidation.isValid) return mimeValidation;

  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.isValid) return sizeValidation;

  return { isValid: true };
}
