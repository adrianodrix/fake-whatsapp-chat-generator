import {
  validateDate,
  validateTime,
  validateStatusWithTimestamp,
} from '../validation';
import {
  formatDateInput,
  combineDateAndTime,
  isSameDay,
  groupMessagesByDate,
} from '../formatting';
import type { Message } from '@/types/message';

describe('Timestamp Validation', () => {
  describe('validateDate', () => {
    it('should accept valid date format YYYY-MM-DD', () => {
      const result = validateDate('2025-08-22');
      expect(result.isValid).toBe(true);
    });

    it('should reject empty date', () => {
      const result = validateDate('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Data é obrigatória');
    });

    it('should reject invalid date format', () => {
      const result = validateDate('22/08/2025');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('formato YYYY-MM-DD');
    });

    it('should reject invalid date values', () => {
      const result = validateDate('2025-13-50');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Data inválida');
    });
  });

  describe('validateTime', () => {
    it('should accept valid time format HH:MM', () => {
      const result = validateTime('14:30');
      expect(result.isValid).toBe(true);
    });

    it('should reject empty time', () => {
      const result = validateTime('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Horário é obrigatório');
    });

    it('should reject invalid time format', () => {
      const result = validateTime('2:30 PM');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('formato HH:MM');
    });

    it('should reject invalid hours', () => {
      const result = validateTime('25:30');
      expect(result.isValid).toBe(false);
    });

    it('should reject invalid minutes', () => {
      const result = validateTime('14:60');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateStatusWithTimestamp', () => {
    it('should allow "sent" status for any timestamp', () => {
      const futureTime = new Date(Date.now() + 60000); // 1 minute in future
      const result = validateStatusWithTimestamp('sent', futureTime);
      expect(result.isValid).toBe(true);
    });

    it('should allow "delivered" status for any timestamp', () => {
      const futureTime = new Date(Date.now() + 60000); // 1 minute in future
      const result = validateStatusWithTimestamp('delivered', futureTime);
      expect(result.isValid).toBe(true);
    });

    it('should reject "read" status for future timestamp', () => {
      const futureTime = new Date(Date.now() + 60000); // 1 minute in future
      const result = validateStatusWithTimestamp('read', futureTime);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain(
        'Status "lido" não pode ser definido para horário futuro'
      );
    });

    it('should allow "read" status for past timestamp', () => {
      const pastTime = new Date(Date.now() - 60000); // 1 minute in past
      const result = validateStatusWithTimestamp('read', pastTime);
      expect(result.isValid).toBe(true);
    });

    it('should reject timestamp more than 24 hours in future', () => {
      const farFuture = new Date(Date.now() + 25 * 60 * 60 * 1000); // 25 hours
      const result = validateStatusWithTimestamp('sent', farFuture);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('não pode ser mais de 24 horas no futuro');
    });
  });
});

describe('Date/Time Formatting', () => {
  describe('formatDateInput', () => {
    it('should format Date to YYYY-MM-DD', () => {
      const date = new Date('2025-08-22T14:30:00');
      const result = formatDateInput(date);
      expect(result).toBe('2025-08-22');
    });
  });

  describe('combineDateAndTime', () => {
    it('should combine date and time strings into Date', () => {
      const result = combineDateAndTime('2025-08-22', '14:30');
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(7); // August is 7 (0-indexed)
      expect(result.getDate()).toBe(22);
      expect(result.getHours()).toBe(14);
      expect(result.getMinutes()).toBe(30);
    });
  });

  describe('isSameDay', () => {
    it('should return true for same day different times', () => {
      const date1 = new Date('2025-08-22T10:00:00');
      const date2 = new Date('2025-08-22T20:00:00');
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('should return false for different days', () => {
      const date1 = new Date('2025-08-22T23:59:00');
      const date2 = new Date('2025-08-23T00:01:00');
      expect(isSameDay(date1, date2)).toBe(false);
    });
  });
});

describe('Message Grouping', () => {
  const createMockMessage = (
    id: string,
    sender: 'user' | 'contact',
    timestamp: string
  ): Message => ({
    id,
    text: `Message ${id}`,
    sender,
    timestamp: new Date(timestamp),
    status: 'sent',
    type: 'text',
    createdAt: new Date(timestamp),
    updatedAt: new Date(timestamp),
  });

  describe('groupMessagesByDate', () => {
    it('should add date separator for different days', () => {
      const messages = [
        createMockMessage('1', 'user', '2025-08-21T14:00:00'),
        createMockMessage('2', 'user', '2025-08-22T14:00:00'),
      ];

      const result = groupMessagesByDate(messages);

      // Should have: separator, message, separator, message
      expect(result).toHaveLength(4);
      expect(result[0].type).toBe('separator');
      expect(result[1].type).toBe('message');
      expect(result[2].type).toBe('separator');
      expect(result[3].type).toBe('message');
    });

    it('should not add separator for same day messages', () => {
      const messages = [
        createMockMessage('1', 'user', '2025-08-22T14:00:00'),
        createMockMessage('2', 'user', '2025-08-22T15:00:00'),
      ];

      const result = groupMessagesByDate(messages);

      // Should have: separator, message, message
      expect(result).toHaveLength(3);
      expect(result[0].type).toBe('separator');
      expect(result[1].type).toBe('message');
      expect(result[2].type).toBe('message');
    });

    it('should add grouping metadata for sequential messages from same sender', () => {
      const messages = [
        createMockMessage('1', 'user', '2025-08-22T14:00:00'),
        createMockMessage('2', 'user', '2025-08-22T14:02:00'), // 2 minutes apart
        createMockMessage('3', 'contact', '2025-08-22T14:05:00'),
      ];

      const result = groupMessagesByDate(messages);

      const message1 = result.find((item) => item.message?.id === '1')?.message;
      const message2 = result.find((item) => item.message?.id === '2')?.message;
      const message3 = result.find((item) => item.message?.id === '3')?.message;

      // Message 1 and 2 should be grouped (same sender, <5min apart)
      expect(message1?._grouping?.isGroupStart).toBe(true);
      expect(message1?._grouping?.isGroupEnd).toBe(false);
      expect(message1?._grouping?.isGrouped).toBe(true);

      expect(message2?._grouping?.isGroupStart).toBe(false);
      expect(message2?._grouping?.isGroupEnd).toBe(true);
      expect(message2?._grouping?.isGrouped).toBe(true);

      // Message 3 should not be grouped (different sender)
      expect(message3?._grouping?.isGrouped).toBe(false);
    });

    it('should not group messages more than 5 minutes apart', () => {
      const messages = [
        createMockMessage('1', 'user', '2025-08-22T14:00:00'),
        createMockMessage('2', 'user', '2025-08-22T14:06:00'), // 6 minutes apart
      ];

      const result = groupMessagesByDate(messages);

      const message1 = result.find((item) => item.message?.id === '1')?.message;
      const message2 = result.find((item) => item.message?.id === '2')?.message;

      expect(message1?._grouping?.isGrouped).toBe(false);
      expect(message2?._grouping?.isGrouped).toBe(false);
    });
  });
});
