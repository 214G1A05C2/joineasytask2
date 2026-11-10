import React from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-sm shadow-indigo-600/20 focus-visible:ring-indigo-500',
  secondary:
    'bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 border border-slate-200 shadow-sm focus-visible:ring-slate-400',
  success:
    'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm shadow-emerald-600/20 focus-visible:ring-emerald-500',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm shadow-rose-600/20 focus-visible:ring-rose-500',
  outline:
    'border border-indigo-200 text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 focus-visible:ring-indigo-500',
  ghost:
    'text-slate-600 hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-slate-400',
};

const SIZES = {
  sm: 'px-2.5 py-1.5 text-xs font-medium rounded-lg',
  md: 'px-4 py-2 text-sm font-medium rounded-xl',
  lg: 'px-5 py-2.5 text-base font-medium rounded-xl',
  icon: 'p-2 rounded-xl',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  icon: Icon = null,
  iconPosition = 'left',
  onClick,
  className = '',
  ...props
}) => {
  const variantStyles = VARIANTS[variant] || VARIANTS.primary;
  const sizeStyles = SIZES[size] || SIZES.md;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 transition-all duration-150 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />
      )}
      {children}
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 shrink-0" />
      )}
    </button>
  );
};
