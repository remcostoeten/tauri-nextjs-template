'use client';

import type { t_notification } from '../types/sidebar-types';

type Props = {
  notifications?: t_notification[];
};

export function NotificationBadge({ notifications }: Props) {
  if (!notifications || notifications.length === 0) return null;

  const totalCount = notifications.reduce((sum, n) => sum + n.count, 0);
  const hasWarning = notifications.some((n) => n.type === 'warning');
  const hasError = notifications.some((n) => n.type === 'error');

  const bgColor = hasError
    ? 'bg-red-500'
    : hasWarning
    ? 'bg-yellow-500'
    : 'bg-blue-500';

  return (
    <div
      className={`absolute -right-1 -top-1 flex h-3 min-w-3 items-center justify-center rounded-full px-1 text-[10px] font-medium text-white ${bgColor}`}
    >
      {totalCount}
    </div>
  );
} 