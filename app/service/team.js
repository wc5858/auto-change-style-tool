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
  async find(username) {
    // populate跨表联查，第一个参数是要查的字段，第二个参数是要查的表要取出来的字段（过滤字段）
    // 要查的字段绑定的表是通过在Schema里指定ref完成的
    return (await this.ctx.model.User.findOne({ username }).populate('team')).team;
  }
  async addMember(username, teamId) {
    return await this.ctx.model.Team.findByIdAndUpdate(teamId, { $addToSet: { members: username } });
  }
}

module.exports = TeamSevice;
