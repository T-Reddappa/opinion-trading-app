import { Document, Types } from "mongoose";

export const CREATE_ORDER = "CREATE_ORDER";
export const CANCEL_ORDER = "CANCEL_ORDER";
export const ON_RAMP = "ON_RAMP";
export const GET_OPEN_ORDERS = "GET_OPEN_ORDERS";
export const GET_DEPTH = "GET_DEPTH";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatarUrl: string | null;
  inrBalances: Types.ObjectId[];
  stockBalances: Types.ObjectId[];
}

export interface JWTPayload {
  userId: string;
  // Add any other properties you typically include in your JWT
  // For example: email?: string, role?: string, etc.
}
