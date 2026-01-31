import { Router } from "express";
import authRoutes from "./auth/auth.routes.js";
import staffRoutes from "./staff/staff.routes.js";
import servicesRoutes from "./services/services.routes.js";
import appointmentsRoutes from "./appointments/appointments.routes.js";
import queueRoutes from "./queue/queue.routes.js";
import dashboardRoutes from "./dashboard/dashboard.routes.js";
import activityRoutes from "./activity/activity.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/staff", staffRoutes);
router.use("/services", servicesRoutes);
router.use("/appointments", appointmentsRoutes);
router.use("/queue", queueRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/activity", activityRoutes);

export default router;
