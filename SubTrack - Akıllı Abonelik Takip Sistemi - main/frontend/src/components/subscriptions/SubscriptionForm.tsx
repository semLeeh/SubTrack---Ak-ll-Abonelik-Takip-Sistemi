import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';
import { Subscription, Category, CreateSubscriptionData } from '../../types';
import { BILLING_CYCLES, CURRENCIES, CATEGORY_COLORS } from '../../utils/constants';

interface SubscriptionFormProps {
  subscription?: Subscription | null;
  categories: Category[];
  onSubmit: (data: CreateSubscriptionData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function SubscriptionForm({ subscription, categories, onSubmit, onCancel, isLoading }: SubscriptionFormProps) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'TRY',
    billingCycle: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    nextBillingDate: '',
    provider: '',
    providerUrl: '',
    color: '#6366f1',
    categoryIds: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (subscription) {
      setForm({
        name: subscription.name,
        description: subscription.description || '',
        price: subscription.price.toString(),
        currency: subscription.currency,
        billingCycle: subscription.billingCycle,
        startDate: subscription.startDate.split('T')[0],
        nextBillingDate: subscription.nextBillingDate.split('T')[0],
        provider: subscription.provider || '',
        providerUrl: subscription.providerUrl || '',
        color: subscription.color || '#6366f1',
        categoryIds: subscription.categories.map(c => c.categoryId),
      });
    }
  }, [subscription]);

  // Auto-calculate next billing date
  useEffect(() => {
    if (form.startDate && !subscription) {
      const start = new Date(form.startDate);
      switch (form.billingCycle) {
        case 'weekly': start.setDate(start.getDate() + 7); break;
        case 'monthly': start.setMonth(start.getMonth() + 1); break;
        case 'yearly': start.setFullYear(start.getFullYear() + 1); break;
      }
      setForm(prev => ({ ...prev, nextBillingDate: start.toISOString().split('T')[0] }));
    }
  }, [form.startDate, form.billingCycle, subscription]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Abonelik adı gereklidir';
    if (!form.price || parseFloat(form.price) <= 0) errs.price = 'Geçerli bir fiyat girin';
    if (!form.nextBillingDate) errs.nextBillingDate = 'Sonraki faturalama tarihi gereklidir';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      name: form.name,
      description: form.description || undefined,
      price: parseFloat(form.price),
      currency: form.currency,
      billingCycle: form.billingCycle,
      startDate: form.startDate,
      nextBillingDate: form.nextBillingDate,
      provider: form.provider || undefined,
      providerUrl: form.providerUrl || undefined,
      color: form.color,
      categoryIds: form.categoryIds,
    });
  };

  const toggleCategory = (id: string) => {
    setForm(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter(c => c !== id)
        : [...prev.categoryIds, id],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Abonelik Adı"
          value={form.name}
          onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Netflix, Spotify..."
          error={errors.name}
        />
        <Input
          label="Sağlayıcı"
          value={form.provider}
          onChange={e => setForm(prev => ({ ...prev, provider: e.target.value }))}
          placeholder="Şirket adı"
        />
      </div>

      <Input
        label="Açıklama"
        value={form.description}
        onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
        placeholder="Plan detayları..."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Fiyat"
          type="number"
          step="0.01"
          value={form.price}
          onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))}
          placeholder="0.00"
          error={errors.price}
        />
        <Dropdown
          label="Para Birimi"
          options={CURRENCIES.map(c => ({ value: c.value, label: c.label }))}
          value={form.currency}
          onChange={v => setForm(prev => ({ ...prev, currency: v }))}
        />
        <Dropdown
          label="Faturalama"
          options={BILLING_CYCLES.map(c => ({ value: c.value, label: c.label }))}
          value={form.billingCycle}
          onChange={v => setForm(prev => ({ ...prev, billingCycle: v }))}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Başlangıç Tarihi"
          type="date"
          value={form.startDate}
          onChange={e => setForm(prev => ({ ...prev, startDate: e.target.value }))}
        />
        <Input
          label="Sonraki Faturalama"
          type="date"
          value={form.nextBillingDate}
          onChange={e => setForm(prev => ({ ...prev, nextBillingDate: e.target.value }))}
          error={errors.nextBillingDate}
        />
      </div>

      <Input
        label="Web Sitesi URL"
        value={form.providerUrl}
        onChange={e => setForm(prev => ({ ...prev, providerUrl: e.target.value }))}
        placeholder="https://example.com"
      />

      {/* Color picker */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Renk
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_COLORS.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => setForm(prev => ({ ...prev, color }))}
              className={`w-8 h-8 rounded-lg transition-all ${form.color === color ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-surface-800 scale-110' : 'hover:scale-105'}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Kategoriler
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border
                  transition-all duration-200
                  ${form.categoryIds.includes(cat.id)
                    ? 'border-transparent text-white shadow-md'
                    : 'border-gray-200 dark:border-surface-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-surface-600'
                  }
                `}
                style={form.categoryIds.includes(cat.id) ? { backgroundColor: cat.color } : {}}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: form.categoryIds.includes(cat.id) ? '#fff' : cat.color }} />
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-surface-700">
        <Button type="button" variant="ghost" onClick={onCancel}>
          İptal
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {subscription ? 'Güncelle' : 'Oluştur'}
        </Button>
      </div>
    </form>
  );
}
