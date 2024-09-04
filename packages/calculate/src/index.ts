export interface DailyData {
  // k 线
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
  turnover?: number;

  // 总资产
  totalAssets: number;
  // 现金资产
  cashAssets: number;
  // 股票资产
  stockAssets: number;
  // 持仓成本价
  cost: number;
  // 持仓数量
  quantity: number;

  // 操作方向
  action: "buy" | "sell" | "hold";
  // 操作数量
  num: number;
  // 操作价格
  price: number;
  // 交易费用
  fee: number;

  // 盈亏
  profitAndLoss: number;
  // 盈亏率
  profitAndLossRatio: number;
}
