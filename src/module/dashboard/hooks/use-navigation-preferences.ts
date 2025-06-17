"use client"

import { useState, useCallback, useEffect } from "react"
import type { TNavigationItem, TNavigationPreferenceUI } from "../types/sidebar-types"
import { getNavigationPreferencesQuery } from "../api/queries/get-navigation-preferences"
import { updateNavigationPreferencesMutation } from "../api/mutations/update-navigation-preferences"
import { toast } from "sonner"
import type { TNavigationPreference } from "@/module/dashboard/api/schema/navigation-preferences-schema"

export function useNavigationPreferences(projectId: string | null) {
  const [preferences, setPreferences] = useState<TNavigationPreference[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load preferences when projectId changes
  useEffect(() => {
    if (!projectId) {
      setPreferences([])
      return
    }

    const loadPreferences = async () => {
      try {
        setIsLoading(true)
        const prefs = await getNavigationPreferencesQuery(projectId)
        setPreferences(prefs as TNavigationPreference[])
      } catch (error) {
        console.error("Failed to load preferences:", error)
        toast.error("Failed to load navigation preferences")
      } finally {
        setIsLoading(false)
      }
    }

    loadPreferences()
  }, [projectId])

  const updatePreferences = useCallback(async (preferences: TNavigationPreferenceUI[]) => {
    if (!projectId) {
      console.error("No project ID available for updating preferences")
      throw new Error("Project ID is required")
    }

    if (!Array.isArray(preferences) || preferences.length === 0) {
      console.error("Invalid preferences provided")
      throw new Error("No preferences provided")
    }

    try {
      setIsLoading(true)
      const prefsToUpdate = preferences.map((pref) => {
        if (!pref.itemId) {
          throw new Error(`Navigation preference has no itemId`)
        }

        return {
          itemId: pref.itemId,
          isVisible: pref.isVisible,
          isFavorite: pref.isFavorite,
          position: pref.position,
          customLabel: pref.customLabel || null,
          projectId,
        }
      })

      const result = await updateNavigationPreferencesMutation(projectId, prefsToUpdate)
      
      if (!result.success) {
        console.error("Failed to update preferences:", result.error)
        throw new Error(result.error || "Failed to update preferences")
      }

      // Fetch updated preferences instead of optimistically updating
      const updatedPrefs = await getNavigationPreferencesQuery(projectId)
      setPreferences(updatedPrefs as TNavigationPreference[])
      toast.success("Navigation preferences updated")
    } catch (error) {
      console.error("Failed to update preferences:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update navigation preferences")
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  const applyPreferencesToNavigation = useCallback(
    (navigationItems: TNavigationItem[]) => {
      if (!preferences.length) return navigationItems

      // Create a map for quick preference lookup
      const prefsMap = new Map(preferences.map(p => [p.itemId, p]))

      // Sort items based on position and apply preferences
      return [...navigationItems]
        .map(item => {
          const pref = prefsMap.get(item.id)
          if (!pref) return item

          return {
            ...item,
            title: pref.customLabel || item.title,
            isVisible: pref.isVisible === 1,
            isFavorite: pref.isFavorite === 1,
            position: pref.position,
          }
        })
        .sort((a, b) => {
          const posA = prefsMap.get(a.id)?.position ?? Number.MAX_SAFE_INTEGER
          const posB = prefsMap.get(b.id)?.position ?? Number.MAX_SAFE_INTEGER
          return posA - posB
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