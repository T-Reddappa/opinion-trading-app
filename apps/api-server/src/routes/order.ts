import { Router } from "express";
import { cancelOrder, createOrder, getOpenOrders } from "../controllers/ordrer";

export const orderRouter = Router();

orderRouter.post("/", createOrder);
orderRouter.get("/", getOpenOrders);
orderRouter.delete("/", cancelOrder);
