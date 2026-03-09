import { prisma } from "../../lib/prisma";

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

export const doctorService = {
  getAllDoctors,
};
