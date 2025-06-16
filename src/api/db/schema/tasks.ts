import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { taskSections } from './task-sections';
import { projects } from '@/module/project/api/schema/project-schema';

export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey().default(sql`lower(hex(randomblob(16)))`),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').default('todo'),
  priority: text('priority').default('medium'),
  projectId: text('project_id').references(() => projects.id),
  sectionId: text('section_id').references(() => taskSections.id),
  assigneeId: text('assignee_id'),
  order: integer('order').default(0),
  dueDate: text('due_date'),
  completedAt: text('completed_at'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export type TTask = typeof tasks.$inferSelect;
export type TNewTask = typeof tasks.$inferInsert; 