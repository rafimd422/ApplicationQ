import {
  pgTable,
  uuid,
  varchar,
  date,
  time,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { staff } from "./staff";
import { services } from "./services";

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "Scheduled",
  "Completed",
  "Cancelled",
  "No-Show",
]);

export const appointments = pgTable(
  "appointments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    customerName: varchar("customer_name", { length: 255 }).notNull(),
    serviceId: uuid("service_id")
      .notNull()
      .references(() => services.id),
    staffId: uuid("staff_id").references(() => staff.id), // nullable - can be unassigned
    appointmentDate: date("appointment_date").notNull(),
    appointmentTime: time("appointment_time").notNull(),
    status: appointmentStatusEnum("status").default("Scheduled").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    staffDateIdx: index("appointments_staff_date_idx").on(
      table.staffId,
      table.appointmentDate,
    ),
    dateIdx: index("appointments_date_idx").on(table.appointmentDate),
    statusIdx: index("appointments_status_idx").on(table.status),
  }),
);

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  service: one(services, {
    fields: [appointments.serviceId],
    references: [services.id],
  }),
  staff: one(staff, {
    fields: [appointments.staffId],
    references: [staff.id],
  }),
}));

export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
