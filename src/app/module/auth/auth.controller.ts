import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { UserService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";

const registerpatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await UserService.registerPatient(payload);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Patient registered successfully",
    data: result,
  });
});

const logInUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await UserService.logInUser(payload);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "user loggedin successfully",
    data: result,
  });
});

export const UserController = {
  registerpatient,
  logInUser,
};
