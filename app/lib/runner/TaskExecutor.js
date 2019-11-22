const drivers = require('../util/drivers');
const change = require('../component/changeColor');
const optimization = require('../component/optimization');
const screenshot = require('../util/screenshot');

class TaskExecutor {
  constructor(options, headless = true) {
    this.options = options;
    this.taskList = [];
    this.ended = false;
    this.time = new Date();
  }

  // 包装每一步的公共操作
  taskWrapper(callback, name) {
    return async options => {
      if (this.ended) {
        // 上一步出错，后续步骤直接跳过
        this.taskList.push({
          name,
          success: false,
          time: new Date() - this.time
        });
        return;
      }
      const { site } = this.options;
      const assignedOptions = Object.assign(this.options, options);
      if (typeof callback === 'function') {
        try {
          await callback(assignedOptions);
          const fileName = await screenshot(
            `${site}-${name}-${+new Date()}`,
            this.driver
          );
          this.taskList.push({
            name,
            success: true,
            screenshot: fileName,
            time: new Date() - this.time
          });
        } catch (error) {
          console.log(error);
          this.taskList.push({
            name,
            success: false,
            time: new Date() - this.time,
            error
          });
          this.ended = true;
          this.driver.quit();
        }
      }
      this.time = new Date();
    };
  }

  async init(options) {
    await this.taskWrapper(async options => {
      this.driver = await drivers.getChromeDriver();
      const { url } = options;
      await this.driver.get(url);
    }, 'init')(options);
  }

  async changeColor(options) {
    await this.taskWrapper(async options => {
      const { colorData } = options;
      await change(this.driver, colorData);
    }, 'changeColor')(options);
  }

  async optimization(options) {
    await this.taskWrapper(async options => {
      await optimization(this.driver);
    }, 'changeColor')(options);
  }

  finish() {
    this.ended = true;
    this.driver.quit();
    return this.taskList;
  }
}

module.exports = TaskExecutor;
