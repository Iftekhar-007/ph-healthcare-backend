import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { UserService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const registerpatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await UserService.registerPatient(payload);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Patient registered successfully",
    data: result,
  });
});

const logInUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await UserService.logInUser(payload);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "user loggedin successfully",
    data: result,
  });
});

export const UserController = {
  registerpatient,
  logInUser,
};
