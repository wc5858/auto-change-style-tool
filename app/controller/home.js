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
            const { color, component, task, catcher, team, user } = ctx.service;
            const [colorData, componentData, taskData, catcherData, teamData, invitation] = await Promise.all([
                color.findByUser(),
                component.findByUser(),
                task.findByUser(),
                catcher.findByUser(),
                team.find(username),
                user.findInvitation(username)
            ]);
            await ctx.render('app.js', {
                url: ctx.url,
                colorData,
                componentData,
                taskData,
                catcherData,
                teamData,
                userInfo: {
                    username,
                    invitation
                }
            });
        }

        async getUserInfo() {
            const { ctx } = this;
            const { username } = ctx.session;
            if (!username) {
                ctx.body = {
                    success: false,
                    error: 'Not logged in'
                };
                return;
            }
            const { user } = ctx.service;
            ctx.body = {
                success: true,
                userInfo: {
                    username,
                    invitation: await user.findInvitation(username)
                }
            };
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

        async logout() {
            const { ctx } = this;
            delete ctx.session.username;
            delete ctx.session.remember;
            ctx.body = {
                success: true
            };
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
                success: false,
                error: 'Wrong user name or password'
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
                    error: 'The user already exists'
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
                    error: 'Registration information error'
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