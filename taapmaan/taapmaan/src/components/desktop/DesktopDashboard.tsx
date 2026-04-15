import React from 'react';
import { WeatherData, RiskLevel, UserProfile, ExposureDuration } from '../../types/weather';
import { Users, MapPin, Droplet, ShieldCheck, Thermometer, Sun, AlertTriangle, Clock } from '../shared/Icons';
import HeatMap from '../shared/HeatMap';
import HourlyTimeline from '../screens/HourlyTimeline';
import AIChatScreen from '../screens/AIChatScreen';
import VerticalNav from '../shared/VerticalNav';
import ConditionsInput from '../screens/ConditionsInput';
import { AppState } from '../../hooks/useAppState';

const getThermalInsights = (hourly?: any[]) => {
  if (!hourly || hourly.length === 0) return { peak: '02:00 PM', optimal: '06:00 AM - 09:45 AM' };
  
  let max = hourly[0];
  hourly.forEach(h => { if (h && h.temp > max.temp) max = h; });

  const safeLimit = 31;
  const safeMorning = hourly.filter(h => {
    if (!h || !h.hour) return false;
    const hrRaw = h.hour.split(' ')[0];
    const isPM = h.hour.includes('PM');
    let hr = parseInt(hrRaw);
    if (isPM && hr !== 12) hr += 12;
    if (!isPM && hr === 12) hr = 0;
    return hr >= 6 && hr <= 11 && h.temp <= safeLimit;
  });

  const optimalEnd = safeMorning.length > 0 ? safeMorning[safeMorning.length - 1].hour : '09:30 AM';
  
  return { 
    peak: max?.hour || '02:00 PM', 
    optimal: `06:00 AM - ${optimalEnd}` 
  };
};

const getMeasures = (level: RiskLevel, persona: UserProfile | null, duration: ExposureDuration) => {
  const measures = [
    { title: "Hydration", desc: "Drink 250ml every 20 mins", icon: <Droplet size={20} /> },
  ];

  // Persona Specifics
  if (persona === 'elderly') {
    measures.push({ title: "Heart Check", desc: "Monitor heart rate", icon: <AlertTriangle size={20} /> });
    measures.push({ title: "Cooling", desc: "Seek AC refuge now", icon: <ShieldCheck size={20} /> });
  } else if (persona === 'child') {
    measures.push({ title: "No Cars", desc: "Never stay in car", icon: <AlertTriangle size={20} /> });
    measures.push({ title: "Activity", desc: "Quiet indoor play", icon: <Sun size={20} /> });
  } else if (persona === 'outdoor_worker') {
    measures.push({ title: "Rest Cycle", desc: "15m shade per hour", icon: <Clock size={20} /> });
    measures.push({ title: "Buddy System", desc: "Watch team members", icon: <Users size={20} /> });
    measures.push({ title: "Salts", desc: "Replace electrolytes", icon: <Droplet size={20} /> });
  } else {
    measures.push({ title: "Clothing", desc: "Wear light cotton", icon: <ShieldCheck size={20} /> });
  }

  // Exposure & Risk Escalation
  if (level === 'extreme' || (level === 'high' && duration === 'over_60')) {
    measures.unshift({ title: "Stop Activity", desc: "Suspend all exposure", icon: <Sun size={20} className="text-red-500" /> });
  } else if (level === 'high' || (level === 'moderate' && persona === 'elderly')) {
    measures.unshift({ title: "Search Refuge", desc: "Find cooling center", icon: <MapPin size={20} /> });
  }

  return measures;
};

