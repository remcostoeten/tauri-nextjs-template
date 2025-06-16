import { useState, useCallback } from "react"
import type { TNavigationItem, TNavigationPreference } from "../types/sidebar-types"

export function useNavigationPreferences(projectId: string | null) {
  const [preferences, setPreferences] = useState<TNavigationPreference[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const updatePreferences = useCallback(async (newPreferences: TNavigationPreference[]) => {
    try {
      // Here you would typically make an API call to persist the preferences
      console.log("Updating preferences:", newPreferences)
      setPreferences(newPreferences)
    } catch (error) {
      console.error("Failed to update preferences:", error)
      throw error
    }
  }, [])

  const applyPreferencesToNavigation = useCallback(
    (navigationItems: TNavigationItem[]) => {
      return navigationItems.map((item) => {
        const preference = preferences.find((p) => p.itemId === item.id)
        if (!preference) return item

        return {
          ...item,
          title: preference.customLabel || item.title,
          isVisible: preference.isVisible,
          isFavorite: preference.isFavorite || false,
        }
      })
    },
    [preferences]
  )

  return {
    preferences,
    updatePreferences,
    applyPreferencesToNavigation,
    isLoading,
  }
} 