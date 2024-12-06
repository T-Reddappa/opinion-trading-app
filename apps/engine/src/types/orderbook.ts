export interface UserOrders {
  [userId: string]: number;
}

export interface PriceLevel {
  total: number;
  orders: UserOrders;
}

export interface StockSide {
  [price: string]: PriceLevel;
}

export interface Market {
  yes: StockSide;
  no: StockSide;
}

export interface OrderBook {
  [marketId: string]: Market;
}
