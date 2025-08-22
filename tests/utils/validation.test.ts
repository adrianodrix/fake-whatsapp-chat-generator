/**
 * Testes para utilitários de validação
 */

import {
  validateMimeType,
  validateFileSize,
  validateName,
  sanitizeString,
  sanitizeFilename,
  validateUploadFile,
  validateUploadFileComplete,
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

  describe('sanitizeFilename', () => {
    it('deve remover caracteres perigosos', () => {
      expect(sanitizeFilename('test<script>.jpg')).toBe('testscript.jpg');
      expect(sanitizeFilename('file:with|dangerous?chars*.png')).toBe(
        'filewithdangerouschars.png'
      );
      expect(sanitizeFilename('normal_file.jpeg')).toBe('normal_file.jpeg');
    });

    it('deve remover caracteres de controle', () => {
      expect(sanitizeFilename('file\x00\x1f.jpg')).toBe('file.jpg');
      expect(sanitizeFilename('test\n\r\t.png')).toBe('test___.png');
    });

    it('deve remover pontos no início e fim', () => {
      expect(sanitizeFilename('...test.jpg...')).toBe('test.jpg');
      expect(sanitizeFilename('.hidden.png')).toBe('hidden.png');
    });

    it('deve limitar tamanho do filename', () => {
      const longName = 'a'.repeat(300) + '.jpg';
      const result = sanitizeFilename(longName);
      expect(result.length).toBeLessThanOrEqual(255);
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

  describe('validateUploadFileComplete - Testes de Segurança', () => {
    // Helper para criar arquivo com bytes específicos
    const createFileWithBytes = (
      bytes: number[],
      mimeType: string,
      filename: string
    ) => {
      const buffer = new ArrayBuffer(bytes.length);
      const view = new Uint8Array(buffer);
      bytes.forEach((byte, index) => {
        view[index] = byte;
      });
      return new File([buffer], filename, { type: mimeType });
    };

    it('deve aceitar JPEG válido com assinatura correta', async () => {
      const jpegBytes = [0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]; // JPEG header
      const jpegFile = createFileWithBytes(jpegBytes, 'image/jpeg', 'test.jpg');

      const result = await validateUploadFileComplete(jpegFile);
      expect(result.isValid).toBe(true);
    });

    it('deve aceitar PNG válido com assinatura correta', async () => {
      const pngBytes = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]; // PNG header
      const pngFile = createFileWithBytes(pngBytes, 'image/png', 'test.png');

      const result = await validateUploadFileComplete(pngFile);
      expect(result.isValid).toBe(true);
    });

    it('deve aceitar WebP válido com assinatura correta', async () => {
      const webpBytes = [
        0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
      ]; // RIFF + WEBP
      const webpFile = createFileWithBytes(
        webpBytes,
        'image/webp',
        'test.webp'
      );

      const result = await validateUploadFileComplete(webpFile);
      expect(result.isValid).toBe(true);
    });

    it('deve rejeitar arquivo com MIME type falso (spoofing attack)', async () => {
      // Arquivo .txt com MIME type de JPEG
      const textBytes = [0x74, 0x65, 0x73, 0x74]; // "test" em ASCII
      const spoofedFile = createFileWithBytes(
        textBytes,
        'image/jpeg',
        'malicious.jpg'
      );

      const result = await validateUploadFileComplete(spoofedFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('não corresponde ao formato declarado');
    });

    it('deve rejeitar script mascarado como imagem', async () => {
      // Script JavaScript com extensão .jpg
      const scriptBytes = [0x3c, 0x73, 0x63, 0x72, 0x69, 0x70, 0x74]; // "<script"
      const maliciousFile = createFileWithBytes(
        scriptBytes,
        'image/jpeg',
        'script.jpg'
      );

      const result = await validateUploadFileComplete(maliciousFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('não corresponde ao formato declarado');
    });

    it('deve rejeitar arquivo executável mascarado como PNG', async () => {
      // Bytes de executável Windows (MZ header)
      const exeBytes = [0x4d, 0x5a, 0x90, 0x00]; // MZ header
      const maliciousFile = createFileWithBytes(
        exeBytes,
        'image/png',
        'virus.png'
      );

      const result = await validateUploadFileComplete(maliciousFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('não corresponde ao formato declarado');
    });

    it('deve rejeitar WebP com header RIFF correto mas sem WEBP', async () => {
      // Apenas RIFF sem WEBP
      const invalidWebpBytes = [
        0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x41, 0x42, 0x43, 0x44,
      ];
      const invalidFile = createFileWithBytes(
        invalidWebpBytes,
        'image/webp',
        'invalid.webp'
      );

      const result = await validateUploadFileComplete(invalidFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('não corresponde ao formato declarado');
    });

    it('deve validar performance da verificação de assinatura', async () => {
      const jpegBytes = [0xff, 0xd8, 0xff, 0xe0].concat(Array(1000).fill(0)); // JPEG + padding
      const jpegFile = createFileWithBytes(jpegBytes, 'image/jpeg', 'test.jpg');

      const startTime = performance.now();
      await validateUploadFileComplete(jpegFile);
      const endTime = performance.now();

      const processingTime = endTime - startTime;
      expect(processingTime).toBeLessThan(50); // Deve ser rápido (< 50ms)
    });
  });
});
