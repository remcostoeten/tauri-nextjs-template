import {
  sqliteTable,
  text,
  integer,
  primaryKey
} from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey().default(sql`lower(hex(randomblob(16)))`), // UUID alternative
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").default("#f76808"),
  icon: text("icon").default("Folder"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`)
})


// Types
export type t_project = typeof projects.$inferSelect
export type t_new_project = typeof projects.$inferInsert
