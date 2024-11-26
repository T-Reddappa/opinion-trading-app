import { Request, Response } from "express";
import { RedisManger } from "../RedisManaget";
import { CANCEL_ORDER, CREATE_ORDER, GET_OPEN_ORDERS } from "../types";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { market, price, quantity, side, userId } = req.body;
    console.log({ market, price, quantity, side, userId });

    const response: any = await RedisManger.getInstance().sendAndAwait({
      type: CREATE_ORDER,
      data: {
        market,
        userId,
        price,
        quantity,
        side,
      },
    });
    res.status(201).json(response.payload);
  } catch (error) {
    res.send(500).json({ error: "Internal server error" });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { orderId, market } = req.body;
    const response: any = await RedisManger.getInstance().sendAndAwait({
      type: CANCEL_ORDER,
      data: {
        orderId,
        market,
      },
    });
    res.status(200).json(response.payload);
  } catch (error) {
    res.send(500).json({ error: "Internal server error" });
  }
};

export const getOpenOrders = async (req: Request, res: Response) => {
  try {
    const { userId, market } = req.query;
    const response: any = await RedisManger.getInstance().sendAndAwait({
      type: GET_OPEN_ORDERS,
      data: {
        userId,
        market,
      },
    });
    res.status(200).json(response.payload);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
