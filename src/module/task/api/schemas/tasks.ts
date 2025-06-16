import {
    sqliteTable,
    text
} from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"
import { projects } from "@/module/projects/api/schema/project-schema"

export const tasks = sqliteTable("tasks", {
    id: text("id").primaryKey().default(sql`lower(hex(randomblob(16)))`),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status").default("todo").notNull(),
    priority: text("priority").default("medium").notNull(),
    projectId: text("project_id").references(() => projects.id),
    assigneeId: text("assignee_id"),
    dueDate: text("due_date"),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`)
})

export type t_task = typeof tasks.$inferSelect
export type t_new_task = typeof tasks.$inferInsert
  