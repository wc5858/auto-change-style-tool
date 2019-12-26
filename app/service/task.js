const Service = require('egg').Service;
const postcss = require('postcss');
const cssnano = require('cssnano')({
  preset: [
    'default',
    {
      discardComments: {
        removeAll: true
      }
    }
  ]
});

class TaskSevice extends Service {
  async getNanoCss(css) {
    const res = await postcss([cssnano]).process(css, {
      from: undefined
    });
    return res.css;
  }
  async find() {
    return await this.ctx.model.Task.find();
  }
  async findOne(id) {
    return await this.ctx.model.Task.findById(id);
  }
  async create(data) {
    return await this.ctx.model.Task.create(data);
  }
  async update(id, data) {
    return await this.ctx.model.Task.findByIdAndUpdate(id, data);
  }
  async delete(id) {
    return await this.ctx.model.Task.findByIdAndDelete(id);
  }
}

module.exports = TaskSevice;
