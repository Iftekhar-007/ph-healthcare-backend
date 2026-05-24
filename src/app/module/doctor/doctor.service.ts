import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IUpdateDoctorPayload } from "./doctor.interface";
import {
  doctorFilterableFields,
  doctorInputConfig,
  doctorSearchableFields,
} from "./doctor.constant";
import { IQueryParams } from "../../interfaces/query.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Doctor, Prisma } from "../../../generated/prisma/client";

// ! get all doctor api
const getAllDoctors = async (query: IQueryParams) => {
  // const result = await prisma.doctor.findMany({
  //   include: {
  //     user: true,
  //     doctorSpecialties: {
  //       include: {
  //         specialty: true,
  //       },
  //     },
  //   },
  // });

  // return result;

  const queryBuilder = new QueryBuilder<
    Doctor,
    Prisma.DoctorWhereInput,
    Prisma.DoctorInclude
  >(prisma.doctor, query, {
    searchableFields: doctorSearchableFields,
    filterableFields: doctorFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .where({ isDeleted: false })
    .include({
      user: true,
      doctorSpecialties: true,
    })
    .dynamicInclude(doctorInputConfig)
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};

// ! get doctor by id
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

// ! delete doctor
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
      await tx.doctor.update({
        where: {
          id: doctorId,
        },

        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });

      await tx.user.update({
        where: {
          id: findDoctor.userId,
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });

      await tx.account.deleteMany({
        where: {
          userId: findDoctor.userId,
        },
      });

      await tx.session.deleteMany({
        where: {
          userId: findDoctor.userId,
        },
      });

      const doctor = await tx.doctor.findUnique({
        where: {
          id: doctorId,
        },
      });

      return doctor;
    });

    return result;
  } catch (err) {
    console.log("Failed to delete doctor", err);
  }
};

// ! update doctor
const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {
  const isDoctorExist = await prisma.doctor.findUnique({
    where: { id },
  });

  if (!isDoctorExist) {
    throw new AppError(status.NOT_FOUND, "Doctor not found");
  }

  const { doctor: doctorData, specialties } = payload;

  await prisma.$transaction(async (tx) => {
    // ✅ Update doctor basic info
    if (doctorData) {
      await tx.doctor.update({
        where: { id },
        data: {
          ...doctorData,
        },
      });
    }

    // ✅ Handle specialties (delete + upsert)
    if (specialties && specialties.length > 0) {
      for (const specialty of specialties) {
        const { specialtyId, shouldDelete } = specialty;

        if (shouldDelete) {
          await tx.doctorSpecialty.delete({
            where: {
              unique_doctor_specialty: {
                doctorId: id,
                specialtyId,
              },
            },
          });
        } else {
          await tx.doctorSpecialty.upsert({
            where: {
              unique_doctor_specialty: {
                doctorId: id,
                specialtyId,
              },
            },
            create: {
              doctorId: id,
              specialtyId,
            },
            update: {}, // no update needed, just ensure existence
          });
        }
      }
    }
  });

  // ✅ Return updated doctor with relations
  const doctor = await getDoctorById(id);

  return doctor;
};

export const doctorService = {
  getAllDoctors,
  getDoctorById,
  deleteDoctor,
  updateDoctor,
};
