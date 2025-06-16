"use client"

import { useState, useEffect, useCallback } from "react"
import { getNavigationPreferencesQuery } from "../api/queries/get-navigation-preferences"
import { updateNavigationPreferencesMutation } from "../api/mutations/update-navigation-preferences"
import type { t_navigation_preference } from "@/api/db/schema"
import type { t_navigation_item } from "../types/sidebar-types"

export function useNavigationPreferences(projectId: string | null) {
  const [preferences, setPreferences] = useState<t_navigation_preference[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadPreferences = useCallback(async () => {
    if (!projectId) return

    try {
      setIsLoading(true)
      setError(null)
      const prefs = await getNavigationPreferencesQuery(projectId)
      setPreferences(prefs)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load preferences")
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  const updatePreferences = useCallback(
    async (newPreferences: Array<{ itemId: string; isVisible: boolean; position: number; customLabel?: string }>) => {
      if (!projectId) return

      try {
        setError(null)
        const result = await updateNavigationPreferencesMutation(projectId, newPreferences)
        if (result.success) {
          await loadPreferences()
        } else {
          throw new Error(result.error)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update preferences")
        throw err
      }
    },
    [projectId, loadPreferences],
  )

  const applyPreferencesToNavigation = useCallback(
    (navigationItems: t_navigation_item[]): t_navigation_item[] => {
      if (preferences.length === 0) return navigationItems

      // Create a map of preferences for quick lookup
      const prefsMap = new Map(preferences.map((pref) => [pref.itemId, pref]))

      // Apply preferences and sort by position
      const itemsWithPrefs = navigationItems
        .map((item) => {
          const pref = prefsMap.get(item.id)
          return {
            ...item,
            isVisible: pref?.isVisible ?? true,
            position: pref?.position ?? 999,
            customLabel: pref?.customLabel,
            title: pref?.customLabel || item.title,
          }
        })
        .filter((item) => item.isVisible)
        .sort((a, b) => a.position - b.position)

      return itemsWithPrefs
    },
    [preferences],
  )

  useEffect(() => {
    loadPreferences()
  }, [loadPreferences])

  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
    applyPreferencesToNavigation,
    refetch: loadPreferences,
  }
}
