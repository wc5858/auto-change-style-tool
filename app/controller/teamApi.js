module.exports = app => {
  return class TeamController extends app.Controller {
    async createTeam() {
      const { ctx } = this;
      const { team } = ctx.service;
      const data = ctx.request.body;
      const res = await team.create(data);
      ctx.body = {
        success: true
      };
    }
  };
};