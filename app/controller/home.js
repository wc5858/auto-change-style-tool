const bcrypt = require('bcrypt');
const Model = require('../mocks/article/list');

module.exports = app => {
  return class AppController extends app.Controller {
    async index() {
      const { ctx } = this;
      const { username } = ctx.session;
      if (!username) {
        ctx.redirect('/login');
        return;
      }
      const { color, component, task, team } = ctx.service;
      const [colorData, componentData, taskData, teamData] = await Promise.all([
        color.find(),
        component.find(),
        task.find(),
        team.find(username)
      ]);
      await ctx.render('app.js', {
        url: ctx.url,
        colorData,
        componentData,
        taskData,
        teamData,
        userInfo: {
          username
        }
      });
    }

    async login() {
      const { ctx } = this;
      if (ctx.session.remember) {
        ctx.redirect('/');
        return;
      }
      await ctx.render('login.js', {
        url: ctx.url
      });
    }

    async handleLogin() {
      const { ctx } = this;
      const { username, password, remember } = ctx.request.body;
      const userRecord = await ctx.service.user.findOne(username);
      if (userRecord) {
        const match = await bcrypt.compare(password, userRecord.password);
        if (match) {
          ctx.session.username = username;
          ctx.session.remember = remember;
          ctx.body = {
            success: true
          };
          return;
        }
      }
      ctx.body = {
        success: false
      };
    }

    async register() {
      const { ctx } = this;
      await ctx.render('register.js', {
        url: ctx.url
      });
    }

    async handleRegister() {
      const { ctx } = this;
      const { username, password, repeatPassword } = ctx.request.body.data;
      const userRecord = await ctx.service.user.findOne(username);
      if (userRecord) {
        ctx.body = {
          success: false,
          error: '该用户已存在'
        };
        return;
      }
      if (
        username && password && password === repeatPassword
      ) {
        ctx.service.user.create({
          username,
          password: await bcrypt.hash(password, 10)
        });
        ctx.body = {
          success: true
        };
      } else {
        ctx.body = {
          success: false,
          error: '注册信息错误'
        };
      }
    }

    async pager() {
      const { ctx } = this;
      const pageIndex = ctx.query.pageIndex;
      const pageSize = ctx.query.pageSize;
      ctx.body = Model.getPage(pageIndex, pageSize);
    }
  };
};