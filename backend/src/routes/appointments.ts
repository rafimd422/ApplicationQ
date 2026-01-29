import { Router, Request, Response } from "express";
import { db } from "../db/index";
import {
  appointments,
  staff,
  services,
  waitingQueue,
} from "../db/schema/index";
import {
  appointmentSchema,
  updateAppointmentSchema,
} from "../validators/index";
import { eq, and, count, gte, lte, or, ne } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";
import { logActivity } from "../utils/activityLogger";
import dayjs from "dayjs";

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Check for time conflicts
const checkTimeConflict = async (
  staffId: string,
  date: string,
  time: string,
  duration: number,
  excludeAppointmentId?: string,
) => {
  const appointmentStart = dayjs(`${date} ${time}`);
  const appointmentEnd = appointmentStart.add(duration, "minute");

  // Get all appointments for this staff on this date
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

    // Check for overlap
    if (
      appointmentStart.isBefore(existingEnd) &&
      appointmentEnd.isAfter(existingStart)
    ) {
      return true; // Conflict found
    }
  }

  return false; // No conflict
};

// Get next queue position
const getNextQueuePosition = async () => {
  const [result] = await db.select({ maxPos: count() }).from(waitingQueue);
  return (result?.maxPos || 0) + 1;
};

// Get all appointments with filters
router.get("/", async (req: Request, res: Response) => {
  try {
    const { date, staffId, status } = req.query;

    let query = db
      .select({
        id: appointments.id,
        customerName: appointments.customerName,
        serviceId: appointments.serviceId,
        serviceName: services.serviceName,
        serviceDuration: services.duration,
        staffId: appointments.staffId,
        staffName: staff.name,
        appointmentDate: appointments.appointmentDate,
        appointmentTime: appointments.appointmentTime,
        status: appointments.status,
        createdAt: appointments.createdAt,
      })
      .from(appointments)
      .leftJoin(services, eq(appointments.serviceId, services.id))
      .leftJoin(staff, eq(appointments.staffId, staff.id));

    const conditions = [];

    if (date && typeof date === "string") {
      conditions.push(eq(appointments.appointmentDate, date));
    }

    if (staffId && typeof staffId === "string") {
      conditions.push(eq(appointments.staffId, staffId));
    }

    if (status && typeof status === "string") {
      conditions.push(eq(appointments.status, status as any));
    }

    const result =
      conditions.length > 0
        ? await query
            .where(and(...conditions))
            .orderBy(appointments.appointmentDate, appointments.appointmentTime)
        : await query.orderBy(
            appointments.appointmentDate,
            appointments.appointmentTime,
          );

    res.json({ appointments: result });
  } catch (error) {
    throw error;
  }
});

// Create appointment
router.post("/", async (req: Request, res: Response) => {
  try {
    const data = appointmentSchema.parse(req.body);

    // Get service details
    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, data.serviceId))
      .limit(1);
    if (!service) {
      throw new AppError("Service not found", 404);
    }

    let finalStaffId = data.staffId || null;
    let addedToQueue = false;

    if (finalStaffId) {
      // Check staff availability
      const [staffMember] = await db
        .select()
        .from(staff)
        .where(eq(staff.id, finalStaffId))
        .limit(1);

      if (!staffMember) {
        throw new AppError("Staff not found", 404);
      }

      if (staffMember.availabilityStatus !== "Available") {
        throw new AppError("Staff is on leave", 400);
      }

      // Check staff type matches required type
      if (staffMember.staffType !== service.requiredStaffType) {
        throw new AppError(
          `This service requires a ${service.requiredStaffType}`,
          400,
        );
      }

      // Check for time conflicts
      const hasConflict = await checkTimeConflict(
        finalStaffId,
        data.appointmentDate,
        data.appointmentTime,
        service.duration,
      );

      if (hasConflict) {
        throw new AppError(
          "This staff member already has an appointment at this time.",
          409,
        );
      }

      // Check daily capacity
      const [appointmentCount] = await db
        .select({ count: count() })
        .from(appointments)
        .where(
          and(
            eq(appointments.staffId, finalStaffId),
            eq(appointments.appointmentDate, data.appointmentDate),
            eq(appointments.status, "Scheduled"),
          ),
        );

      if ((appointmentCount?.count || 0) >= staffMember.dailyCapacity) {
        // Staff at capacity - null out the staffId and add to queue
        finalStaffId = null;
        addedToQueue = true;
      }
    } else {
      // No staff specified - add to queue
      addedToQueue = true;
    }

    // Create appointment
    const [newAppointment] = await db
      .insert(appointments)
      .values({
        customerName: data.customerName,
        serviceId: data.serviceId,
        staffId: finalStaffId,
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        status: "Scheduled",
      })
      .returning();

    // If no staff assigned, add to waiting queue
    if (addedToQueue) {
      const queuePosition = await getNextQueuePosition();
      await db.insert(waitingQueue).values({
        appointmentId: newAppointment.id,
        queuePosition,
      });

      await logActivity("Appointment added to queue", {
        appointmentId: newAppointment.id,
        customerName: data.customerName,
        queuePosition,
      });
    } else {
      await logActivity("Appointment created", {
        appointmentId: newAppointment.id,
        customerName: data.customerName,
        staffId: finalStaffId,
      });
    }

    res.status(201).json({
      appointment: newAppointment,
      addedToQueue,
      message: addedToQueue
        ? "Appointment created and added to waiting queue"
        : "Appointment created successfully",
    });
  } catch (error) {
    throw error;
  }
});

