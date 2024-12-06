import mongoose, { Schema } from "mongoose";
import {
  ICategory,
  IInrBalance,
  IMarket,
  IOrder,
  IStockBalance,
  ITrade,
  IUser,
} from "../types/user";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, alias: "user_id", required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, select: false },
    avatarUrl: { type: String, default: null },
    inrBalances: [{ type: mongoose.Schema.Types.ObjectId, ref: "InrBalance" }],
    stockBalances: [
      { type: mongoose.Schema.Types.ObjectId, ref: "StockBalance" },
    ],
  },
  {
    timestamps: true,
  }
);

const inrBalanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  balance: { type: Number, required: true, default: 0, min: 0 },
  locked: { type: Number, require: true, default: 0, min: 0 },
});

const stockBalanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  marketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Market",
    required: true,
  },
  yesQuantity: { type: Number, default: 0, min: 0 },
  yesLocked: { type: Number, default: 0, min: 0 },
  noQuantity: { type: Number, default: 0, min: 0 },
  noLocked: { type: Number, default: 0, min: 0 },
});

const marketSchema = new mongoose.Schema({
  title: { type: String, default: "", required: true, trim: true },
  stockSymbol: { type: String, default: "", required: true },
  description: { type: String, required: true },
  thumbnail: { type: String },
  sourceOfTruth: { type: String, default: "" },
  stockBalances: [
    { type: mongoose.Schema.Types.ObjectId, ref: "StockBalance" },
  ],
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: {
    type: String,
    enum: ["upcoming", "active", "resolved", "cancelled"],
    default: "upcoming",
  },
  currentYesPrice: {
    type: Number,
    default: 5,
    min: 0,
    max: 10,
  },
  currentNoPrice: {
    type: Number,
    default: 5,
    min: 0,
    max: 20,
  },
  totalVolumes: {
    type: Number,
    default: 0,
    min: 0,
  },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  numberOfTraders: { type: Number, default: 0 },
  result: { type: String, default: null },
});

const orderSchema = new mongoose.Schema({
  stockSymbol: { type: String, required: true },
  stockType: { type: String, enum: ["yes", "no"], required: true },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  marketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Market",
    require: true,
  },
  orderType: { type: String, enum: ["market", "limit"], required: true },
  side: {
    type: String,
    enum: ["buy", "sell"],
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0, max: 10 },
  status: {
    type: String,
    enum: ["pending", "partial", "filled", "cancelled"],
    required: true,
    default: "pending",
  },
  tradedQuantity: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  icon: { type: String, default: null },
  markets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Market" }],
});

const TradeSchema = new Schema({
  orderId: { type: String, required: true },
  marketId: { type: String, required: true },
  matchedOrderId: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  stockType: { type: String, enum: ["yes", "no"], required: true },
  buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  executedAt: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUser>("User", userSchema);
export const InrBalance = mongoose.model<IInrBalance>(
  "InrBalance",
  inrBalanceSchema
);
export const StockBalance = mongoose.model<IStockBalance>(
  "StockBalance",
  stockBalanceSchema
);
export const Market = mongoose.model<IMarket>("Market", marketSchema);
export const Order = mongoose.model<IOrder>("Order", orderSchema);
export const Category = mongoose.model<ICategory>("Category", categorySchema);
export const Trade = mongoose.model<ITrade>("Trade", TradeSchema);
