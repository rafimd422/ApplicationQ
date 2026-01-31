import { Request, Response, NextFunction } from "express";
import { db } from "../../config/index.js";
import { services } from "../../db/schema/index.js";
import { serviceSchema, updateServiceSchema } from "./services.validation.js";
import { eq } from "drizzle-orm";
import { ApiError } from "../../utils/apiError.js";

export const getAllServices = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allServices = await db
      .select()
      .from(services)
      .orderBy(services.serviceName);
    res.json({ services: allServices });
  } catch (error) {
    next(error);
  }
};

export const createService = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = serviceSchema.parse(req.body);
    const [newService] = await db.insert(services).values(data).returning();
    res
      .status(201)
      .json({ service: newService, message: "Service created successfully" });
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, id))
      .limit(1);

    if (!service) {
      throw new ApiError("Service not found", 404);
    }

    res.json({ service });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const data = updateServiceSchema.parse(req.body);

    const [updatedService] = await db
      .update(services)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();

    if (!updatedService) {
      throw new ApiError("Service not found", 404);
    }

    res.json({
      service: updatedService,
      message: "Service updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const [deleted] = await db
      .delete(services)
      .where(eq(services.id, id))
      .returning();

    if (!deleted) {
      throw new ApiError("Service not found", 404);
    }

    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    next(error);
  }
};
