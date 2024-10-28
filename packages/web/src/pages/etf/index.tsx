import { useParams } from "react-router-dom";
import Chart from "../../components/chart";
import data from "@etf/data";
import useOptions from "./useChartOptions";

const ETF = () => {
  const { code } = useParams() as { code: string };
  const etf = data.find((item) => item.code === code);

  const options = useOptions(code);

  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-2xl font-bold">{etf?.name}</h1>
      <p className="text-sm text-gray-500">跟踪指数: {etf?.index}</p>
      <div className="flex-1">
        <Chart options={options} />
      </div>
    </div>
  );
};

export default ETF;
