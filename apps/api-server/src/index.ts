import { Request, Response } from "express";
const express = require("express");
// import dotenv from "dotenv";

import { connectDB } from "@repo/db/";
import { userRouter } from "./routes/userRoute";
import { orderRouter } from "./routes/order";
// dotenv.config({ path: "../../.env" });

const PORT = 3001;

const app = express();
app.use(express.json());
connectDB();
connectDB()
  .then(() => console.log("Database connected in API server"))
  .catch((error) => console.error("Connection failed", error as typeof Error));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/order", orderRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("<h3>TRADING APP</h3>");
});

app.listen(PORT, () => {
  console.log("Server is running on 3001");
});
