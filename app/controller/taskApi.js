const TaskExecutor = require('../lib/runner/TaskExecutor');

module.exports = app => {
  return class TaskController extends app.Controller {
    async createTask() {
      const { ctx } = this;
      const { color, task, component, fs } = ctx.service;
      const {
        colorDataId,
        url,
        site,
        componentDataId,
        ...settings
      } = ctx.request.body;
      const res = await task.create({
        url,
        site,
        settings,
        state: '执行中'
      });
      const id = res._id;
      const runner = async () => {
        const colorData = await color.findOne(colorDataId);
        // 允许组件多个输入源
        const componentRecords = await Promise.all(
          componentDataId.map(id => component.findOne(id))
        );
        task.update(id, {
          colorDataName: colorData.site,
          componentDataNames: componentRecords.map(i => i.site)
        });
        const componentDatas = (
          await Promise.all(
            componentRecords.map(componentRecord =>
              fs.read(componentRecord.filename)
            )
          )
        ).map(JSON.parse);
        // 快速展平二维数组的一个小技巧
        const flattenComponentData = Array.prototype.concat.apply(
          [],
          componentDatas
        );
        const taskExecutor = new TaskExecutor(
          {
            url,
            colorData,
            site,
            componentData: flattenComponentData,
            ...settings
          },
          {
            headless: true,
            beforeEachTask: taskList => {
              task.update(id, {
                taskList
              });
            },
            onEachTaskEnd: taskList => {
              task.update(id, {
                taskList
              });
            }
          }
        );
        await taskExecutor.init();
        await taskExecutor.replaceComponent();
        await taskExecutor.changeColor();
        await taskExecutor.optimization();
        return await taskExecutor.finish();
      };
      runner()
        .then(result => {
          if (result.success) {
            task.update(id, {
              state: '执行结束',
              result: result.data
            });
          } else {
            task.update(id, {
              state: '子任务执行失败'
            });
          }
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
