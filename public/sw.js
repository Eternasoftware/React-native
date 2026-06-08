self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
});

self.addEventListener("push", async function (event) {
  const data = await event.data.json();
  const options = {
    body: data.body,
    icon: "../assets/images/adaptive-icon.png",
    badge: "../assets/images/adaptive-icon.png",
    vibrate: [200, 100, 200],
  };
  event.waitUntil(
    self.registration
      .showNotification(data.title, options)
      .then(() => console.log("Notification displayed"))
      .catch((err) => console.error("Error displaying notification:", err))
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  clients.openWindow("/");
});
