'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';

type ToastKind = 'success' | 'error';
interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}

const ToastCtx = createContext<{ show: (message: string, kind?: ToastKind) => void } | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

let counter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((message: string, kind: ToastKind = 'success') => {
    const id = ++counter;
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2400);
  }, []);

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div className="toast-wrap">
        {toasts.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`toast toast-${t.kind}`}
            onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
          >
            {t.kind === 'success' ? (
              <Check size={14} strokeWidth={2.5} />
            ) : (
              <AlertCircle size={14} strokeWidth={2.5} />
            )}
            <span>{t.message}</span>
          </button>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
