export interface KLine {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
  // 成交量
  volume: number;
  // 成交额
  turnover: number;
  // 振幅
  amplitude: number;
  // 涨跌幅
  change: number;
  // 涨跌额
  change_amount: number;
}

export enum SignalAction {
  buy = "buy",
  sell = "sell",
  hold = "hold",
}

export interface BuySignal {
  action: SignalAction.buy;
  price: number;
  amount: number;
  fee: number;
}
export interface SellSignal {
  action: SignalAction.sell;
  price: number;
  amount: number;
  fee: number;
}
export interface HoldSignal {
  action: SignalAction.hold;
}

export type Signal = BuySignal | SellSignal | HoldSignal;

export type StrategyFn = (klineData: KLine[]) => Signal[];

export interface Log {
  // 现金=初始资产-（买入价*买入数量+买入手续费）+（卖出价*卖出数量-卖出手续费）
  cash: number;
  // 持有股票数=买入数量-卖出数量
  holdAmount: number;
  // 股票资产
  stockAsset: number;
  // 总资产= 股票资产+现金
  total: number;
  // 成本价=股票资产/持有股票数
  holdCost: number;
  // 盈亏=总资产-初始资产
  profit: number;
  // 盈亏率=盈亏/初始资产
  totalRate: number;
  // 信号
  signal: Signal;
  // 备注
  remark?: string;
}
