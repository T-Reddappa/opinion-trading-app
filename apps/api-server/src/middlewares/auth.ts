import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";
import { JWTPayload } from "../types";

import { User } from "@repo/db";

declare module "express-serve-static-core" {
  interface Request {
    user: {
      _id: string;
      // Add other user properties as needed
    } & Document;
  }
}

const JWT_SECRET: string = "myapp@123";

export const validateRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ error: "Please provide all the required fields" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: "Invalid email format" });
      return;
    }

    if (password?.length < 8) {
      res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
      return;
    }

    const existingUser = await User.findOne({
      $or: [
        {
          username: username.toLowerCase(),
        },
        { email: email.toLowerCase() },
      ],
    });

    if (existingUser) {
      res.status(409).json({ error: "Username or email already exists" });
      return;
    }

    next();
  } catch (error) {
    console.error("Registration validation error:", error);
    res
      .status(500)
      .json({ error: "Internal server error during registration validation" });
  }
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ error: 'Authorization header must start with "Bearer"' });
    }

    const token = authHeader?.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    const user = await User.findOne({ _id: decoded.userId });
    console.log(user);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
