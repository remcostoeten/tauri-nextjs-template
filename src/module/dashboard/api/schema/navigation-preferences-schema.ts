import { projects } from "@/api/db/schema"
import { sql } from "drizzle-orm"
import { integer, text } from "drizzle-orm/sqlite-core"
import { sqliteTable } from "drizzle-orm/sqlite-core"

export const navigationPreferences = sqliteTable("navigation_preferences", {
  id: text("id").primaryKey().default(sql`lower(hex(randomblob(16)))`),
  projectId: text("project_id").notNull().references(() => projects.id),
  itemId: text("item_id").notNull(),
  isVisible: integer("is_visible").notNull().default(1),
  position: integer("position").notNull(),
  customLabel: text("custom_label"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`)
})

export type t_navigation_preference = typeof navigationPreferences.$inferSelect
export type t_new_navigation_preference = typeof navigationPreferences.$inferInsert