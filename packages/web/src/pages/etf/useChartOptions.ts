import { useEffect, useMemo, useState } from "react";
import {
  calculateMA,
  calculateStartRange,
  downColor,
  formatKlineData,
  upColor,
} from "./helper";
import Quant from "@etf/quant";
import { bollingerBands } from "indicatorts";
import { KLine, SignalAction, StrategyFn } from "@etf/types";

const strategyFn: StrategyFn = (klines: KLine[]) => {
  const boll = bollingerBands(klines.map((item) => item.close));

  // 策略
  return klines.map((kline, i) => {
    const upper = boll.upper[i];
    const lower = boll.lower[i];
    const middle = boll.middle[i];

    // 如果收盘价上穿上轨，则卖出
    if (kline.close > upper) {
      return {
        action: SignalAction.sell,
        price: kline.close,
        amount: 1000,
        fee: 0.0005,
      };
    }
    // 如果收盘价下穿下轨，则买入
    else if (kline.close < lower) {
      return {
        action: SignalAction.buy,
        price: kline.close,
        amount: 1000,
        fee: 0.0005,
      };
    } else {
      return {
        action: SignalAction.hold,
      };
    }
  });
};

const useOptions = (code: string): echarts.EChartsOption => {
  const [quant, setQuant] = useState<Quant | null>(null);

  useEffect(() => {
    const quant = new Quant();
    quant.run(code, strategyFn, 10000).then(() => {
      console.log(quant);
      setQuant(quant);
    });
  }, [code]);

  const options = useMemo(() => {
    if (!quant) {
      return {};
    }

    if (!quant.klines.length) {
      return {};
    }

    const options: echarts.EChartsOption = {
      animation: false,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        textStyle: {
          color: "#000",
        },
        position: function (pos: any, _: any, __: any, ___: any, size: any) {
          const obj: { top: number; left?: number; right?: number } = {
            top: 10,
          };
          if (+(pos[0] < size.viewSize[0] / 2)) {
            obj.right = 30;
          } else {
            obj.left = 30;
          }
          return obj;
        },
        formatter: (params: any) => {
          const kline = quant.getKlineByDate(params[0].axisValue);
          if (!kline) return "";
          const klineData = formatKlineData(kline);

          return `
            <div class="min-w-32 same-font">
              <div class="flex">
                <div class="flex-1 font-bold">${kline?.date}</div>
              </div>
              <div class="flex">
                开盘价：
                <div class="flex-1 text-right">${klineData.open.value}</div>
              </div>
              <div class="flex">
                收盘价：
                <div class="flex-1 text-right">${klineData.close.value}</div>
              </div>
              <div class="flex">
                最低价：
                <div class="flex-1 text-right">${klineData.low.value}</div>
              </div>
              <div class="flex">
                最高价：
                <div class="flex-1 text-right">${klineData.high.value}</div>
              </div>
              <div class="flex">
                涨跌幅：
                <div class="flex-1 text-right" style="${klineData.change.style}">${klineData.change.value}</div>
              </div>
              <div class="flex">
                涨跌额：
                <div class="flex-1 text-right">${klineData.change_amount.value}</div>
              </div>
              <div class="flex">
                成交量：
                <div class="flex-1 text-right">${klineData.volume.value}</div>
              </div>
              <div class="flex">
                成交额：
                <div class="flex-1 text-right">${klineData.turnover.value}</div>
              </div>
            </div>
            `;
        },
      },
      axisPointer: {
        link: [
          {
            xAxisIndex: "all",
          },
        ],
        label: {
          backgroundColor: "#777",
        },
      },
      visualMap: {
        show: false,
        seriesIndex: 5,
        pieces: [
          {
            value: 1,
            color: downColor,
          },
          {
            value: -1,
            color: upColor,
          },
        ],
      },
      grid: [
        {
          left: "8%",
          right: "4%",
          height: "45%",
        },
        {
          left: "8%",
          right: "4%",
          top: "55%",
          height: "15%",
        },
        {
          left: "8%",
          right: "4%",
          top: "75%",
          height: "16%",
        },
      ],
      xAxis: [
        {
          type: "category",
          data: quant.dates,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          min: "dataMin",
          max: "dataMax",
          axisPointer: {
            z: 100,
          },
        },
        {
          type: "category",
          gridIndex: 1,
          data: quant.dates,
          boundaryGap: false,
          axisLine: { onZero: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          min: "dataMin",
          max: "dataMax",
        },
        {
          type: "category",
          gridIndex: 2,
          data: quant.dates,
          boundaryGap: false,
          axisLine: { onZero: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          min: "dataMin",
          max: "dataMax",
        },
      ],
      yAxis: [
        {
          scale: true,
        },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
        },
        {
          gridIndex: 2,
          scale: true,
          // axisLabel: { show: false },
          axisLine: { show: false },
          // axisTick: { show: false },
          // splitLine: { show: false },
        },
      ],
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: [0, 1],
          start: calculateStartRange(quant.klines.length),
          end: 100,
        },
        {
          type: "inside",
          xAxisIndex: [0, 2],
          start: calculateStartRange(quant.klines.length),
          end: 100,
        },
      ],
      series: [
        {
          name: "MA5",
          type: "line",
          data: calculateMA(5, quant.closes),
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 1,
          },
          tooltip: {
            show: false,
          },
        },
        {
          name: "MA10",
          type: "line",
          data: calculateMA(10, quant.closes),
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 1,
          },
          tooltip: {
            show: false,
          },
        },
        {
          name: "MA20",
          type: "line",
          data: calculateMA(20, quant.closes),
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 1,
          },
          tooltip: {
            show: false,
          },
        },
        {
          name: "MA30",
          type: "line",
          data: calculateMA(30, quant.closes),
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 1,
          },
          tooltip: {
            show: false,
          },
        },
        {
          name: "Dow-Jones index",
          type: "candlestick",
          data: quant.candlestick,
          itemStyle: {
            color: upColor,
            color0: downColor,
            borderColor: undefined,
            borderColor0: undefined,
          },
        },
        {
          name: "Volume",
          type: "bar",
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: quant.volumes,
        },
        // 量化交易的结果
        {
          type: "bar",
          xAxisIndex: 2,
          yAxisIndex: 2,
          data: quant.logs.map((item) => item.total),
        },
      ],
    };

    return options;
  }, [quant]);

  return options;
};

export default useOptions;
