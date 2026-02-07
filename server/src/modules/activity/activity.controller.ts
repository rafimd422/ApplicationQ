import { Request, Response, NextFunction } from "express";
import { db } from "../../config/index.js";
import { activityLogs } from "../../db/schema/index.js";
import { desc } from "drizzle-orm";
import { apiResponse } from "../../utils/apiResponse.js";

export const getActivityLogs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { limit = "10" } = req.query;
    const limitNum = Math.min(parseInt(limit as string, 10) || 10, 50);

    const logs = await db
      .select()
      .from(activityLogs)
      .orderBy(desc(activityLogs.createdAt))
      .limit(limitNum);

    return apiResponse(res, 200, "Activity logs fetched successfully", {
      logs,
    });
  } catch (error) {
    next(error);
  }
};
