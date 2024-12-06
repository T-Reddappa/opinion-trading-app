export interface Trade {
  id: string;
  marketId: string;
  userId: string;
  side: "yes" | "no";
  price: number;
  quantity: number;
  timestamp: number;
}

export interface Market {
  id: string;
  liquidity: number;
  positions: {
    yes: number;
    no: number;
  };
  volume24h: number;
  lastPrice: number;
  lastUpdated: number;
}

export interface UserPosition {
  marketId: string;
  shares: {
    yes: number;
    no: number;
  };
}

export class TradingEngine {
  private markets: Map<string, Market> = new Map();
  private userPositions: Map<string, Map<string, UserPosition>> = new Map();
  private recentTrades: Map<string, Trade[]> = new Map();

  constructor(private readonly maxTradeHistory: number = 1000) {}

  initializeMarket(marketId: string, initialLiquidity: number): void {
    if (this.markets.has(marketId)) {
      throw new Error("Market already exists");
    }

    this.markets.set(marketId, {
      id: marketId,
      liquidity: initialLiquidity,
      positions: { yes: 0, no: 0 },
      lastPrice: 0.5,
      volume24h: 0,
      lastUpdated: Date.now(),
    });

    this.recentTrades.set(marketId, []);
  }

  private getOrCreateUserPosition(
    userId: string,
    marketId: string
  ): UserPosition {
    let userMarkets = this.userPositions.get(userId);
    if (!userMarkets) {
      (userMarkets = new Map()), this.userPositions.set(userId, userMarkets);
    }

    let position = userMarkets.get(marketId);
    if (!position) {
      position = {
        marketId,
        shares: { yes: 0, no: 0 },
      };
      userMarkets.set(marketId, position);
    }
    return position;
  }

  private calculatePrice(market: Market, side: "yes" | "no"): number {
    const b = market.liquidity;
    const { yes, no } = market.positions;

    return (
      Math.exp(market.positions[side] / b) /
      (Math.exp(yes / b) + Math.exp(no / b))
    );
  }

  private calculateCost(
    market: Market,
    side: "yes" | "no",
    shares: number
  ): number {
    const b = market.liquidity;
    const { yes, no } = market.positions;

    const oldCost = b * Math.log(Math.exp(yes / b) + Math.exp(no / b));

    const newPositions = {
      yes: side === "yes" ? yes + shares : yes,
      no: side === "no" ? no + shares : no,
    };

    const newCost =
      b *
      Math.log(Math.exp(newPositions.yes / b) + Math.exp(newPositions.no / b));

    return newCost - oldCost;
  }

  executeTrade(
    userId: string,
    marketId: string,
    side: "yes" | "no",
    shares: number,
    maxCost?: number
  ): Trade {
    const market = this.markets.get(marketId);
    if (!market) throw new Error("Market not found");

    const cost = this.calculateCost(market, side, shares);
    if (maxCost && cost > maxCost) {
      throw new Error("Cost exceeds maximum allowed");
    }

    market.positions[side] += shares;

    market.lastPrice = this.calculatePrice(market, side);
    market.volume24h += cost;
    market.lastUpdated = Date.now();

    const position = this.getOrCreateUserPosition(userId, marketId);
    position.shares[side] += shares;

    //create trade record
    const trade: Trade = {
      id: `t_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      marketId,
      userId,
      side,
      price: market.lastPrice,
      quantity: shares,
      timestamp: Date.now(),
    };

    const trades = this.recentTrades.get(marketId)!;
    trades.push(trade);

    if (trades.length > this.maxTradeHistory) {
      trades.shift();
    }

    return trade;
  }

  getMarketPrice(marketId: string, side: "yes" | "no"): number {
    const market = this.markets.get(marketId);
    if (!market) throw new Error("Market not found");
    return this.calculatePrice(market, side);
  }

  getMarketInfo(marketId: string): Market | undefined {
    return this.markets.get(marketId);
  }

  getUserPosition(userId: string, marketId: string): UserPosition {
    return this.getOrCreateUserPosition(userId, marketId);
  }

  getAllUserPositions(userId: string): UserPosition[] {
    const userMarkets = this.userPositions.get(userId);
    return userMarkets ? Array.from(userMarkets.values()) : [];
  }

  getRecentTrades(marketId: string): Trade[] {
    return this.recentTrades.get(marketId) || [];
  }

  get24HourVolume(marketId: string): number {
    const market = this.markets.get(marketId);
    if (!market) return 0;

    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const trades = this.recentTrades.get(marketId) || [];

    return trades
      .filter((t) => t.timestamp > oneDayAgo)
      .reduce((sum, t) => sum + t.price * t.quantity, 0);
  }
}
