/**
 * types/tapmaan.d.ts
 *
 * Global type declarations for the TaapMaan PWA.
 *
 * - HeatRiskResponse — shared shape returned by /api/heat-risk
 * - navigator.standalone — iOS PWA standalone mode flag (not in lib.dom.d.ts)
 * - ServiceWorkerRegistration.showNotification — extended options (actions)
 */

// ─── Heat Risk ────────────────────────────────────────────────────────────────

export type HeatRiskResponse = {
  /** Overall risk classification. */
  riskLevel: "Low" | "Moderate" | "High" | "Extreme";
  /** Ambient temperature in °C. */
  temperature: number;
  /** Relative humidity as a percentage (0–100). */
  humidity: number;
  /** Feels-like temperature (heat index) in °C. */
  heatIndex: number;
  /** List of time-window strings when outdoor activity is safer, e.g. "06:00–09:00". */
  safeHours: string[];
  /** Ordered list of recommended protective actions. */
  preventiveMeasures: string[];
  /** Human-readable area/city name for the queried coordinate. */
  areaName: string;
};

// ─── Browser globals ──────────────────────────────────────────────────────────

declare global {
  interface Navigator {
    /**
     * True when the page is running as an installed PWA in standalone mode
     * on iOS. Only present on iOS Safari; undefined elsewhere.
     */
    standalone?: boolean;
  }

  /**
   * Extend NotificationOptions to include the `actions` array that is
   * available in the service-worker context (showNotification) but missing
   * from the lib.dom type definitions in some TypeScript versions.
   */
  interface NotificationOptions {
    actions?: Array<{
      action: string;
      title: string;
      icon?: string;
    }>;
    /** Vibrate pattern for the notification. */
    vibrate?: number | number[];
    /** Whether to re-alert (sound/vibrate) when replacing a tagged notification. */
    renotify?: boolean;
    /** Keep notification on-screen until user interacts. */
    requireInteraction?: boolean;
    /** Arbitrary serialisable data attached to the notification. */
    data?: unknown;
  }
}