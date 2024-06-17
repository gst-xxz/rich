import { PeriodType } from "@etf/api";

export enum PeriodTimespan {
  day = "day",
  week = "week",
  month = "month",
  // year = "year",
}

export const timespanPeriodMap = {
  [PeriodTimespan.day]: PeriodType.daily,
  [PeriodTimespan.week]: PeriodType.weekly,
  [PeriodTimespan.month]: PeriodType.monthly,
};

export const periods = [
  { multiplier: 1, timespan: PeriodTimespan.day, text: "日k" },
  { multiplier: 1, timespan: PeriodTimespan.week, text: "周k" },
  { multiplier: 1, timespan: PeriodTimespan.month, text: "月K" },
  // { multiplier: 1, timespan: PeriodTimespan.year, text: "年K" },
];
