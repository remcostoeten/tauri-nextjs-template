"use server"

import { getNavigationPreferences } from "../repositories/navigation-preferences-repository"

export async function getNavigationPreferencesQuery(projectId: string) {
  return await getNavigationPreferences(projectId)
}
