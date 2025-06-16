"use server"

import { bulkUpdateNavigationPreferences } from "../repositories/navigation-preferences-repository"
import { revalidatePath } from "next/cache"

export async function updateNavigationPreferencesMutation(
  projectId: string,
  preferences: Array<{ itemId: string; isVisible: boolean; position: number; customLabel?: string }>,
) {
  try {
    if (!projectId) {
      throw new Error("Project ID is required")
    }

    await bulkUpdateNavigationPreferences(projectId, preferences)

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to update navigation preferences:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update preferences" }
  }
}
