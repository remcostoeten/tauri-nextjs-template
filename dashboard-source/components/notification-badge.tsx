import type { t_notification } from "../types/sidebar-types"

type NotificationBadgeProps = {
  notifications?: t_notification[]
  className?: string
}

export function NotificationBadge({ notifications, className = "" }: NotificationBadgeProps) {
  if (!notifications || notifications.length === 0) {
    return null
  }

  const totalCount = notifications.reduce((sum, notif) => sum + notif.count, 0)

  if (totalCount === 0) {
    return null
  }

  return (
    <div
      className={`absolute -top-0.5 -right-0.5 bg-[#e93d82] text-white text-[10px] rounded-full min-w-[14px] h-[14px] flex items-center justify-center font-medium leading-none ${className}`}
    >
      {totalCount > 9 ? "9+" : totalCount}
    </div>
  )
}
