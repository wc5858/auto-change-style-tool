const drivers = require('../util/drivers');
const change = require('../component/changeColor');
// const saveImg = require('../util/saveImage');

module.exports = async function(options) {
  const driver = await drivers.getChromeDriver();
  try {
    const { url, colorData } = options;
    await driver.get(url);
    // let imgData = await driver.takeScreenshot();
    // saveImg(site + '-change-before', imgData);
    let data = await change(driver, colorData);
    // imgData = await driver.takeScreenshot();
    // saveImg(site + '-change-after', imgData);
  } catch (e) {
    throw e;
  } finally {
    driver.quit();
  }
};
