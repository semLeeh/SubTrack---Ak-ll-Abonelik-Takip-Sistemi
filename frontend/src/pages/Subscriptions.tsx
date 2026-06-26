import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Grid3X3, List, X } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Dropdown from '../components/ui/Dropdown';
import SubscriptionCard from '../components/subscriptions/SubscriptionCard';
import SubscriptionForm from '../components/subscriptions/SubscriptionForm';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from '../components/ui/Toast';
import { Subscription, CreateSubscriptionData } from '../types';
import { SUBSCRIPTION_STATUSES, BILLING_CYCLES } from '../utils/constants';

export default function Subscriptions() {
  const {
    subscriptions, categories, isLoading, error,
    fetchSubscriptions, fetchCategories,
    createSubscription, updateSubscription, cancelSubscription,
  } = useSubscriptions();

  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cycleFilter, setCycleFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const filters: Record<string, string> = {};
    if (statusFilter !== 'all') filters.status = statusFilter;
    if (cycleFilter !== 'all') filters.billingCycle = cycleFilter;
    if (debouncedSearch) filters.search = debouncedSearch;
    fetchSubscriptions(filters);
  }, [debouncedSearch, statusFilter, cycleFilter, fetchSubscriptions]);

  const handleCreate = async (data: CreateSubscriptionData) => {
    setFormLoading(true);
    try {
      await createSubscription(data);
      setShowForm(false);
      toast('Abonelik başarıyla oluşturuldu', 'success');
    } catch (err: any) {
      toast(err.response?.data?.error || 'Hata oluştu', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data: CreateSubscriptionData) => {
    if (!editingSub) return;
    setFormLoading(true);
    try {
      await updateSubscription(editingSub.id, data);
      setEditingSub(null);
      toast('Abonelik güncellendi', 'success');
    } catch (err: any) {
      toast(err.response?.data?.error || 'Hata oluştu', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = async (sub: Subscription) => {
    if (!confirm(`${sub.name} aboneliğini iptal etmek istediğinize emin misiniz?`)) return;
    try {
      await cancelSubscription(sub.id);
      toast(`${sub.name} iptal edildi`, 'success');
    } catch (err: any) {
      toast('İptal işlemi başarısız', 'error');
    }
  };

  const activeFilters = [statusFilter !== 'all', cycleFilter !== 'all', search !== ''].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <div className="flex-1 sm:max-w-xs">
            <Input
              placeholder="Abonelik ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
              rightIcon={search ? (
                <button onClick={() => setSearch('')}><X className="w-4 h-4" /></button>
              ) : undefined}
            />
          </div>
          <Dropdown
            options={[{ value: 'all', label: 'Tüm Durumlar' }, ...SUBSCRIPTION_STATUSES.filter(s => s.value !== 'all').map(s => ({ value: s.value, label: s.label }))]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <Dropdown
            options={[{ value: 'all', label: 'Tüm Döngüler' }, ...BILLING_CYCLES.map(c => ({ value: c.value, label: c.label }))]}
            value={cycleFilter}
            onChange={setCycleFilter}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 dark:bg-surface-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-surface-700 shadow-sm' : 'text-gray-400'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-surface-700 shadow-sm' : 'text-gray-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowForm(true)}>
            Yeni Abonelik
          </Button>
        </div>
      </div>

      {/* Active filters info */}
      {activeFilters > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Filter className="w-4 h-4" />
          <span>{subscriptions.length} sonuç gösteriliyor</span>
          <button
            onClick={() => { setSearch(''); setStatusFilter('all'); setCycleFilter('all'); }}
            className="text-brand-500 hover:text-brand-400 font-medium"
          >
            Filtreleri temizle
          </button>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}`}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-36 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Subscriptions */}
      {!isLoading && (
        <AnimatePresence mode="wait">
          {subscriptions.length > 0 ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}
            >
              {subscriptions.map((sub, index) => (
                <SubscriptionCard
                  key={sub.id}
                  subscription={sub}
                  index={index}
                  onEdit={s => setEditingSub(s)}
                  onCancel={handleCancel}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
                <Plus className="w-8 h-8 text-brand-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Henüz abonelik yok
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                İlk aboneliğinizi ekleyerek başlayın
              </p>
              <Button onClick={() => setShowForm(true)} icon={<Plus className="w-4 h-4" />}>
                Abonelik Ekle
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Create Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Yeni Abonelik" maxWidth="max-w-xl">
        <SubscriptionForm
          categories={categories}
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          isLoading={formLoading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingSub} onClose={() => setEditingSub(null)} title="Abonelik Düzenle" maxWidth="max-w-xl">
        <SubscriptionForm
          subscription={editingSub}
          categories={categories}
          onSubmit={handleUpdate}
          onCancel={() => setEditingSub(null)}
          isLoading={formLoading}
        />
      </Modal>
    </div>
  );
}
