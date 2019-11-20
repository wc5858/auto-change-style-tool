const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const getChromeDriver = async (headless = true) => {
  if (headless) {
    return await new Builder()
      .forBrowser('chrome')
      // 无头模式
      .setChromeOptions(new chrome.Options().headless())
      .build();
  }
  return await new Builder().forBrowser('chrome').build();
};

module.exports = {
  getChromeDriver
};
