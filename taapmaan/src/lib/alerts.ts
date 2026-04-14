import { RiskLevel, UserProfile, ExposureDuration } from "../types/weather";

export function getPersonalizedAlertMessage(
  city: string,
  score: number,
  level: RiskLevel,
  persona: UserProfile | null,
  duration: ExposureDuration,
  activity: string | undefined
): string {
  const personaName = (persona || 'general').replace('_', ' ');
  const exposureTime = duration.replace('_', '-');
  const activityLabel = activity || 'activity';

  let greeting = `TAAPMAAN HEAT ALERT - ${city.toUpperCase()}`;
  let stats = `\n\nScale: ${score}C (${level.toUpperCase()})\nProfile: ${personaName.toUpperCase()}\nActivity: ${activityLabel}\nStay: ${exposureTime}m`;
  
  let advice = "";

  if (persona === 'elderly') {
    advice = `\n\nADVICE: Heart strain risk. Get to AC now. Drink water. No exertion.`;
  } else if (persona === 'child') {
    advice = `\n\nADVICE: Kids heat up 5x faster. Keep hydrating. Never leave in car.`;
  } else if (persona === 'outdoor_worker') {
    advice = `\n\nADVICE: 15m shade rest/hour. Replace salts. Use buddy system.`;
  } else {
    advice = `\n\nADVICE: Seek shade. Wear cotton. Hydrate.`;
  }

  if (duration === 'over_60') {
    advice += `\n\nCRITICAL: Over 60m exposure is dangerous. Find cooling center.`;
  }

  const link = `\n\nLive: ${typeof window !== 'undefined' ? window.location.origin : 'taapmaan.gov'}`;

  return encodeURIComponent(greeting + stats + advice + link);
}
