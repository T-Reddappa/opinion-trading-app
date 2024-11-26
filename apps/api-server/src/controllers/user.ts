import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { InrBalance, User } from "@repo/db";
import { Request, Response } from "express";

interface JWTPayload {
  userId: string;
  // Add any other properties you typically include in your JWT
  // For example: email?: string, role?: string, etc.
}

const SECRET_KEY: string = "myapp@123";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    await user.save();

    const inrBalance = new InrBalance({
      userId: user._id,
      balance: 0,
      locked: 0,
    });
    await inrBalance.save();

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      SECRET_KEY
    );

    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({
      message: "User registered successfully",
      user: userData,
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Please provide email and password" });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      SECRET_KEY
    );

    const inrBalance = await InrBalance.findOne({ userId: user._id });

    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      message: "Login Successful",
      user: userData,
      balance: inrBalance,
      token,
    });
  } catch (error) {
    console.log("Login error:", error);
    res.json(500).json({ error: "Internal server error" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const resetToken = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Password reset token generated",
      resetToken,
    });
  } catch (error) {
    console.log("Password reset request error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { resetToken, newPassword } = req.body;

    const decoded = jwt.verify(resetToken, SECRET_KEY) as JWTPayload;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(decoded.userId, {
      password: hashedPassword,
    });

    res.status(200).json({ message: "Password reset succesful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Interval server error" });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    const inrBalance = await InrBalance.findOne({ userId: req.user._id });

    res.json({ user, balance: inrBalance });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
