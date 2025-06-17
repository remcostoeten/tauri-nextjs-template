import { text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Helper for created_at timestamp
export const createdAt = text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`);

// Helper for updated_at timestamp  
export const updatedAt = text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`)
    .$onUpdate(() => sql`(datetime('now'))`);

// Alternative: Using CURRENT_TIMESTAMP (also works)
export const createdAtAlt = text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`);

export const updatedAtAlt = text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`);
