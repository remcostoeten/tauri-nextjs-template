import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { projects } from '@/module/project/api/schema/project-schema';

export const taskSections = sqliteTable('task_sections', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  title: text('title').notNull(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  order: integer('order').notNull().default(0),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
}); 