import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./modules/auth/auth.routes.js";
import { errorHandler } from "./common/middleware/errorHandler.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// api
app.use("/api/v1/auth", userRouter);

app.use(errorHandler);

export default app;
