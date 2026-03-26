import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { UserService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";

const registerpatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await UserService.registerPatient(payload);

  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessToken(res, accessToken);
  tokenUtils.setRefreshToken(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Patient registered successfully",
    data: {
      accessToken,
      refreshToken,
      token,
      ...rest,
    },
  });
});

const logInUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await UserService.logInUser(payload);

  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessToken(res, accessToken);
  tokenUtils.setRefreshToken(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "user loggedin successfully",
    data: {
      accessToken,
      refreshToken,
      token,
      ...rest,
    },
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getMe(user);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "user retrieved successfully",
    data: result,
  });
});

export const UserController = {
  registerpatient,
  logInUser,
  getMe,
};
