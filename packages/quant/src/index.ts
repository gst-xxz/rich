import { getEtfKline } from "@etf/api";
import { KLine, Log, StrategyFn } from "@etf/types";
import backtest from "./backtest";

class Quant {
  public klines: KLine[] = [];

  public logs: Log[] = [];

  async run(code: string, strategyFn: StrategyFn, initialCash: number = 10000) {
    this.klines = await getEtfKline(code);
    const signals = strategyFn(this.klines);
    const { logs } = backtest(initialCash, this.klines, signals);
    this.logs = logs;
  }

  getKlineByDate(date: string) {
    return this.klines.find((kline) => kline.date === date);
  }

  get dates() {
    return this.klines.map((kline) => kline.date);
  }

  get closes() {
    return this.klines.map((kline) => kline.close);
  }

  get candlestick() {
    return this.klines.map((kline) => [
      kline.open,
      kline.close,
      kline.low,
      kline.high,
    ]);
  }

  get volumes() {
    return this.klines.map((kline, i) => [
      i,
      kline.volume,
      kline.open > kline.close ? 1 : -1,
    ]);
  }
}

export default Quant;
