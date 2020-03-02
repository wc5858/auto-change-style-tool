module.exports = app => {
  return class TeamController extends app.Controller {
    async createTeam() {
      const { ctx } = this;
      const { team, user } = ctx.service;
      const data = ctx.request.body;
      const res = await team.create(data);
      await user.joinTeam(ctx.session.username, res._id);
      ctx.body = {
        success: true
      };
    }
    async findTeam() {
      const { ctx } = this;
      const { team } = ctx.service;
      const data = await team.find(ctx.session.username);
      ctx.body = {
        success: true,
        data
      };
    }
    async invite() {
      const { ctx } = this;
      const { user } = ctx.service;
      const { target, teamId, invitor } = ctx.request.body;
      const targetUser = await user.findOne(target);
      if (!targetUser) {
        ctx.body = {
          success: false,
          error: 'User does not exist.'
        };
        return;
      }
      const res = await user.addInvitation(target, teamId, invitor);
      if (!res) {
        ctx.body = {
          success: false,
          error: 'Invitation already exists.'
        };
        return;
      }
      ctx.body = {
        success: true
      };
    }
    async decline() {
      const { ctx } = this;
      const { username } = ctx.session;
      const { user } = ctx.service;
      const { teamId } = ctx.request.body;
      const res = await user.decline(username, teamId);
      ctx.body = {
        success: true
      };
    }
    async join() {
      const { ctx } = this;
      const { username } = ctx.session;
      const { user, team } = ctx.service;
      console.log(ctx.request.body);
      const { teamId } = ctx.request.body;
      await user.joinTeam(username, teamId);
      await team.addMember(username, teamId);
      // 删除信息
      await user.decline(username, teamId);
      ctx.body = {
        success: true
      };
    }
  };
};