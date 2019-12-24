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
  async find() {
    const data = await this.ctx.model.Task.find();
    // 合并css
    await Promise.all(
      data.map(async i => {
        if (i.result && i.result.style) {
          const res = await postcss([cssnano]).process(i.result.style, {
            from: undefined
          });
          i.result.cleanCss = res.css;
          return;
        }
      })
    );
    return data;
  }
  // async findOne(id) {
  //   return await this.ctx.model.Task.findById(id);
  // }
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
