/**
 * Testes para utilitários de validação
 */

import {
  validateMimeType,
  validateFileSize,
  validateName,
  sanitizeString,
  validateUploadFile,
} from '../../src/utils/validation';

describe('Validation Utils', () => {
  describe('validateMimeType', () => {
    it('deve aceitar MIME types válidos', () => {
      const jpegFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const pngFile = new File(['test'], 'test.png', { type: 'image/png' });
      const webpFile = new File(['test'], 'test.webp', { type: 'image/webp' });

      expect(validateMimeType(jpegFile).isValid).toBe(true);
      expect(validateMimeType(pngFile).isValid).toBe(true);
      expect(validateMimeType(webpFile).isValid).toBe(true);
    });

    it('deve rejeitar MIME types inválidos', () => {
      const txtFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const gifFile = new File(['test'], 'test.gif', { type: 'image/gif' });

      expect(validateMimeType(txtFile).isValid).toBe(false);
      expect(validateMimeType(gifFile).isValid).toBe(false);
      expect(validateMimeType(txtFile).error).toContain('não suportado');
    });
  });

  describe('validateFileSize', () => {
    it('deve aceitar arquivos menores que 10MB', () => {
      const smallFile = new File(['x'.repeat(1024)], 'small.jpg', {
        type: 'image/jpeg',
      });
      expect(validateFileSize(smallFile).isValid).toBe(true);
    });

    it('deve rejeitar arquivos maiores que 10MB', () => {
      // Criar um arquivo simulado maior que 10MB
      const largeFile = new File(['x'], 'large.jpg', { type: 'image/jpeg' });
      Object.defineProperty(largeFile, 'size', { value: 11 * 1024 * 1024 });

      expect(validateFileSize(largeFile).isValid).toBe(false);
      expect(validateFileSize(largeFile).error).toContain('muito grande');
    });
  });

  describe('validateName', () => {
    it('deve aceitar nomes válidos', () => {
      expect(validateName('João').isValid).toBe(true);
      expect(validateName('Ana Maria').isValid).toBe(true);
      expect(validateName('a').isValid).toBe(true);
      expect(validateName('x'.repeat(25)).isValid).toBe(true);
    });

    it('deve rejeitar nomes vazios', () => {
      expect(validateName('').isValid).toBe(false);
      expect(validateName('   ').isValid).toBe(false);
      expect(validateName('').error).toContain('obrigatório');
    });

    it('deve rejeitar nomes muito longos', () => {
      const longName = 'x'.repeat(26);
      expect(validateName(longName).isValid).toBe(false);
      expect(validateName(longName).error).toContain('máximo 25');
    });
  });

  describe('sanitizeString', () => {
    it('deve escapar caracteres HTML', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
      );
      expect(sanitizeString('João & Maria')).toBe('João &amp; Maria');
      expect(sanitizeString("It's a test")).toBe('It&#x27;s a test');
    });

    it('deve preservar texto normal', () => {
      expect(sanitizeString('João Silva')).toBe('João Silva');
      expect(sanitizeString('123 ABC')).toBe('123 ABC');
    });
  });

  describe('validateUploadFile', () => {
    it('deve validar arquivo completamente válido', () => {
      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      expect(validateUploadFile(validFile).isValid).toBe(true);
    });

    it('deve falhar se MIME type for inválido', () => {
      const invalidFile = new File(['test'], 'test.txt', {
        type: 'text/plain',
      });
      expect(validateUploadFile(invalidFile).isValid).toBe(false);
    });

    it('deve falhar se arquivo for muito grande', () => {
      const largeFile = new File(['x'], 'large.jpg', { type: 'image/jpeg' });
      Object.defineProperty(largeFile, 'size', { value: 11 * 1024 * 1024 });

      expect(validateUploadFile(largeFile).isValid).toBe(false);
    });
  });
});
