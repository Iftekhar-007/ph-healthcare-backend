import { Request, Response } from "express";
import { specialtyService } from "./specialty.service";

const createSpecialty = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const result = await specialtyService.createSpecialty(payload);

    res.status(201).json({
      success: true,
      message: "Specialty Created Successfully!",
      data: result,
    });
  } catch (err: unknown) {
    let message = "something went wrong!";

    if (err instanceof Error) {
      message = err.message;
    }
    res.status(500).json({
      success: false,
      message,
    });
  }
};

const getAllSpecialty = async (req: Request, res: Response) => {
  try {
    const result = await specialtyService.getAllSpecialty();

    res.status(201).json({
      success: true,
      message: "All Specialty",
      data: result,
    });
  } catch (err: unknown) {
    let message = "something went wrong!";

    if (err instanceof Error) {
      message = err.message;
    }
    res.status(400).json({
      success: false,
      message,
    });
  }
};

const deleteSpecialty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await specialtyService.deleteSpecialty(id as string);

    res.status(201).json({
      success: true,
      message: "Specialty Deleted Successfully!",
      data: result,
    });
  } catch (err: unknown) {
    let message = "something went wrong!";

    if (err instanceof Error) {
      message = err.message;
    }
    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const specialtyController = {
  createSpecialty,
  getAllSpecialty,
  deleteSpecialty,
};
