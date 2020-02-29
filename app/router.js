
module.exports = app => {

  const { index, login, handleLogin, register, handleRegister } = app.controller.home;

  app.get('/', index);
  app.get('/style', index);
  app.get('/color', index);
  app.get('/component', index);
  app.get('/catcher', index);
  app.get('/teams', index);

  // 渲染登录页面，用户输入账号密码
  app.get('/login', login);
  // 登录校验
  app.post('/login', handleLogin);
  // 注册
  app.get('/register', register);
  app.post('/register', handleRegister);

  const { createColor, findColor, deleteColor } = app.controller.colorApi;

  app.post('/api/v1/color/create', createColor);
  app.post('/api/v1/color/find', findColor);
  app.post('/api/v1/color/delete', deleteColor);

  const { createTask, findTask, getNanoCss } = app.controller.taskApi;

  app.post('/api/v1/task/create', createTask);
  app.post('/api/v1/task/find', findTask);
  app.post('/api/v1/task/getNanoCss', getNanoCss);

  const { createComponent, findComponent, deleteComponent } = app.controller.componentApi;

  app.post('/api/v1/component/create', createComponent);
  app.post('/api/v1/component/find', findComponent);
  app.post('/api/v1/component/delete', deleteComponent);
  
  const { createTeam } = app.controller.teamApi;

  app.post('/api/v1/team/create', createTeam);
};
