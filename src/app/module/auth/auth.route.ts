import { Router } from "express";
import { UserController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register-patient", UserController.registerpatient);

router.post("/login", UserController.logInUser);

router.get(
  "/me",
  checkAuth(
    UserRole.PATIENT,
    UserRole.DOCTOR,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  ),
  UserController.getMe,
);

export const AuthRoutes = router;
