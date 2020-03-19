const drivers = require('../util/drivers');
const getResult = require('../component/getResult');

class CatcherExecutor {
  constructor(options, {headless = true} = {}) {
    this.options = options;
    this.result = {};
    this.headless = headless;

  }
  
  async init() {
    this.driver = await drivers.getChromeDriver(this.headless);
    const { url } = this.options;
    await this.driver.get(url);
  }

  async test() {
    //TODO : test
    
  }

  async finish() {
    // this.result.data = await getResult(this.driver);
    this.result.success = true;
    this.driver.close();
    return this.result;
  }
}
module.exports = CatcherExecutor;