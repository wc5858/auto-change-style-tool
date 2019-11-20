const changeColor = require('../lib/runner/changeColor');

module.exports = app => {
  return class TaskController extends app.Controller {
    async createTask() {
      const { ctx } = this;
      const { color } = ctx.service;
      const { colorDataId, url } = ctx.request.body;
      const colorData = await color.findOne(colorDataId);
      changeColor({ url, colorData })
      // const res = await color.create(
      //   Object.assign(data, {
      //     state: '执行中'
      //   })
      // );
      // 异步执行任务，无需等待任务完成
      // const id = res._id;
      // const start = +new Date();
      // getColor(data)
      //   .then(colorData => {
      //     color.update(id, {
      //       state: '执行成功',
      //       time: +new Date() - start,
      //       bgColor: colorData.bgColorData,
      //       fontColor: colorData.fontColorData
      //     });
      //   })
      //   .catch(e => {
      //     console.log(e)
      //     color.update(id, {
      //       state: '执行失败',
      //       time: +new Date() - start,
      //       err: e.message
      //     });
      //   });
      // 先返回创建任务成功
      ctx.body = {
        success: true
      };
    }
  };
};