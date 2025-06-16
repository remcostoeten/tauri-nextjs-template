import { db } from "../db/connection"
import { navigationPreferences } from "../db/schema"
import { eq, and } from "drizzle-orm"
import type { t_navigation_preference, t_new_navigation_preference } from "../db/schema"

export async function getNavigationPreferences(projectId: string): Promise<t_navigation_preference[]> {
  return await db
    .select()
    .from(navigationPreferences)
    .where(eq(navigationPreferences.projectId, projectId))
    .orderBy(navigationPreferences.position)
}

export async function upsertNavigationPreference(
  preference: t_new_navigation_preference,
): Promise<t_navigation_preference> {
  const existing = await db
    .select()
    .from(navigationPreferences)
    .where(
      and(
        eq(navigationPreferences.projectId, preference.projectId),
        eq(navigationPreferences.itemId, preference.itemId),
      ),
    )
    .limit(1)

  if (existing.length > 0) {
    const result = await db
      .update(navigationPreferences)
      .set({ ...preference, updatedAt: new Date() })
      .where(eq(navigationPreferences.id, existing[0].id))
      .returning()
    return result[0]
  } else {
    const result = await db.insert(navigationPreferences).values(preference).returning()
    return result[0]
  }
}

export async function bulkUpdateNavigationPreferences(
  projectId: string,
  preferences: Array<{ itemId: string; isVisible: boolean; position: number; customLabel?: string }>,
): Promise<void> {
  // Use transaction for bulk update
  await db.transaction(async (tx) => {
    for (const pref of preferences) {
      await tx
        .insert(navigationPreferences)
        .values({
          projectId,
          itemId: pref.itemId,
          isVisible: pref.isVisible,
          position: pref.position,
          customLabel: pref.customLabel,
        })
        .onConflictDoUpdate({
          target: [navigationPreferences.projectId, navigationPreferences.itemId],
          set: {
            isVisible: pref.isVisible,
            position: pref.position,
            customLabel: pref.customLabel,
            updatedAt: new Date(),
          },
        })
    }
  })
}
