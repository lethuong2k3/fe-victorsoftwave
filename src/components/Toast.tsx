import React, { useEffect } from 'react';
<<<<<<< HEAD
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export type ToastMessage = {
  type: 'success' | 'error' | 'info';
  text: string;
};

type ToastProps = {
  message: ToastMessage | null;
  onClose: () => void;
  durationMs?: number;
};

export const Toast: React.FC<ToastProps> = ({ message, onClose, durationMs = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, durationMs);
    return () => clearTimeout(timer);
  }, [message, onClose, durationMs]);

  if (!message) return null;

  const styles =
    message.type === 'success'
      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
      : message.type === 'error'
      ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300';

  const Icon =
    message.type === 'success' ? CheckCircle2 : message.type === 'error' ? AlertCircle : Info;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-sm ${styles}`}
        role="alert"
        aria-live="polite"
      >
        <Icon className="w-5 h-5 shrink-0" />
        <div className="text-sm">{message.text}</div>
        <button
          aria-label="Close notification"
          onClick={onClose}
          className="ml-2 p-1 rounded-md hover:bg-white/30 dark:hover:bg-black/20 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

=======
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
>>>>>>> b2df92e (first commit)
