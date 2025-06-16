import { pgTable, uuid, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { projects } from "@/module/project/api/schemas/projects";

export const navigationPreferences = pgTable("navigation_preferences", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .references(() => projects.id)
    .notNull(),
  itemId: varchar("item_id", { length: 255 }).notNull(),
  isVisible: boolean("is_visible").default(true),
  position: integer("position").notNull(),
  customLabel: varchar("custom_label", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type t_navigation_preference = typeof navigationPreferences.$inferSelect;
export type t_new_navigation_preference = typeof navigationPreferences.$inferInsert;

