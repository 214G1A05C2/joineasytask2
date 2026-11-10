import React from 'react';

export const ProgressBar = ({
  value = 0,
  max = 100,
  size = 'md',
  color = 'indigo',
  showLabel = false,
  labelPrefix = '',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  const colorGradients = {
    indigo: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    amber: 'bg-gradient-to-r from-amber-400 to-amber-500',
    rose: 'bg-gradient-to-r from-rose-500 to-red-600',
    blue: 'bg-gradient-to-r from-blue-500 to-cyan-500',
  };

  const selectedGradient =
    percentage === 100
      ? colorGradients.emerald
      : colorGradients[color] || colorGradients.indigo;

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5 font-medium">
          <span>{labelPrefix}</span>
          <span className="font-semibold text-slate-700">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${sizeClasses[size] || sizeClasses.md}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${selectedGradient}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
