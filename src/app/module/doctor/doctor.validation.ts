import z from "zod";

export const updateDoctorValidation = z
  .object({
    password: z.string().min(6).max(20),
    doctor: z
      .object({
        name: z.string().min(5).max(80),
        profilePhoto: z.string().optional(),
        contactNumber: z.string().max(15).optional(),
        address: z.string().optional(),
        experience: z.number().nonnegative(),
        appointmentFee: z.number().nonnegative(),
        qualification: z.string().min(2).max(100),
        currentWorkingPlace: z.string().min(2).max(100),
        designation: z.string().min(2).max(100),
      })
      .partial(),
    specialties: z.array(z.string()).min(1),
  })
  .partial();
