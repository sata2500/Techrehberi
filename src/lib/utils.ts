import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind sınıflarını birleştiren yardımcı fonksiyon
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Belirli bir süre beklemek için kullanılabilecek yardımcı fonksiyon
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Belirli bir tarih formatında string oluşturur
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// String içindeki HTML etiketlerini temizler
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, '');
}

// Metin kısaltma fonksiyonu
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// URL slug oluşturma fonksiyonu
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

// Local storage'a veri kaydetme
export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Local storage error:', error);
    }
  }
}

// Local storage'dan veri okuma
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window !== 'undefined') {
    try {
      const value = window.localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : defaultValue;
    } catch (error) {
      console.error('Local storage error:', error);
      return defaultValue;
    }
  }
  return defaultValue;
}

// Her değişen yazı için rastgele ID oluşturma
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}