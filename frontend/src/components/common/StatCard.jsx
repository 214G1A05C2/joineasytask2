import React from 'react';
import { Card } from './Card';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'indigo',
  trend,
  className = '',
}) => {
  const colorStyles = {
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      ring: 'ring-indigo-100',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      ring: 'ring-emerald-100',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      ring: 'ring-amber-100',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      ring: 'ring-rose-100',
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      ring: 'ring-blue-100',
    },
  };

  const scheme = colorStyles[color] || colorStyles.indigo;

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900">{value}</span>
            {trend && (
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  trend.isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>

        {Icon && (
          <div className={`p-3 rounded-2xl ring-4 ${scheme.bg} ${scheme.text} ${scheme.ring}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  );
};
