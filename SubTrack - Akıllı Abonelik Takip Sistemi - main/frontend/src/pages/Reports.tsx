import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileSpreadsheet, BarChart3 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import RevenueChart from '../components/charts/RevenueChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import { reportApi } from '../api/report.api';
import { useToast } from '../components/ui/Toast';
import { RevenueDataPoint, CategoryDistribution } from '../types';

export default function Reports() {
  const [revenue, setRevenue] = useState<RevenueDataPoint[]>([]);
  const [categories, setCategories] = useState<CategoryDistribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [exporting, setExporting] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const [rev, cat] = await Promise.all([
          reportApi.getRevenue(12),
          reportApi.getCategoryDistribution(),
        ]);
        setRevenue(rev);
        setCategories(cat);
      } catch (err) {
        console.error('Reports error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleExport = async (type: 'subscriptions' | 'payments') => {
    setExporting(type);
    try {
      if (type === 'subscriptions') {
        await reportApi.exportSubscriptionsCSV();
      } else {
        await reportApi.exportPaymentsCSV();
      }
      toast(`${type === 'subscriptions' ? 'Abonelikler' : 'Ödemeler'} CSV olarak indirildi`, 'success');
    } catch (err) {
      toast('Export başarısız oldu', 'error');
    } finally {
      setExporting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-80 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="skeleton h-64 rounded-2xl" />
          <div className="skeleton h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Export buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="secondary"
          icon={<FileSpreadsheet className="w-4 h-4" />}
          onClick={() => handleExport('subscriptions')}
          isLoading={exporting === 'subscriptions'}
        >
          Abonelikleri İndir (CSV)
        </Button>
        <Button
          variant="secondary"
          icon={<Download className="w-4 h-4" />}
          onClick={() => handleExport('payments')}
          isLoading={exporting === 'payments'}
        >
          Ödemeleri İndir (CSV)
        </Button>
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Gelir/Gider Trendi
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Son 12 aylık harcama trendi</p>
            </div>
            <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-500/10">
              <BarChart3 className="w-5 h-5 text-brand-500" />
            </div>
          </div>
          {revenue.length > 0 ? (
            <RevenueChart data={revenue} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              Henüz yeterli veri yok
            </div>
          )}
        </Card>
      </motion.div>

      {/* Category Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Kategori Bazlı Dağılım
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Aktif aboneliklerin aylık maliyeti</p>
          </div>
          {categories.length > 0 ? (
            <CategoryPieChart data={categories} />
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-400">
              Henüz kategori verisi yok
            </div>
          )}
        </Card>
      </motion.div>

      {/* Summary Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Aylık Harcama Özeti
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-surface-700">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Ay</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Toplam</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">İşlem Sayısı</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-surface-700/50">
                {revenue.slice().reverse().map((item) => (
                  <tr key={item.month} className="hover:bg-gray-50 dark:hover:bg-surface-800/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{item.month}</td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900 dark:text-white">
                      {item.revenue > 0 ? `₺${item.revenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-gray-500 dark:text-gray-400">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
