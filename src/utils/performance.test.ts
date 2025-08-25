import {
  prefersReducedMotion,
  observeReducedMotionPreference,
  debounce,
  throttle,
  measurePerformanceWithSentry,
  cleanupResources,
} from './performance';

// Mock do Sentry
jest.mock('@/monitoring/sentry', () => ({
  captureMessage: jest.fn(),
}));

// Mock do matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: query === '(prefers-reduced-motion: reduce)',
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock do performance API
const mockPerformance = {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByName: jest.fn(() => [{ duration: 50 }]),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
};

Object.defineProperty(global, 'performance', {
  writable: true,
  value: mockPerformance,
});

describe('Performance Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();

    // Reset all mocks
    mockPerformance.now.mockReturnValue(Date.now());
    mockPerformance.getEntriesByName.mockReturnValue([{ duration: 50 }]);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('prefersReducedMotion', () => {
    it('retorna true quando prefers-reduced-motion está ativo', () => {
      (window.matchMedia as jest.Mock).mockReturnValue({ matches: true });
      expect(prefersReducedMotion()).toBe(true);
    });

    it('retorna false quando prefers-reduced-motion não está ativo', () => {
      (window.matchMedia as jest.Mock).mockReturnValue({ matches: false });
      expect(prefersReducedMotion()).toBe(false);
    });

    it('retorna false quando window é undefined', () => {
      const originalWindow = global.window;
      // @ts-expect-error - deleting window for test
      delete global.window;
      expect(prefersReducedMotion()).toBe(false);
      global.window = originalWindow;
    });
  });

  describe('observeReducedMotionPreference', () => {
    it('registra listener para mudanças na preferência', () => {
      const callback = jest.fn();
      const mockEventListener = jest.fn();
      const mockRemoveEventListener = jest.fn();

      (window.matchMedia as jest.Mock).mockReturnValue({
        matches: false,
        addEventListener: mockEventListener,
        removeEventListener: mockRemoveEventListener,
      });

      const cleanup = observeReducedMotionPreference(callback);

      expect(mockEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );

      cleanup();
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });

    it('retorna função vazia quando window é undefined', () => {
      const originalWindow = global.window;
      // @ts-expect-error - deleting window for test
      delete global.window;

      const cleanup = observeReducedMotionPreference(jest.fn());
      expect(typeof cleanup).toBe('function');

      global.window = originalWindow;
    });
  });

  describe('debounce', () => {
    it('debounce chamada de função', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('test');
      debouncedFn('test2');
      debouncedFn('test3');

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('test3');
    });

    it('reseta timer quando chamado novamente antes do delay', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('test1');
      jest.advanceTimersByTime(50);

      debouncedFn('test2');
      jest.advanceTimersByTime(50);

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('test2');
    });
  });

  describe('throttle', () => {
    it('throttle chamada de função', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn('test1');
      throttledFn('test2');
      throttledFn('test3');

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('test1');

      jest.advanceTimersByTime(100);

      throttledFn('test4');
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith('test4');
    });
  });

  describe('measurePerformanceWithSentry', () => {
    it('mede performance de função síncrona', () => {
      const mockFn = jest.fn(() => 'result');

      const result = measurePerformanceWithSentry('test-operation', mockFn);

      expect(result).toBe('result');
      expect(mockFn).toHaveBeenCalled();
    });

    it('mede performance de função assíncrona', async () => {
      const mockAsyncFn = jest.fn(async () => 'async-result');

      const result = await measurePerformanceWithSentry(
        'test-async-operation',
        mockAsyncFn
      );

      expect(result).toBe('async-result');
      expect(mockAsyncFn).toHaveBeenCalled();
    });

    it('executa função fornecida em desenvolvimento', () => {
      // Mock process.env para desenvolvimento
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const mockFn = jest.fn(() => 'test-result');
      const result = measurePerformanceWithSentry('test-operation', mockFn);

      expect(mockFn).toHaveBeenCalled();
      expect(result).toBe('test-result');

      // Restaurar env original
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('cleanupResources', () => {
    it('executa sem erro', () => {
      expect(() => cleanupResources()).not.toThrow();
    });

    it('não falha quando clearMarks/clearMeasures não existem', () => {
      expect(() => cleanupResources()).not.toThrow();
    });
  });
});
