import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger', // danger, warning, success, info
  loading = false,
}) => {
  const iconConfig = {
    danger: {
      icon: AlertTriangle,
      color: 'text-rose-600 bg-rose-50 ring-rose-100',
      btnVariant: 'danger',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-50 ring-amber-100',
      btnVariant: 'primary',
    },
    success: {
      icon: CheckCircle,
      color: 'text-emerald-600 bg-emerald-50 ring-emerald-100',
      btnVariant: 'success',
    },
    info: {
      icon: Info,
      color: 'text-indigo-600 bg-indigo-50 ring-indigo-100',
      btnVariant: 'primary',
    },
  };

  const current = iconConfig[type] || iconConfig.danger;
  const IconComponent = current.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-2xl ring-4 shrink-0 ${current.color}`}>
          <IconComponent className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="text-base font-semibold text-slate-900">{title}</h4>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          variant={current.btnVariant}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};
