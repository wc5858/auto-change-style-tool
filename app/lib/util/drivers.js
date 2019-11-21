const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const getChromeDriver = async (headless = true) => {
  if (headless) {
    return await new Builder()
      .forBrowser('chrome')
      // 无头模式headless
      .setChromeOptions(
        new chrome.Options().headless().windowSize({
          height: 200,
          width: 1800
        })
      )
      .build();
  }
  const driver = await new Builder().forBrowser('chrome').build();
  // 可以在这里对driver做一些公共操作
  return driver;
};

module.exports = {
  getChromeDriver
};
