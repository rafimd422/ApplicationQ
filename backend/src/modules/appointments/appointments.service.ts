import { db } from "../../config/index.js";
import {
  appointments,
  services,
  waitingQueue
} from "../../db/schema/index.js";
import { eq, and, ne, count } from "drizzle-orm";
import dayjs from "dayjs";

export const checkTimeConflict = async (
  staffId: string,
  date: string,
  time: string,
  duration: number,
  excludeAppointmentId?: string,
) => {
  const appointmentStart = dayjs(`${date} ${time}`);
  const appointmentEnd = appointmentStart.add(duration, "minute");

  const existingAppointments = await db
    .select({
      id: appointments.id,
      time: appointments.appointmentTime,
      duration: services.duration,
    })
    .from(appointments)
    .innerJoin(services, eq(appointments.serviceId, services.id))
    .where(
      and(
        eq(appointments.staffId, staffId),
        eq(appointments.appointmentDate, date),
        eq(appointments.status, "Scheduled"),
        excludeAppointmentId
          ? ne(appointments.id, excludeAppointmentId)
          : undefined,
      ),
    );

  for (const existing of existingAppointments) {
    const existingStart = dayjs(`${date} ${existing.time}`);
    const existingEnd = existingStart.add(existing.duration, "minute");

    if (
      appointmentStart.isBefore(existingEnd) &&
      appointmentEnd.isAfter(existingStart)
    ) {
      return true;
    }
  }

  return false;
};

export const getNextQueuePosition = async () => {
  const [result] = await db.select({ maxPos: count() }).from(waitingQueue);
  return (result?.maxPos || 0) + 1;
};
