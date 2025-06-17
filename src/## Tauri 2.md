## Tauri 2.0 & Nextjs 15 | CRUD | Sqlite | Drizzle

This is a desktop application which also must run on web. It's built with Nextjs 15+, Tauri 2.0. Drizzle-orm with drizzle-kit, sqlite via Turso and styling via TailwindCSS.

## Database

Don't ever touch the `drizzle.config.ts`
- The main schema is only responsible for re-exporting schemas comming from `src/module/MODULENAME/api/{MODULENAME-schema.ts,schemas/SUBMODULE-schemas.ts}
- We use  sqlite via Turso
- The database can be imported via `