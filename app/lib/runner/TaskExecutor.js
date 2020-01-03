const drivers = require('../util/drivers');
const change = require('../component/changeColor');
const searchUsedCSS = require('../component/searchUsedCSS');
const optimization = require('../component/optimization');
const getResult = require('../component/getResult');
const replaceComponent = require('../component/replaceComponent');
const screenshot = require('../util/screenshot');

class TaskExecutor {
  constructor(options, { onEachTaskEnd, beforeEachTask, headless = true }) {
    this.options = options;
    this.onEachTaskEnd =
      typeof onEachTaskEnd === 'function' ? onEachTaskEnd : () => {};
    this.beforeEachTask =
      typeof beforeEachTask === 'function' ? beforeEachTask : () => {};
    this.headless = headless;
    this.taskList = [];
    this.ended = false;
    this.result = {};
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
          const result = await callback(assignedOptions);
          if (this.headless) {
            const fileName = await screenshot(
              `${site}-${name}-${+new Date()}`,
              this.driver
            );
            cur.screenshot = fileName;
          }
          cur.success = true;
          cur.wait = false;
          if (result) {
            cur.result = result;
          }
        } catch (error) {
          console.log(error);
          cur.wait = false;
          cur.error = error;
          this.ended = true;
          this.result.success = false;
          this.driver.close();
        }
        cur.time = new Date() - this.time;
        this.onEachTaskEnd(this.taskList);
      }
      this.time = new Date();
    };
  }

  async init(options) {
    await this.taskWrapper(async options => {
      this.driver = await drivers.getChromeDriver(this.headless);
      const { url } = options;
      await this.driver.get(url);
      await searchUsedCSS(this.driver);
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
      return await replaceComponent(this.driver, componentData, {
        pac,
        threshold1,
        threshold2
      });
    }, 'replaceComponent')(options);
  }

  async finish() {
    this.ended = true;
    if (this.result.success !== false ) {
      this.result.success = true;
      this.result.data = await getResult(this.driver);
    }
    driver.close();
    return this.result;
  }
}

module.exports = TaskExecutor;
