import { HourlyData, WeatherData } from "../types/weather";

export const HOURLY_MOCK: HourlyData[] = [
  { hour: "6 AM", temp: 24, humidity: 80, score: 75, riskLevel: "low" },
  { hour: "7 AM", temp: 25, humidity: 78, score: 77, riskLevel: "low" },
  { hour: "8 AM", temp: 26, humidity: 75, score: 80, riskLevel: "moderate" },
  { hour: "9 AM", temp: 28, humidity: 70, score: 82, riskLevel: "moderate" },
  { hour: "10 AM", temp: 30, humidity: 65, score: 90, riskLevel: "high" },
  { hour: "11 AM", temp: 32, humidity: 60, score: 94, riskLevel: "high" },
  { hour: "12 PM", temp: 34, humidity: 55, score: 98, riskLevel: "high" },
  { hour: "1 PM", temp: 36, humidity: 50, score: 104, riskLevel: "extreme" },
  { hour: "2 PM", temp: 37, humidity: 48, score: 106, riskLevel: "extreme" },
  { hour: "3 PM", temp: 37, humidity: 48, score: 107, riskLevel: "extreme" },
  { hour: "4 PM", temp: 35, humidity: 50, score: 98, riskLevel: "high" },
  { hour: "5 PM", temp: 33, humidity: 55, score: 94, riskLevel: "high" },
  { hour: "6 PM", temp: 31, humidity: 60, score: 92, riskLevel: "high" },
  { hour: "7 PM", temp: 29, humidity: 65, score: 85, riskLevel: "moderate" },
  { hour: "8 PM", temp: 28, humidity: 70, score: 82, riskLevel: "moderate" },
  { hour: "9 PM", temp: 27, humidity: 75, score: 80, riskLevel: "moderate" },
  { hour: "10 PM", temp: 26, humidity: 78, score: 78, riskLevel: "low" },
  { hour: "11 PM", temp: 25, humidity: 80, score: 76, riskLevel: "low" },
  { hour: "12 AM", temp: 24, humidity: 82, score: 75, riskLevel: "low" },
  { hour: "1 AM", temp: 23, humidity: 85, score: 74, riskLevel: "low" },
  { hour: "2 AM", temp: 23, humidity: 85, score: 74, riskLevel: "low" },
  { hour: "3 AM", temp: 22, humidity: 88, score: 73, riskLevel: "low" },
  { hour: "4 AM", temp: 22, humidity: 88, score: 73, riskLevel: "low" },
  { hour: "5 AM", temp: 23, humidity: 85, score: 74, riskLevel: "low" },
];

export const DEFAULT_WEATHER: WeatherData = {
  temp: 29,
  feelsLike: 32,
  humidity: 49,
  wind: { speed: 6, direction: "East" },
  uvIndex: 10,
  pressure: 1011,
  sunrise: "06:22 AM",
  sunset: "06:55 PM",
  city: "Mumbai",
  dataSource: "api",
  updatedAt: "10:27 AM"
};
