import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { projects } from '@/api/db/schema';

export const taskSections = sqliteTable('task_sections', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: text('title').notNull(),
    projectId: text('project_id').references(() => projects.id).notNull(),
    order: integer('order').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const taskLabels = sqliteTable('task_labels', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    color: text('color').notNull(),
    projectId: text('project_id').references(() => projects.id).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const taskLabelAssignments = sqliteTable('task_label_assignments', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    taskId: text('task_id').references(() => tasks.id).notNull(),
    labelId: text('label_id').references(() => taskLabels.id).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const tasks = sqliteTable('tasks', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: text('title').notNull(),
    description: text('description'),
    status: text('status').notNull().default('todo'),
    priority: text('priority').notNull().default('medium'),
    projectId: text('project_id').references(() => projects.id).notNull(),
    sectionId: text('section_id').references(() => taskSections.id),
    assigneeId: text('assignee_id'),
    order: integer('order').notNull().default(0),
    dueDate: integer('due_date', { mode: 'timestamp' }),
    completedAt: integer('completed_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const taskComments = sqliteTable('task_comments', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    taskId: text('task_id').references(() => tasks.id).notNull(),
    userId: text('user_id').notNull(),
    content: text('content').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}); 