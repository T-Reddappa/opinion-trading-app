import { createClient } from "redis";
import { TradingEngine } from "./tradingEngine";

export class TradingEngineApp {
  private engine: TradingEngine;
  private redisClient = createClient();

  constructor() {
    this.engine = new TradingEngine();
  }

  async initialzie() {
    await this.redisClient.connect();
    console.log("connected to Redis");
  }

  async processMessages() {
    while (true) {
      try {
        const response = await this.redisClient.rPop("messages");
        if (!response) {
          await this.delay(100);
          continue;
        }

        const message = JSON.parse(response);

        if (message.type === "trade") {
          const { userId, marketId, side, shares, maxCost } = message;
          const trade = this.engine.executeTrade(
            userId,
            marketId,
            side,
            shares,
            maxCost
          );
          console.log("processed trade:", trade);
        } else if (message.type === "query") {
          const { marketId } = message;
          const marketInfo = this.engine.getMarketInfo(marketId);
        } else {
          console.warn(`Unkown message type: ${message.type}`);
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
