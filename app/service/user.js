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
  async findInvitation(username) {
    // 此时要关联查询invitation的teamId，用如下的schema
    return (await this.ctx.model.User.findOne({ username }).populate('invitation.teamId')).invitation;
  }
  async joinTeam(username, teamId) {
    return await this.ctx.model.User.findOneAndUpdate({ username }, { $addToSet: { team: teamId } });
  }
  async addInvitation(username, teamId, invitor) {
    // 这里要过滤重复的邀请
    return await this.ctx.model.User.findOneAndUpdate({ username, 'invitation.teamId': { $ne: teamId } }, { $addToSet: { invitation: { teamId, invitor } } });
  }
  async decline(username, teamId) {
    return await this.ctx.model.User.findOneAndUpdate({ username }, { $pull: { invitation: { teamId } } });
  }
}

module.exports = UserSevice;
