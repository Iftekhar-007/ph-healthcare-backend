import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IUpdateDoctorPayload } from "./doctor.interface";

const getAllDoctors = async () => {
  const result = await prisma.doctor.findMany({
    include: {
      user: true,
      doctorSpecialties: {
        include: {
          specialty: true,
        },
      },
    },
  });

  return result;
};

const getDoctorById = async (doctorId: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
    },
    include: {
      user: true,
      doctorSpecialties: {
        select: {
          specialty: true,
        },
      },
    },
  });
  return doctor;
};

const deleteDoctor = async (doctorId: string) => {
  const findDoctor = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
    },
  });

  if (!findDoctor) {
    throw new AppError(status.NOT_FOUND, "Doctor not found with this id");
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const deletedDoctor = await tx.doctor.update({
        where: {
          id: doctorId,
        },

        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });

      const deletedUser = await tx.user.update({
        where: {
          id: findDoctor.userId,
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });

      return { deletedDoctor, deletedUser };
    });

    return result;
  } catch (err) {
    console.log("Failed to delete doctor", err);
  }
};

const updateDoctor = async (
  doctorId: string,
  payload: IUpdateDoctorPayload,
) => {
  // const { doctor } = payload;
  const findDoctor = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
    },
  });

  if (!findDoctor) {
    throw new AppError(status.NOT_FOUND, "Doctor not found with this id");
  }

  try {
    const { doctor, specialties } = payload;
    const result = await prisma.$transaction(async (tx) => {
      const account = await tx.account.findFirst({
        where: {
          userId: findDoctor.userId,
        },
      });

      if (!account) {
        throw new AppError(status.NOT_FOUND, "Account not found");
      }

      // const updatedPassword = await tx.account.update({
      //   where: {
      //     id: account.id,
      //   },
      //   data: {
      //     password,
      //   },
      // });

      const updatedDoctorInfo = await tx.doctor.update({
        where: {
          id: doctorId,
        },
        data: {
          ...doctor,
        },
      });

      // if (specialties && specialties.length > 0) {
      //   for (const specialty of specialties) {
      //     const { specialtyId, shouldDelete } = specialty;
      //     if (shouldDelete) {
      //       await tx.doctorSpecialty.delete({
      //         where: {
      //           doctorId_specialtyId: {
      //             doctorId: doctorId,
      //             specialtyId: specialtyId,
      //           },
      //         },
      //       });
      //     }
      //   }
      // }

      return { updatedDoctorInfo };
    });
    return result;
  } catch (err) {
    console.log("Failed to update doctor", err);
  }
};

export const doctorService = {
  getAllDoctors,
  getDoctorById,
  deleteDoctor,
  updateDoctor,
};
