import { NextFunction, Request, RequestHandler, Response } from "express";

export const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
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
};
