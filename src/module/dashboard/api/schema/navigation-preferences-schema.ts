import { projects } from "@/module/project/api/schema/project-schema"
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core"
import { createId } from '@paralleldrive/cuid2'

export const navigationPreferences = sqliteTable("navigation_preferences", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  projectId: text("project_id").notNull().references(() => projects.id),
  itemId: text("item_id").notNull(),
  isVisible: integer("is_visible").notNull().default(1),
  position: integer("position").notNull(),
  isFavorite: integer("is_favorite").notNull().default(0),
  customLabel: text("custom_label"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date())
}, (table) => ({
  projectItemUnique: unique().on(table.projectId, table.itemId)
}))

export type TNavigationPreference = typeof navigationPreferences.$inferSelect
export type TNewNavigationPreference = typeof navigationPreferences.$inferInsert