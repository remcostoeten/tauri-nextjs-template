import { text, integer } from 'drizzle-orm/sqlite-core';
import { createTable, TBaseTable, TBaseInsert } from '@/api/db/schema/base-entity';
import { projects } from '@/module/project/api/schema/project-schema';

export const taskSections = createTable('task_sections', {
    title: text('title').notNull(),
    projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
    order: integer('order').notNull().default(0),
});

export type TTaskSection = TBaseTable<typeof taskSections>;
export type TNewTaskSection = TBaseInsert<typeof taskSections>; 