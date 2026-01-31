import { Router } from "express";
import * as dashboardController from "./dashboard.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/stats", dashboardController.getStats);
router.get("/staff-load", dashboardController.getStaffLoad);

export default router;
