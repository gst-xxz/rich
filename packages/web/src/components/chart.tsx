import React from "react";
import * as echarts from "echarts";
import lodash from "lodash";

const Chart = ({ options }: { options: echarts.EChartsOption }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const chartRef = React.useRef<echarts.ECharts>();

  React.useEffect(() => {
    chartRef.current = echarts.init(containerRef.current);
  }, []);

  React.useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    chartRef.current?.setOption(options, true);
  }, [options]);

  React.useEffect(() => {
    const onResize = lodash.throttle(() => {
      chartRef.current?.resize();
    }, 100);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      chartRef.current?.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full"></div>;
};

export default Chart;
