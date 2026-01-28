import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const staffTypeEnum = pgEnum("staff_type", [
  "Doctor",
  "Consultant",
  "Support Agent",
]);
export const availabilityStatusEnum = pgEnum("availability_status", [
  "Available",
  "On Leave",
]);

export const staff = pgTable("staff", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  staffType: staffTypeEnum("staff_type").notNull(),
  dailyCapacity: integer("daily_capacity").default(5).notNull(),
  availabilityStatus: availabilityStatusEnum("availability_status")
    .default("Available")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Staff = typeof staff.$inferSelect;
export type NewStaff = typeof staff.$inferInsert;
