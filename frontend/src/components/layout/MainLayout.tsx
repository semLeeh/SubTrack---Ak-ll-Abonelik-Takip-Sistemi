import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Genel bakış ve istatistikler' },
  '/subscriptions': { title: 'Abonelikler', subtitle: 'Aboneliklerinizi yönetin' },
  '/payments': { title: 'Ödemeler', subtitle: 'Ödeme geçmişi ve faturalar' },
  '/reports': { title: 'Raporlar', subtitle: 'Gelir analizi ve raporlar' },
  '/settings': { title: 'Ayarlar', subtitle: 'Hesap ve tercihler' },
};

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pageInfo = pageTitles[location.pathname] || { title: 'SubTracker' };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-surface-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="px-4 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
