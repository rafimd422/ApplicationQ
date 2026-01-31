import { Request, Response, NextFunction } from "express";
import { db } from "../../config/index.js";
import {
  appointments,
  staff,
  services,
  waitingQueue,
} from "../../db/schema/index.js";
import { eq, and, asc, count } from "drizzle-orm";
import { ApiError } from "../../utils/apiError.js";
import { logActivity } from "../../utils/activityLogger.js";
import dayjs from "dayjs";

export const getWaitingQueue = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const queue = await db
      .select({
        id: waitingQueue.id,
        queuePosition: waitingQueue.queuePosition,
        addedAt: waitingQueue.addedAt,
        appointmentId: appointments.id,
        customerName: appointments.customerName,
        serviceId: appointments.serviceId,
        serviceName: services.serviceName,
        requiredStaffType: services.requiredStaffType,
        serviceDuration: services.duration,
        appointmentDate: appointments.appointmentDate,
        appointmentTime: appointments.appointmentTime,
      })
      .from(waitingQueue)
      .innerJoin(appointments, eq(waitingQueue.appointmentId, appointments.id))
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .where(eq(appointments.status, "Scheduled"))
      .orderBy(asc(waitingQueue.queuePosition));

    res.json({ queue });
  } catch (error) {
    next(error);
  }
};

export const autoAssign = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [firstInQueue] = await db
      .select({
        queueId: waitingQueue.id,
        appointmentId: appointments.id,
        customerName: appointments.customerName,
        appointmentDate: appointments.appointmentDate,
        appointmentTime: appointments.appointmentTime,
        serviceId: appointments.serviceId,
        requiredStaffType: services.requiredStaffType,
      })
      .from(waitingQueue)
      .innerJoin(appointments, eq(waitingQueue.appointmentId, appointments.id))
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .where(eq(appointments.status, "Scheduled"))
      .orderBy(asc(waitingQueue.queuePosition))
      .limit(1);

    if (!firstInQueue) {
      return res.json({ message: "No appointments in queue", assigned: false });
    }

    const availableStaff = await db
      .select()
      .from(staff)
      .where(
        and(
          eq(staff.staffType, firstInQueue.requiredStaffType),
          eq(staff.availabilityStatus, "Available"),
        ),
      );

    let assignedStaff = null;

    for (const s of availableStaff) {
      const [appointmentCount] = await db
        .select({ count: count() })
        .from(appointments)
        .where(
          and(
            eq(appointments.staffId, s.id),
            eq(appointments.appointmentDate, firstInQueue.appointmentDate),
            eq(appointments.status, "Scheduled"),
          ),
        );

      if ((appointmentCount?.count || 0) < s.dailyCapacity) {
        assignedStaff = s;
        break;
      }
    }

    if (!assignedStaff) {
      return res.json({
        message: "No available staff with capacity for this appointment",
        assigned: false,
      });
    }

    await db
      .update(appointments)
      .set({ staffId: assignedStaff.id, updatedAt: new Date() })
      .where(eq(appointments.id, firstInQueue.appointmentId));

    await db
      .delete(waitingQueue)
      .where(eq(waitingQueue.id, firstInQueue.queueId));

    const remainingQueue = await db
      .select()
      .from(waitingQueue)
      .orderBy(asc(waitingQueue.queuePosition));

    for (let i = 0; i < remainingQueue.length; i++) {
      await db
        .update(waitingQueue)
        .set({ queuePosition: i + 1 })
        .where(eq(waitingQueue.id, remainingQueue[i].id));
    }

    const time = dayjs().format("h:mm A");
    await logActivity(
      `Appointment for ${firstInQueue.customerName} auto-assigned to ${assignedStaff.name}`,
      {
        appointmentId: firstInQueue.appointmentId,
        staffId: assignedStaff.id,
        staffName: assignedStaff.name,
        time,
      },
    );

    res.json({
      message: `Appointment assigned to ${assignedStaff.name}`,
      assigned: true,
      staffId: assignedStaff.id,
      staffName: assignedStaff.name,
      appointmentId: firstInQueue.appointmentId,
    });
  } catch (error) {
    next(error);
  }
};

export const manualAssign = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { queueId, staffId } = req.params;

    const [queueItem] = await db
      .select({
        queueId: waitingQueue.id,
        appointmentId: appointments.id,
        customerName: appointments.customerName,
        requiredStaffType: services.requiredStaffType,
        appointmentDate: appointments.appointmentDate,
      })
      .from(waitingQueue)
      .innerJoin(appointments, eq(waitingQueue.appointmentId, appointments.id))
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .where(eq(waitingQueue.id, queueId))
      .limit(1);

    if (!queueItem) {
      throw new ApiError("Queue item not found", 404);
    }

    const [staffMember] = await db
      .select()
      .from(staff)
      .where(eq(staff.id, staffId))
      .limit(1);

    if (!staffMember) {
      throw new ApiError("Staff not found", 404);
    }

    if (staffMember.staffType !== queueItem.requiredStaffType) {
      throw new ApiError(
        `This service requires a ${queueItem.requiredStaffType}`,
        400,
      );
    }

    if (staffMember.availabilityStatus !== "Available") {
      throw new ApiError("Staff is on leave", 400);
    }

    const [appointmentCount] = await db
      .select({ count: count() })
      .from(appointments)
      .where(
        and(
          eq(appointments.staffId, staffId),
          eq(appointments.appointmentDate, queueItem.appointmentDate),
          eq(appointments.status, "Scheduled"),
        ),
      );

    if ((appointmentCount?.count || 0) >= staffMember.dailyCapacity) {
      throw new ApiError("Staff is at maximum capacity for this date", 400);
    }

    await db
      .update(appointments)
      .set({ staffId, updatedAt: new Date() })
      .where(eq(appointments.id, queueItem.appointmentId));

    await db.delete(waitingQueue).where(eq(waitingQueue.id, queueId));

    const remainingQueue = await db
      .select()
      .from(waitingQueue)
      .orderBy(asc(waitingQueue.queuePosition));

    for (let i = 0; i < remainingQueue.length; i++) {
      await db
        .update(waitingQueue)
        .set({ queuePosition: i + 1 })
        .where(eq(waitingQueue.id, remainingQueue[i].id));
    }

    const time = dayjs().format("h:mm A");
    await logActivity(
      `Appointment for ${queueItem.customerName} assigned to ${staffMember.name}`,
      {
        appointmentId: queueItem.appointmentId,
        staffId,
        staffName: staffMember.name,
        time,
      },
    );

    res.json({
      message: `Appointment assigned to ${staffMember.name}`,
      staffId,
      staffName: staffMember.name,
      appointmentId: queueItem.appointmentId,
    });
  } catch (error) {
    next(error);
  }
};
