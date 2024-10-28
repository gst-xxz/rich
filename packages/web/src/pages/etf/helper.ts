import { KLine } from "@etf/types";

export const calculateStartRange = (length: number) => {
  if (length < 120) {
    return 0;
  }
  if (length > 2000) {
    return ((length * 0.95) / length) * 100;
  }

  return ((length - 120) / length) * 100;
};

export function calculateMA(dayCount: number, closes: number[]) {
  const result = [];
  for (var i = 0, len = closes.length; i < len; i++) {
    if (i < dayCount) {
      result.push("-");
      continue;
    }
    var sum = 0;
    for (var j = 0; j < dayCount; j++) {
      sum += closes[i - j];
    }
    result.push(+(sum / dayCount).toFixed(3));
  }
  return result;
}

// 如果小数不到4位，用0补齐
const formatNumber = (value: number, decimal: number = 3) => {
  const str = value.toFixed(decimal);
  if (str.length < decimal + 1) {
    return str.padStart(decimal + 1, "0");
  }
  return str;
};

const formatBigNumber = (value: number, unit: string = "") => {
  if (value > 100000000) {
    return (value / 100000000).toFixed(2) + "亿" + unit;
  }
  if (value > 10000) {
    return (value / 10000).toFixed(2) + "万" + unit;
  }
  return value.toString() + unit;
};

// 添加单位
const addUnit = (value: number, unit: string) => {
  return `${value}${unit}`;
};

export const upColor = "#dd2101";
export const downColor = "#009933";

export const formatKlineData = (data: KLine) => {
  return {
    open: {
      value: formatNumber(data.open),
    },
    close: {
      value: formatNumber(data.close),
    },
    low: {
      value: formatNumber(data.low),
    },
    high: {
      value: formatNumber(data.high),
    },
    change: {
      value: addUnit(data.change, "%"),
      style: `color: ${data.change > 0 ? upColor : downColor};`,
    },
    change_amount: {
      value: formatNumber(data.change_amount),
    },
    volume: {
      value: formatBigNumber(data.volume),
    },
    turnover: {
      value: formatBigNumber(data.turnover),
    },
  };
};
