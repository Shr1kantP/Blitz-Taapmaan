import React from 'react';
import { Share2, ShieldCheck, AlertTriangle, HelpCircle } from '../shared/Icons';
import HeatMap from '../shared/HeatMap';
import WeatherGrid from '../shared/WeatherGrid';
import SunriseSunset from '../shared/SunriseSunset';
import AIChatPanel from '../shared/AIChatPanel';
import { WeatherData, UserProfile, RiskLevel, ExposureDuration } from '../../types/weather';
import { RISK_COLORS } from '../../lib/heatIndex';

interface RiskDashboardProps {
  weather: WeatherData;
  score: number;
  level: RiskLevel;
  persona: UserProfile | null;
  duration: ExposureDuration;
  reasons: string[];
  onViewTimeline: () => void;
  onLocationSelect?: (lat: number, lon: number) => void;
}

const RiskDashboard: React.FC<RiskDashboardProps> = ({
  weather, score, level, persona, duration, reasons, onViewTimeline, onLocationSelect
}) => {
  const handleWhatsAppShare = () => {
    const text = `⚠️ *TAAPMAAN Heat Alert*\nRisk: ${level.toUpperCase()}\nHeat Index: ${score}°C\nLocation: ${weather.city}\nStay safe!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="p-6 pb-32 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto max-h-screen">
      <div className="h-64 w-full">
        <HeatMap 
            centerLat={weather.lat} 
            centerLon={weather.lon} 
            intensity={score} 
            weather={weather}
            onLocationSelect={onLocationSelect}
        />
      </div>

      {/* Main Score Display */}
      <div className="relative p-8 rounded-[3rem] bg-white border border-gray-100 shadow-2xl overflow-hidden">
        <div className={`absolute left-0 top-0 bottom-0 w-3`} style={{ backgroundColor: RISK_COLORS[level] }}></div>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter">
              {score}<span className="text-2xl ml-1">°C</span>
            </h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Heat Index Score (RealFeel)</p>
          </div>
          <div
            className="px-6 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-lg"
            style={{ backgroundColor: RISK_COLORS[level] }}
          >
            {level}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <HelpCircle size={14} /> Risk Analysis
          </h3>
          <ul className="space-y-2">
            {reasons.map((reason, i) => (
              <li key={i} className="flex gap-3 text-xs font-medium text-slate-600 leading-relaxed">
                <div className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: RISK_COLORS[level] }} />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-2 mt-8">
          <span className="px-3 py-1 bg-gray-50 rounded-full text-[10px] font-bold text-gray-400 border border-gray-100 uppercase">{persona?.replace('_', ' ')}</span>
          <span className="px-3 py-1 bg-gray-50 rounded-full text-[10px] font-bold text-gray-400 border border-gray-100 uppercase">{duration.replace('_', '-')} mins</span>
        </div>
      </div>

      {/* Recommended Windows */}
      <div className="bg-emerald-50 p-6 rounded-[2.5rem] border border-emerald-100">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-4 flex items-center gap-2">
          <ShieldCheck size={14} /> Safe Windows Today
        </h3>
        <div className="flex flex-wrap gap-2">
          <div className="px-4 py-2 bg-white rounded-xl text-[11px] font-bold text-emerald-700 shadow-sm">6:00 AM – 9:45 AM</div>
          <div className="px-4 py-2 bg-white rounded-xl text-[11px] font-bold text-emerald-700 shadow-sm">After 7:30 PM</div>
        </div>
      </div>

      <WeatherGrid weather={weather} />
      <SunriseSunset sunrise={weather.sunrise} sunset={weather.sunset} />
      <AIChatPanel score={score} level={level} city={weather.city} persona={persona} duration={duration} />

      <button
        onClick={handleWhatsAppShare}
        className="w-full py-5 rounded-[2rem] bg-emerald-500 text-white font-black flex items-center justify-center gap-3 shadow-xl shadow-emerald-100 hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        <Share2 size={20} />
        Share heat alert
      </button>

      <button
        onClick={onViewTimeline}
        className="w-full py-4 rounded-[2rem] border-2 border-brand-orange text-brand-orange font-black text-sm hover:bg-orange-50 transition-all"
      >
        View hourly curve →
      </button>
    </div>
  );
};

export default RiskDashboard;
