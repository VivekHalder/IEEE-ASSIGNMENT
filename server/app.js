import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { limit } from "./constant.js";

const app = express();

// Enable CORS
app.use(
  cors({
    origin: "*", 
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({limit: `${limit}`})); // Parse JSON request bodies
app.use(express.urlencoded({extended: true , limit: `${limit}`})); // Parse URL-encoded request bodies

// Cookie parsing middleware
app.use(cookieParser());

import userRouter from "./routes/users.routes.js";
// Route handling
app.use("/api/v1/users", userRouter);

export { app };