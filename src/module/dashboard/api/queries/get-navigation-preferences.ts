"use server"

import { getNavigationPreferences } from "@/module/dashboard/api/queries/navigation-preferences-repository"

export async function getNavigationPreferencesQuery(projectId: string) {
  return await getNavigationPreferences(projectId)
}
