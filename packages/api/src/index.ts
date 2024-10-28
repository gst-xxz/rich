import list, { EtfBasicInfo, etfCodeIdMap } from "@etf/data";
import { commonFetch } from "./utils";
import { KLine } from "@etf/types";

export const getEtfList = async () => list;

export const getEtfIndexList = async () => {
  const indexMap = list.reduce((obj, item) => {
    if (!obj[item.index]) {
      obj[item.index] = { index: item.index, etfs: [] };
    }
    obj[item.index].etfs.push(item);
    return {
      ...obj,
    };
  }, {} as Record<string, { index: string; etfs: EtfBasicInfo[] }>);
  return Object.values(indexMap)
    .map((item) => ({
      ...item,
      etfs: item.etfs
        .sort((a, b) => (a.gm > b.gm ? -1 : 1))
        .filter((etf) => etf.gm > 1),
    }))
    .filter((item) => item.etfs.length > 0);
};

export enum PeriodType {
  daily = 101,
  weekly = 102,
  monthly = 103,
}
export enum Adjust {
  qfq = 1,
  hfq = 2,
  default = 0,
}
interface OrginEtfResult {
  data: {
    klines: string[];
  };
}
export const getEtfKline = async (
  symbol = "510300",
  period: PeriodType = PeriodType.daily,
  start_date = "19700101",
  end_date = "20500101",
  adjust: Adjust = Adjust.qfq
) => {
  // https://quote.eastmoney.com/sz159707.html

  const url = "https://push2his.eastmoney.com/api/qt/stock/kline/get";
  const params = {
    fields1: "f1,f2,f3,f4,f5,f6",
    fields2: "f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61,f62,f63,f64",
    ut: "7eea3edcaed734bea9cbfc24409ed989",
    klt: period,
    fqt: adjust,
    lmt: 66,
    beg: start_date,
    end: end_date,
    secid: `${etfCodeIdMap[symbol]}.${symbol}`,
  };

  const data = (await commonFetch(url, params)) as OrginEtfResult;
  const kLineData: KLine[] =
    data.data?.klines.map((item) => {
      const [
        date,
        open,
        close,
        high,
        low,
        volume,
        turnover,
        amplitude,
        change,
        change_amount,
      ] = item.split(",");

      return {
        date,
        open: +open,
        close: +close,
        high: +high,
        low: +low,
        volume: +volume,
        turnover: +turnover,
        amplitude: +amplitude,
        change: +change,
        change_amount: +change_amount,
      };
    }) ?? [];
  return kLineData;
};
