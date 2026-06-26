import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Receipt, TrendingUp, TrendingDown, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import Card, { StatCard } from '../components/ui/Card';
import Badge, { getStatusBadgeVariant } from '../components/ui/Badge';
import Dropdown from '../components/ui/Dropdown';
import { paymentApi } from '../api/payment.api';
import { Payment, PaymentSummary, PaginatedResponse } from '../types';
import { formatCurrency, formatDateShort, getStatusLabel } from '../utils/formatters';
import { PAYMENT_STATUSES } from '../utils/constants';

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSummary() {
      try {
        const data = await paymentApi.getSummary();
        setSummary(data);
      } catch (err) {
        console.error('Summary error:', err);
      }
    }
    loadSummary();
  }, []);

  useEffect(() => {
    async function loadPayments() {
      setIsLoading(true);
      try {
        const data = await paymentApi.getAll(page, 15, statusFilter);
        setPayments(data.payments);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        console.error('Payments error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPayments();
  }, [page, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Bu Ay"
          value={formatCurrency(summary?.thisMonth || 0)}
          icon={<CreditCard className="w-5 h-5" />}
          color="#6366f1"
          trend={summary?.changePercent}
          delay={0}
        />
        <StatCard
          title="Geçen Ay"
          value={formatCurrency(summary?.lastMonth || 0)}
          icon={<Receipt className="w-5 h-5" />}
          color="#06b6d4"
          delay={0.05}
        />
        <StatCard
          title="Toplam Harcama"
          value={formatCurrency(summary?.totalSpent || 0)}
          subtitle={`${summary?.totalPayments || 0} ödeme`}
          icon={<TrendingUp className="w-5 h-5" />}
          color="#10b981"
          delay={0.1}
        />
      </div>

      {/* Payments table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Ödeme Geçmişi
            </h3>
            <Dropdown
              options={PAYMENT_STATUSES.map(s => ({ value: s.value, label: s.label }))}
              value={statusFilter}
              onChange={v => { setStatusFilter(v); setPage(1); }}
            />
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton h-16 rounded-xl" />
              ))}
            </div>
          ) : payments.length > 0 ? (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-surface-700">
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Abonelik</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tutar</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Durum</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tarih</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fatura No</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-surface-700/50">
                    {payments.map((payment, index) => (
                      <motion.tr
                        key={payment.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-gray-50 dark:hover:bg-surface-800/50 transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                              style={{ backgroundColor: payment.subscription?.color || '#6366f1' }}
                            >
                              {payment.subscription?.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {payment.subscription?.name || 'Bilinmeyen'}
                              </p>
                              {payment.subscription?.provider && (
                                <p className="text-xs text-gray-400">{payment.subscription.provider}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(payment.amount, payment.currency)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant={getStatusBadgeVariant(payment.status)} dot>
                            {getStatusLabel(payment.status)}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-sm text-gray-500 dark:text-gray-400">
                          {formatDateShort(payment.paidAt)}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-gray-400 dark:text-gray-500 font-mono">
                          {payment.invoiceUrl || '-'}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100 dark:border-surface-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sayfa {page} / {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500">
              <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Ödeme kaydı bulunamadı</p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
