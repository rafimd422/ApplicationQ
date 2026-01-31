import { Request, Response, NextFunction } from "express";
import { db } from "../../config/index.js";
import { staff, appointments } from "../../db/schema/index.js";
import { staffSchema, updateStaffSchema } from "../../validators/index.js";
import { eq, and, count } from "drizzle-orm";
import { ApiError } from "../../utils/apiError.js";

export const getAllStaff = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allStaff = await db.select().from(staff).orderBy(staff.name);
    res.json({ staff: allStaff });
  } catch (error) {
    next(error);
  }
};

export const createStaff = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = staffSchema.parse(req.body);
    const [newStaff] = await db.insert(staff).values(data).returning();
    res
      .status(201)
      .json({ staff: newStaff, message: "Staff created successfully" });
  } catch (error) {
    next(error);
  }
};

export const getStaffById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const [staffMember] = await db
      .select()
      .from(staff)
      .where(eq(staff.id, id))
      .limit(1);

    if (!staffMember) {
      throw new ApiError("Staff not found", 404);
    }

    res.json({ staff: staffMember });
  } catch (error) {
    next(error);
  }
};

export const updateStaff = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const data = updateStaffSchema.parse(req.body);

    const [updatedStaff] = await db
      .update(staff)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(staff.id, id))
      .returning();

    if (!updatedStaff) {
      throw new ApiError("Staff not found", 404);
    }

    res.json({ staff: updatedStaff, message: "Staff updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteStaff = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const [deleted] = await db
      .delete(staff)
      .where(eq(staff.id, id))
      .returning();

    if (!deleted) {
      throw new ApiError("Staff not found", 404);
    }

    res.json({ message: "Staff deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getStaffAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date || typeof date !== "string") {
      throw new ApiError("Date is required", 400);
    }

    const [staffMember] = await db
      .select()
      .from(staff)
      .where(eq(staff.id, id))
      .limit(1);

    if (!staffMember) {
      throw new ApiError("Staff not found", 404);
    }

    const [result] = await db
      .select({ count: count() })
      .from(appointments)
      .where(
        and(
          eq(appointments.staffId, id),
          eq(appointments.appointmentDate, date),
          eq(appointments.status, "Scheduled"),
        ),
      );

    const currentCount = result?.count || 0;
    const capacity = staffMember.dailyCapacity;
    const isAvailable =
      staffMember.availabilityStatus === "Available" && currentCount < capacity;

    res.json({
      staffId: id,
      staffName: staffMember.name,
      date,
      currentAppointments: currentCount,
      dailyCapacity: capacity,
      isAvailable,
      availabilityStatus: staffMember.availabilityStatus,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllStaffAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { date } = req.query;

    if (!date || typeof date !== "string") {
      throw new ApiError("Date is required", 400);
    }

    const allStaff = await db.select().from(staff).orderBy(staff.name);

    const staffWithAvailability = await Promise.all(
      allStaff.map(async (s) => {
        const [result] = await db
          .select({ count: count() })
          .from(appointments)
          .where(
            and(
              eq(appointments.staffId, s.id),
              eq(appointments.appointmentDate, date),
              eq(appointments.status, "Scheduled"),
            ),
          );

        const currentCount = result?.count || 0;

        return {
          ...s,
          currentAppointments: currentCount,
          isAvailable:
            s.availabilityStatus === "Available" &&
            currentCount < s.dailyCapacity,
        };
      }),
    );

    res.json({ staff: staffWithAvailability, date });
  } catch (error) {
    next(error);
  }
};
