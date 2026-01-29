import { Router, Request, Response } from "express";
import { db } from "../db/index";
import { appointments, staff, waitingQueue } from "../db/schema/index";
import { eq, and, count, sql } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth";
import dayjs from "dayjs";

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get dashboard stats
router.get("/stats", async (req: Request, res: Response) => {
  try {
    const today = dayjs().format("YYYY-MM-DD");

    // Total appointments today
    const [totalToday] = await db
      .select({ count: count() })
      .from(appointments)
      .where(eq(appointments.appointmentDate, today));

    // Completed today
    const [completedToday] = await db
      .select({ count: count() })
      .from(appointments)
      .where(
        and(
          eq(appointments.appointmentDate, today),
          eq(appointments.status, "Completed"),
        ),
      );

    // Pending (Scheduled) today
    const [pendingToday] = await db
      .select({ count: count() })
      .from(appointments)
      .where(
        and(
          eq(appointments.appointmentDate, today),
          eq(appointments.status, "Scheduled"),
        ),
      );

    // Cancelled today
    const [cancelledToday] = await db
      .select({ count: count() })
      .from(appointments)
      .where(
        and(
          eq(appointments.appointmentDate, today),
          eq(appointments.status, "Cancelled"),
        ),
      );

    // No-shows today
    const [noShowToday] = await db
      .select({ count: count() })
      .from(appointments)
      .where(
        and(
          eq(appointments.appointmentDate, today),
          eq(appointments.status, "No-Show"),
        ),
      );

    // Waiting queue count
    const [queueCount] = await db
      .select({ count: count() })
      .from(waitingQueue)
      .innerJoin(appointments, eq(waitingQueue.appointmentId, appointments.id))
      .where(eq(appointments.status, "Scheduled"));

    // Total staff
    const [totalStaff] = await db.select({ count: count() }).from(staff);

    // Available staff
    const [availableStaff] = await db
      .select({ count: count() })
      .from(staff)
      .where(eq(staff.availabilityStatus, "Available"));

    res.json({
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
    throw error;
  }
});

// Get staff load summary
router.get("/staff-load", async (req: Request, res: Response) => {
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

    res.json({ staffLoad, date: targetDate });
  } catch (error) {
    throw error;
  }
});

export default router;
