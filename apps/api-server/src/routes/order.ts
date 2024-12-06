import { Router } from "express";
import { cancelOrder, createOrder, getOpenOrders } from "../controllers/order";

export const orderRouter = Router();

orderRouter.post("/", createOrder);
orderRouter.get("/", getOpenOrders);
orderRouter.delete("/", cancelOrder);
