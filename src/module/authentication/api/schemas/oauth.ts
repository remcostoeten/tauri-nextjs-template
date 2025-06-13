import { pgTable, text, timestamp, uuid, unique } from 'drizzle-orm/pg-core';

export const oauthAccounts = pgTable(
	'oauth_accounts',
	{
		id: uuid('id')
			.primaryKey()
			.defaultRandom(),
		userId: text('user_id').notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('provider_account_id').notNull(),
		accessToken: text('access_token').notNull(),
		createdAt: timestamp('created_at')
			.notNull()
			.defaultNow(),
		updatedAt: timestamp('updated_at')
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		providerAccountUnique: unique().on(table.provider, table.providerAccountId)
	})
);
