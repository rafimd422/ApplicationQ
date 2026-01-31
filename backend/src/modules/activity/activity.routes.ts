import { Router } from "express";
import * as activityController from "./activity.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", activityController.getActivityLogs);

export default router;
