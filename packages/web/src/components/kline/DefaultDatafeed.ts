import { getEtfKline } from "@etf/api";
import { KLineData } from "@etf/klinecharts";
import dayjs from "dayjs";

import { Datafeed, SymbolInfo, Period } from "@etf/klinecharts-pro";
import { PeriodTimespan, timespanPeriodMap } from "./constant";

export default class DefaultDatafeed implements Datafeed {
  async searchSymbols(): Promise<SymbolInfo[]> {
    return [];
  }

  async getHistoryKLineData(
    symbol: SymbolInfo,
    period: Period,
    from: number,
    to: number
  ): Promise<KLineData[]> {
    return getEtfKline(
      symbol.ticker,
      timespanPeriodMap[period.timespan as PeriodTimespan],
      dayjs(from).format("YYYYMMDD"),
      dayjs(to).format("YYYYMMDD")
    );
  }

  subscribe(): void {}

  unsubscribe(): void {}
}
