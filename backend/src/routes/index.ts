import { Router } from "express";
import authRoutes from "./auth";
import staffRoutes from "./staff";
import servicesRoutes from "./services";
import appointmentsRoutes from "./appointments";
import queueRoutes from "./queue";
import dashboardRoutes from "./dashboard";
import activityRoutes from "./activity";

const router = Router();

router.use("/auth", authRoutes);
router.use("/staff", staffRoutes);
router.use("/services", servicesRoutes);
router.use("/appointments", appointmentsRoutes);
router.use("/queue", queueRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/activity", activityRoutes);

export default router;
