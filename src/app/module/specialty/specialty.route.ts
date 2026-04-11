import { Router } from "express";
import { specialtyController } from "./specialty.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { multerUpload } from "../../../config/multer.config";
import { validateRequestBody } from "../../middleware/validateRequest";
import { specialtyValidation } from "./specialty.validation";

const router = Router();

router.post(
  "/create-specialty",
  // checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequestBody(specialtyValidation.createSpecialtyZodShcema),
  specialtyController.createSpecialty,
);

router.get("/all-specialties", specialtyController.getAllSpecialty);

router.patch(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  specialtyController.updateSpecialty,
);

router.delete(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  specialtyController.deleteSpecialty,
);

export const SpecialtyRoutes = router;
