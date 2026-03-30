import { Router } from "express";
import { adminController } from "./admin.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.get(
  "/all-admins",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminController.getAllAdmins,
);

router.get(
  "/:adminId",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminController.getAdminById,
);

router.patch(
  "/:adminId",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminController.updateAdmin,
);

router.delete(
  "/:adminId",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminController.deleteAdmin,
);

export const adminRoutes = router;
