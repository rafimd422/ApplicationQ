import { Router } from "express";
import * as appointmentsController from "./appointments.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", appointmentsController.getAllAppointments);
router.post("/", appointmentsController.createAppointment);
router.get("/:id", appointmentsController.getAppointmentById);
router.put("/:id", appointmentsController.updateAppointment);
router.delete("/:id", appointmentsController.cancelAppointment);
router.post("/:id/complete", appointmentsController.completeAppointment);
router.post("/:id/no-show", appointmentsController.noShowAppointment);

export default router;
