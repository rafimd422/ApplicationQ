import { Router } from "express";
import * as queueController from "./queue.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", queueController.getWaitingQueue);
router.post("/assign", queueController.autoAssign);
router.post("/:queueId/assign/:staffId", queueController.manualAssign);

export default router;
