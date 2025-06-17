import { eq, and } from "drizzle-orm"
import { navigationPreferences, type TNavigationPreference, type TNewNavigationPreference } from "@/api/db/schema"
import { db } from "@/api/db/connection"
import { sql } from "drizzle-orm"

type TProps = {
  itemId: string
  isVisible: number
  isFavorite: number
  position: number
  customLabel?: string | null
}

export async function getNavigationPreferences(projectId: string): Promise<TProps[]> {
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
  preferences: TProps[],
): Promise<void> {
  try {
    // Validate projectId
    if (!projectId || typeof projectId !== 'string' || projectId.trim() === '') {
      throw new Error('Invalid project ID provided')
    }

    // Validate preferences array
    if (!Array.isArray(preferences) || preferences.length === 0) {
      throw new Error('No preferences provided for update')
    }

    // Validate each preference object
    preferences.forEach((pref, index) => {
      if (!pref.itemId || typeof pref.itemId !== 'string' || pref.itemId.trim() === '') {
        throw new Error(`Invalid itemId in preference at index ${index}`)
      }
      if (typeof pref.isVisible !== 'number') {
        throw new Error(`Invalid isVisible value in preference at index ${index}`)
      }
      if (typeof pref.isFavorite !== 'number') {
        throw new Error(`Invalid isFavorite value in preference at index ${index}`)
      }
      if (typeof pref.position !== 'number') {
        throw new Error(`Invalid position value in preference at index ${index}`)
      }
    })

    await db.transaction(async (tx) => {
      for (const pref of preferences) {
        try {
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
            await tx
              .update(navigationPreferences)
              .set({
                isVisible: pref.isVisible,
                isFavorite: pref.isFavorite,
                position: pref.position,
                customLabel: pref.customLabel ?? null,
                updatedAt: sql`CURRENT_TIMESTAMP`,
              })
              .where(eq(navigationPreferences.id, existing[0].id))
          } else {
            await tx.insert(navigationPreferences).values({
              projectId,
              itemId: pref.itemId,
              isVisible: pref.isVisible,
              isFavorite: pref.isFavorite,
              position: pref.position,
              customLabel: pref.customLabel ?? null,
            })
          }
        } catch (error) {
          console.error("Failed to update/insert preference:", {
            error,
            projectId,
            preference: pref,
            errorMessage: error instanceof Error ? error.message : "Unknown error"
          })
          throw error
        }
      }
    })
  } catch (error) {
    console.error("Transaction failed in bulkUpdateNavigationPreferences:", {
      error,
      projectId,
      preferencesCount: preferences.length,
      errorMessage: error instanceof Error ? error.message : "Unknown error"
    })
    throw error
  }
}
