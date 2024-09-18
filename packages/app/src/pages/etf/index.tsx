import KlineChart from "../../components/kline";

const Etf = () => {
  return (
    <div>
      <div className="">基本信息</div>
      <div>
        <div className="">k线</div>
        <KlineChart />
      </div>
      <div>选择策略</div>
      <div>调参</div>
      <div>结果</div>
      <div>分析</div>
    </div>
  );
};

export default Etf;
