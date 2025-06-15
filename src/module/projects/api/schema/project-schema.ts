import { pgTable, uuid, varchar, text, timestamp, boolean, integer } from "drizzle-orm/pg-core"

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 7 }).default("#f76808"),
  icon: varchar("icon", { length: 50 }).default("Folder"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export type t_project = typeof projects.$inferSelect
export type t_new_project = typeof projects.$inferInsert
