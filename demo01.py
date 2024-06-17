import akshare as ak
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# 1. 获取历史数据
def get_data(symbol, start_date, end_date):
    data = ak.stock_zh_a_hist(symbol=symbol, period="daily", start_date=start_date, end_date=end_date, adjust="qfq")
    data = data[['日期', '收盘']]
    data.columns = ['Date', 'Close']
    data.set_index('Date', inplace=True)
    data.index = pd.to_datetime(data.index)
    return data

# 2. 计算布林带
def calculate_bollinger_bands(data, window=20):
    data['Middle Band'] = data['Close'].rolling(window=window).mean()
    data['Std Dev'] = data['Close'].rolling(window=window).std()
    data['Upper Band'] = data['Middle Band'] + (data['Std Dev'] * 2)
    data['Lower Band'] = data['Middle Band'] - (data['Std Dev'] * 2)
    return data

# 3. 定义交易规则
def generate_signals(data):
    data['Signal'] = 0
    data['Signal'][data['Close'] > data['Upper Band']] = -1  # 卖出信号
    data['Signal'][data['Close'] < data['Lower Band']] = 1   # 买入信号
    data['Position'] = data['Signal'].shift()  # 持仓：买入->1，卖出->-1，观望->0
    return data

# 4. 执行回测
def backtest_strategy(data, initial_capital=10000):
    capital = initial_capital
    position = 0
    portfolio = []

    for index, row in data.iterrows():
        if row['Position'] == 1:  # 买入
            if position == 0:
                position = capital / row['Close']
                capital = 0
        elif row['Position'] == -1:  # 卖出
            if position > 0:
                capital = position * row['Close']
                position = 0
        portfolio.append(capital + (position * row['Close']))

    data['Portfolio Value'] = portfolio
    return data

# 5. 评估结果
def evaluate_strategy(data, initial_capital=10000):
    final_value = data['Portfolio Value'].iloc[-1]
    total_return = (final_value - initial_capital) / initial_capital
    max_drawdown = (data['Portfolio Value'].cummax() - data['Portfolio Value']).max() / data['Portfolio Value'].cummax().max()
    return total_return, max_drawdown

# 主函数
if __name__ == "__main__":
    symbol = "000001"  # 股票代码，以平安银行为例
    start_date = "20200101"
    end_date = "20231231"
    
    # 获取数据
    data = get_data(symbol, start_date, end_date)
    data = calculate_bollinger_bands(data)
    data = generate_signals(data)
    data = backtest_strategy(data)

    # 评估结果
    total_return, max_drawdown = evaluate_strategy(data)
    print(f"总收益: {total_return * 100:.2f}%")
    print(f"最大回撤: {max_drawdown * 100:.2f}%")

    # 绘制结果
    plt.figure(figsize=(14, 7))
    plt.plot(data['Close'], label='Close Price')
    plt.plot(data['Upper Band'], label='Upper Band', linestyle='--')
    plt.plot(data['Middle Band'], label='Middle Band', linestyle='--')
    plt.plot(data['Lower Band'], label='Lower Band', linestyle='--')
    plt.fill_between(data.index, data['Lower Band'], data['Upper Band'], color='grey', alpha=0.1)
    plt.plot(data['Portfolio Value'], label='Portfolio Value', color='g')
    plt.title('Bollinger Bands Strategy Backtest')
    plt.legend()
    plt.show()
