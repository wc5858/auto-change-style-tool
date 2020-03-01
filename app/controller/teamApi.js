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
      console.log(ctx.request.body);
      // WIP
      ctx.body = {
        success: true
      };
    }
  };
};