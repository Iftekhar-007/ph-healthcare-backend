import express, { Application, Request, Response } from "express";
import { IndexRoutes } from "./app/Routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";

const app: Application = express();

app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express!");
});

app.use("/api/v1", IndexRoutes);

app.use(globalErrorHandler);

app.use(notFound);

export default app;
