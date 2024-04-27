import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { LIMIT } from "./constant.js";

const app = express();

app.use(
  cors({
    origin: "*",
    credential: true,
  }),
);

app.use(
  express.json({
    limit: LIMIT,
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: LIMIT,
  }),
);

app.use(cookieParser());

import userRouter from "./routes/users.routes.js";
app.use("/api/v1/users", userRouter);

export { app };