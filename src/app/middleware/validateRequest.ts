import { NextFunction, Request, Response } from "express";
import z from "zod";

export const validateRequestBody = (zodObject: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsedResult = zodObject.safeParse(req.body);

    if (!parsedResult.success) {
      next(parsedResult.error);
    }

    req.body = parsedResult.data;

    next();
  };
};
