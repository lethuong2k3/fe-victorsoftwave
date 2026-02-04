import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export type ToastMessage = {
  type: 'success' | 'error';
  text: string;
};

interface ToastProps {
  message: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className={`fixed top-24 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-sm ${
            message.type === 'success'
              ? 'bg-white/90 border-green-200 text-green-700 dark:bg-slate-800/90 dark:border-green-900 dark:text-green-400'
              : 'bg-white/90 border-red-200 text-red-700 dark:bg-slate-800/90 dark:border-red-900 dark:text-red-400'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors ml-2"
          >
            <X className="w-4 h-4 opacity-50" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
