DROP INDEX "oauth_accounts_provider_provider_account_id_unique";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `tasks` ALTER COLUMN "status" TO "status" text NOT NULL DEFAULT 'todo';--> statement-breakpoint
CREATE UNIQUE INDEX `oauth_accounts_provider_provider_account_id_unique` ON `oauth_accounts` (`provider`,`provider_account_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `tasks` ALTER COLUMN "priority" TO "priority" text NOT NULL DEFAULT 'medium';