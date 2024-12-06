import { Market } from "@repo/db";
import { NextFunction, Response, Request } from "express";

export const updateMarketStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentTime = new Date();
    await Market.updateMany(
      {
        status: "upcoming",
        startTime: { $lte: currentTime },
      },
      { status: "active" }
    );

    await Market.updateMany(
      {
        status: "active",
        endTime: { $lte: currentTime },
      },
      { status: "resolved" }
    );
    next();
  } catch (error) {
    next(error);
  }
};
