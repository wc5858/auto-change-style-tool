const getComponent = require('../lib/runner/getComponent');

module.exports = app => {
  return class ComponentController extends app.Controller {
    async createComponent() {
      const { ctx } = this;
      const { component, fs } = ctx.service;
      const data = ctx.request.body;
      
      // 创建任务
      const res = await component.create(
        Object.assign(data, {
          state: '执行中'
        })
      );
      // 异步执行任务，无需等待任务完成
      const id = res._id;
      const start = +new Date();
      getComponent(data)
        .then(async data => {
          const file = await fs.write(JSON.stringify(data), data.site + new Date());
          await component.update(id, {
            state: '执行成功',
            time: +new Date() - start,
            fileId: file._id
          });
        })
        .catch(e => {
          component.update(id, {
            state: '执行失败',
            time: +new Date() - start,
            err: e.message
          });
        });
      ctx.body = {
        success: true
      };
    }

    async findComponent() {
      const { ctx } = this;
      const { component } = ctx.service;
      const data = await component.find();
      ctx.body = {
        success: true,
        data
      };
    }

    async deleteComponent() {
      const { ctx } = this;
      const { component } = ctx.service;
      const data = ctx.request.body;
      await component.delete(data.id);
      ctx.body = {
        success: true
      };
    }
  };
};
