export type RiskLevel = "low" | "moderate" | "high" | "extreme";
export type UserProfile = "outdoor_worker" | "elderly" | "child" | "general";
export type ActivityType = "sitting" | "walking" | "heavy_labour";
export type ExposureDuration = "under_30" | "30_60" | "over_60";

export interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  wind: { speed: number; direction: string };
  uvIndex: number;
  pressure: number;
  sunrise: string;
  sunset: string;
  city: string;
  lat?: number;
  lon?: number;
  dataSource: string;
  updatedAt?: string;
}

export interface HourlyData {
  hour: string;
  temp: number;
  humidity: number;
  riskLevel: RiskLevel;
  score: number;
}

export interface AppState {
  persona: UserProfile | null;
  city: string;
  temp: number;
  humidity: number;
  exposureDuration: ExposureDuration;
  activityType: ActivityType;
  currentScreen: 1 | 2 | 3 | 4;
}
