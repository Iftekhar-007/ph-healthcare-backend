import { Router } from "express";
import { specialtyController } from "./specialty.controller";

const router = Router();

router.post("/create-specialty", specialtyController.createSpecialty);

export const SpecialtyRoutes = router;
