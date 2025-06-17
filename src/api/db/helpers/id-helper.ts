/**
 * @description ID field helpers for SQLite schemas
 * @author Remco Stoeten
 */

import { text } from "drizzle-orm/sqlite-core";
import { createId } from '@paralleldrive/cuid2';

export const cuidId = text("id").primaryKey().$defaultFn(() => createId());