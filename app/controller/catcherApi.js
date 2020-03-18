const CatcherExecutor = require('../lib/runner/getCatcher');

module.exports = app => {
  return class CatcherController extends app.Controller {
    async createCatcher() {
      const { ctx } = this;
      const { catcher,  task } = ctx.service;
      const data = ctx.request.body;

      // 创建任务
      const res = await catcher.create(
        Object.assign(data, {
          state: '执行中',
          creator: ctx.session.username
        })
      );
      // 异步执行任务，无需等待任务完成
      const id = res._id;
      const runner = async () => {
        const taskData = await task.findOne(data.taskDataId);
        catcher.update(id, {
          taskDataName: taskData.site
        })
        const catcherExecutor = new CatcherExecutor(
          {
            url: taskData.url,
            html: taskData.result.bodyHTML
          }
        )
        await catcherExecutor.init();
        await catcherExecutor.test();
        return await catcherExecutor.finish();
      };
      runner().then(result => {
        if (result.success) {
          catcher.update(id, {
            state: '捕捉完成',
            result: result.data
          })
        } else {
          task.update(id, {
            state: '捕捉失败'
          });
        }
      })
      ctx.body = {
        success: true
      };
    }

    async findCatcher() {
      const { ctx } = this;
      const { catcher } = ctx.service;
      const data = await catcher.findByUser();
      ctx.body = {
        success: true,
        data
      };
    }

    async deleteCatcher() {
      const { ctx } = this;
      const { catcher } = ctx.service;
      const data = ctx.request.body;
      await catcher.delete(data.id);
      ctx.body = { 
        success: true
      };
    }
  };
};