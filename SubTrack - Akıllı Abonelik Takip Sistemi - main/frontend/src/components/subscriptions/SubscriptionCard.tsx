import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, MoreVertical, Pause, Trash2 } from 'lucide-react';
import { Subscription } from '../../types';
import Badge, { getStatusBadgeVariant } from '../ui/Badge';
import { formatCurrency, formatRelativeDate, getStatusLabel, getBillingCycleLabel } from '../../utils/formatters';

interface SubscriptionCardProps {
  subscription: Subscription;
  index: number;
  onEdit: (sub: Subscription) => void;
  onCancel: (sub: Subscription) => void;
}

export default function SubscriptionCard({ subscription, index, onEdit, onCancel }: SubscriptionCardProps) {
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
      className="glass-card-hover p-5 group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0"
            style={{
              backgroundColor: subscription.color || '#6366f1',
              boxShadow: `0 4px 14px ${subscription.color || '#6366f1'}30`,
            }}
          >
            {subscription.name.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                {subscription.name}
              </h3>
              {subscription.providerUrl && (
                <a
                  href={subscription.providerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-brand-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
            {subscription.provider && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subscription.provider}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2">
              <Badge variant={getStatusBadgeVariant(subscription.status)} dot>
                {getStatusLabel(subscription.status)}
              </Badge>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {getBillingCycleLabel(subscription.billingCycle)}
              </span>
            </div>
            {/* Categories */}
            {subscription.categories.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {subscription.categories.map(({ category }) => (
                  <span
                    key={category.id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full"
                    style={{
                      backgroundColor: category.color + '15',
                      color: category.color,
                    }}
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Price & Menu */}
        <div className="flex items-start gap-2 flex-shrink-0">
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(subscription.price, subscription.currency)}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-1">
              <Calendar className="w-3 h-3" />
              <span>{formatRelativeDate(subscription.nextBillingDate)}</span>
            </div>
          </div>

          {/* Actions menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-700 transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-40 py-1 rounded-xl bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700 shadow-xl z-10">
                <button
                  onClick={() => { onEdit(subscription); setShowMenu(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-surface-700"
                >
                  Düzenle
                </button>
                {subscription.status === 'active' && (
                  <button
                    onClick={() => { onCancel(subscription); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    İptal Et
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
