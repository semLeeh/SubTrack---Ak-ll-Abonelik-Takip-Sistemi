// Utility constants

export const BILLING_CYCLES = [
  { value: 'weekly', label: 'Haftalık' },
  { value: 'monthly', label: 'Aylık' },
  { value: 'yearly', label: 'Yıllık' },
] as const;

export const SUBSCRIPTION_STATUSES = [
  { value: 'all', label: 'Tümü', color: '#94a3b8' },
  { value: 'active', label: 'Aktif', color: '#10b981' },
  { value: 'paused', label: 'Duraklatılmış', color: '#f59e0b' },
  { value: 'cancelled', label: 'İptal Edilmiş', color: '#ef4444' },
  { value: 'expired', label: 'Süresi Dolmuş', color: '#6b7280' },
] as const;

export const PAYMENT_STATUSES = [
  { value: 'all', label: 'Tümü' },
  { value: 'paid', label: 'Ödendi', color: '#10b981' },
  { value: 'pending', label: 'Beklemede', color: '#f59e0b' },
  { value: 'failed', label: 'Başarısız', color: '#ef4444' },
  { value: 'refunded', label: 'İade Edildi', color: '#8b5cf6' },
] as const;

export const CURRENCIES = [
  { value: 'TRY', label: '₺ TRY', symbol: '₺' },
  { value: 'USD', label: '$ USD', symbol: '$' },
  { value: 'EUR', label: '€ EUR', symbol: '€' },
  { value: 'GBP', label: '£ GBP', symbol: '£' },
] as const;

export const CATEGORY_COLORS = [
  '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981',
  '#f59e0b', '#ec4899', '#ef4444', '#f97316',
  '#14b8a6', '#6366f1', '#a855f7', '#e11d48',
];

export const MONTHS_TR = [
  'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
  'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara',
];

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
