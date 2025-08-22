/**
 * Utilitários de validação para uploads e inputs
 */

// MIME types permitidos para upload de imagem
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB em bytes

// Magic numbers para verificação de assinatura de arquivo
const FILE_SIGNATURES = {
  jpeg: [0xff, 0xd8, 0xff],
  png: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  webp: [0x52, 0x49, 0x46, 0x46], // RIFF (WebP tem mais verificações específicas)
} as const;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Verifica a assinatura (magic numbers) do arquivo
 */
export async function validateFileSignature(
  file: File
): Promise<ValidationResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      if (!arrayBuffer) {
        resolve({
          isValid: false,
          error: 'Erro ao ler arquivo para verificação de assinatura.',
        });
        return;
      }

      const bytes = new Uint8Array(arrayBuffer.slice(0, 12)); // Lê primeiros 12 bytes

      // Verifica JPEG
      if (file.type === 'image/jpeg') {
        const jpegSig = FILE_SIGNATURES.jpeg;
        if (
          bytes.length >= jpegSig.length &&
          bytes.slice(0, jpegSig.length).every((byte, i) => byte === jpegSig[i])
        ) {
          resolve({ isValid: true });
          return;
        }
      }

      // Verifica PNG
      if (file.type === 'image/png') {
        const pngSig = FILE_SIGNATURES.png;
        if (
          bytes.length >= pngSig.length &&
          bytes.slice(0, pngSig.length).every((byte, i) => byte === pngSig[i])
        ) {
          resolve({ isValid: true });
          return;
        }
      }

      // Verifica WebP (RIFF + WEBP)
      if (file.type === 'image/webp') {
        const riffSig = FILE_SIGNATURES.webp;
        if (
          bytes.length >= 12 &&
          bytes
            .slice(0, riffSig.length)
            .every((byte, i) => byte === riffSig[i]) &&
          bytes[8] === 0x57 &&
          bytes[9] === 0x45 &&
          bytes[10] === 0x42 &&
          bytes[11] === 0x50
        ) {
          // "WEBP"
          resolve({ isValid: true });
          return;
        }
      }

      resolve({
        isValid: false,
        error:
          'Arquivo não corresponde ao formato declarado. Possível tentativa de bypass de segurança.',
      });
    };

    reader.onerror = () => {
      resolve({
        isValid: false,
        error: 'Erro ao verificar assinatura do arquivo.',
      });
    };

    // Lê apenas os primeiros 12 bytes para performance
    reader.readAsArrayBuffer(file.slice(0, 12));
  });
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
 * Sanitiza nome de arquivo removendo caracteres perigosos
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[<>:"/\\|?*]/g, '') // Remove caracteres perigosos
    .replace(/[\n\r\t]/g, '_') // Substitui quebras de linha e tabs por underscore
    .split('') // Converte para array de caracteres
    .filter((char) => {
      const code = char.charCodeAt(0);
      // Remove caracteres de controle (0-31 e 128-159)
      return !(code <= 31 || (code >= 128 && code <= 159));
    })
    .join('') // Reconstrói a string
    .replace(/^\.+/, '') // Remove pontos no início
    .replace(/\.+$/, '') // Remove pontos no final
    .replace(/\s+/g, '_') // Substitui espaços por underscore
    .substring(0, 255); // Limita tamanho
}

/**
 * Valida texto de mensagem
 */
export function validateMessage(text: string): ValidationResult {
  if (!text.trim()) {
    return {
      isValid: false,
      error: 'Mensagem não pode estar vazia',
    };
  }

  if (text.length > 4096) {
    return {
      isValid: false,
      error: 'Mensagem muito longa (máximo 4096 caracteres)',
    };
  }

  return { isValid: true, error: null };
}

/**
 * Sanitiza mensagem (escapa HTML e remove espaços em branco)
 */
export function sanitizeMessage(text: string): string {
  return sanitizeString(text.trim());
}

/**
 * Validação completa do arquivo de upload (síncrona)
 */
export function validateUploadFile(file: File): ValidationResult {
  const mimeValidation = validateMimeType(file);
  if (!mimeValidation.isValid) return mimeValidation;

  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.isValid) return sizeValidation;

  return { isValid: true };
}

/**
 * Validação completa do arquivo com verificação de assinatura (assíncrona)
 */
export async function validateUploadFileComplete(
  file: File
): Promise<ValidationResult> {
  // Validações básicas primeiro
  const basicValidation = validateUploadFile(file);
  if (!basicValidation.isValid) return basicValidation;

  // Verificação de assinatura de arquivo
  const signatureValidation = await validateFileSignature(file);
  if (!signatureValidation.isValid) return signatureValidation;

  return { isValid: true };
}
