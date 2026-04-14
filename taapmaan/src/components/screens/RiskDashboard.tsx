import { Share2, ShieldCheck, AlertTriangle, HelpCircle, ArrowRight, Droplet, Thermometer, Sun, MessageSquare, Clock, Users, MapPin } from '../shared/Icons';
import HeatMap from '../shared/HeatMap';
import WeatherGrid from '../shared/WeatherGrid';
import SunriseSunset from '../shared/SunriseSunset';
import AIChatPanel from '../shared/AIChatPanel';
import { WeatherData, UserProfile, RiskLevel, ExposureDuration } from '../../types/weather';
import { RISK_COLORS } from '../../lib/heatIndex';

import { getPersonalizedAlertMessage } from '../../lib/alerts';

interface RiskDashboardProps {
  weather: WeatherData;
  score: number;
  level: RiskLevel;
  persona: UserProfile | null;
  duration: ExposureDuration;
  activity?: string;
  phoneNumber?: string;
  reasons: string[];
  onViewTimeline: () => void;
  onLocationSelect?: (lat: number, lon: number) => void;
}

const getMeasures = (level: RiskLevel, persona: UserProfile | null, duration: ExposureDuration) => {
  const measures = [
    { title: "Hydration", desc: "Drink 250ml / 20m", icon: <Droplet size={18} /> },
  ];

  // Persona Specifics
  if (persona === 'elderly') {
    measures.push({ title: "Heart Check", desc: "Monitor for palpitations", icon: <AlertTriangle size={18} /> });
    measures.push({ title: "Cooling", desc: "Must be in AC environment", icon: <ShieldCheck size={18} /> });
  } else if (persona === 'child') {
    measures.push({ title: "No Cars", desc: "Never stay in parked cars", icon: <AlertTriangle size={18} /> });
    measures.push({ title: "Activity", desc: "Quiet indoor play only", icon: <HelpCircle size={18} /> });
  } else if (persona === 'outdoor_worker') {
    measures.push({ title: "Rest Cycle", desc: "15m shade every hour", icon: <Clock size={18} /> });
    measures.push({ title: "Buddy System", desc: "Watch for confusion", icon: <Users size={18} /> });
    measures.push({ title: "Salts", desc: "Replace lost electrolytes", icon: <Droplet size={18} /> });
  } else {
    measures.push({ title: "Clothing", desc: "Loose Light Cotton", icon: <ShieldCheck size={18} /> });
  }

  // Exposure & Risk Escalation
  if (level === 'extreme' || (level === 'high' && duration === 'over_60')) {
    measures.unshift({ title: "CRITICAL STOP", desc: "Cease all exposure now", icon: <Sun size={18} className="text-red-500" /> });
  } else if (level === 'high' || (level === 'moderate' && persona === 'elderly')) {
      measures.unshift({ title: "Search Refuge", desc: "Find a cooling center", icon: <MapPin size={18} /> });
  }

  return measures;
};

const RiskDashboard: React.FC<RiskDashboardProps> = ({
  weather, score, level, persona, duration, activity, phoneNumber, reasons, onViewTimeline, onLocationSelect
}) => {
  const measures = getMeasures(level, persona, duration);
  
  const handleSMSShare = () => {
    const text = getPersonalizedAlertMessage(weather.city, score, level, persona, duration, activity);
    const cleanNumber = phoneNumber?.replace(/\D/g, '') || '';
    // Most universal format for SMS URI
    window.location.href = `sms:${cleanNumber}?body=${text}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32 animate-in fade-in duration-700">
      {/* Immersive Map Hero */}
      <div className="h-[40vh] w-full relative">
        <HeatMap 
            centerLat={weather.lat} 
            centerLon={weather.lon} 
            intensity={score} 
            weather={weather}
            onLocationSelect={onLocationSelect}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="px-6 -mt-24 relative z-10 space-y-6">
          {/* Main Score Card */}
          <div className="bg-slate-900 text-white p-10 rounded-none shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/20 blur-[80px] rounded-none -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange">Atmospheric Risk</p>
                      <div className={`px-4 py-1.5 rounded-none border font-black uppercase text-[8px] tracking-[0.2em] ${
                          level === 'extreme' ? 'bg-red-500/20 text-red-100 border-red-500/40' :
                          'bg-emerald-500/20 text-emerald-100 border-emerald-500/40'
                      }`}>{level}</div>
                  </div>
                  <div className="flex items-baseline gap-2">
                      <span className="text-8xl font-black italic tracking-tighter leading-none">{score}°</span>
                      <span className="text-xl font-black tracking-tighter text-slate-500 uppercase italic">RealFeel</span>
                  </div>
                  <p className="mt-8 text-lg text-slate-400 font-medium leading-relaxed">{reasons[0]}</p>
              </div>
          </div>

          {/* New: Safety Protocols (Desktop Feature) */}
          <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-4">Safety Protocols</h3>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1">
                  {measures.map((m, i) => (
                      <div key={i} className="min-w-[140px] bg-white p-6 rounded-none border border-slate-100 shadow-sm transition-all active:scale-95">
                          <div className="text-brand-orange mb-3">{m.icon}</div>
                          <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight mb-1">{m.title}</p>
                          <p className="text-[9px] font-bold text-slate-400 leading-tight">{m.desc}</p>
                      </div>
                  ))}
              </div>
          </div>

          {/* Context Hybrid */}
          <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-8 rounded-none border border-slate-100 shadow-sm">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Persona Profile</p>
                  <p className="text-sm font-black text-slate-900 capitalize italic">{persona?.replace('_', ' ')}</p>
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-none bg-emerald-500" />
                      <span className="text-[8px] font-black text-slate-300 uppercase">Live Probe</span>
                  </div>
              </div>
              <div className="bg-white p-8 rounded-none border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Optimal Window</p>
                    <p className="text-sm font-black text-brand-orange italic uppercase">06:00 - 09:45</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-50">
                      <span className="text-[8px] font-black text-slate-300 uppercase">Morning Cycle</span>
                  </div>
              </div>
          </div>

          <WeatherGrid weather={weather} />

          {/* New: Green Safe Havens (Desktop Feature) */}
          <div className="bg-emerald-950 p-8 rounded-none text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-none" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-6">Green Safe Zones</h3>
              <div className="space-y-3">
                  {[
                      { name: "National Park", status: "85% Cool" },
                      { name: "Aarey Colony", status: "80% Cool" }
                  ].map((zone, i) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-none border border-white/10 transition-all active:bg-white/10">
                          <span className="text-xs font-black italic tracking-tighter">{zone.name}</span>
                          <span className="text-[10px] font-black uppercase text-emerald-400">{zone.status}</span>
                      </div>
                  ))}
              </div>
          </div>

          <div className="space-y-4 pt-4">
              <button
                onClick={handleSMSShare}
                className="w-full py-6 rounded-none bg-slate-900 text-white font-black flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all italic text-lg"
              >
                <div className="w-6 h-6 flex items-center justify-center bg-white/10 rounded-lg">
                    <MessageSquare size={16} />
                </div>
                Push SMS Alert
              </button>

              <button
                onClick={onViewTimeline}
                className="w-full py-5 rounded-none bg-white border border-slate-200 text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 shadow-sm"
              >
                Launch Atmospheric Curve <ArrowRight size={14} />
              </button>
          </div>
      </div>
    </div>
  );
};

export default RiskDashboard;
