import { Router } from "express";
import { userController } from "./user.controller";
import { createDoctorZodSchema } from "./user.validation";
import { validateRequestBody } from "../../middleware/validateRequest";

const router = Router();

router.post(
  "/create-doctor",
  validateRequestBody(createDoctorZodSchema),
  userController.createDoctor,
);

export const userRoutes = router;
