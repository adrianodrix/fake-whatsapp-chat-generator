/**
 * Utilitários de formatação de data e hora
 */

/**
 * Formata uma data para o formato de tempo HH:MM
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formata uma data para o formato completo usado no WhatsApp
 */
export const formatDateTime = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Formata uma data para o formato de entrada de data (YYYY-MM-DD)
 */
export const formatDateInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Converte string de tempo HH:MM para Date mantendo data atual
 */
export const timeStringToDate = (
  timeStr: string,
  baseDate: Date = new Date()
): Date => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const newDate = new Date(baseDate);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};

/**
 * Combina date string (YYYY-MM-DD) e time string (HH:MM) em uma Date
 */
export const combineDateAndTime = (dateStr: string, timeStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);

  return new Date(year, month - 1, day, hours, minutes, 0, 0);
};

/**
 * Verifica se uma mensagem foi enviada hoje
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Verifica se duas datas são do mesmo dia
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

/**
 * Agrupa mensagens por data, inserindo separadores de data
 */
import type { Message } from '@/types/message';
import { performanceMonitor } from './performance-monitor';

export interface MessageGroup {
  type: 'separator' | 'message';
  date?: Date;
  message?: Message;
  key: string;
}

export const groupMessagesByDate = (messages: Message[]): MessageGroup[] => {
  return performanceMonitor.monitor(
    'groupMessagesByDate',
    () => {
      if (messages.length === 0) return [];

      const grouped: MessageGroup[] = [];
      let lastDate: Date | null = null;

      messages.forEach((message, index) => {
        const messageDate = message.timestamp;

        // Se é uma data diferente da anterior, adiciona separador
        if (!lastDate || !isSameDay(messageDate, lastDate)) {
          grouped.push({
            type: 'separator',
            date: messageDate,
            key: `separator-${messageDate.toISOString().split('T')[0]}`,
          });
          lastDate = messageDate;
        }

        // Adiciona a mensagem com informações de agrupamento
        const prevMessage = index > 0 ? messages[index - 1] : null;
        const nextMessage =
          index < messages.length - 1 ? messages[index + 1] : null;

        // Verifica se deve agrupar com mensagem anterior (mesmo remetente, até 5min de diferença)
        const shouldGroupWithPrevious =
          prevMessage &&
          prevMessage.sender === message.sender &&
          prevMessage.type === message.type &&
          message.timestamp.getTime() - prevMessage.timestamp.getTime() <
            5 * 60 * 1000; // 5 minutos

        // Verifica se deve agrupar com próxima mensagem
        const shouldGroupWithNext =
          nextMessage &&
          nextMessage.sender === message.sender &&
          nextMessage.type === message.type &&
          nextMessage.timestamp.getTime() - message.timestamp.getTime() <
            5 * 60 * 1000; // 5 minutos

        const isGrouped = Boolean(
          shouldGroupWithPrevious || shouldGroupWithNext
        );
        const messageWithGrouping: Message = {
          ...message,
          // Adiciona metadados para renderização agrupada
          _grouping: {
            isGroupStart: !shouldGroupWithPrevious && isGrouped,
            isGroupEnd: !shouldGroupWithNext && isGrouped,
            isGrouped: isGrouped,
          },
        };

        grouped.push({
          type: 'message',
          message: messageWithGrouping,
          key: `message-${message.id}`,
        });
      });

      return grouped;
    },
    { messageCount: messages.length }
  );
};
