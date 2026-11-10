import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm shadow-slate-900/5 transition-all duration-200 ${
        hover ? 'hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  children,
  title,
  subtitle,
  action,
  className = '',
}) => {
  return (
    <div className={`p-6 border-b border-slate-100 flex items-start justify-between gap-4 ${className}`}>
      <div>
        {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        {children}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export const CardBody = ({ children, className = '' }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`p-4 sm:p-6 bg-slate-50/70 border-t border-slate-100 rounded-b-2xl flex items-center justify-between gap-3 ${className}`}>
      {children}
    </div>
  );
};
