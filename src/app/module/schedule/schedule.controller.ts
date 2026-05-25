import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { scheduleService } from "./schedule.service";

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const schedule = await scheduleService.createSchedule();
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Schedule created successfully",
    data: schedule,
  });
});

export const scheduleController = {
  createSchedule,
};
