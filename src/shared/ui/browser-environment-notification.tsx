'use client'

import { DesktopAppToast } from './action-notification'
import { IfWeb } from '@/shared/core/if-web'

type TBrowserNotificationProps = {
  /**
   * Whether to show the notification
   * @default true
   */
  show?: boolean
  /**
   * Custom message to display
   * @default "Browser Environment: Window controls are not available in web browser mode. Build and run the Tauri desktop app to see the custom title bar and window controls."
   */
  message?: string
  /**
   * Custom action label
   * @default "Download Desktop App"
   */
  actionLabel?: string
  /**
   * Custom storage key for hiding the notification
   * @default "browserEnvironmentNotificationHidden"
   */
  storageKey?: string
  /**
   * Custom action handler
   * @default Opens Tauri documentation
   */
  onAction?: () => void
  /**
   * Position of the notification
   * @default "bottom-right"
   */
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
}

/**
 * Browser Environment Notification Component
 *
 * Shows a notification to web users about the availability of the desktop app
 * with enhanced features like window controls and native functionality.
 *
 * Only renders in web browser environment (not in Tauri).
 */
export function BrowserEnvironmentNotification({
  show = true,
  message = "Browser Environment: Window controls are not available in web browser mode. Build and run the Tauri desktop app to see the custom title bar and window controls.",
  actionLabel = "Learn More",
  storageKey = "browserEnvironmentNotificationHidden",
  onAction,
  position = "bottom-right"
}: TBrowserNotificationProps) {
  const defaultAction = () => {
    // Default action: open Tauri documentation or your app's download page
    window.open('https://github.com/tauri-apps/tauri', '_blank')
  }

  if (!show) return null

  return (
    <IfWeb>
      <DesktopAppToast
        position={position}
        storageKey={storageKey}
        message={message}
        actionLabel={actionLabel}
        hidePermanentlyLabel="Don't show this again"
        onAction={onAction || defaultAction}
        showCheckbox={true}
        animation="slide"
      />
    </IfWeb>
  )
}

/**
 * Hook for controlling the browser environment notification
 */
export function useBrowserEnvironmentNotification() {
  const showNotification = (options?: Partial<TBrowserNotificationProps>) => {
    // This could be enhanced to programmatically show the notification
    // For now, it returns the component with the given options
    return <BrowserEnvironmentNotification {...options} />
  }

  return {
    showNotification,
    BrowserEnvironmentNotification
  }
}
