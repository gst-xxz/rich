import list from "./etf.json";

export interface EtfBasicInfo {
  code: string;
  name: string;
  index: string;
  gm: number;
  market: string;
}

const data = (
  list as [string, string, string, number, string][]
).map<EtfBasicInfo>((item) => ({
  code: item[0],
  name: item[1],
  index: item[2],
  gm: item[3],
  market: item[4],
}));

export default data;

export const etfCodeIdMap = data.reduce(
  (obj, item) => ({
    ...obj,
    [item.code]: item.market,
  }),
  {} as Record<string, string>
);

const _etfGroupByIndex = data.reduce((prev, item) => {
  if (!prev[item.index]) {
    prev[item.index] = {
      index: item.index,
      list: [],
    };
  }
  prev[item.index].list.push(item);
  return prev;
}, {} as Record<string, { list: EtfBasicInfo[]; index: string }>);

export const etfGroupByIndex = Object.values(_etfGroupByIndex);
