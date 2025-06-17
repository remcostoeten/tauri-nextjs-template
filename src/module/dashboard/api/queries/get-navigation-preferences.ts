"use server"

import { getNavigationPreferences } from "./navigation-preferences-repository"

export async function getNavigationPreferencesQuery(projectId: string) {
  try {
    if (!projectId) {
      return []
    }
    return await getNavigationPreferences(projectId)
  } catch (error) {
    console.error("Failed to get navigation preferences:", error)
    throw error
  }
}
