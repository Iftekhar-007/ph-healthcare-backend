import status from "http-status";
import { UserRole, UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";
import { IORequestUser } from "../../interfaces/requestUser.interface";
import { jwtUtils } from "../../utils/jwt";
import { envVars } from "../../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { IChangePasswordPayload } from "./auth.interface";

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

  try {
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

    const accessToken = tokenUtils.getAccessToken({
      userdId: data.user.id,
      role: data.user.role,
      email: data.user.email,
      name: data.user.name,
      emailVerified: data.user.emailVerified,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
    });

    const refreshToken = tokenUtils.getRefreshToken({
      userdId: data.user.id,
      role: data.user.role,
      email: data.user.email,
      name: data.user.name,
      emailVerified: data.user.emailVerified,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
    });

    return {
      ...data,
      accessToken,
      refreshToken,
      patient,
    };
  } catch (err) {
    console.log("transaction Error", err);
    await prisma.user.delete({
      where: {
        id: data.user.id,
      },
    });
    throw err;
  }
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
    throw new AppError(
      status.FORBIDDEN,
      "Your account is blocked. Please contact support.",
    );
  }
  if (data.user.isDeleted) {
    throw new AppError(
      status.NOT_FOUND,
      "Your account is deleted. Please contact support.",
    );
  }

  const accessToken = tokenUtils.getAccessToken({
    userdId: data.user.id,
    role: data.user.role,
    email: data.user.email,
    name: data.user.name,
    emailVerified: data.user.emailVerified,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
  });

  const refreshToken = tokenUtils.getRefreshToken({
    userdId: data.user.id,
    role: data.user.role,
    email: data.user.email,
    name: data.user.name,
    emailVerified: data.user.emailVerified,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
  });

  return {
    ...data,
    accessToken,
    refreshToken,
  };
};

const getMe = async (user: IORequestUser) => {
  const getMyProfile = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    include: {
      patient: true,
      doctor: {
        include: {
          doctorSpecialties: true,
          appointments: true,
          prescriptions: {
            include: {
              patient: true,
            },
          },
          reviews: true,
        },
      },
      admin: true,
    },
  });
  return getMyProfile;
};

const getNewToken = async (refreshToken: string, sessionToken: string) => {
  const isSessionTokenExist = await prisma.session.findUnique({
    where: {
      token: sessionToken,
    },
    include: {
      user: true,
    },
  });

  if (!isSessionTokenExist) {
    throw new AppError(status.UNAUTHORIZED, "Invalid session token");
  }

  const verifiedToken = jwtUtils.verifyToken(
    refreshToken,
    envVars.REFRESH_TOKEN_SECRET,
  );

  // console.log(verifiedToken);

  if (!verifiedToken.success && verifiedToken.error) {
    throw new AppError(status.UNAUTHORIZED, verifiedToken.error.message);
  }

  const data = verifiedToken.data as JwtPayload;
  // console.log(data);

  const newAccessToken = tokenUtils.getAccessToken({
    userdId: data.userId,
    role: data.role,
    email: data.email,
    name: data.name,
    emailVerified: data.emailVerified,
    status: data.status,
    isDeleted: data.isDeleted,
  });

  const newRefreshToken = tokenUtils.getRefreshToken({
    userdId: data.userId,
    role: data.role,
    email: data.email,
    name: data.name,
    emailVerified: data.emailVerified,
    status: data.status,
    isDeleted: data.isDeleted,
  });

  const { token } = await prisma.session.update({
    where: {
      token: sessionToken,
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
      updatedAt: new Date(),
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: token,
  };
};

const changePassword = async (
  payload: IChangePasswordPayload,
  sessionToken: string,
) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  if (!session) {
    throw new AppError(status.UNAUTHORIZED, "Invalid session token");
  }

  const { currentPassword, newPassword } = payload;

  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  const accessToken = tokenUtils.getAccessToken({
    userdId: session.user.id,
    role: session.user.role,
    email: session.user.email,
    name: session.user.name,
    emailVerified: session.user.emailVerified,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
  });

  const refreshToken = tokenUtils.getRefreshToken({
    userdId: session.user.id,
    role: session.user.role,
    email: session.user.email,
    name: session.user.name,
    emailVerified: session.user.emailVerified,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
  });

  return {
    ...result,
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  registerPatient,
  logInUser,
  getMe,
  getNewToken,
  changePassword,
};
