import { projects } from "@/module/project/api/schema/project-schema"
import { sql } from "drizzle-orm"
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core"

export const navigationPreferences = sqliteTable("navigation_preferences", {
  id: text("id").primaryKey().default(sql`lower(hex(randomblob(16)))`),
  projectId: text("project_id").notNull().references(() => projects.id),
  itemId: text("item_id").notNull(),
  isVisible: integer("is_visible").notNull().default(1),
  position: integer("position").notNull(),
  isFavorite: integer("is_favorite").notNull().default(0),
  customLabel: text("custom_label"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`)
}, (table) => ({
  projectItemUnique: unique().on(table.projectId, table.itemId)
}))

export type TNavigationPreference = typeof navigationPreferences.$inferSelect
export type TNewNavigationPreference = typeof navigationPreferences.$inferInsert