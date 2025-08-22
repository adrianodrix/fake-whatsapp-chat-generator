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
