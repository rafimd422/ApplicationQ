import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { staffTypeEnum } from "./staff";

export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  serviceName: varchar("service_name", { length: 255 }).notNull(),
  duration: integer("duration").notNull(), // in minutes: 15, 30, 60
  requiredStaffType: staffTypeEnum("required_staff_type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
