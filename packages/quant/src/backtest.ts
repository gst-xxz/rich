import {
  KLine,
  Signal,
  SignalAction,
  BuySignal,
  SellSignal,
  Log,
} from "@etf/types";

function backtest(initialCash: number, klines: KLine[], signals: Signal[]) {
  // 现金
  let cash = initialCash;
  // 持有股票数
  let holdAmount = 0;
  // 购买股票的投入
  let cashInvestment = 0;

  const logs: Log[] = [];
  let maxTotal = initialCash; // 最大总资产
  let maxDrawdown = 0; // 最大回撤

  const record = (kline: KLine, signal: Signal, remark?: string) => {
    const stockAsset = holdAmount * kline.close;
    const total = cash + stockAsset;
    const profit = total - initialCash;
    const totalRate = profit / initialCash;

    // 更新最大总资产
    if (total > maxTotal) {
      maxTotal = total;
    }

    // 计算当前回撤
    const drawdown = (total - maxTotal) / maxTotal;
    maxDrawdown = Math.min(maxDrawdown, drawdown);

    logs.push({
      cash,
      holdAmount,
      stockAsset,
      total,
      holdCost: holdAmount === 0 ? 0 : cashInvestment / holdAmount,
      profit,
      totalRate,
      signal,
      remark,
    });
  };

  const hold = (kline: KLine, remark?: string) => {
    record(kline, { action: SignalAction.hold }, remark);
  };

  const buy = (kline: KLine, signal: BuySignal) => {
    const buyStockAsset = kline.close * signal.amount;
    const buyCash = buyStockAsset + signal.fee;

    if (cash < buyCash) {
      hold(kline, "现金不足");
      return;
    }

    // 更新现金
    cash -= buyCash;
    // 更新持有股票数
    holdAmount += signal.amount;
    // 更新购买股票的投入
    cashInvestment += buyCash;
    // 计算当前状态
    record(kline, signal);
  };

  const sell = (kline: KLine, signal: SellSignal) => {
    if (holdAmount < signal.amount) {
      hold(kline, "持有股票数不足");
      return;
    }

    const sellCash = kline.close * signal.amount;
    // 更新现金
    cash += sellCash - signal.fee;
    // 更新持有股票数
    holdAmount -= signal.amount;
    // 更新购买股票的投入
    cashInvestment -= sellCash + signal.fee;

    // 计算当前状态
    record(kline, signal);
  };

  signals.forEach((signal, index) => {
    const kline = klines[index];
    if (signal.action === SignalAction.buy) {
      buy(kline, signal);
    } else if (signal.action === SignalAction.sell) {
      sell(kline, signal);
    } else if (signal.action === SignalAction.hold) {
      hold(kline);
    }
  });

  // 计算回测结果
  const finalTotal = cash + holdAmount * klines[klines.length - 1].close;
  const totalReturn = (finalTotal - initialCash) / initialCash; // 总收益
  const annualReturn = Math.pow(1 + totalReturn, 252 / klines.length) - 1; // 年化收益

  return {
    logs,
    totalReturn,
    finalTotal,
    annualReturn,
  };
}

export default backtest;
