const Service = require('egg').Service;

class ComponentSevice extends Service {
  async find() {
    return await this.ctx.model.Component.find();
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
