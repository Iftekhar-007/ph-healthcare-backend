import z from "zod";

const createSpecialtyZodShcema = z.object({
  title: z.string("title is required"),
  description: z.string().optional(),
  icon: z.string().optional(),
});

export const specialtyValidation = {
  createSpecialtyZodShcema,
};
