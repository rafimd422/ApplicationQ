import { Router } from "express";
import * as staffController from "./staff.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", staffController.getAllStaff);
router.post("/", staffController.createStaff);
router.get("/availability/all", staffController.getAllStaffAvailability);
router.get("/:id", staffController.getStaffById);
router.put("/:id", staffController.updateStaff);
router.delete("/:id", staffController.deleteStaff);
router.get("/:id/availability", staffController.getStaffAvailability);

export default router;
