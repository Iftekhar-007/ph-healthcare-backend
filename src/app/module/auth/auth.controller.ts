import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import AppError from "../../errorHelpers/AppError";

const registerpatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await AuthService.registerPatient(payload);

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

  const result = await AuthService.logInUser(payload);

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
  const result = await AuthService.getMe(user);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "user retrieved successfully",
    data: result,
  });
});

const getNewToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];

  if (!refreshToken || !betterAuthSessionToken) {
    throw new AppError(
      status.UNAUTHORIZED,
      "Unauthorized access! No Session token provided.",
    );
  }

  const result = await AuthService.getNewToken(
    refreshToken,
    betterAuthSessionToken,
  );

  tokenUtils.setAccessToken(res, result.accessToken);
  tokenUtils.setRefreshToken(res, result.refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, result.sessionToken);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Tokens generated successfully",
    data: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      token: result.sessionToken,
    },
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];

  const result = await AuthService.changePassword(
    payload,
    betterAuthSessionToken,
  );

  const { accessToken, refreshToken, token } = result;

  tokenUtils.setAccessToken(res, accessToken);
  tokenUtils.setRefreshToken(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

export const AuthController = {
  registerpatient,
  logInUser,
  getMe,
  getNewToken,
  changePassword,
};
