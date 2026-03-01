import { Router } from "express";
import { specialtyController } from "./specialty.controller";

const router = Router();

router.post("/create-specialty", specialtyController.createSpecialty);

router.get("/all-specialties", specialtyController.getAllSpecialty);

router.delete("/:id", specialtyController.deleteSpecialty);

export const SpecialtyRoutes = router;
