import { Request, Response, NextFunction } from "express";
import { db } from "../../config/index.js";
import { appointments, staff, waitingQueue } from "../../db/schema/index.js";
import { eq, and, count } from "drizzle-orm";
import dayjs from "dayjs";
import { apiResponse } from "../../utils/apiResponse.js";

export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const today = dayjs().format("YYYY-MM-DD");

    const [totalToday] = await db
      .select({ count: count() })
      .from(appointments)
      .where(eq(appointments.appointmentDate, today));

    const [completedToday] = await db
      .select({ count: count() })
      .from(appointments)
      .where(
        and(
          eq(appointments.appointmentDate, today),
          eq(appointments.status, "Completed"),
        ),
      );

    const [pendingToday] = await db
      .select({ count: count() })
      .from(appointments)
      .where(
        and(
          eq(appointments.appointmentDate, today),
          eq(appointments.status, "Scheduled"),
        ),
      );

    const [cancelledToday] = await db
      .select({ count: count() })
      .from(appointments)
      .where(
        and(
          eq(appointments.appointmentDate, today),
          eq(appointments.status, "Cancelled"),
        ),
      );

    const [noShowToday] = await db
      .select({ count: count() })
      .from(appointments)
      .where(
        and(
          eq(appointments.appointmentDate, today),
          eq(appointments.status, "No-Show"),
        ),
      );

    const [queueCount] = await db
      .select({ count: count() })
      .from(waitingQueue)
      .innerJoin(appointments, eq(waitingQueue.appointmentId, appointments.id))
      .where(eq(appointments.status, "Scheduled"));

    const [totalStaff] = await db.select({ count: count() }).from(staff);

    const [availableStaff] = await db
      .select({ count: count() })
      .from(staff)
      .where(eq(staff.availabilityStatus, "Available"));

    return apiResponse(res, 200, "Dashboard stats fetched successfully", {
      today,
      totalAppointments: totalToday?.count || 0,
      completed: completedToday?.count || 0,
      pending: pendingToday?.count || 0,
      cancelled: cancelledToday?.count || 0,
      noShow: noShowToday?.count || 0,
      waitingQueueCount: queueCount?.count || 0,
      totalStaff: totalStaff?.count || 0,
      availableStaff: availableStaff?.count || 0,
    });
  } catch (error) {
    next(error);
  }
};

export const getStaffLoad = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { date } = req.query;
    const targetDate =
      typeof date === "string" ? date : dayjs().format("YYYY-MM-DD");

    const allStaff = await db.select().from(staff).orderBy(staff.name);

    const staffLoad = await Promise.all(
      allStaff.map(async (s) => {
        const [result] = await db
          .select({ count: count() })
          .from(appointments)
          .where(
            and(
              eq(appointments.staffId, s.id),
              eq(appointments.appointmentDate, targetDate),
              eq(appointments.status, "Scheduled"),
            ),
          );

        const currentCount = result?.count || 0;
        const isAtCapacity = currentCount >= s.dailyCapacity;

        return {
          id: s.id,
          name: s.name,
          staffType: s.staffType,
          currentAppointments: currentCount,
          dailyCapacity: s.dailyCapacity,
          availabilityStatus: s.availabilityStatus,
          isAtCapacity,
          loadStatus: isAtCapacity ? "Booked" : "OK",
        };
      }),
    );

    return apiResponse(res, 200, "Staff load fetched successfully", {
      staffLoad,
      date: targetDate,
    });
  } catch (error) {
    next(error);
  }
};
