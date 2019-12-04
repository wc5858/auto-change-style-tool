const drivers = require('../util/drivers');
const change = require('../component/changeColor');
const optimization = require('../component/optimization');
const replaceComponent = require('../component/replaceComponent');
const screenshot = require('../util/screenshot');

class TaskExecutor {
  constructor(options, { onEachTaskEnd, beforeEachTask }) {
    this.options = options;
    this.onEachTaskEnd =
      typeof onEachTaskEnd === 'function' ? onEachTaskEnd : () => {};
    this.beforeEachTask =
      typeof beforeEachTask === 'function' ? beforeEachTask : () => {};
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
          wait: true,
          time: new Date() - this.time
        });
        return;
      }
      if (typeof callback === 'function') {
        const cur = {
          name,
          success: false,
          wait: true
        };
        this.taskList.push(cur);
        this.beforeEachTask(this.taskList);
        try {
          const { site } = this.options;
          const assignedOptions = Object.assign(this.options, options);
          await callback(assignedOptions);
          const fileName = await screenshot(
            `${site}-${name}-${+new Date()}`,
            this.driver
          );
          cur.success = true;
          cur.wait = false;
          cur.screenshot = fileName;
        } catch (error) {
          console.log(error);
          cur.wait = false;
          cur.error = error;
          this.ended = true;
          this.driver.quit();
        }
        cur.time = new Date() - this.time;
        this.onEachTaskEnd(this.taskList);
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
      const { colorData, bgMappingType } = options;
      await change(this.driver, colorData, bgMappingType);
    }, 'changeColor')(options);
  }

  async optimization(options) {
    await this.taskWrapper(async options => {
      await optimization(this.driver);
    }, 'optimization')(options);
  }

  async replaceComponent(options) {
    await this.taskWrapper(async options => {
      const { componentData, pac, threshold1, threshold2 } = options;
      await replaceComponent(this.driver, componentData, {
        pac,
        threshold1,
        threshold2
      });
    }, 'replaceComponent')(options);
  }

  finish() {
    this.ended = true;
    this.driver.quit();
    return this.taskList;
  }
}

module.exports = TaskExecutor;
