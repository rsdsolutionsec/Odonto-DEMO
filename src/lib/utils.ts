import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(isoString: string): string {
  try {
    const date = typeof isoString === 'string' ? parseISO(isoString) : new Date(isoString);
    return format(date, "EEEE d 'de' MMMM, yyyy - HH:mm", { locale: es });
  } catch {
    return isoString;
  }
}

export function formatDate(dateString: string): string {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return format(date, "d 'de' MMMM, yyyy", { locale: es });
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string): string {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return format(date, 'dd/MM/yyyy');
  } catch {
    return dateString;
  }
}

export function formatTime(isoOrTimeString: string): string {
  try {
    if (isoOrTimeString.includes('T')) {
      return format(parseISO(isoOrTimeString), 'HH:mm');
    }
    return isoOrTimeString.slice(0, 5);
  } catch {
    return isoOrTimeString;
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}
