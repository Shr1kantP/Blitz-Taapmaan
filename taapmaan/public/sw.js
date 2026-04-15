// TaapMaan Service Worker — public/sw.js
// Plain JS: service workers cannot be TypeScript.

const APP_ORIGIN = self.location.origin;

// ─── Lifecycle ────────────────────────────────────────────────────────────────

self.addEventListener("install", (event) => {
  console.log("[SW] Installed");
  // Skip waiting so the new SW activates immediately.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activated");
  // Claim all open clients so the new SW controls them without reload.
  event.waitUntil(self.clients.claim());
});

// ─── Push ─────────────────────────────────────────────────────────────────────

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "⚠️ Heat Alert", body: event.data.text() };
  }

  const title = payload.title ?? "⚠️ TaapMaan Heat Alert";
  const options = {
    body: payload.body ?? "Heat risk detected in your area.",
    icon: payload.icon ?? "/favicon.ico",
    badge: payload.badge ?? "/favicon.ico",
    tag: "tapmaan-risk",          // Replace instead of stacking.
    renotify: true,               // Vibrate/sound even when replacing.
    requireInteraction: false,
    actions: [
      { action: "view", title: "View Details" },
      { action: "dismiss", title: "Dismiss" },
    ],
    data: {
      url: payload.url ?? "/",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// ─── Notification click ───────────────────────────────────────────────────────

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // "Dismiss" action — just close, do nothing more.
  if (event.action === "dismiss") return;

  // "View Details" action (or body click) — focus or open the app tab.
  const targetUrl = (event.notification.data && event.notification.data.url)
    ? event.notification.data.url
    : "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Try to find an already-open tab pointing at our origin.
        for (const client of clientList) {
          const clientUrl = new URL(client.url);
          if (clientUrl.origin === APP_ORIGIN && "focus" in client) {
            return client.focus();
          }
        }
        // No open tab — open a new one.
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});