// Get appointment by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [appointment] = await db
      .select({
        id: appointments.id,
        customerName: appointments.customerName,
        serviceId: appointments.serviceId,
        serviceName: services.serviceName,
        serviceDuration: services.duration,
        staffId: appointments.staffId,
        staffName: staff.name,
        appointmentDate: appointments.appointmentDate,
        appointmentTime: appointments.appointmentTime,
        status: appointments.status,
        createdAt: appointments.createdAt,
      })
      .from(appointments)
      .leftJoin(services, eq(appointments.serviceId, services.id))
      .leftJoin(staff, eq(appointments.staffId, staff.id))
      .where(eq(appointments.id, id))
      .limit(1);

    if (!appointment) {
      throw new AppError("Appointment not found", 404);
    }

    res.json({ appointment });
  } catch (error) {
    throw error;
  }
});

// Update appointment
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateAppointmentSchema.parse(req.body);

    // Get existing appointment
    const [existing] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, id))
      .limit(1);
    if (!existing) {
      throw new AppError("Appointment not found", 404);
    }

    // If changing staff or time, check for conflicts
    if (data.staffId && (data.appointmentDate || data.appointmentTime)) {
      const [service] = await db
        .select()
        .from(services)
        .where(eq(services.id, existing.serviceId))
        .limit(1);

      const hasConflict = await checkTimeConflict(
        data.staffId,
        data.appointmentDate || existing.appointmentDate,
        data.appointmentTime || existing.appointmentTime,
        service?.duration || 30,
        id,
      );

      if (hasConflict) {
        throw new AppError(
          "This staff member already has an appointment at this time.",
          409,
        );
      }
    }

    const [updatedAppointment] = await db
      .update(appointments)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();

    // If staff was assigned, remove from queue if it was there
    if (data.staffId) {
      await db.delete(waitingQueue).where(eq(waitingQueue.appointmentId, id));
    }

    res.json({
      appointment: updatedAppointment,
      message: "Appointment updated successfully",
    });
  } catch (error) {
    throw error;
  }
});

// Cancel appointment
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [appointment] = await db
      .update(appointments)
      .set({ status: "Cancelled", updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();

    if (!appointment) {
      throw new AppError("Appointment not found", 404);
    }

    // Remove from queue if present
    await db.delete(waitingQueue).where(eq(waitingQueue.appointmentId, id));

    await logActivity("Appointment cancelled", {
      appointmentId: id,
      customerName: appointment.customerName,
    });

    res.json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    throw error;
  }
});

// Mark appointment as completed
router.post("/:id/complete", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [appointment] = await db
      .update(appointments)
      .set({ status: "Completed", updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();

    if (!appointment) {
      throw new AppError("Appointment not found", 404);
    }

    await logActivity("Appointment completed", {
      appointmentId: id,
      customerName: appointment.customerName,
    });

    res.json({ appointment, message: "Appointment marked as completed" });
  } catch (error) {
    throw error;
  }
});

// Mark appointment as no-show
router.post("/:id/no-show", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [appointment] = await db
      .update(appointments)
      .set({ status: "No-Show", updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();

    if (!appointment) {
      throw new AppError("Appointment not found", 404);
    }

    await logActivity("Appointment marked as no-show", {
      appointmentId: id,
      customerName: appointment.customerName,
    });

    res.json({ appointment, message: "Appointment marked as no-show" });
  } catch (error) {
    throw error;
  }
});

export default router;
