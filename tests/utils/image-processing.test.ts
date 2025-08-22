/**
 * Testes para utilitários de processamento de imagem
 */

import {
  isCanvasSupported,
  generateInitialsAvatar,
} from '../../src/utils/image-processing';

// Mock Canvas API para testes
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: jest.fn(() => ({
    fillStyle: '',
    fillRect: jest.fn(),
    font: '',
    textAlign: '',
    textBaseline: '',
    fillText: jest.fn(),
    drawImage: jest.fn(),
    toDataURL: jest.fn(() => 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ=='),
  })),
});

Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
  value: jest.fn((callback) =>
    callback(new Blob(['test'], { type: 'image/jpeg' }))
  ),
});

// Mock FileReader
global.FileReader = class {
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null =
    null;
  onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null =
    null;
  result: string | ArrayBuffer | null = null;

  readAsDataURL() {
    setTimeout(() => {
      this.result = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ==';
      if (this.onload) {
        this.onload({} as ProgressEvent<FileReader>);
      }
    }, 10);
  }
} as unknown as typeof FileReader;

// Mock URL.createObjectURL
global.URL = {
  createObjectURL: jest.fn(() => 'blob:mock-url'),
  revokeObjectURL: jest.fn(),
} as unknown as typeof URL;

describe('Image Processing Utils', () => {
  describe('isCanvasSupported', () => {
    it('deve detectar suporte ao Canvas API', () => {
      expect(isCanvasSupported()).toBe(true);
    });
  });

  describe('generateInitialsAvatar', () => {
    it('deve gerar avatar com iniciais para nome simples', () => {
      const avatar = generateInitialsAvatar('João');
      expect(avatar).toContain('data:image');
    });

    it('deve gerar avatar com iniciais para nome completo', () => {
      const avatar = generateInitialsAvatar('João Silva');
      expect(avatar).toContain('data:image');
    });

    it('deve gerar avatar com máximo 2 iniciais', () => {
      const avatar = generateInitialsAvatar('João Pedro Silva Santos');
      expect(avatar).toContain('data:image');
    });

    it('deve lidar com nomes vazios', () => {
      const avatar = generateInitialsAvatar('');
      expect(avatar).toContain('data:image');
    });
  });
});
