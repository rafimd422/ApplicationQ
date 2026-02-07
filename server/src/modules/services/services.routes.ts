import { Router } from "express";
import * as servicesController from "./services.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", servicesController.getAllServices);
router.post("/", servicesController.createService);
router.get("/:id", servicesController.getServiceById);
router.put("/:id", servicesController.updateService);
router.delete("/:id", servicesController.deleteService);

export default router;
