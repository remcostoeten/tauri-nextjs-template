DROP INDEX "oauth_accounts_provider_provider_account_id_unique";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
DROP INDEX "navigation_preferences_project_id_item_id_unique";--> statement-breakpoint
ALTER TABLE `projects` ALTER COLUMN "status" TO "status" text DEFAULT 'active';--> statement-breakpoint
CREATE UNIQUE INDEX `oauth_accounts_provider_provider_account_id_unique` ON `oauth_accounts` (`provider`,`provider_account_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `navigation_preferences_project_id_item_id_unique` ON `navigation_preferences` (`project_id`,`item_id`);--> statement-breakpoint
ALTER TABLE `projects` ALTER COLUMN "owner_id" TO "owner_id" text;