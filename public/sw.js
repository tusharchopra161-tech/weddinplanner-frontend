
self.addEventListener("push", (event) => {
  let data = {
    title: "Wedding Planner",
    body: "You have a new notification.",
    url: "/",
    tag: "wedding-planner-notification",
    type: "general",
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (error) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body || "You have a new notification.",
    icon: "/android-chrome-192x192 (2).png",
    badge: "/favicon-32x32 (2).png",
    tag: data.tag || "wedding-planner-notification",
    renotify: false,
    timestamp: Date.now(),
    data: {
      url: data.url || "/",
      type: data.type || "general",
      bookingId: data.bookingId || null,
      palaceId: data.palaceId || null,
    },
    actions: [
      {
        action: "view",
        title: "View details",
      },
      {
        action: "dismiss",
        title: "Dismiss",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Wedding Planner", options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") {
    return;
  }

  const targetUrl = new URL(
    event.notification.data?.url || "/",
    self.location.origin
  );

  // Only navigate within the Wedding Planner website.
  if (targetUrl.origin !== self.location.origin) {
    return;
  }

  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of windows) {
        if (new URL(client.url).origin === self.location.origin) {
          await client.navigate(targetUrl.href);
          return client.focus();
        }
      }

      return self.clients.openWindow(targetUrl.href);
    })()
  );
});
