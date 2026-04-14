import { Share2, ShieldCheck, AlertTriangle, HelpCircle, ArrowRight } from '../shared/Icons';
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
    <div className="min-h-screen bg-slate-50 pb-32 animate-in fade-in duration-700">
      {/* Immersive Map Hero */}
      <div className="h-[45vh] w-full relative">
        <HeatMap 
            centerLat={weather.lat} 
            centerLon={weather.lon} 
            intensity={score} 
            weather={weather}
            onLocationSelect={onLocationSelect}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Floating Main Score Card */}
      <div className="px-6 -mt-32 relative z-10 space-y-6">
          <div className="bg-slate-900 text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/20 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-50 text-brand-orange">Safety Status</p>
                  <div className="flex items-baseline gap-4">
                      <span className="text-8xl font-black italic tracking-tighter">{score}°</span>
                      <div className={`px-5 py-2 rounded-2xl border font-black uppercase text-[10px] tracking-widest ${
                          level === 'extreme' ? 'bg-red-500/20 text-red-100 border-red-500/40' :
                          level === 'high' ? 'bg-orange-500/20 text-orange-100 border-orange-500/40' :
                          'bg-emerald-500/20 text-emerald-100 border-emerald-500/40'
                      }`}>{level}</div>
                  </div>
                  <p className="mt-8 text-lg text-slate-400 font-medium leading-relaxed">{reasons[0]}</p>
              </div>
          </div>

          {/* Quick Context Grid */}
          <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Persona</p>
                  <p className="text-sm font-black text-slate-900 capitalize italic">{persona?.replace('_', ' ')}</p>
              </div>
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Exposure</p>
                  <p className="text-sm font-black text-slate-900 italic">{duration.replace('_', '-')} MINS</p>
              </div>
          </div>

          {/* Safe Window Card */}
          <div className="bg-emerald-500 p-8 rounded-[3rem] text-white shadow-xl shadow-emerald-500/20">
              <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Optimal Window</h3>
              <p className="text-2xl font-black leading-tight italic">06:00 AM – 09:45 AM</p>
          </div>

          <WeatherGrid weather={weather} />

          <div className="space-y-4">
              <button
                onClick={handleWhatsAppShare}
                className="w-full py-6 rounded-[2.5rem] bg-brand-orange text-white font-black flex items-center justify-center gap-3 shadow-xl shadow-brand-orange/20 hover:scale-[1.02] active:scale-[0.98] transition-all italic text-lg"
              >
                <Share2 size={22} />
                Share Status Alert
              </button>

              <button
                onClick={onViewTimeline}
                className="w-full py-5 rounded-[2.5rem] bg-white border border-slate-200 text-slate-900 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                Launch Hourly Curve <ArrowRight size={14} />
              </button>
          </div>
      </div>
    </div>
  );
};

export default RiskDashboard;
