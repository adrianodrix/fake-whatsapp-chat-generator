/**
 * Testes das funções utilitárias de performance
 * Foca na lógica core sem depender de environment variables
 */

import {
  DEFAULT_PERFORMANCE_BUDGET,
  measurePerformance,
  measureAsyncPerformance,
} from '../../src/utils/performance';

// Mock console methods
beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation();
  jest.spyOn(console, 'warn').mockImplementation();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Performance Utilities - Core Logic', () => {
  describe('DEFAULT_PERFORMANCE_BUDGET', () => {
    it('should have reasonable default values', () => {
      expect(DEFAULT_PERFORMANCE_BUDGET.renderTime).toBe(16); // 60fps
      expect(DEFAULT_PERFORMANCE_BUDGET.exportTime).toBe(2000); // 2s
      expect(DEFAULT_PERFORMANCE_BUDGET.bundleSize).toBe(200 * 1024); // 200KB
      expect(DEFAULT_PERFORMANCE_BUDGET.interactionDelay).toBe(100); // 100ms
    });

    it('should be frozen/immutable', () => {
      // Verify the object is frozen
      expect(Object.isFrozen(DEFAULT_PERFORMANCE_BUDGET)).toBe(true);

      // Attempting to modify should not change the values
      try {
        (DEFAULT_PERFORMANCE_BUDGET as { renderTime: number }).renderTime = 32;
      } catch {
        // Frozen objects might throw in strict mode
      }

      // Values should remain unchanged
      expect(DEFAULT_PERFORMANCE_BUDGET.renderTime).toBe(16);
    });
  });

  describe('measurePerformance', () => {
    it('should measure synchronous operations', () => {
      const testOperation = jest.fn(() => {
        // Simulate some work
        let sum = 0;
        for (let i = 0; i < 1000; i++) {
          sum += i;
        }
        return sum;
      });

      const duration = measurePerformance('test_sync_op', testOperation);

      expect(testOperation).toHaveBeenCalled();
      expect(duration).toBeGreaterThan(0);
      expect(typeof duration).toBe('number');
    });

    it('should handle operations that throw errors', () => {
      const failingOperation = jest.fn(() => {
        throw new Error('Test error');
      });

      expect(() => {
        measurePerformance('failing_op', failingOperation);
      }).toThrow('Test error');

      expect(failingOperation).toHaveBeenCalled();
    });

    it('should return meaningful duration values', () => {
      const quickOperation = () => {
        /* no-op */
      };
      const duration = measurePerformance('quick_op', quickOperation);

      expect(duration).toBeGreaterThanOrEqual(0);
      expect(duration).toBeLessThan(100); // Should be very quick
    });
  });

  describe('measureAsyncPerformance', () => {
    it('should measure async operations', async () => {
      const asyncOperation = jest.fn(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return 'async result';
      });

      const result = await measureAsyncPerformance(
        'test_async_op',
        asyncOperation
      );

      expect(asyncOperation).toHaveBeenCalled();
      expect(result.result).toBe('async result');
      expect(result.duration).toBeGreaterThan(40); // Should be at least 50ms
      expect(typeof result.duration).toBe('number');
    });

    it('should handle async operations that reject', async () => {
      const failingAsyncOperation = jest.fn(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        throw new Error('Async error');
      });

      await expect(
        measureAsyncPerformance('failing_async_op', failingAsyncOperation)
      ).rejects.toThrow('Async error');

      expect(failingAsyncOperation).toHaveBeenCalled();
    });

    it('should return correct structure for successful operations', async () => {
      const operation = async () => ({ data: 'test' });

      const result = await measureAsyncPerformance('struct_test', operation);

      expect(result).toHaveProperty('result');
      expect(result).toHaveProperty('duration');
      expect(result.result).toEqual({ data: 'test' });
      expect(typeof result.duration).toBe('number');
    });
  });

  describe('Performance Measurement Accuracy', () => {
    it('should measure fast operations with reasonable precision', () => {
      const fastOp = () => Math.random();
      const duration = measurePerformance('fast_op', fastOp);

      expect(duration).toBeGreaterThanOrEqual(0);
      expect(duration).toBeLessThan(10); // Should be under 10ms for simple operation
    });

    it('should measure slower operations accurately', async () => {
      const slowAsyncOp = async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      };

      const result = await measureAsyncPerformance('slow_op', slowAsyncOp);

      expect(result.duration).toBeGreaterThan(90); // Should be close to 100ms
      expect(result.duration).toBeLessThan(150); // But not too much over
    });
  });

  describe('Error Handling', () => {
    it('should not break when measuring operations with undefined return', () => {
      const undefinedOp = () => undefined;

      expect(() => {
        const duration = measurePerformance('undefined_op', undefinedOp);
        expect(typeof duration).toBe('number');
      }).not.toThrow();
    });

    it('should handle null return values', () => {
      const nullOp = () => null;

      expect(() => {
        const duration = measurePerformance('null_op', nullOp);
        expect(typeof duration).toBe('number');
      }).not.toThrow();
    });

    it('should handle complex object return values', async () => {
      const complexOp = async () => ({
        nested: { data: [1, 2, 3] },
        fn: () => 'test',
      });

      const result = await measureAsyncPerformance('complex_op', complexOp);

      expect(result.result).toHaveProperty('nested');
      expect(result.result.nested.data).toEqual([1, 2, 3]);
      expect(typeof result.result.fn).toBe('function');
      expect(result.duration).toBeGreaterThan(0);
    });
  });
});
