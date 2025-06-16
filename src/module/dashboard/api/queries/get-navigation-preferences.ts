import type { t_navigation_preference } from "@/api/db/schema"

// This is a mock implementation - replace with real database query later
export async function getNavigationPreferencesQuery(projectId: string): Promise<t_navigation_preference[]> {
  // For now, return empty array to use default navigation
  return []
} 