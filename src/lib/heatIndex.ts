import { RiskLevel, UserProfile, ExposureDuration } from "../types/weather";

export function calculateHeatIndex(tempC: number, rh: number): number {
  const T = (tempC * 9/5) + 32;
  let hi = 0.5 * (T + 61.0 + ((T - 68.0) * 1.2) + (rh * 0.094));

  if (hi >= 80) {
    hi = -42.379 +
         2.04901523 * T +
         10.14333127 * rh -
         0.22475541 * T * rh -
         0.00683783 * T * T -
         0.05391553 * rh * rh +
         0.00122874 * T * T * rh +
         0.00085282 * T * rh * rh -
         0.00000199 * T * T * rh * rh;

    if (rh < 13 && T >= 80 && T <= 112) {
      hi -= ((13 - rh) / 4) * Math.sqrt((17 - Math.abs(T - 95.0)) / 17);
    } else if (rh > 85 && T >= 80 && T <= 87) {
      hi += ((rh - 85) / 10) * ((87 - T) / 5);
    }
  }

  return hi;
}

export function calculateRisk(
  tempC: number, 
  humidity: number, 
  persona: UserProfile, 
  duration: ExposureDuration
): { score: number; level: RiskLevel; reasons: string[] } {
  let score = calculateHeatIndex(tempC, humidity);
  const reasons: string[] = [];

  if (score >= 80) reasons.push("Base heat index exceeds safety threshold.");

  // Apply persona multipliers
  if (persona === "elderly") {
    score *= 1.10;
    reasons.push("Physiological sensitivity (65+) increases perceived stress by 10%.");
  } else if (persona === "outdoor_worker") {
    const penalty = duration === "over_60" ? 5 : duration === "30_60" ? 3 : 1;
    score += penalty;
    reasons.push(`Outdoor exertion penalty applied for ${duration.replace('_', '-')} minute exposure.`);
  } else if (persona === "child") {
    score += 5;
    reasons.push("Children's lower surface-area-to-mass ratio reduces cooling efficiency.");
  }

  let level: RiskLevel = "low";
  if (score < 80) level = "low";
  else if (score < 91) level = "moderate";
  else if (score < 104) level = "high";
  else level = "extreme";

  // Convert final score to Celsius for UI
  const scoreC = (score - 32) * 5/9;

  return { score: Math.round(scoreC), level, reasons };
}

export const RISK_COLORS = {
  low: "#22C55E",      // Success Green
  moderate: "#EAB308", // Warning Yellow
  high: "#F97316",     // Alert Orange
  extreme: "#EF4444",  // Critical Red
};
