import {
  pgTable,
  uuid,
  varchar,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const activityLogs = pgTable(
  "activity_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    action: varchar("action", { length: 255 }).notNull(),
    details: jsonb("details"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    createdAtIdx: index("activity_logs_created_at_idx").on(table.createdAt),
  }),
);

export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
