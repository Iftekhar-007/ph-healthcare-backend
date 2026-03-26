/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { UserRole, UserStatus } from "../../generated/prisma/enums";
import { cookieUtils } from "../utils/cookie";
import { prisma } from "../lib/prisma";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import { jwtUtils } from "../utils/jwt";
import { envVars } from "../../config/env";

export const checkAuth =
  (...authRoles: UserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // session token verification
      const sessionToken = cookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );

      if (!sessionToken) {
        throw new AppError(
          status.FORBIDDEN,
          "Unauthorized access! No Session token provided.",
        );
      }

      if (sessionToken) {
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });

        if (sessionExists && sessionExists.user) {
          const user = sessionExists.user;

          const now = new Date();
          const expireAt = new Date(sessionExists.expiresAt);
          const createdAt = new Date(sessionExists.createdAt);

          const sessionLifeTime = expireAt.getTime() - createdAt.getTime();
          const timeRemaining = expireAt.getTime() - now.getTime();

          // const age = now.getTime() - createdAt.getTime();

          const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

          if (percentRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expires-At", expireAt.toISOString());
            res.setHeader("X-Time-Remaining", timeRemaining.toString());

            console.log("Session expiring soon!");
          }

          if (
            user.status === UserStatus.BLOCKED ||
            user.status === UserStatus.DELETED
          ) {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorized access! User is not active. ",
            );
          }

          if (user.isDeleted) {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorized access! User deleted. ",
            );
          }

          if (authRoles.length > 0 && !authRoles.includes(user.role)) {
            throw new AppError(
              status.FORBIDDEN,
              "Forbidden Access! You are not allowed to access this route 🤔!!",
            );
          }

          req.user = {
            userId: user.id,
            email: user.email,
            role: user.role,
          };
        }
      }

      // access token verification

      const accessToken = cookieUtils.getCookie(req, "accessToken");

      if (!accessToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! you do not have permission to access this route. ",
        );
      }

      const verifiedToken = jwtUtils.verifyToken(
        accessToken,
        envVars.ACCESS_TOKEN_SECRET,
      );

      if (!verifiedToken.success) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! invalid access token. ",
        );
      }

      if (
        authRoles.length > 0 &&
        !authRoles.includes(verifiedToken.data!.role as UserRole)
      ) {
        throw new AppError(
          status.FORBIDDEN,
          "Forbidden access! you do not have permiission to access this route!",
        );
      }

      next();
    } catch (error: any) {
      next(error);
    }
  };
