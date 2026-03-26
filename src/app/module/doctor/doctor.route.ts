import { Router } from "express";
import { doctorController } from "./doctor.controller";
import { validateRequestBody } from "../../middleware/validateRequest";
import { updateDoctorValidation } from "./doctor.validation";

const router = Router();

router.get("/all-doctors", doctorController.getAllDoctors);

router.get("/:doctorId", doctorController.getDoctorById);

router.patch(
  "/:doctorId",
  validateRequestBody(updateDoctorValidation),
  doctorController.updateDoctor,
);

router.delete("/:doctorId", doctorController.deleteDoctor);

export const doctorRoutes = router;
