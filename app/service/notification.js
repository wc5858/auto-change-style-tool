const Service = require('egg').Service;
const webpush = require('web-push');

class NotificationSevice extends Service {
  async notice(text) {
    const { ctx } = this;
    webpush.setGCMAPIKey('AAAAEo2Ey8Q:APA91bESu_HxnzM4U7JuwwklKhDnUQb8Gxz_dZm8VjEsZVdz53Yd6R4oyWrE6vMXO3f7nF--LX5nyEu3JSdEPDXPX134zk7jdO3wMH5a_wI2rS4pu3Re7RuRuPvJ7zRHUWmmmzhT75Bn');
    const { vapidKeys } = ctx.app;
    console.log(ctx.session.subscription, vapidKeys)
    webpush.setVapidDetails(
      'http://127.0.0.1:7001/',
      vapidKeys.publicKey,
      vapidKeys.privateKey
    );
    
    webpush.sendNotification(ctx.session.subscription, text);
  }
}

module.exports = NotificationSevice;
