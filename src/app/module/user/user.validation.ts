import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const createDoctorZodSchema = z.object({
  password: z
    .string("password is required")
    .min(6, "password must be at least 6 cheracters")
    .max(20, "password must be less than 20 characters"),
  doctor: z.object({
    name: z
      .string("name is required")
      .min(5, "name must be at least 5 characters")
      .max(80, "name must be less than or equal 80 characters"),
    email: z.email("email is required"),
    profilePhoto: z.string().optional(),
    contactNumber: z
      .string()
      .max(15, "Contact number must be 15 characters")
      .optional(),
    address: z.string().optional(),
    registrationNumber: z.string("registration number is required"),
    experience: z
      .int()
      .nonnegative("experience must be a non-negative integer"),
    gender: z.enum(
      [Gender.MALE, Gender.FEMALE, Gender.OTHER],
      "gender must be either MALE,FEMALE OR OTHER",
    ),
    appointmentFee: z
      .number()
      .nonnegative("appointment fee must be a non-negative number"),

    qualification: z
      .string("qualification is required")
      .min(2, "qualification must be at least 2 characters")
      .max(100, "qualification must be less than or equal 100 characters"),

    currentWorkingPlace: z
      .string("current working place is required")
      .min(2, "current working place must be at least 2 characters")
      .max(
        100,
        "current working place must be less than or equal 100 characters",
      ),

    designation: z
      .string("designation is required")
      .min(2, "designation must be at least 2 characters")
      .max(100, "designation must be less than or equal 100 characters"),
  }),
  specialties: z
    .array(z.string(), "specialties must be an array of strings")
    .min(1, "at least one speciality is required"),
});
