import { text, integer } from "drizzle-orm/sqlite-core";
import { createTable, TBaseTable, TBaseInsert } from "@/api/db/schema/base-entity";

export const projects = createTable("projects", {
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").default("#f76808"),
  icon: text("icon").default("Folder"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  status: text("status").default("active"),
  ownerId: text("owner_id"),
});

// Types
export type TProject = TBaseTable<typeof projects>;
export type TNewProject = TBaseInsert<typeof projects>;
