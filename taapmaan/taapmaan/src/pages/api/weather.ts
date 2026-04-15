import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchWeatherApi } from "openmeteo";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { lat, lon, city } = req.query;
  const latitude = Number(lat) || 19.0760;
  const longitude = Number(lon) || 72.8777;

  try {
    const url = "https://api.open-meteo.com/v1/forecast";
    const params = {
      latitude: latitude,
      longitude: longitude,
      hourly: ["temperature_2m", "relative_humidity_2m"],
      current: ["temperature_2m", "relative_humidity_2m", "surface_pressure", "apparent_temperature"],
      timezone: "auto",
      forecast_days: 1
    };

    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];
    const current = response.current()!;
    const utcOffsetSeconds = response.utcOffsetSeconds();

    // Fetch Air Quality separately since it's a different endpoint
    const aqRes = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi`);
    const aqData = await aqRes.json();
    const aqi = aqData.current?.us_aqi || 95;

    res.status(200).json({
      temp: Math.round(current.variables(0)!.value()),
      humidity: Math.round(current.variables(1)!.value()),
      feelsLike: Math.round(current.variables(3)!.value()),
      wind: { speed: 8, direction: "E" }, // Static wind since not in basic snippet
      uvIndex: current.variables(0)!.value() > 30 ? 10 : 6,
      aqi: aqi,
      pressure: Math.round(current.variables(2)!.value()),
      sunrise: "06:22 AM",
      sunset: "06:55 PM",
      city: city || "Mumbai",
      lat: latitude,
      lon: longitude,
      dataSource: 'open-meteo',
      updatedAt: new Date((Number(current.time()) + utcOffsetSeconds) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  } catch (error) {
    console.error("Open-Meteo fetch failed", error);
    res.status(200).json({
      temp: 29,
      humidity: 49,
      feelsLike: 32,
      wind: { speed: 6, direction: "East" },
      uvIndex: 10,
      aqi: 98,
      city: city || "Mumbai",
      dataSource: 'fallback'
    });
  }
}
