import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, Sun, Moon, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { formatRelativeDate } from '../../utils/formatters';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
}

const typeIcons: Record<string, string> = {
  renewal: '🔄',
  payment: '💳',
  cancellation: '❌',
  info: 'ℹ️',
};

export default function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 px-4 lg:px-8 py-4 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-surface-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/30"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </motion.button>

            {/* Notification dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl
                             bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700
                             shadow-2xl shadow-black/10 dark:shadow-black/30"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-surface-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Bildirimler</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllAsRead()}
                        className="text-xs text-brand-500 hover:text-brand-600 font-medium"
                      >
                        Tümünü okundu yap
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                      Bildirim yok
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 dark:divide-surface-700">
                      {notifications.slice(0, 10).map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => {
                            if (!notif.isRead) markAsRead(notif.id);
                          }}
                          className={`
                            w-full text-left px-4 py-3 transition-colors
                            ${notif.isRead
                              ? 'bg-transparent'
                              : 'bg-brand-50/50 dark:bg-brand-500/5'
                            }
                            hover:bg-gray-50 dark:hover:bg-surface-700/50
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-lg flex-shrink-0 mt-0.5">
                              {typeIcons[notif.type] || 'ℹ️'}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${notif.isRead ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                                {notif.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                                {notif.message}
                              </p>
                              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                                {formatRelativeDate(notif.createdAt)}
                              </p>
                            </div>
                            {!notif.isRead && (
                              <span className="w-2 h-2 bg-brand-500 rounded-full flex-shrink-0 mt-2" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
