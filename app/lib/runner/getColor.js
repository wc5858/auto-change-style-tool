const drivers = require('../util/drivers');
const { Builder } = require('selenium-webdriver');
const getStyle = require('../component/getStyle');

const mergeColorData = function(datas) {
  const bgColorData = {};
  const fontColorData = {};
  let totalBgColorArea = 0;
  let totalBgColorTimes = 0;
  let totalFontColorLength = 0;
  for (let data of datas) {
    for (let color in data.bgColorData) {
      let area = data.bgColorData[color].area;
      let times = data.bgColorData[color].times;
      if (bgColorData[color]) {
        bgColorData[color].area += area;
        bgColorData[color].times += times;
      } else {
        bgColorData[color] = {
          area,
          times
        };
      }
      totalBgColorArea += area;
      totalBgColorTimes += times;
    }
    for (let color in data.fontColorData) {
      const length = data.fontColorData[color].length;
      if (fontColorData[color]) {
        fontColorData[color].length += length;
      } else {
        fontColorData[color] = {
          length
        };
      }
      totalFontColorLength += length;
    }
  }
  for (let k in bgColorData) {
    bgColorData[k].areaRatio = bgColorData[k].area / totalBgColorArea;
    bgColorData[k].timesRatio = bgColorData[k].times / totalBgColorTimes;
  }
  for (let k in fontColorData) {
    fontColorData[k].lengthRatio = fontColorData[k].length / totalFontColorLength;
  }
  return {
    bgColorData,
    fontColorData
  };
};

module.exports = async function(data) {
  const driver = await drivers.getChromeDriver();
  try {
    const { baseUrl, subPages } = data;
    const res = [];
    for (let page of subPages) {
      await driver.get(baseUrl + page);
      const data = await getStyle(driver, 'colordata');
      res.push(JSON.parse(data));
    }
    return mergeColorData(res);
  } catch (e) {
    // 捕获异常重新抛出
    // 换了个写法，如果throw new Error(e)，就会丢失错误栈信息
    throw e;
  } finally {
    driver.quit();
  }
};
