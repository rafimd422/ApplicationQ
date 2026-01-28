import { pgTable, uuid, integer, timestamp, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { appointments } from "./appointments";

export const waitingQueue = pgTable(
  "waiting_queue",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    appointmentId: uuid("appointment_id")
      .notNull()
      .references(() => appointments.id, { onDelete: "cascade" }),
    queuePosition: integer("queue_position").notNull(),
    addedAt: timestamp("added_at").defaultNow().notNull(),
  },
  (table) => ({
    positionIdx: index("waiting_queue_position_idx").on(table.queuePosition),
    appointmentIdx: index("waiting_queue_appointment_idx").on(
      table.appointmentId,
    ),
  }),
);

export const waitingQueueRelations = relations(waitingQueue, ({ one }) => ({
  appointment: one(appointments, {
    fields: [waitingQueue.appointmentId],
    references: [appointments.id],
  }),
}));

export type WaitingQueueEntry = typeof waitingQueue.$inferSelect;
export type NewWaitingQueueEntry = typeof waitingQueue.$inferInsert;
