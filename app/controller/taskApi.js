const TaskExecutor = require('../lib/runner/TaskExecutor');

module.exports = app => {
  return class TaskController extends app.Controller {
    async createTask() {
      const { ctx } = this;
      const { color, task, component, fs } = ctx.service;
      const { colorDataId, url, site, componentDataId } = ctx.request.body;
      const res = await task.create({
        url,
        site,
        state: '执行中'
      });
      const id = res._id;
      const runner = async () => {
        const colorData = await color.findOne(colorDataId);
        const componentRecord = await component.findOne(componentDataId);
        const componentData = JSON.parse(await fs.read(componentRecord.filename));
        const taskExecutor = new TaskExecutor({ url, colorData, site, componentData }, taskList => {
          task.update(id, {
            taskList
          });
        });
        await taskExecutor.init();
        await taskExecutor.replaceComponent();
        await taskExecutor.changeColor();
        await taskExecutor.optimization();
        return taskExecutor.finish();
      };
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
