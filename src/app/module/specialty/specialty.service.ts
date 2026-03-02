import { Specialty } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createSpecialty = async (payload: Specialty): Promise<Specialty> => {
  const specialty = await prisma.specialty.create({
    data: payload,
  });

  return specialty;
};

const getAllSpecialty = async () => {
  const allSpecialty = await prisma.specialty.findMany();

  return allSpecialty;
};

const deleteSpecialty = async (id: string) => {
  const isSpecialty = await prisma.specialty.findUnique({
    where: {
      id,
    },
  });

  if (!isSpecialty) {
    console.error("Not Found This specialty");
  }

  const data = await prisma.specialty.delete({
    where: {
      id,
    },
  });
  return data;
};

const updateSpecialty = async (id: string, payload: Specialty) => {
  const updatedSpecialty = await prisma.specialty.update({
    where: {
      id,
    },
    data: payload,
  });

  return updatedSpecialty;
};

export const specialtyService = {
  createSpecialty,
  getAllSpecialty,
  deleteSpecialty,
  updateSpecialty,
};
