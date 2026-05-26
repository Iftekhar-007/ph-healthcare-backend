import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { scheduleController } from "./schedule.controller";
import { validateRequestBody } from "../../middleware/validateRequest";
import { scheduleValidation } from "./schedule.validation";

const router = Router();

router.post(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequestBody(scheduleValidation.createScheduleZodSchema),
  scheduleController.createSchedule,
);

export const scheduleRoutes = router;
