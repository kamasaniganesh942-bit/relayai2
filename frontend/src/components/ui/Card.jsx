import React from 'react';

export function Card({
  children,
  className = '',
  title,
  subtitle,
  action,
  headerAction,
  padding = 'normal',
  ...props
}) {
  const paddings = {
    none: '',
    sm: 'p-4',
    normal: 'p-6',
    lg: 'p-8',
  };

  const actualHeaderAction = action || headerAction;

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-200 ${className}`}
      {...props}
    >
      {(title || subtitle || actualHeaderAction) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {actualHeaderAction && <div>{actualHeaderAction}</div>}
        </div>
      )}
      <div className={paddings[padding]}>{children}</div>
    </div>
  );
}

export default Card;

