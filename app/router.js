
module.exports = app => {
  app.get('/', app.controller.home.index);
  app.get('/color', app.controller.home.index);
  app.get('/component', app.controller.home.index);
  app.get('/catcher', app.controller.home.index);

  app.post('/api/v1/color/create', app.controller.colorApi.createColor);
  app.post('/api/v1/color/find', app.controller.colorApi.findColor);
  app.post('/api/v1/color/delete', app.controller.colorApi.deleteColor);

  app.post('/api/v1/task/create', app.controller.taskApi.createTask);
  app.post('/api/v1/task/find', app.controller.taskApi.findTask);
  
  app.post('/api/v1/component/create', app.controller.componentApi.createComponent);
  app.post('/api/v1/component/find', app.controller.componentApi.findComponent);
  app.post('/api/v1/component/delete', app.controller.componentApi.deleteComponent);
};
