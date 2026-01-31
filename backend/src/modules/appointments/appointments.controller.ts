import { Request, Response, NextFunction } from "express";
import { db } from "../../config/index.js";
import {
  appointments,
  staff,
  services,
  waitingQueue,
} from "../../db/schema/index.js";
import {
  appointmentSchema,
  updateAppointmentSchema,
} from "./appointments.validation.js";
import { eq, and, count } from "drizzle-orm";
import { ApiError } from "../../utils/apiError.js";
import { logActivity } from "../../utils/activityLogger.js";
import * as appointmentService from "./appointments.service.js";

export const getAllAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
    next(error);
  }
};

export const createAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = appointmentSchema.parse(req.body);

    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, data.serviceId))
      .limit(1);

    if (!service) {
      throw new ApiError("Service not found", 404);
    }

    let finalStaffId = data.staffId || null;
    let addedToQueue = false;

    if (finalStaffId) {
      const [staffMember] = await db
        .select()
        .from(staff)
        .where(eq(staff.id, finalStaffId))
        .limit(1);

      if (!staffMember) {
        throw new ApiError("Staff not found", 404);
      }

      if (staffMember.availabilityStatus !== "Available") {
        throw new ApiError("Staff is on leave", 400);
      }

      if (staffMember.staffType !== service.requiredStaffType) {
        throw new ApiError(
          `This service requires a ${service.requiredStaffType}`,
          400,
        );
      }

      const hasConflict = await appointmentService.checkTimeConflict(
        finalStaffId,
        data.appointmentDate,
        data.appointmentTime,
        service.duration,
      );

      if (hasConflict) {
        throw new ApiError(
          "This staff member already has an appointment at this time.",
          409,
        );
      }

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
        finalStaffId = null;
        addedToQueue = true;
      }
    } else {
      addedToQueue = true;
    }

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

    if (addedToQueue) {
      const queuePosition = await appointmentService.getNextQueuePosition();
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
    next(error);
  }
};

export const getAppointmentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
      throw new ApiError("Appointment not found", 404);
    }

    res.json({ appointment });
  } catch (error) {
    next(error);
  }
};

export const updateAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const data = updateAppointmentSchema.parse(req.body);

    const [existing] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, id))
      .limit(1);

    if (!existing) {
      throw new ApiError("Appointment not found", 404);
    }

    if (data.staffId && (data.appointmentDate || data.appointmentTime)) {
      const [service] = await db
        .select()
        .from(services)
        .where(eq(services.id, existing.serviceId))
        .limit(1);

      const hasConflict = await appointmentService.checkTimeConflict(
        data.staffId,
        data.appointmentDate || existing.appointmentDate,
        data.appointmentTime || existing.appointmentTime,
        service?.duration || 30,
        id,
      );

      if (hasConflict) {
        throw new ApiError(
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

    if (data.staffId) {
      await db.delete(waitingQueue).where(eq(waitingQueue.appointmentId, id));
    }

    res.json({
      appointment: updatedAppointment,
      message: "Appointment updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const cancelAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const [appointment] = await db
      .update(appointments)
      .set({ status: "Cancelled", updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();

    if (!appointment) {
      throw new ApiError("Appointment not found", 404);
    }

    await db.delete(waitingQueue).where(eq(waitingQueue.appointmentId, id));

    await logActivity("Appointment cancelled", {
      appointmentId: id,
      customerName: appointment.customerName,
    });

    res.json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    next(error);
  }
};

export const completeAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const [appointment] = await db
      .update(appointments)
      .set({ status: "Completed", updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();

    if (!appointment) {
      throw new ApiError("Appointment not found", 404);
    }

    await logActivity("Appointment completed", {
      appointmentId: id,
      customerName: appointment.customerName,
    });

    res.json({ appointment, message: "Appointment marked as completed" });
  } catch (error) {
    next(error);
  }
};

export const noShowAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const [appointment] = await db
      .update(appointments)
      .set({ status: "No-Show", updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();

    if (!appointment) {
      throw new ApiError("Appointment not found", 404);
    }

    await logActivity("Appointment marked as no-show", {
      appointmentId: id,
      customerName: appointment.customerName,
    });

    res.json({ appointment, message: "Appointment marked as no-show" });
  } catch (error) {
    next(error);
  }
};
