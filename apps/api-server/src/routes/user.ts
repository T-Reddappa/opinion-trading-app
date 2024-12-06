import express from "express";
import {
  claimBonus,
  createUser,
  forgotPassword,
  getUserProfile,
  login,
  resetPassword,
} from "../controllers/user";
import { authMiddleware, validateRegistration } from "../middlewares/auth";
export const userRouter = express.Router();

userRouter.post("/create", validateRegistration, createUser);
userRouter.post("/login", login);
userRouter.post("/claimBonus", authMiddleware, claimBonus);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.get("/me", authMiddleware, getUserProfile);
