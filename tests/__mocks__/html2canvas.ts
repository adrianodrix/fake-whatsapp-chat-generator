/**
 * Mock do html2canvas para ambiente de testes
 * Simula a funcionalidade básica sem depender de APIs de browser
 */

// Mock canvas element
const createMockCanvas = (width = 800, height = 600) => {
  const mockImageData = {
    data: new Uint8ClampedArray(width * height * 4).fill(255), // Todos pixels brancos
    width,
    height,
  };

  const canvas = {
    width,
    height,
    style: {},
    getContext: jest.fn(() => ({
      drawImage: jest.fn(),
      scale: jest.fn(),
      getImageData: jest.fn(() => mockImageData),
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    })),
    toDataURL: jest.fn(
      () =>
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    ),
    toBlob: jest.fn((callback) => {
      const blob = new Blob(['fake-image-data'], { type: 'image/png' });
      callback(blob);
    }),
  };

  return canvas;
};

// Mock principal do html2canvas
const html2canvas = jest
  .fn()
  .mockImplementation(async (element, options = {}) => {
    // Simular delay do processo real
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Criar canvas mock com dimensões baseadas no elemento ou opções
    const width = options.width || element?.offsetWidth || 800;
    const height = options.height || element?.offsetHeight || 600;

    const canvas = createMockCanvas(width, height);

    // Chamar onProgress callback se fornecido
    if (options.onProgress) {
      options.onProgress(10);
      await new Promise((resolve) => setTimeout(resolve, 50));
      options.onProgress(50);
      await new Promise((resolve) => setTimeout(resolve, 50));
      options.onProgress(100);
    }

    return canvas;
  });

export default html2canvas;
