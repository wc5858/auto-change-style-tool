const getColor = require('../lib/runner/getColor');

module.exports = app => {
  return class ColorController extends app.Controller {
    async createColor() {
      const { ctx } = this;
      const { color } = ctx.service;
      const data = ctx.request.body;
      // 创建任务
      const res = await color.create(
        Object.assign(data, {
          state: '执行中'
        })
      );
      // 异步执行任务，无需等待任务完成
      const id = res._id;
      const start = +new Date();
      getColor(data)
        .then(colorData => {
          color.update(id, {
            state: '执行成功',
            time: +new Date() - start,
            bgColor: colorData.bgColorData,
            fontColor: colorData.fontColorData
          });
        })
        .catch(e => {
          console.log(e)
          color.update(id, {
            state: '执行失败',
            time: +new Date() - start,
            err: e.message
          });
        });
      // 先返回创建任务成功
      ctx.body = {
        success: true
      };
    }

    async findColor() {
      const { ctx } = this;
      const { color } = ctx.service;
      const data = await color.find();
      ctx.body = {
        success: true,
        data
      };
    }

    async deleteColor() {
      const { ctx } = this;
      const { color } = ctx.service;
      const data = ctx.request.body;
      await color.delete(data.id);
      ctx.body = {
        success: true
      };
    }
  };
};