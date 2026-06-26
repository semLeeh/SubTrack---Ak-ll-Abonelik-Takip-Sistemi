import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg relative overflow-hidden">
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative z-10"
      >
        <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-2">Sayfa Bulunamadı</h2>
        <p className="text-gray-400 mb-8">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
        <Link to="/">
          <Button icon={<Home className="w-4 h-4" />} size="lg">
            Ana Sayfaya Dön
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
