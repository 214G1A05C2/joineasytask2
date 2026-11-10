import React from 'react';

const VARIANTS = {
  primary: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/10',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10',
  warning: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/10',
  danger: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/10',
  info: 'bg-sky-50 text-sky-700 border-sky-200 ring-sky-500/10',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/10',
  purple: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/10',
};

const SIZES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs font-medium',
  lg: 'px-3 py-1.5 text-sm font-medium',
};

export const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  dot = false,
  className = '',
  icon: Icon = null,
}) => {
  const variantStyles = VARIANTS[variant] || VARIANTS.primary;
  const sizeStyles = SIZES[size] || SIZES.md;

  const dotColors = {
    primary: 'bg-indigo-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
    neutral: 'bg-slate-400',
    purple: 'bg-purple-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ring-1 ring-inset ${variantStyles} ${sizeStyles} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant] || 'bg-slate-400'}`}
        />
      )}
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </span>
  );
};
