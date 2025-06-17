import { text, integer } from 'drizzle-orm/sqlite-core';
import { createTable, TBaseTable, TBaseInsert } from '@/api/db/schema/base-entity';
import { taskSections } from './task-section-schema';
import { projects } from '@/module/project/api/schema/project-schema';

export const tasks = createTable('tasks', {
    title: text('title').notNull(),
    description: text('description'),
    status: text('status').default('todo'),
    priority: text('priority').default('medium'),
    projectId: text('project_id').references(() => projects.id),
    sectionId: text('section_id').references(() => taskSections.id),
    assigneeId: text('assignee_id'),
    order: integer('order').default(0),
    dueDate: integer('due_date', { mode: "timestamp" }),
    completedAt: integer('completed_at', { mode: "timestamp" }),
});

export type TTask = TBaseTable<typeof tasks>;
export type TNewTask = TBaseInsert<typeof tasks>; 