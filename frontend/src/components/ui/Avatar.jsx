import React from 'react';

export function Avatar({
  src,
  name = 'User',
  size = 'md',
  className = '',
}) {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm font-semibold',
    lg: 'w-12 h-12 text-base font-semibold',
    xl: 'w-16 h-16 text-lg font-bold',
  };

  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700 ${sizes[size] || sizes.md} ${className}`}
      />
    );
  }

  // Consistent pleasant colors based on name initials
  const colors = [
    'bg-indigo-600 text-white',
    'bg-blue-600 text-white',
    'bg-emerald-600 text-white',
    'bg-amber-600 text-white',
    'bg-purple-600 text-white',
    'bg-pink-600 text-white',
    'bg-rose-600 text-white',
  ];
  const charCode = name.charCodeAt(0) || 0;
  const color = colors[charCode % colors.length];

  return (
    <div
      className={`rounded-full flex items-center justify-center shrink-0 uppercase tracking-tight select-none shadow-xs ${color} ${sizes[size] || sizes.md} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}

export default Avatar;

