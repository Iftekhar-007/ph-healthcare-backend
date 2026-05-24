import express, { Application, Request, Response } from "express";
import { IndexRoutes } from "./app/Routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "path";
import cors from "cors";
import { envVars } from "./config/env";
import qs from "qs";

const app: Application = express();

app.set("query parser", (str: string) => qs.parse(str));

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`));

app.use(
  cors({
    origin: [
      envVars.FRONTEND_API,
      envVars.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:5000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/auth", toNodeHandler(auth));

app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express!");
});

app.use("/api/v1", IndexRoutes);

app.use(globalErrorHandler);

app.use(notFound);

export default app;
