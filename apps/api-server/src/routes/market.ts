import { Router } from "express";
import { updateMarketStatus } from "../middlewares/market";
import {
  createCategory,
  createMarket,
  getCategories,
  getMarketById,
  getMarkets,
  getPrices,
  settleMarket,
} from "../controllers/market";

export const marketRouter = Router();

marketRouter.use(["/getMarkets", "/getMarket/:marketId"], updateMarketStatus);

marketRouter.post("/createMarket", createMarket);
marketRouter.post("/createCategory", createCategory);
marketRouter.get("/getMarkets", getMarkets);
marketRouter.get("/getCategories", getCategories);
marketRouter.get("/price/:marketId", getPrices);
marketRouter.get("/getMarket/:marketId", getMarketById);
marketRouter.post("/settle", settleMarket);
