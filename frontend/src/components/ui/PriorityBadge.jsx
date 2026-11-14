import React from 'react';
import Badge from './Badge';

export function PriorityBadge({ priority = 'medium', className = '' }) {
  const priorityConfig = {
    critical: { label: 'Critical', variant: 'danger' },
    high: { label: 'High', variant: 'warning' },
    medium: { label: 'Medium', variant: 'info' },
    low: { label: 'Low', variant: 'default' },
  };

  const key = String(priority).toLowerCase();
  const config = priorityConfig[key] || { label: priority, variant: 'default' };

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}

export default PriorityBadge;

