const Service = require('egg').Service;

class ColorSevice extends Service {
  async find() {
    return await this.ctx.model.Color.find();
  }
  async findByUser() {
    const { ctx } = this;
    const { user } = ctx.service;
    const { username } = ctx.session;
    const teams = (await user.findOne(username)).team;
    const data = await this.ctx.model.Color.find({
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
    return await this.ctx.model.Color.findById(id);
  }
  async create(data) {
    return await this.ctx.model.Color.create(data);
  }
  async update(id, data) {
    return await this.ctx.model.Color.findByIdAndUpdate(id, data);
  }
  async delete(id) {
    return await this.ctx.model.Color.findByIdAndDelete(id);
  }
}

module.exports = ColorSevice;
