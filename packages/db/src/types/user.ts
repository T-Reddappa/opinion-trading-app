import { Document, Types } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatarUrl: string | null;
  inrBalances: Types.ObjectId[];
  stockBalances: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IInrBalance extends Document {
  userId: Types.ObjectId;
  balance: Number;
  locked: Number;
}

// const stockBalanceSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   marketId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Market",
//     required: true,
//   },
//   yesQuantity: { type: Number, default: 0, min: 0 },
//   yesLocked: { type: Number, default: 0, min: 0 },
//   noQuantity: { type: Number, default: 0, min: 0 },
//   noLocked: { type: Number, default: 0, min: 0 },
// });

export interface IStockBalance extends Document {
  userId: Types.ObjectId;
  marktetId: Types.ObjectId;
  yesQuantity: Number;
  yesLocked: Number;
  noQuantity: Number;
  noLocked: Number;
}

export interface IMarket extends Document {
  title: String;
  stockSymbol: String;
  description: String;
  thumbnail: string;
  sourceOfTruth: string;
  stockBalances: Types.ObjectId[];
  startTime: String;
  endTime: string;
  status: String;
  currentYesPrice: Number;
  currentNoPrice: Number;
  totalVolumes: Number;
  categoryId: Types.ObjectId;
  numberOfTraders: Number;
  result: String;
}

export interface IOrder extends Document {
  stockSymbol: String;
  stockType: String;
  createdAt?: String;
  userId: Types.ObjectId;
  marketId: Types.ObjectId;
  orderType: string;
  side: String;
  quantity: Number;
  price: Number;
  status: String;
  tradedQuantity: Number;
}

export interface ICategory extends Document {
  name: String;
  icon: String;
  markets: Types.ObjectId[];
}
