import { eq, and } from "drizzle-orm"
import { navigationPreferences, type TNavigationPreference, type TNewNavigationPreference } from "@/api/db/schema"
import { db } from "@/api/db/connection"
import { sql } from "drizzle-orm"

export async function getNavigationPreferences(projectId: string): Promise<TNavigationPreference[]> {
  return await db
    .select()
    .from(navigationPreferences)
    .where(eq(navigationPreferences.projectId, projectId))
    .orderBy(navigationPreferences.position)
}

export async function upsertNavigationPreference(
  preference: TNewNavigationPreference,
): Promise<TNavigationPreference> {
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
      .set({ ...preference, updatedAt: sql`CURRENT_TIMESTAMP` })
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
  preferences: Array<{ itemId: string; isVisible: boolean; isFavorite: boolean; position: number; customLabel?: string }>,
): Promise<void> {
  // Use transaction for bulk update
  await db.transaction(async (tx) => {
    for (const pref of preferences) {
      // First try to find existing preference
      const existing = await tx
        .select()
        .from(navigationPreferences)
        .where(
          and(
            eq(navigationPreferences.projectId, projectId),
            eq(navigationPreferences.itemId, pref.itemId),
          ),
        )
        .limit(1)

      if (existing.length > 0) {
        // Update existing preference
        await tx
          .update(navigationPreferences)
          .set({
            isVisible: pref.isVisible ? 1 : 0,
            isFavorite: pref.isFavorite ? 1 : 0,
            position: pref.position,
            customLabel: pref.customLabel,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(navigationPreferences.id, existing[0].id))
      } else {
        // Insert new preference
        await tx.insert(navigationPreferences).values({
          projectId,
          itemId: pref.itemId,
          isVisible: pref.isVisible ? 1 : 0,
          isFavorite: pref.isFavorite ? 1 : 0,
          position: pref.position,
          customLabel: pref.customLabel,
        })
      }
    }
  })
}
