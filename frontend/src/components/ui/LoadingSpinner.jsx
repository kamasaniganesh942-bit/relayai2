import React from 'react';

export function LoadingSpinner({ size = 'md', message, className = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 gap-3 ${className}`}>
      <div
        className={`animate-spin rounded-full border-slate-200 dark:border-slate-800 border-t-indigo-600 dark:border-t-indigo-400 ${sizes[size] || sizes.md}`}
      />
      {message && <p className="text-xs font-medium text-slate-500 dark:text-slate-400 animate-pulse">{message}</p>}
    </div>
  );
}

export default LoadingSpinner;

