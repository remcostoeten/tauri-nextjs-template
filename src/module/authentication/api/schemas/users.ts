import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: uuid('id')
		.primaryKey()
		.defaultRandom(),
	email: text('email').notNull().unique(),
	password: text('password'),
	name: text('name'),
	avatar: text('avatar'),
	emailVerified: timestamp('email_verified_at'),
	lastLoginAt: timestamp('last_login_at'),
	createdAt: timestamp('created_at')
		.notNull()
		.defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow(),
});
