import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { WEEECheckbox } from "@/shared/ui/weee-checkbox"
import { usePlatform } from "@/shared/hooks/use-platform"
import { IfTauri } from "@/shared/core/if-tauri"
import { IfWeb } from "@/shared/core/if-web"
import clsx from "clsx"

type TPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"

type AnimationType = "fade" | "slide" | "none"

type TProps =  {
  position?: TPosition
  offset?: { x: number; y: number }
  animation?: AnimationType
  showCheckbox?: boolean
  storageKey?: string
  onAction?: () => void
  actionLabel?: string
  message?: string
  hidePermanentlyLabel?: string
}

export function DesktopAppToast({
  position = "bottom-right",
  offset = { x: 20, y: 20 },
  animation = "slide",
  showCheckbox = true,
  storageKey = "desktopAppToastHidden",
  onAction,
  actionLabel = "Open",
  message = "We've detected the app is installed.",
  hidePermanentlyLabel = "Automatically open in desktop app"
}: TProps) {
  const [visible, setVisible] = useState(false)
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const { isTauri } = usePlatform()

  useEffect(() => {
    const checkStorageAndShow = async () => {
      try {
        let isHidden = false

        if (isTauri) {
          try {
            // Use Tauri's secure storage if available
            const { Store } = await import('@tauri-apps/plugin-store')
            const store = await Store.load('app-preferences.dat')
            const storedValue = await store.get(storageKey)
            isHidden = Boolean(storedValue)
          } catch (storeError) {
            console.warn('Tauri store not available, falling back to localStorage:', storeError)
            isHidden = localStorage.getItem(storageKey) === 'true'
          }
        } else {
          // Fallback to localStorage for web
          isHidden = localStorage.getItem(storageKey) === 'true'
        }

        if (!isHidden) {
          setVisible(true)
        }
      } catch (error) {
        console.error('Failed to check storage:', error)
        // Fallback to localStorage
        const isHidden = localStorage.getItem(storageKey) === 'true'
        if (!isHidden) {
          setVisible(true)
        }
      }
    }

    checkStorageAndShow()
  }, [storageKey, isTauri])

  const handleClose = () => {
    setVisible(false)
  }

  const handleHideForever = async () => {
    if (typeof window === "undefined") return
    if (!storageKey) return

    try {
      if (isTauri) {
        try {
          // Use Tauri's secure storage if available
          const { Store } = await import('@tauri-apps/plugin-store')
          const store = await Store.load('app-preferences.dat')
          await store.set(storageKey, true)
          await store.save()
        } catch (storeError) {
          console.warn('Tauri store not available, falling back to localStorage:', storeError)
          localStorage.setItem(storageKey, "true")
        }
      } else {
        // Fallback to localStorage for web
        localStorage.setItem(storageKey, "true")
      }
      setVisible(false)
    } catch (error) {
      console.error('Failed to save preference:', error)
      // Fallback to localStorage
      localStorage.setItem(storageKey, "true")
      setVisible(false)
    }
  }

  const handleAction = async () => {
    if (typeof window === "undefined") return

    try {
      if (isTauri) {
        try {
          // Use Tauri's shell plugin if available
          const { open } = await import('@tauri-apps/plugin-shell')
          await open("weee://open")
        } catch (shellError) {
          console.warn('Tauri shell plugin not available, falling back to window.open:', shellError)
          window.open("weee://open", "_blank")
        }
      } else {
        // Fallback for web browsers
        window.open("weee://open", "_blank")
      }
    } catch (error) {
      console.error('Failed to open app:', error)
      // Fallback to window.open
      window.open("weee://open", "_blank")
    }

    if (onAction) onAction()
    handleClose()
  }

  if (!visible) return null

  const positionClass = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0",
  }[position]

  const positionStyle = {
    "top-left": { top: `${offset.y}px`, left: `${offset.x}px` },
    "top-right": { top: `${offset.y}px`, right: `${offset.x}px` },
    "bottom-left": { bottom: `${offset.y}px`, left: `${offset.x}px` },
    "bottom-right": { bottom: `${offset.y}px`, right: `${offset.x}px` },
  }[position]

  const animationClass = {
    fade: "transition-opacity duration-300 opacity-100",
    slide: "transition-transform duration-300 transform translate-y-0",
    none: "",
  }[animation]

  return (
    <aside
      role="alert"
      aria-live="polite"
      style={positionStyle}
      className={clsx(
        "fixed z-50 w-[345px] rounded-lg border border-[#2a2a2a] bg-[#191919] p-3 shadow-lg",
        positionClass,
        animationClass
      )}
    >
      {/* Header */}
      <header className="flex items-center justify-between gap-1 mb-1">
        <div className="flex-1 min-w-0 pr-4">
          <h2 className="text-sm font-semibold text-[#eeeeee] leading-6 truncate">
            Open in desktop app?
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 rounded-full p-0 hover:bg-white/10 text-[#a6a6a6] hover:text-white absolute top-3 right-3"
          aria-label="Close"
          onClick={handleClose}
        >
          <X className="h-3 w-3" />
        </Button>
      </header>

      {/* Content */}
      <section className="mb-3 text-[#a6a6a6] text-xs leading-5">
        <p>{message}</p>
      </section>

      {/* Footer */}
      <footer className="flex items-center justify-between gap-1">
        {showCheckbox && (
          <div className="flex items-center space-x-2">
            <WEEECheckbox
              id="auto-open"
              checked={checkboxChecked}
              onChange={() => {
                setCheckboxChecked(!checkboxChecked)
                if (!checkboxChecked) {
                  handleHideForever()
                }
              }}
              size={16}
              color="#3b82f6"
            />
            <label
              htmlFor="auto-open"
              className="text-xs text-[#a6a6a6] cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              <IfTauri>{hidePermanentlyLabel} (secure storage)</IfTauri>
              <IfWeb>{hidePermanentlyLabel}</IfWeb>
            </label>
          </div>
        )}
        <Button
          size="sm"
          className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1 h-6 rounded"
          onClick={handleAction}
        >
          {actionLabel}
        </Button>
      </footer>
    </aside>
  )
}
