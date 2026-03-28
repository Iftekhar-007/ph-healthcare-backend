import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { adminServices } from "./admin.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const result = await adminServices.getAllAdmins();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "All Admins Retrieve Successfully!",
    data: result,
  });
});

const getAdminById = catchAsync(async (req: Request, res: Response) => {
  const { adminId } = req.params;
  const result = await adminServices.getAdminById(adminId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Admin retrieved successfully",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const { adminId } = req.params;
  const result = await adminServices.updateAdmin(adminId as string, req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Admin updated successfully",
    data: result,
  });
});

export const adminController = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
};
