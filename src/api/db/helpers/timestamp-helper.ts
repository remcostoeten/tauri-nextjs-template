/**
 * @description Timestamp field helpers for SQLite schemas
 * @author Remco Stoeten
 */

import { integer } from "drizzle-orm/sqlite-core";

export const createdAt = integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date());

export const updatedAt = integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date());


export const timestamps = {
    createdAt,
    updatedAt,
} as const;