"use server"

import { revalidatePath } from "next/cache"
import { bulkUpdateNavigationPreferences } from "../queries/navigation-preferences-repository"

type TProps = {
  itemId: string
  isVisible: number
  isFavorite: number
  position: number
  customLabel?: string | null
}

export async function updateNavigationPreferencesMutation(
  projectId: string,
  preferences: TProps[]
) {
  try {
    if (!projectId) {
      throw new Error("Project ID is required")
    }

    if (!preferences || !Array.isArray(preferences) || preferences.length === 0) {
      throw new Error("Invalid preferences data provided")
    }

    // Log the input data for debugging
    console.log("Updating navigation preferences:", {
      projectId,
      preferencesCount: preferences.length,
      preferences: preferences.map(p => ({
        itemId: p.itemId,
        isVisible: p.isVisible,
        isFavorite: p.isFavorite,
        position: p.position
      }))
    })

    await bulkUpdateNavigationPreferences(projectId, preferences)
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Failed to update navigation preferences:", {
      error,
      projectId,
      preferencesData: preferences,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      errorStack: error instanceof Error ? error.stack : undefined
    })
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update navigation preferences",
    }
  }
} 