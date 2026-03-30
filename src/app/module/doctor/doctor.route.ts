import { Router } from "express";
import { doctorController } from "./doctor.controller";
import { validateRequestBody } from "../../middleware/validateRequest";
import { updateDoctorValidation } from "./doctor.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.get("/all-doctors", doctorController.getAllDoctors);

router.get("/:doctorId", doctorController.getDoctorById);

router.patch(
  "/:doctorId",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequestBody(updateDoctorValidation),
  doctorController.updateDoctor,
);

router.delete(
  "/:doctorId",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  doctorController.deleteDoctor,
);

export const doctorRoutes = router;
