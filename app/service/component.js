const Service = require('egg').Service;

class ComponentSevice extends Service {
  async find() {
    return await this.ctx.model.Component.find();
  }
  async findByUser() {
    const { ctx } = this;
    const { user } = ctx.service;
    const { username } = ctx.session;
    const teams = (await user.findOne(username)).team;
    const data = await this.ctx.model.Component.find({
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
    return await this.ctx.model.Component.findById(id);
  }
  async create(data) {
    return await this.ctx.model.Component.create(data);
  }
  async update(id, data) {
    return await this.ctx.model.Component.findByIdAndUpdate(id, data);
  }
  async delete(id) {
    return await this.ctx.model.Component.findByIdAndDelete(id);
  }
}

module.exports = ComponentSevice;
