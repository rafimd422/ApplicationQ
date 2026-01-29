import { Router, Request, Response } from "express";
import { db } from "../db/index";
import { activityLogs } from "../db/schema/index";
import { desc } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get recent activity logs
router.get("/", async (req: Request, res: Response) => {
  try {
    const { limit = "10" } = req.query;
    const limitNum = Math.min(parseInt(limit as string, 10) || 10, 50);

    const logs = await db
      .select()
      .from(activityLogs)
      .orderBy(desc(activityLogs.createdAt))
      .limit(limitNum);

    res.json({ logs });
  } catch (error) {
    throw error;
  }
});

export default router;
