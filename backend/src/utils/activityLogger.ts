import { db } from "../db/index.js";
import { activityLogs } from "../db/schema/index.js";

export const logActivity = async (
  action: string,
  details?: Record<string, any>,
) => {
  await db.insert(activityLogs).values({
    action,
    details: details || {},
  });
};
