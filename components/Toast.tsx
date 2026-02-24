import React, { useEffect } from 'react';
import { Icon } from './Icon';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: number) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const getStyles = () => {
    switch (toast.type) {
      case 'success': return 'bg-white border-green-500 text-green-700';
      case 'error': return 'bg-white border-red-500 text-red-700';
      case 'warning': return 'bg-white border-orange-500 text-orange-700';
      default: return 'bg-white border-blue-500 text-blue-700';
    }
  };

  const getIcon = () => {
      switch (toast.type) {
          case 'success': return 'CheckCircle';
          case 'error': return 'AlertCircle';
          case 'warning': return 'Clock';
          default: return 'Info';
      }
  };

  return (
    <div className={`
      flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border-l-4 min-w-[300px] transform transition-all duration-500 animate-fade-in
      ${getStyles()}
    `}>
      <Icon name={getIcon()} size={20} />
      <span className="text-sm font-semibold flex-1 text-gray-800">{toast.message}</span>
      <button onClick={() => onClose(toast.id)} className="text-gray-400 hover:text-gray-600">
        <Icon name="X" size={16} />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: ToastMessage[], removeToast: (id: number) => void }> = ({ toasts, removeToast }) => {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            {toasts.map(t => (
                <Toast key={t.id} toast={t} onClose={removeToast} />
            ))}
        </div>
    );
};