import React from 'react';
import { Wind, Droplets, Sun, Gauge } from './Icons';
import { WeatherData } from '../../types/weather';

interface WeatherGridProps {
  weather: WeatherData;
}

const WeatherGrid: React.FC<WeatherGridProps> = ({ weather }) => {
  // Defensive check to prevent crash if weather or nested properties are missing
  const windSpeed = weather?.wind?.speed ?? 0;
  const windDir = weather?.wind?.direction ?? 'N';
  const humidity = weather?.humidity ?? 0;
  const uvIndex = weather?.uvIndex ?? 0;
  const pressure = weather?.pressure ?? 1013;

  const stats = [
    { label: 'Wind', value: `${windSpeed} km/h`, icon: <Wind className="text-blue-400" />, sub: windDir },
    { label: 'Humidity', value: `${humidity}%`, icon: <Droplets className="text-cyan-400" />, sub: 'Relative' },
    { label: 'UV Index', value: uvIndex, icon: <Sun className="text-yellow-400" />, sub: uvIndex > 5 ? 'High' : 'Moderate' },
    { label: 'Pressure', value: `${pressure} hPa`, icon: <Gauge className="text-emerald-400" />, sub: 'Stable' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-slate-900 p-5 rounded-none border border-slate-800 flex flex-col gap-3 shadow-lg">
          <div className="bg-slate-800 w-10 h-10 rounded-none flex items-center justify-center">
            {stat.icon}
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-white text-xl font-bold">{stat.value}</p>
            <p className="text-slate-500 text-[10px] mt-1">{stat.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeatherGrid;
