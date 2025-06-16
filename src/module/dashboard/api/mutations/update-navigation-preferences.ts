"use server"

import { revalidatePath } from "next/cache"
import { bulkUpdateNavigationPreferences } from "@/module/dashboard/api/queries/navigation-preferences-repository"

type UpdateNavigationPreferencesResponse = {
  success: boolean
  error?: string
}

type NavigationPreference = {
  itemId: string
  isVisible: boolean
  isFavorite: boolean
  position: number
  customLabel?: string
}

export async function updateNavigationPreferencesMutation(
  projectId: string,
  preferences: NavigationPreference[]
): Promise<UpdateNavigationPreferencesResponse> {
  try {
    if (!projectId) {
      throw new Error("Project ID is required")
    }

    await bulkUpdateNavigationPreferences(projectId, preferences)

    revalidatePath("/dashboard")
    return {
      success: true,
    }
  } catch (error) {
    console.error("Failed to update navigation preferences:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update navigation preferences",
    }
  }
} 