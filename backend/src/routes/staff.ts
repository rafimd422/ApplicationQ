import { Router, Request, Response } from "express";
import { db } from "../db/index";
import { staff, appointments } from "../db/schema/index";
import { staffSchema, updateStaffSchema } from "../validators/index";
import { eq, and, count, sql } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all staff
router.get("/", async (req: Request, res: Response) => {
  try {
    const allStaff = await db.select().from(staff).orderBy(staff.name);
    res.json({ staff: allStaff });
  } catch (error) {
    throw error;
  }
});

// Create staff
router.post("/", async (req: Request, res: Response) => {
  try {
    const data = staffSchema.parse(req.body);

    const [newStaff] = await db.insert(staff).values(data).returning();

    res
      .status(201)
      .json({ staff: newStaff, message: "Staff created successfully" });
  } catch (error) {
    throw error;
  }
});

// Get staff by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [staffMember] = await db
      .select()
      .from(staff)
      .where(eq(staff.id, id))
      .limit(1);

    if (!staffMember) {
      throw new AppError("Staff not found", 404);
    }

    res.json({ staff: staffMember });
  } catch (error) {
    throw error;
  }
});

// Update staff
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateStaffSchema.parse(req.body);

    const [updatedStaff] = await db
      .update(staff)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(staff.id, id))
      .returning();

    if (!updatedStaff) {
      throw new AppError("Staff not found", 404);
    }

    res.json({ staff: updatedStaff, message: "Staff updated successfully" });
  } catch (error) {
    throw error;
  }
});

// Delete staff
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [deleted] = await db
      .delete(staff)
      .where(eq(staff.id, id))
      .returning();

    if (!deleted) {
      throw new AppError("Staff not found", 404);
    }

    res.json({ message: "Staff deleted successfully" });
  } catch (error) {
    throw error;
  }
});

// Get staff availability for a specific date
router.get("/:id/availability", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date || typeof date !== "string") {
      throw new AppError("Date is required", 400);
    }

    // Get staff member
    const [staffMember] = await db
      .select()
      .from(staff)
      .where(eq(staff.id, id))
      .limit(1);

    if (!staffMember) {
      throw new AppError("Staff not found", 404);
    }

    // Count appointments for this date
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
    throw error;
  }
});

// Get all staff with their availability for a date
router.get("/availability/all", async (req: Request, res: Response) => {
  try {
    const { date } = req.query;

    if (!date || typeof date !== "string") {
      throw new AppError("Date is required", 400);
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
    throw error;
  }
});

export default router;
