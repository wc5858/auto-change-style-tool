const Model = require('../mocks/article/list');

module.exports = app => {
  return class AppController extends app.Controller {
    async index() {
      const { ctx } = this;
      const { color, component, task } = ctx.service;
      const [colorData, componentData, taskData] = await Promise.all([
        color.find(),
        component.find(),
        task.find()
      ]);
      await ctx.render('app.js', {
        url: ctx.url,
        colorData,
        componentData,
        taskData
      });
    }

    async pager() {
      const { ctx } = this;
      const pageIndex = ctx.query.pageIndex;
      const pageSize = ctx.query.pageSize;
      ctx.body = Model.getPage(pageIndex, pageSize);
    }
  };
};
