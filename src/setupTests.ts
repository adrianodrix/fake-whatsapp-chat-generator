import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  length: 0,
  key: () => null,
} as Storage;

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock scrollIntoView para testes
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: jest.fn(),
  writable: true,
});

// Mock canvas para testes
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: jest.fn(() => ({
    drawImage: jest.fn(),
    scale: jest.fn(),
    getImageData: jest.fn(() => ({
      data: new Uint8ClampedArray(4),
      width: 1,
      height: 1,
    })),
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high',
  })),
});

// Mock document.createElement para testes
const originalCreateElement = document.createElement;
document.createElement = jest.fn().mockImplementation((tagName) => {
  if (tagName === 'canvas') {
    const canvas = originalCreateElement.call(
      document,
      'canvas'
    ) as HTMLCanvasElement;
    canvas.width = 800;
    canvas.height = 600;
    canvas.getContext = jest.fn(() => ({
      // Minimal mock for 2d context
      drawImage: jest.fn(),
      scale: jest.fn(),
      getImageData: jest.fn(() => ({
        data: new Uint8ClampedArray(800 * 600 * 4).fill(255),
        width: 800,
        height: 600,
      })),
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    })) as unknown as CanvasRenderingContext2D;
    canvas.toDataURL = jest.fn(() => 'data:image/png;base64,test');
    canvas.toBlob = jest.fn((callback) => {
      const blob = new Blob(['test'], { type: 'image/png' });
      callback(blob);
    });
    return canvas;
  }
  return originalCreateElement.call(document, tagName);
});

// Mock window.devicePixelRatio
Object.defineProperty(window, 'devicePixelRatio', {
  value: 2,
  writable: true,
});

// Mock performance.now - compatível com fake timers
if (!window.performance) {
  window.performance = {} as Performance;
}

window.performance.now = jest.fn(() => Date.now());
window.performance.mark = jest.fn();
window.performance.measure = jest.fn();
window.performance.getEntriesByName = jest.fn(() => [
  {
    duration: 100,
    entryType: 'measure',
    name: 'test-measure',
    startTime: 0,
    toJSON: () => ({}),
  } as PerformanceEntry,
]);

// Custom matchers for WhatsApp Chat Generator are extended by testing-library/jest-dom
// Additional custom matchers are defined in test-utils/matchers.ts

// Custom matchers are provided by @testing-library/jest-dom
// Additional custom matchers can be added here if needed
import './test-utils/matchers';
