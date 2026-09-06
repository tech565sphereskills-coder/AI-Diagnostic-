import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-start p-4 rounded-xl bg-white shadow-xl border border-slate-200/80 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
        >
          <div className="mr-3 flex-shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
            {toast.type === 'info' && <AlertCircle className="w-5 h-5 text-blue-600" />}
          </div>
          <div className="flex-1 min-w-0 pr-2">
            <h4 className="text-sm font-semibold text-slate-900">{toast.title}</h4>
            {toast.message && <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>}
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
