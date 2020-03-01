const Service = require('egg').Service;

class UserSevice extends Service {
  async create(data) {
    const { username, password } = data;
    const userInfo = {
      username,
      password,
      charactor: 'user',
      team: []
    };
    return await this.ctx.model.User.create(userInfo);
  }
  async findOne(username) {
    return await this.ctx.model.User.findOne({ username });
  }
  async joinTeam(username, teamId) {
    return await this.ctx.model.User.findOneAndUpdate({ username }, { $push: { team: teamId } });
  }
}

module.exports = UserSevice;