interface DesktopDashboardProps {
  weather: WeatherData;
  score: number;
  level: RiskLevel;
  reasons: string[];
  persona: UserProfile | null;
  duration: ExposureDuration;
  hourly: any[];
  onLocationSelect: (lat: number, lon: number) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

const DesktopDashboard: React.FC<DesktopDashboardProps> = ({ 
  weather, score, level, reasons, persona, duration, hourly, onLocationSelect, activeTab, onTabChange,
  state, updateState
}) => {
  const measures = getMeasures(level, persona, duration);
  const insights = getThermalInsights(hourly);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
             {/* Header Section */}
             <div className="flex justify-between items-end px-4">
                <div>
                   <h2 className="text-4xl font-black text-slate-900 tracking-tight">Main Dashboard</h2>
                   <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Real-time localized heat intelligence</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-6 py-3 bg-white rounded-none border border-slate-100 flex items-center gap-3">
                        <Users size={16} className="text-brand-orange" />
                        <span className="text-sm font-black text-slate-900 capitalize">{persona?.replace('_', ' ')}</span>
                    </div>
                </div>
             </div>

             {/* Main Analytics Grid */}
             <div className="grid grid-cols-12 gap-8">
                {/* Score Card */}
                <div className="col-span-12 xl:col-span-8 bg-slate-900 rounded-none p-12 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange/20 blur-[100px] rounded-none -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-orange/30 transition-all duration-1000" />
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-50">Current Heat Risk</p>
                            <div className="flex items-baseline gap-4">
                                <span className="text-9xl font-black italic tracking-tighter">{score}°</span>
                                <div className={`px-6 py-2 rounded-none border font-black uppercase text-sm ${
                                    level === 'extreme' ? 'bg-red-500/20 text-red-100 border-red-500/40' :
                                    level === 'high' ? 'bg-orange-500/20 text-orange-100 border-orange-500/40' :
                                    'bg-emerald-500/20 text-emerald-100 border-emerald-500/40'
                                }`}>{level}</div>
                            </div>
                            <p className="mt-8 text-xl text-slate-400 font-medium max-w-lg leading-relaxed">{reasons[0]}</p>
                        </div>
                        <div className="w-full md:w-64 space-y-3">
                            {reasons.slice(1, 4).map((r, i) => (
                                <div key={i} className="p-4 bg-white/5 rounded-none border border-white/5 backdrop-blur-sm text-xs font-medium text-slate-300">
                                    {r}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Optimal Window Card */}
                <div className="col-span-12 xl:col-span-4 bg-emerald-500 rounded-none p-12 text-white flex flex-col justify-between shadow-2xl shadow-emerald-500/20">
                    <h3 className="text-xs font-black uppercase tracking-widest opacity-60">Smart Window</h3>
                    <div className="my-8">
                        <p className="text-3xl font-black leading-tight tracking-tight">Best safe hours:<br/> <span className="text-emerald-900">{insights.optimal}</span></p>
                    </div>
                    <div className="p-4 bg-white/10 rounded-none border border-white/10 text-xs font-bold leading-relaxed flex justify-between items-center">
                        <span>Peak: {insights.peak}</span>
                        <div className="h-1.5 w-1.5 bg-white rounded-none animate-pulse" />
                    </div>
                </div>

                {/* Environmental Focus - Map */}
                <div className="col-span-12 xl:col-span-9 h-[500px] bg-white rounded-none border border-slate-100 p-4 shadow-sm relative group overflow-hidden">
                    <HeatMap 
                      centerLat={weather.lat || 19.0760} 
                      centerLon={weather.lon || 72.8777} 
                      intensity={score} 
                      weather={weather} 
                      onLocationSelect={onLocationSelect}
                    />
                </div>

                {/* Sidebar Safety Protocols & Green Havens */}
                <div className="col-span-12 xl:col-span-3 space-y-6">
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 px-4 mb-6">Safety Command</h3>
                        <div className="space-y-4">
                            {measures.map((m, i) => (
                                <div key={i} className="bg-white p-6 rounded-none border border-slate-100 shadow-sm flex items-center gap-5 hover:border-brand-orange/20 transition-all cursor-default group">
                                    <div className="p-3 bg-slate-50 text-slate-400 rounded-none group-hover:bg-brand-orange group-hover:text-white transition-all">
                                        {m.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-slate-900 mb-0.5">{m.title}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{m.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600 px-4 mb-6">Green Safe Havens</h3>
                        <div className="bg-emerald-950 rounded-[2.5rem] p-6 text-white space-y-4">
                            {[
                                { name: "National Park", dist: "North" },
                                { name: "Aarey Colony", dist: "West" },
                                { name: "Shivaji Park", dist: "South" }
                            ].map((zone, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <span className="text-xs font-black italic tracking-tighter">{zone.name}</span>
                                    <span className="text-[8px] font-black uppercase bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md">80% Cool</span>
                                </div>
                            ))}
                            <p className="text-[8px] font-bold text-emerald-400/60 uppercase text-center mt-4">Verified Cooling Zones</p>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        );
      case 'map':
        return (
            <div className="h-[calc(100vh-160px)] w-full animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="h-full w-full rounded-[4rem] overflow-hidden shadow-2xl relative border-[12px] border-white ring-1 ring-slate-200/50">
                    <HeatMap 
                        centerLat={weather.lat} 
                        centerLon={weather.lon} 
                        intensity={score} 
                        weather={weather}
                        onLocationSelect={(lat, lon) => {
                            onLocationSelect?.(lat, lon);
                            onTabChange('forecast');
                        }}
                    />
                    <div className="absolute top-10 left-10 z-[100] pointer-events-none">
                        <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl border border-white">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Live Probing</p>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic leading-none">Regional Explorer</h2>
                            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100">
                                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{weather.city} Monitoring Station</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
      case 'forecast':
        return (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700">
                <HourlyTimeline hourly={hourly} />
            </div>
        );
      case 'chat':
        return (
            <div className="h-[80vh] animate-in fade-in slide-in-from-right-8 duration-700">
                <AIChatScreen score={score} level={level} city={weather.city} persona={persona || 'general'} />
            </div>
        );
      case 'settings':
        return (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="mb-10 flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Profile & Environment</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Customize your heat safety baseline</p>
                    </div>
                    <button 
                      onClick={() => updateState({ currentScreen: 1 })}
                      className="px-8 py-3 bg-slate-100 text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                    >
                        Change Persona
                    </button>
                </div>
                
                <div className="border-t border-slate-100 -mx-12 mb-8" />
                
                <ConditionsInput 
                    city={state.city} 
                    temp={weather.temp} 
                    humidity={weather.humidity} 
                    duration={state.exposureDuration} 
                    activity={state.activityType}
                    onChange={updateState} 
                />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
        {/* Left Sidebar - Permanent Floating Pill */}
        <aside className="hidden lg:block">
            <VerticalNav activeTab={activeTab} onTabChange={onTabChange} />
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 h-full overflow-y-auto no-scrollbar p-16 relative">
            <header className="flex justify-between items-center mb-16 px-4">
                <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-brand-orange rounded-full animate-pulse" />
                    <h1 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em]">{activeTab}</h1>
                </div>
                <div className="flex items-center gap-8">
                    <div className="text-right">
                        <p className="text-xs font-black text-slate-900">{weather.city}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 justify-end">
                            <MapPin size={10} className="text-brand-orange" />
                            {weather.dataSource === 'api' ? 'Live Probe Active' : 'Simulated Data'}
                        </p>
                    </div>
                    {weather.updatedAt && (
                        <div className="px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Last Synced</p>
                            <p className="text-[10px] font-black text-slate-900">{weather.updatedAt}</p>
                        </div>
                    )}
                </div>
            </header>

            <div className="max-w-7xl mx-auto">
                {renderContent()}
            </div>
        </div>
    </div>
  );
};

export default DesktopDashboard;
