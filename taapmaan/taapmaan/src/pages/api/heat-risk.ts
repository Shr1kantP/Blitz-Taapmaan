/**
 * pages/api/heat-risk.ts
 *
 * Heat risk API route — Pages Router style.
 * Accepts GET ?lat=<number>&lng=<number>
 * Returns a mock HeatRiskResponse so the full notification flow can be
 * tested end-to-end before the real backend is connected.
 */

import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import type { HeatRiskResponse } from "../../../types/tapmaan";

// ─── Mock data helpers ────────────────────────────────────────────────────────

type RiskLevel = HeatRiskResponse["riskLevel"];

function classifyRisk(heatIndex: number): RiskLevel {
  if (heatIndex >= 54) return "Extreme";
  if (heatIndex >= 41) return "High";
  if (heatIndex >= 32) return "Moderate";
  return "Low";
}

/**
 * Simple deterministic heat-index approximation (Rothfusz equation).
 * Good enough for mock / development use.
 */
function calcHeatIndex(tempC: number, humidity: number): number {
  const T = tempC * 9 / 5 + 32; // °F
  const HI =
    -42.379 +
    2.04901523 * T +
    10.14333127 * humidity -
    0.22475541 * T * humidity -
    0.00683783 * T * T -
    0.05481717 * humidity * humidity +
    0.00122874 * T * T * humidity +
    0.00085282 * T * humidity * humidity -
    0.00000199 * T * T * humidity * humidity;
  return Math.round((HI - 32) * 5 / 9); // back to °C
}

/** Returns a plausible area name from coordinates (mock only). */
function mockAreaName(lat: number, lng: number): string {
  // Very rough lookup — replace with real reverse-geocoding later.
  if (lat > 19.0 && lat < 19.2 && lng > 72.8 && lng < 73.0) return "Mumbai";
  if (lat > 28.5 && lat < 28.7 && lng > 77.1 && lng < 77.3) return "New Delhi";
  if (lat > 12.9 && lat < 13.1 && lng > 77.5 && lng < 77.7) return "Bengaluru";
  if (lat > 13.0 && lat < 13.2 && lng > 80.2 && lng < 80.4) return "Chennai";
  if (lat > 17.3 && lat < 17.5 && lng > 78.4 && lng < 78.6) return "Hyderabad";
  return `Area (${lat.toFixed(2)}, ${lng.toFixed(2)})`;
}

const PREVENTIVE_MEASURES: Record<RiskLevel, string[]> = {
  Low: [
    "Stay hydrated — drink water regularly",
    "Wear light-coloured clothing",
    "Use sunscreen SPF 30+",
    "Take breaks in the shade",
  ],
  Moderate: [
    "Avoid outdoor activity between 11 AM – 4 PM",
    "Drink at least 2 litres of water",
    "Wear a hat and UV-protective clothing",
    "Check on elderly neighbours",
  ],
  High: [
    "Stay indoors with air conditioning or a fan",
    "Drink water every 20 minutes even if not thirsty",
    "Avoid strenuous outdoor work",
    "Soak a cloth in cold water and apply to neck/wrists",
    "Seek a cooling centre if no AC at home",
  ],
  Extreme: [
    "Do NOT go outdoors unless absolutely essential",
    "Call a doctor if feeling dizzy, confused, or nauseous",
    "Drink cold water and apply ice packs",
    "Check on vulnerable family members every hour",
    "Contact emergency services if someone collapses",
  ],
};

const SAFE_HOURS: Record<RiskLevel, string[]> = {
  Low:      ["06:00–09:00", "17:00–19:00"],
  Moderate: ["06:00–08:00", "18:00–19:00"],
  High:     ["06:00–07:30"],
  Extreme:  [],
};

// ─── Mock weather generator ───────────────────────────────────────────────────

function generateMockWeather(lat: number, _lng: number) {
  // Simulate hotter conditions closer to the equator.
  const baseTemp = Math.round(28 + (20 - Math.abs(lat)) * 0.4);
  const temperature = Math.min(Math.max(baseTemp, 22), 48);
  // Add artificial variation so different map clicks return different levels.
  const humidity = Math.round(45 + Math.random() * 40);
  const heatIndex = calcHeatIndex(temperature, humidity);
  return { temperature, humidity, heatIndex };
}

// ─── Route handler ────────────────────────────────────────────────────────────

const handler: NextApiHandler<HeatRiskResponse | { error: string }> = (
  req: NextApiRequest,
  res: NextApiResponse<HeatRiskResponse | { error: string }>
) => {
  // Allow GET (query params) only — Pages Router convention.
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const rawLat = req.query["lat"];
  const rawLng = req.query["lng"];

  const latStr = Array.isArray(rawLat) ? rawLat[0] : rawLat;
  const lngStr = Array.isArray(rawLng) ? rawLng[0] : rawLng;

  if (!latStr || !lngStr) {
    return res.status(400).json({ error: "Missing required query params: lat, lng" });
  }

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ error: "lat and lng must be valid numbers" });
  }

  const { temperature, humidity, heatIndex } = generateMockWeather(lat, lng);
  const riskLevel = classifyRisk(heatIndex);
  const areaName = mockAreaName(lat, lng);

  const response: HeatRiskResponse = {
    riskLevel,
    temperature,
    humidity,
    heatIndex,
    areaName,
    safeHours: SAFE_HOURS[riskLevel],
    preventiveMeasures: PREVENTIVE_MEASURES[riskLevel],
  };

  return res.status(200).json(response);
};

export default handler;
