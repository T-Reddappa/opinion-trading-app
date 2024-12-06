import { Category, Market } from "@repo/db";
import { Request, Response } from "express";
import { readSync } from "fs";

/*
marketRouter.post('/createMarket', createMarket);
marketRouter.post('/createCategory', createCategory);
marketRouter.get('/getMarkets, getMarkets);
marketRouter.get('/getCategories, getCategories);
marketRouter.get('/price/:marketId', getPrices);
marketRouter.get('/getMarket/:marketId', getMarketById);
marketRouter.post('/settle', settleMarket);
*/

export const createMarket = async (req: Request, res: Response) => {
  try {
    const {
      title,
      stockSymbol,
      description,
      thumbnail,
      sourceOfTruth,
      startTime,
      endTime,
      status,
      currentYesPrice,
      currentNoPrice,
      totalVolumes,
      categoryId,
      // numberOfTraders,
      // result,
    } = req.body;

    if (new Date(startTime) >= new Date(endTime)) {
      res.json(400).json({ error: "Start time must be before End time" });
      return;
    }

    const market = new Market({
      title,
      stockSymbol,
      description,
      categoryId,
      thumbnail,
      sourceOfTruth,
      startTime,
      endTime,
      status,
      currentYesPrice,
      currentNoPrice,
      totalVolumes,
    });

    if (categoryId) {
      await Category.findByIdAndUpdate(categoryId, {
        $push: { markets: market._id },
      });
    }

    await market.save();

    res.status(201).json({ market, message: "Market created succesfully" });
  } catch (error) {
    console.error("Internal servere error");
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMarkets = async (req: Request, res: Response) => {
  try {
    const markets = await Market.find({});
    res.status(200).json({ markets });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMarketById = async (req: Request, res: Response) => {
  try {
    const { marketId } = req.params;
    const market = await Market.findById(marketId);
    if (!market) {
      res.status(404).json({ erro: "Market not found" });
      return;
    }
    res.status(200).json(market);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, icon, markets } = req.body;
    const category = new Category({
      name,
      icon,
      markets,
    });
    await category.save();
    res.status(201).json({ category, message: `{name} category created.` });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPrices = async (req: Request, res: Response) => {
  try {
    const { marketId } = req.params;
    const market = await Market.findById(marketId).settle(
      "currentYesPrice currentNoPrice totalVolumes"
    );

    if (!market) {
      res.status(400).json({ error: "Market not found" });
      return;
    }

    res.status(200).json({
      currentYesPrice: market.currentYesPrice,
      currentNoPrice: market.currentNoPrice,
      totalVolumes: market.totalVolumes,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const settleMarket = async (req: Request, res: Response) => {
  try {
    const { marketId, result } = req.body;

    if (!["yes", "no"].includes(result)) {
      res.status(400).json({
        error: 'Result must be either "yes" or "no"',
      });
      return;
    }

    const market = await Market.findById(marketId);

    if (!market) {
      res.status(404).json({ erro: "Market not found" });
      return;
    }

    if (market.status !== "active") {
      res.status(400).json({
        error: "Only active markets can be settled",
      });
      return;
    }

    if (new Date() < market.endTime) {
      res.status(400).json({
        error: "Cannot settle market before end time",
      });
      return;
    }

    market.status = "resolved";
    market.result = result;
    await market.save();

    res.json(market);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
