import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";

interface RegisterInfoType {
  name: string;
  email: string;
  password: string;
}

const registerPatient = async (payload: RegisterInfoType) => {
  const { name, email, password } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      role: UserRole.PATIENT,
    },
  });

  if (!data.user) {
    throw new Error("User registration failed");
  }

  // const patient = await prisma.$transaction(async (tx) => {});

  return data;
};

export const UserService = {
  registerPatient,
};
