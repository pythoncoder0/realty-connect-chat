
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, type: 'sale' | 'rent' = 'sale'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
  
  const formattedPrice = formatter.format(price);
  
  if (type === 'rent') {
    return `${formattedPrice}/month`;
  }
  
  return formattedPrice;
}

export function formatDate(dateString: string, formatStr: string = 'MMM d, yyyy'): string {
  const date = new Date(dateString);
  return format(date, formatStr);
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function generateChatId(userId: string, propertyId: string): string {
  return `chat-${userId}-${propertyId}`;
}

export function stripHtml(html: string): string {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}
