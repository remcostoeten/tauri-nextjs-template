import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    description: text('description'),
    status: text('status').notNull().default('active'),
    ownerId: text('owner_id').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const projectMembers = sqliteTable('project_members', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    projectId: text('project_id').references(() => projects.id).notNull(),
    userId: text('user_id').notNull(),
    role: text('role').notNull().default('member'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}); 