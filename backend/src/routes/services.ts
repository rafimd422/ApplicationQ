import { Router, Request, Response } from "express";
import { db } from "../db/index";
import { services } from "../db/schema/index";
import { serviceSchema, updateServiceSchema } from "../validators/index";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all services
router.get("/", async (req: Request, res: Response) => {
  try {
    const allServices = await db
      .select()
      .from(services)
      .orderBy(services.serviceName);
    res.json({ services: allServices });
  } catch (error) {
    throw error;
  }
});

// Create service
router.post("/", async (req: Request, res: Response) => {
  try {
    const data = serviceSchema.parse(req.body);

    const [newService] = await db.insert(services).values(data).returning();

    res
      .status(201)
      .json({ service: newService, message: "Service created successfully" });
  } catch (error) {
    throw error;
  }
});

// Get service by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, id))
      .limit(1);

    if (!service) {
      throw new AppError("Service not found", 404);
    }

    res.json({ service });
  } catch (error) {
    throw error;
  }
});

// Update service
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateServiceSchema.parse(req.body);

    const [updatedService] = await db
      .update(services)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();

    if (!updatedService) {
      throw new AppError("Service not found", 404);
    }

    res.json({
      service: updatedService,
      message: "Service updated successfully",
    });
  } catch (error) {
    throw error;
  }
});

// Delete service
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [deleted] = await db
      .delete(services)
      .where(eq(services.id, id))
      .returning();

    if (!deleted) {
      throw new AppError("Service not found", 404);
    }

    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    throw error;
  }
});

export default router;
