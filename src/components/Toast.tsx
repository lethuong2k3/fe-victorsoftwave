import React, { useEffect } from 'react';
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

