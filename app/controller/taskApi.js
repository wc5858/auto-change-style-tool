const TaskExecutor = require('../lib/runner/TaskExecutor');

module.exports = app => {
  return class TaskController extends app.Controller {
    async createTask() {
      const { ctx } = this;
      const { color, task } = ctx.service;
      const { colorDataId, url, site } = ctx.request.body;
      const res = await task.create({
        url,
        site,
        state: '执行中'
      });
      const runner = async () => {
        const colorData = await color.findOne(colorDataId);
        const taskExecutor = new TaskExecutor({ url, colorData, site });
        await taskExecutor.init();
        await taskExecutor.changeColor();
        await taskExecutor.optimization();
        return taskExecutor.finish();
      };
      const id = res._id;
      runner()
        .then(taskList => {
          task.update(id, {
            state: '执行结束',
            taskList
          });
        })
        .catch(e => {
          console.log(e);
          task.update(id, {
            state: '执行失败',
            err: e.message
          });
        });
      ctx.body = {
        success: true
      };
    }

    async findTask() {
      const { ctx } = this;
      const { task } = ctx.service;
      const data = await task.find();
      ctx.body = {
        success: true,
        data
      };
    }
  };
};
