import { UserRole, UserStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

interface IORegisterInfoType {
  name: string;
  email: string;
  password: string;
}

interface IOLogInInfoType {
  email: string;
  password: string;
}

const registerPatient = async (payload: IORegisterInfoType) => {
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

  const patient = await prisma.$transaction(async (tx) => {
    const patientTx = await tx.patient.create({
      data: {
        userId: data.user.id,
        name: payload.name,
        email: payload.email,
      },
    });
    return patientTx;
  });

  return {
    ...data,
    patient,
  };
};

const logInUser = async (payload: IOLogInInfoType) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (!data.user) {
    throw new Error("User login failed");
  }

  if (data.user.status === UserStatus.BLOCKED) {
    throw new Error("Your account is blocked. Please contact support.");
  }
  if (data.user.isDeleted) {
    throw new Error("Your account is deleted. Please contact support.");
  }

  return data;
};

export const UserService = {
  registerPatient,
  logInUser,
};
