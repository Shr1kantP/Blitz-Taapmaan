import { RiskLevel, UserProfile, ExposureDuration } from "../types/weather";

export function getPersonalizedWAMessage(
  city: string,
  score: number,
  level: RiskLevel,
  persona: UserProfile | null,
  duration: ExposureDuration,
  activity: string | undefined
): string {
  const personaName = (persona || 'general').replace('_', ' ');
  const exposureTime = duration.replace('_', '-');
  const activityLabel = activity || 'outdoor activity';

  let greeting = `⚠️ *TAAPMAAN HEAT ALERT - ${city.toUpperCase()}* ⚠️`;
  let stats = `\n\n*Scale:* ${score}°C (${level.toUpperCase()})\n*Profile:* ${personaName.toUpperCase()}\n*Activity:* ${activityLabel}\n*Exposure:* ${exposureTime} mins`;
  
  let personalizedAdvice = "";

  // Persona based advic
  if (persona === 'elderly') {
    personalizedAdvice = `\n\n👴 *Safety for Seniors:*\n• Extreme heat strains the heart. Seek air conditioning immediately.\n• Drink water even if not thirsty.\n• Avoid any physical exertion during peak hours.`;
  } else if (persona === 'child') {
    personalizedAdvice = `\n\n👶 *Child Safety Notice:*\n• Body temperature rises 3-5x faster in kids.\n• Ensure continuous hydration.\n• Never leave children in parked vehicles.`;
  } else if (persona === 'outdoor_worker') {
    personalizedAdvice = `\n\n👷 *Work Site Protocol:*\n• Mandatory 15-min rest in shade every hour.\n• Replace electrolytes (salts) lost in sweat.\n• Use a "buddy system" to monitor for heat stroke.`;
  } else if (persona === 'sports_athlete') {
      personalizedAdvice = `\n\n🏃 *Athlete Protocol:*\n• Pre-hydrate 2 hours before activity.\n• Monitor urine color (should be pale yellow).\n• Stop immediately if feeling dizzy or cramped.`;
  } else {
    personalizedAdvice = `\n\n✅ *General Precautions:*\n• Stay in the shade.\n• Wear light, breathable clothing.\n• Avoid caffeine and heavy meals.`;
  }

  // Duration based warning
  if (duration === 'over_60') {
    personalizedAdvice += `\n\n🚨 *CRITICAL:* Prolonged exposure (>60 mins) at this risk level is dangerous. Find a cooling center immediately.`;
  }

  const footer = `\n\n🔗 Stay updated: ${typeof window !== 'undefined' ? window.location.origin : 'https://taapmaan.gov'}\n#Taapmaan #HeatSafety`;

  return encodeURIComponent(greeting + stats + personalizedAdvice + footer);
}
