const TaskExecutor = require('../lib/runner/TaskExecutor');
const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);

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
        share,
        teamId,
        bgMappingType,
        settings
      } = ctx.request.body;
      const res = await task.create({
        url,
        site,
        subTasks: settings.filter(i => i),
        state: '执行中',
        creator: ctx.session.username,
        team: share ? teamId : null
      });
      const id = res._id;
      const runner = async () => {
        const colorData = await color.findOne(colorDataId);
        // 允许组件多个输入源
        const componentRecords = await Promise.all(
          componentDataId.map(id => component.findOne(id))
        );
        task.update(id, {
          colorDataName: {
            colorDataId: id,
            name: colorData.site
          },
          componentDataNames: componentRecords.map(i => ({
            componentDataId: i._id,
            name: i.site
          }))
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
        return await Promise.all(settings.filter(i => i).map(async (setting, idx) => {
          const updateTaskList = taskList => {
            task.update(id, { $set: { [`subTasks.${idx}.taskList`]: taskList } });
          };
          const taskExecutor = new TaskExecutor(
            {
              url,
              colorData,
              site,
              componentData: flattenComponentData,
              bgMappingType,
              ...setting
            },
            {
              headless: true,
              beforeEachTask: updateTaskList,
              onEachTaskEnd: updateTaskList
            }
          );
          await taskExecutor.init();
          await taskExecutor.replaceComponent();
          await taskExecutor.changeColor();
          await taskExecutor.optimization();
          await taskExecutor.evaluate();
          const result = await taskExecutor.finish();
          if (result.success) {
            const file = await fs.write(JSON.stringify(result.data), `${site}-${idx}-${+new Date()}`);
            task.update(id, {
              $set: { 
                [`subTasks.${idx}.success`]: true,
                [`subTasks.${idx}.dataFile`]: file
              }
            });
          } else {
            task.update(id, {
              $set: { 
                [`subTasks.${idx}.success`]: false
              }
            });
          }
          return result.success;
        }))
      };
      runner()
        .then(results => {
          if (results.every(i => i)) {
            task.update(id, {
              state: '执行结束'
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
      const { task, fs } = ctx.service;
      const data = await task.findByUser();
      await Promise.all(data.map(async i => {
        return await Promise.all(i.subTasks.map(async j => {
          if (j.dataFile) {
            j.data = JSON.parse(await fs.read(j.dataFile.filename));
          }
          return;
        }));
      }));
      ctx.body = {
        success: true,
        data
      };
    }
    
    async deleteTask() {
      const { ctx } = this;
      const { task } = ctx.service;
      const data = ctx.request.body;
      await task.delete(data.id);
      ctx.body = {
        success: true
      };
    }

    async getNanoCss() {
      const { ctx } = this;
      const data = ctx.request.body;
      ctx.body = {
        success: true,
        data: await ctx.service.task.getNanoCss(data.rawCss)
      };
    }
    async imgBase64() {
      const { ctx } = this;
      const data = ctx.request.body;
      const img = await readFile(data.img);
      const imageBase64 = img.toString('base64');
      ctx.body = {
        success: true,
        data: imageBase64
      };
    }
  };
};
