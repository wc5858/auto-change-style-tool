self.addEventListener('push', function (event) {
    const title = event.data.text();

    event.waitUntil(self.registration.showNotification(title, {
        body: 'see more'
    }));
});