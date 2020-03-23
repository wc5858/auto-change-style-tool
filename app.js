const webpush = require('web-push');

module.exports = app => {
  // VAPID keys should only be generated only once.
  app.vapidKeys = webpush.generateVAPIDKeys();
};