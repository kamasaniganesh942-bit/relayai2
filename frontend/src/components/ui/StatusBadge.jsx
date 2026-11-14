import React from 'react';
import Badge from './Badge';

export function StatusBadge({ status = 'new', className = '' }) {
  const statusConfig = {
    new: { label: 'New', variant: 'info' },
    under_review: { label: 'Under Review', variant: 'purple' },
    assigned: { label: 'Assigned', variant: 'primary' },
    in_progress: { label: 'In Progress', variant: 'primary' },
    waiting_approval: { label: 'Waiting Approval', variant: 'warning' },
    blocked: { label: 'Blocked', variant: 'danger' },
    completed: { label: 'Completed', variant: 'success' },
    rejected: { label: 'Rejected', variant: 'danger' },
    approved: { label: 'Approved', variant: 'success' },
    pending: { label: 'Pending', variant: 'warning' },
  };

  const key = String(status).toLowerCase().replace(/\s+/g, '_');
  const config = statusConfig[key] || { label: status, variant: 'default' };

  return (
    <Badge variant={config.variant} dot className={className}>
      {config.label}
    </Badge>
  );
}

export default StatusBadge;

