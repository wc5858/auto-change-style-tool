const webpush = require('web-push');

module.exports = app => {
  return class NotificationController extends app.Controller {
    async key() {
      const { ctx } = this;
      console.log(ctx.app.vapidKeys.publicKey)
      ctx.body = {
        success: true,
        key: ctx.app.vapidKeys.publicKey
      };
    }
    async subscribe() {
      const { ctx } = this;
      ctx.session.subscription = ctx.request.body;
      ctx.body = {
        success: true
      };
    }
    async cancel() {
      const { ctx } = this;
      delete ctx.session.subscription;
      ctx.body = {
        success: true
      };
    }
    async test() {
      const { ctx } = this;
      ctx.service.notification.notice('test notice');
      ctx.body = {
        success: true
      };
    }
  };
};