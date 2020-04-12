const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const getChromeDriver = async (headless = true) => {
  let options = new chrome.Options();
  options = options
    .addArguments('--disable-web-security')
    // --disable-web-security必须配合下面这个参数一起使用，user-data-dir每个driver独立使用
    .addArguments(
      `--user-data-dir=c:\\z\\${+new Date()}-${Math.floor(
        Math.random() * 1000
      )}`
    );
  if (headless) {
    // 无头模式headless
    options = options.headless();
  }
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(
      options.windowSize({
        height: 4500,
        width: 1800
      })
    )
    .build();
  // 可以在这里对driver做一些公共操作
  driver.manage().setTimeouts({ script: null });
  return driver;
};

module.exports = {
  getChromeDriver
};
