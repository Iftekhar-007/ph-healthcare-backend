import { Prisma } from "../../../generated/prisma/client";

export const doctorSearchableFields = [
  "name",
  "email",
  "qualification",
  "designation",
  "currentWorkingPlace",
  "registrationNumber",
  "doctorSpecialties.specialty.title",
];

export const doctorFilterableFields = [
  "gender",
  "isDeleted",
  "appointmentFee",
  "experience",
  "registrationNumber",
  "doctorSpecialties.specialtyId",
  "currentWorkingPlace",
  "designation",
  "qualification",
  "doctorSpecialties.specialty.title",
  "user.role",
];

export const doctorInputConfig: Partial<
  Record<
    keyof Prisma.DoctorInclude,
    Prisma.DoctorInclude[keyof Prisma.DoctorInclude]
  >
> = {
  user: true,
  doctorSpecialties: true,
  appointments: {
    include: {
      patient: true,
      doctor: true,
      appointment: true,
      prescriptions: true,
    },
  },
  doctorSchedules: {
    include: {
      schedule: true,
    },
  },
  prescriptions: true,
  reviews: true,
};
