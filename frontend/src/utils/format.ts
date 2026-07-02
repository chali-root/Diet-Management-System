import dayjs from 'dayjs';

export function formatDateTime(dateStr: string): string {
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm');
}

export function formatDate(dateStr: string): string {
  return dayjs(dateStr).format('YYYY-MM-DD');
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function getTodayStr(): string {
  return dayjs().format('YYYY-MM-DD');
}
