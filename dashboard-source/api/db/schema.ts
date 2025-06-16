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

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).default("todo"),
  priority: varchar("priority", { length: 20 }).default("medium"),
  projectId: uuid("project_id").references(() => projects.id),
  assigneeId: varchar("assignee_id", { length: 255 }),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const navigationPreferences = pgTable("navigation_preferences", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .references(() => projects.id)
    .notNull(),
  itemId: varchar("item_id", { length: 255 }).notNull(),
  isVisible: boolean("is_visible").default(true),
  position: integer("position").notNull(),
  customLabel: varchar("custom_label", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export type t_project = typeof projects.$inferSelect
export type t_new_project = typeof projects.$inferInsert
export type t_task = typeof tasks.$inferSelect
export type t_new_task = typeof tasks.$inferInsert
export type t_navigation_preference = typeof navigationPreferences.$inferSelect
export type t_new_navigation_preference = typeof navigationPreferences.$inferInsert
