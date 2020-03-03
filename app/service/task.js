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
    const res = await this.ctx.model.Task.find();
    // Promise.all(
    //   res.map(async i => {
    //     if (i.result && typeof i.result.bodyHTML !== 'string') {
    //       i.result.bodyHTML = await this.ctx.service.fs.read(
    //         i.result.bodyHTML.filename
    //       );
    //     }
    //   })
    // );
    return res;
  }
  async findByUser() {
    const { ctx } = this;
    const { user } = ctx.service;
    const { username } = ctx.session;
    const teams = (await user.findOne(username)).team;
    const data = await this.ctx.model.Task.find({
      $or: [
        {
          creator: username
        },
        {
          team: {
            $in: teams
          }
        }
      ]
    });
    return data;
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
