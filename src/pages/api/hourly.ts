import type { NextApiRequest, NextApiResponse } from 'next';
import { calculateRisk } from '../../lib/heatIndex';

const apiKey = process.env.OPENWEATHER_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { lat, lon, city } = req.query;

  // If no API key or empty, return jittered mock data for testing
  if (!apiKey || apiKey === 'your_openweather_key_here' || apiKey === '') {
    return res.status(200).json(getMockHourly(lat as string, lon as string));
  }

  try {
    let url = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&units=metric`;
    if (lat && lon) {
      url += `&lat=${lat}&lon=${lon}`;
    } else {
      url += `&q=${city || 'Mumbai'}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== "200") {
      return res.status(200).json(getMockHourly(lat as string, lon as string));
    }

    // Process entries
    const hourly = data.list.slice(0, 8).map((item: any) => {
        const temp = item.main.temp;
        const humidity = item.main.humidity;
        const risk = calculateRisk(temp, humidity, 'general', 'under_30');
        
        return {
            hour: new Date(item.dt * 1000).toLocaleTimeString([], { hour: 'numeric' }),
            score: risk.score,
            riskLevel: risk.level
        };
    });

    res.status(200).json(hourly);
  } catch (error) {
    res.status(200).json(getMockHourly(lat as string, lon as string));
  }
}

function getMockHourly(lat?: string, lon?: string) {
    const latNum = Number(lat) || 0;
    const lonNum = Number(lon) || 0;
    // Deterministic jitter based on coords to show "plotting variance"
    const jitter = (Math.sin(latNum * 10) + Math.cos(lonNum * 10)) * 4;

    return [
        { hour: "6 AM", score: Math.round(26 + jitter), riskLevel: jitter > 2 ? "moderate" : "low" },
        { hour: "9 AM", score: Math.round(29 + jitter), riskLevel: jitter > 0 ? "moderate" : "low" },
        { hour: "12 PM", score: Math.round(32 + jitter), riskLevel: jitter > 1 ? "high" : "moderate" },
        { hour: "3 PM", score: Math.round(34 + jitter), riskLevel: jitter > 0 ? "high" : "moderate" },
        { hour: "6 PM", score: Math.round(31 + jitter), riskLevel: jitter < -1 ? "low" : "moderate" },
        { hour: "9 PM", score: Math.round(28 + jitter), riskLevel: "low" },
        { hour: "12 AM", score: Math.round(26 + jitter), riskLevel: "low" },
        { hour: "3 AM", score: Math.round(25 + jitter), riskLevel: "low" }
    ];
}
