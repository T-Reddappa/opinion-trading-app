import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "../../.env" });

const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI;
    console.log("uri", uri);
    if (!uri) {
      throw new Error("MONGO_URI is undefined.");
    }
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error", err);
    process.exit(1);
  }
};

export default connectDB;
