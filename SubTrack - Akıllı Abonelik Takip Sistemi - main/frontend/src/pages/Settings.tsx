import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Moon, Sun, Save } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../components/ui/Toast';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUser({ name, email });
      toast('Profil güncellendi', 'success');
    } catch (err: any) {
      toast(err.response?.data?.error || 'Güncelleme başarısız', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Profil Bilgileri
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Ad Soyad"
              value={name}
              onChange={e => setName(e.target.value)}
              icon={<User className="w-4 h-4" />}
            />
            <Input
              label="E-posta"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
            />
            <div className="flex justify-end">
              <Button type="submit" isLoading={isSaving} icon={<Save className="w-4 h-4" />}>
                Kaydet
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>

      {/* Theme */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Görünüm
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="w-5 h-5 text-brand-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {isDark ? 'Koyu Tema' : 'Açık Tema'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Arayüz temasını değiştirin
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`
                relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300
                ${isDark ? 'bg-brand-500' : 'bg-gray-300'}
              `}
            >
              <span
                className={`
                  inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300
                  ${isDark ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </Card>
      </motion.div>

      {/* Account Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Hesap Bilgileri
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-surface-700">
              <span className="text-gray-500 dark:text-gray-400">Hesap ID</span>
              <span className="text-gray-900 dark:text-white font-mono text-xs">{user?.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-surface-700">
              <span className="text-gray-500 dark:text-gray-400">Kayıt Tarihi</span>
              <span className="text-gray-900 dark:text-white">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : '-'}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500 dark:text-gray-400">Plan</span>
              <span className="text-brand-500 font-medium">Ücretsiz</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
