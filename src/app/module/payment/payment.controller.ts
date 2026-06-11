/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { envVars } from "../../../config/env";
import status from "http-status";
import { stripe } from "../../../config/stripe.config";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../shared/sendResponse";

const handleStripeWebhookEvent = catchAsync(
  async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"] as string;

    const webhookSecret = envVars.STRIPE.WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      console.error("Missing Stripe signature or webhook secret.");
      return res.status(status.BAD_REQUEST).json({
        message: "Missing Stripe signature or webhook secret.",
      });
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret,
      );
    } catch (error) {
      console.error("Error verifying Stripe webhook signature:", error);
    }

    try {
      const result = await paymentService.handleStripeWebhookEvent(event);

      sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: result?.message ?? "",
        data: (result as any)?.data,
      });
    } catch (error) {
      console.error("Error processing Stripe webhook event:", error);
    }
  },
);

export const paymentController = {
  handleStripeWebhookEvent,
};
