/**
 * lib/notifications.ts
 *
 * Typed utility functions for browser push notifications and heat-risk API calls.
 * Uses the native Notification API + Service Worker — no external push services.
 *
 * Re-exports HeatRiskResponse so callers can import it from here.
 */

export type { HeatRiskResponse } from "../types/tapmaan";
import type { HeatRiskResponse } from "../types/tapmaan";

// ─── iOS Safari detection ─────────────────────────────────────────────────────

/**
 * Returns true when the user is on iOS Safari running in a *browser tab*
 * (not in a PWA standalone window). The Notification API is blocked in this
 * context; callers should show an install-to-home-screen banner instead.
 */
export function detectIOSSafari(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  const ua = window.navigator.userAgent;
  const isIOS = /iP(hone|ad|od)/.test(ua);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS/.test(ua);
  const isStandalone = window.navigator.standalone === true;
  return isIOS && isSafari && !isStandalone;
}

// ─── Service worker registration ──────────────────────────────────────────────

export async function getReadySW(): Promise<ServiceWorkerRegistration | null> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }
  try {
    // Ensure the SW is registered first.
    await navigator.serviceWorker.register("/sw.js");
    // .ready waits until a SW is active — this is required for showNotification().
    const registration = await navigator.serviceWorker.ready;
    return registration;
  } catch (err) {
    console.error("[TaapMaan] Service worker error:", err);
    return null;
  }
}

// ─── Permission request ───────────────────────────────────────────────────────

/**
 * Requests browser notification permission and registers the service worker.
 * Must be called from a user-gesture handler on mobile browsers.
 * Returns true if permission was granted.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof Notification === "undefined") return false;

  // iOS Safari in browser mode — callers should show the install banner instead.
  if (detectIOSSafari()) return false;

  if (Notification.permission === "granted") {
    await getReadySW();
    return true;
  }

  if (Notification.permission === "denied") return false;

  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    await getReadySW();
    return true;
  }
  return false;
}

// ─── Send notification ────────────────────────────────────────────────────────

const URGENCY_EMOJI: Record<HeatRiskResponse["riskLevel"], string> = {
  Low:      "ℹ️",
  Moderate: "⚠️",
  High:     "🔴",
  Extreme:  "🚨",
};

/**
 * Displays a heat risk notification via the registered service worker.
 * Falls back to a direct Notification constructor if SW is unavailable.
 */
export async function sendHeatNotification(riskData: HeatRiskResponse): Promise<void> {
  if (typeof Notification === "undefined") return;
  if (Notification.permission !== "granted") return;

  const emoji = URGENCY_EMOJI[riskData.riskLevel];
  const title = `${emoji} ${riskData.riskLevel} Heat Risk — ${riskData.areaName}`;
  const top2Measures = riskData.preventiveMeasures.slice(0, 2).join("; ");
  const body =
    `🌡 ${riskData.temperature}°C  💧 ${riskData.humidity}% humidity  ` +
    `🥵 Heat Index ${riskData.heatIndex}°C\n${top2Measures}`;

  const options: NotificationOptions = {
    body,
    icon:  "/favicon.ico",
    badge: "/favicon.ico",
    tag:   "tapmaan-risk",
    // `actions` are only valid inside a service worker context; passing them
    // here is harmless for the SW path and ignored for the fallback path.
  };

  const registration = await getReadySW();

  if (registration) {
    // SW path — preferred because it works even when the page is in background.
    registration.showNotification(title, options);
  } else {
    // Fallback — direct notification (no action buttons, foreground only).
    new Notification(title, options);
  }
}

// ─── API helper ───────────────────────────────────────────────────────────────

/**
 * Fetches heat risk data for a given coordinate from /api/heat-risk.
 * Returns null on any network or parse error.
 */
export async function getRiskFromAPI(
  lat: number,
  lng: number
): Promise<HeatRiskResponse | null> {
  try {
    const res = await fetch(`/api/heat-risk?lat=${lat}&lng=${lng}`);
    if (!res.ok) return null;
    const data: HeatRiskResponse = await res.json() as HeatRiskResponse;
    return data;
  } catch {
    return null;
  }
}