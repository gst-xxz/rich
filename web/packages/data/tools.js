const fetch = require("node-fetch");
const cheerio = require("cheerio");
const fs = require("fs");

const url = `https://1.push2.eastmoney.com/api/qt/clist/get?cb=callback&pn=1&pz=1200&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&dect=1&wbp2u=|0|0|0|web&fid=f3&fs=b:MK0021,b:MK0022,b:MK0023,b:MK0024&fields=f12,f13,f14&_=${Date.now()}`;

function executeCallback(code) {
  return new Promise((resolve) => {
    // 定义 callback 函数
    function callback(data) {
      resolve(data); // 这里可以根据需要处理 data 参数
    }

    // 使用 new Function 创建一个新的函数对象
    const func = new Function("callback", code);

    // 调用新创建的函数，并传入 callback 函数
    func(callback);
  });
}

const wait = (time, step = 200) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time * step);
  });
};

const getEtfInfo = async (code, name, market, index) => {
  try {
    await wait(index);
    console.log("start:" + code);
    const res = await fetch(`https://fundf10.eastmoney.com/jbgk_${code}.html`);

    const html = await res.text();
    const $ = cheerio.load(html);

    const bd = $(".info.w790 tr").eq(9).find("td").eq(1).text();
    const gm = $(".info.w790 tr").eq(3).find("td").eq(1).text();
    console.log("end:" + code);

    return [code, name, bd, parseFloat(gm), market];
  } catch (e) {
    console.log(1);
    return null;
  }
};

const getEtfList = async () => {
  const ret = await fetch(url);
  const text = await ret.text();
  const data = await executeCallback(text);
  const ps = data.data.diff.map(
    ({ f12: code, f13: marker, f14: name }, index) =>
      getEtfInfo(code, name, marker, index)
  );
  const list = await Promise.all(ps);
  fs.writeFile(__dirname + "/etf.json", JSON.stringify(list), () => {
    console.log("写入文件成功");
  });
};

const main = async () => {
  await getEtfList();
};

main();
