const Service = require('egg').Service;

class TeamSevice extends Service {
  async create(data) {
    const { teamName, dsc, memberInvite, avatar } = data;
    const info = {
      teamName,
      dsc,
      memberInvite,
      avatar,
      admin: this.ctx.session.username,
      members: []
    };
    return await this.ctx.model.Team.create(info);
  }
}

module.exports = TeamSevice;
