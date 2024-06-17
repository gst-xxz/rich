import { KLineChartPro } from "@etf/klinecharts-pro";
import "@etf/klinecharts-pro/dist/klinecharts-pro.css";
import React from "react";
import DefaultDatafeed from "./DefaultDatafeed";
import "./index.css";
import { periods } from "./constant";

const EtfChart = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const chartRef = React.useRef<KLineChartPro>();

  React.useEffect(() => {
    if (chartRef.current) {
      return;
    }
    // 创建实例
    chartRef.current = new KLineChartPro({
      container: containerRef.current!,
      // 初始化标的信息
      symbol: {
        shortName: "BABA",
        ticker: "159707",
      },
      // 初始化周期
      period: periods[0],
      periods,
      datafeed: new DefaultDatafeed(),
      drawingBarVisible: false,
      watermark: "",
      styles: {
        candle: { priceMark: { last: { show: false } } },
      },
      mainIndicators: ["BOLL"],
      subIndicators: ["VOL"],
    });
  }, []);
  return <div ref={containerRef} className="w-[600px] h-96"></div>;
};

export default EtfChart;
