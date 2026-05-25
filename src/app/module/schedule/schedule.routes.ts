import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { scheduleController } from "./schedule.controller";

const router = Router();

router.post(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  scheduleController.createSchedule,
);

export const scheduleRoutes = router;
