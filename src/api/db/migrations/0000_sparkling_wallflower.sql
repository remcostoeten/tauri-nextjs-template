CREATE TABLE oauth_accounts (
	id TEXT PRIMARY KEY NOT NULL,
	user_id TEXT NOT NULL,
	provider TEXT NOT NULL,
	provider_account_id TEXT NOT NULL,
	access_token TEXT NOT NULL,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX oauth_accounts_provider_provider_account_id_unique ON oauth_accounts (provider, provider_account_id);

CREATE TABLE sessions (
	id TEXT PRIMARY KEY NOT NULL,
	user_id TEXT NOT NULL,
	expires_at INTEGER NOT NULL,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL
);

CREATE TABLE users (
	id TEXT PRIMARY KEY NOT NULL,
	email TEXT NOT NULL,
	password TEXT,
	name TEXT,
	avatar TEXT,
	email_verified_at INTEGER,
	last_login_at INTEGER,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX users_email_unique ON users (email);

CREATE TABLE projects (
	id TEXT PRIMARY KEY NOT NULL,
	name TEXT NOT NULL,
	description TEXT,
	color TEXT DEFAULT '#f76808',
	icon TEXT DEFAULT 'Folder',
	is_active INTEGER DEFAULT 1,
	created_at TEXT DEFAULT (datetime('now')),
	updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE navigation_preferences (
	id TEXT PRIMARY KEY NOT NULL,
	project_id TEXT NOT NULL,
	item_id TEXT NOT NULL,
	is_visible INTEGER DEFAULT 1 NOT NULL,
	position INTEGER NOT NULL,
	custom_label TEXT,
	created_at TEXT DEFAULT (datetime('now')) NOT NULL,
	updated_at TEXT DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE tasks (
	id TEXT PRIMARY KEY NOT NULL,
	title TEXT NOT NULL,
	description TEXT,
	status TEXT DEFAULT 'todo',
	priority TEXT DEFAULT 'medium',
	project_id TEXT,
	assignee_id TEXT,
	due_date TEXT,
	created_at TEXT DEFAULT (datetime('now')),
	updated_at TEXT DEFAULT (datetime('now')),
	FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE NO ACTION ON DELETE NO ACTION
);
