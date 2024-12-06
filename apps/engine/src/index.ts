import { TradingEngineApp } from "./services/tradingEngineApp";

async function main() {
  const app = new TradingEngineApp();

  try {
    await app.initialzie();
    await app.processMessages();
  } catch (error) {
    console.error("Application error:", error);
    process.exit(1);
  }
}

main();
