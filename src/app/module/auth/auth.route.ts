import { Router } from "express";
import { UserController } from "./auth.controller";

const router = Router();

router.post("/register-patient", UserController.registerpatient);

export const AuthRoutes = router;
