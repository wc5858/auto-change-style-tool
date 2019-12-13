const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const getChromeDriver = async (headless = true) => {
  let options = new chrome.Options();
  if (headless) {
    // 无头模式headless
    options = options.headless();
  }
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(
      options.windowSize({
        height: 1000,
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
