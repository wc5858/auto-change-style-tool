module.exports = app => {

  const { index, login, handleLogin, register, handleRegister, getUserInfo, logout } = app.controller.home;

  app.get('/', index);
  app.get('/style', index);
  app.get('/color', index);
  app.get('/component', index);
  app.get('/catcher', index);
  app.get('/teams', index);

  // 渲染登录页面，用户输入账号密码
  app.get('/login', login);
  // 登录校验
  app.post('/api/v1/user/login', handleLogin);
  // 注册
  app.get('/register', register);
  app.post('/api/v1/user/register', handleRegister);

  app.post('/api/v1/user/info', getUserInfo);
  app.post('/api/v1/user/logout', logout);

  const { createColor, findColor, deleteColor } = app.controller.colorApi;

  app.post('/api/v1/color/create', createColor);
  app.post('/api/v1/color/find', findColor);
  app.post('/api/v1/color/delete', deleteColor);

  const { createTask, findTask, getNanoCss, imgBase64, deleteTask } = app.controller.taskApi;

  app.post('/api/v1/task/create', createTask);
  app.post('/api/v1/task/find', findTask);
  app.post('/api/v1/task/getNanoCss', getNanoCss);
  app.post('/api/v1/task/delete', deleteTask);
  app.post('/api/v1/task/img/base64', imgBase64);

  const { createComponent, findComponent, deleteComponent, getData } = app.controller.componentApi;

  app.post('/api/v1/component/create', createComponent);
  app.post('/api/v1/component/find', findComponent);
  app.post('/api/v1/component/delete', deleteComponent);
  app.post('/api/v1/component/data', getData);

  const { createCatcher, findCatcher, deleteCatcher } = app.controller.catcherApi;

  app.post('/api/v1/catcher/create', createCatcher);
  app.post('/api/v1/catcher/find', findCatcher);
  app.post('/api/v1/catcher/delete', deleteCatcher);

  const { createTeam, findTeam, invite, decline, join } = app.controller.teamApi;

  app.post('/api/v1/team/create', createTeam);
  app.post('/api/v1/team/find', findTeam);
  app.post('/api/v1/team/invite', invite);
  app.post('/api/v1/team/decline', decline);
  app.post('/api/v1/team/join', join);

  const { key, subscribe, cancel, test } = app.controller.notificationApi;

  app.post('/api/v1/notification/key', key);
  app.post('/api/v1/notification/subscribe', subscribe);
  app.post('/api/v1/notification/cancel', cancel);
  app.post('/api/v1/notification/test', test);
};
