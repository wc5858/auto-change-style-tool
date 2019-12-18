const drivers = require('../util/drivers');
const searchUsedCSS = require('../component/searchUsedCSS');
const seg = require('../component/segmentation');
const cp = require('../util/component');

module.exports = async function(data) {
  const driver = await drivers.getChromeDriver();
  try {
    const { baseUrl, subPages, pac } = data;
    const res = [];
    for (let page of subPages) {
      await driver.get(baseUrl + page);
      await searchUsedCSS(driver);
      let node = await seg(driver, {
        pac: 4,
        returnType: 'null',
        showBox: false
      });
      const list = cp.getLeafComponent(node);
      for (const item of list) {
        const tag = item.tagSequence.join(' ') + '|' + item.classList.join(' ');
        if (res[tag]) {
          // console.log(tag);
          res[tag].times++;
        } else {
          res[tag] = item;
          res[tag].times = 1;
        }
      }
    }
    return Object.values(res);
  } catch (e) {
    throw e;
  } finally {
    driver.quit();
  }
};
