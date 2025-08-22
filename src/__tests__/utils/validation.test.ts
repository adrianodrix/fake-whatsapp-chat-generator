import { validateMessage, sanitizeMessage } from '../../utils/validation';

describe('Validation Utils', () => {
  describe('validateMessage', () => {
    it('should validate correct message', () => {
      const result = validateMessage('Hello world');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should reject empty message', () => {
      const result = validateMessage('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('vazia');
    });

    it('should reject whitespace-only message', () => {
      const result = validateMessage('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('vazia');
    });

    it('should reject too long message', () => {
      const longMessage = 'a'.repeat(4097);
      const result = validateMessage(longMessage);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('muito longa');
    });

    it('should accept maximum length message', () => {
      const maxMessage = 'a'.repeat(4096);
      const result = validateMessage(maxMessage);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('sanitizeMessage', () => {
    it('should escape HTML characters', () => {
      const input = '<script>alert("xss")</script>';
      const result = sanitizeMessage(input);
      expect(result).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
      );
    });

    it('should trim whitespace', () => {
      const input = '  hello world  ';
      const result = sanitizeMessage(input);
      expect(result).toBe('hello world');
    });

    it('should handle normal text', () => {
      const input = 'Hello world!';
      const result = sanitizeMessage(input);
      expect(result).toBe('Hello world!');
    });
  });
});
