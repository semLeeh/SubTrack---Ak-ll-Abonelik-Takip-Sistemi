import { CURRENCIES } from './constants';

export function formatCurrency(amount: number, currency: string = 'TRY'): string {
  const locale = currency === 'TRY' ? 'tr-TR' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getCurrencySymbol(currency: string): string {
  const found = CURRENCIES.find(c => c.value === currency);
  return found?.symbol || currency;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Bugün';
  if (diffDays === 1) return 'Yarın';
  if (diffDays === -1) return 'Dün';
  if (diffDays > 0 && diffDays <= 7) return `${diffDays} gün sonra`;
  if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} gün önce`;
  return formatDateShort(dateString);
}

export function getBillingCycleLabel(cycle: string): string {
  const labels: Record<string, string> = {
    weekly: 'Haftalık',
    monthly: 'Aylık',
    yearly: 'Yıllık',
  };
  return labels[cycle] || cycle;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Aktif',
    paused: 'Duraklatılmış',
    cancelled: 'İptal Edilmiş',
    expired: 'Süresi Dolmuş',
    paid: 'Ödendi',
    pending: 'Beklemede',
    failed: 'Başarısız',
    refunded: 'İade Edildi',
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: '#10b981',
    paused: '#f59e0b',
    cancelled: '#ef4444',
    expired: '#6b7280',
    paid: '#10b981',
    pending: '#f59e0b',
    failed: '#ef4444',
    refunded: '#8b5cf6',
  };
  return colors[status] || '#6b7280';
}

export function getMonthlyEquivalent(price: number, cycle: string): number {
  switch (cycle) {
    case 'weekly': return price * 4.33;
    case 'yearly': return price / 12;
    default: return price;
  }
}

export function daysUntil(dateString: string): number {
  const date = new Date(dateString);
  const now = new Date();
  return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
