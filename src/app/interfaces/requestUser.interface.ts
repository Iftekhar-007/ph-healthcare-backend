import { UserRole } from "../../generated/prisma/enums";

export interface IORequestUser {
  userId: string;
  email: string;
  role: UserRole;
}
