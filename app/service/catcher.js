const Service = require('egg').Service;

class CatcherService extends Service {
  async find() {
    return await this.ctx.model.Catcher.find();
  }
  async findByUser() {
    const { ctx } = this;
    const { user } = ctx.service;
    const { username } = ctx.session;
    const teams = (await user.findOne(username)).team;
    const data = await this.ctx.model.Catcher.find({
      $or: [{
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
    return await this.ctx.model.Catcher.findById(id);
  }
  async create(data) {
    return await this.ctx.model.Catcher.create(data);
  }
  async update(id, data) {
    return await this.ctx.model.Catcher.findByIdAndUpdate(id, data);
  }
  async delete(id) {
    return await this.ctx.model.Catcher.findByIdAndDelete(id);
  }
}
module.exports = CatcherService;