import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  disableDevLogs: true,
});

serwist.addEventListeners();

// Add push notification event listeners
self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options: NotificationOptions & { vibrate: number[] } = {
      body: data.content,
      icon: data.icon || "/icon-192x192.png",
      badge: "/icon-192x192.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.id,
        url: data.openUrl,
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll().then(function (clientList) {
      for (const client of clientList) {
        if (client.url === "/" && "focus" in client) {
          return (client as WindowClient).focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(event.notification.data.url);
      }
    })
  );
});

// self.addEventListener("pushsubscriptionchange", function (event) {
//   event.waitUntil(
//     fetch("https://pushpad.xyz/pushsubscriptionchange", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         old_endpoint: event.oldSubscription ? event.oldSubscription.endpoint : null,
//         new_endpoint: event.newSubscription ? event.newSubscription.endpoint : null,
//         new_p256dh: event.newSubscription ? event.newSubscription.toJSON().keys.p256dh : null,
//         new_auth: event.newSubscription ? event.newSubscription.toJSON().keys.auth : null,
//       }),
//     })
//   );
// });

// self.addEventListener("pushsubscriptionchange", function (event) {
//   console.log("pushsubscriptionchange", event);
// });