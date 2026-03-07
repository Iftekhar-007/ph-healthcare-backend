import { Router } from "express";
import { SpecialtyRoutes } from "../module/specialty/specialty.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { userRouter } from "../module/user/user.route";

const router = Router();

router.use("/auth", AuthRoutes);

router.use("/specialties", SpecialtyRoutes);

router.use("/doctors", userRouter);

export const IndexRoutes = router;
