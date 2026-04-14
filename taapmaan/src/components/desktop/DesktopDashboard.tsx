import React from 'react';
import { WeatherData, RiskLevel, UserProfile, ExposureDuration } from '../../types/weather';
import { Users, MapPin } from '../shared/Icons';
import HeatMap from '../shared/HeatMap';
import HourlyTimeline from '../screens/HourlyTimeline';
import AIChatScreen from '../screens/AIChatScreen';
import VerticalNav from '../shared/VerticalNav';

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
}

const DesktopDashboard: React.FC<DesktopDashboardProps> = ({ 
  weather, score, level, reasons, persona, duration, hourly, onLocationSelect, activeTab, onTabChange
}) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
             {/* Main Score & Analysis */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                <div className="xl:col-span-2">
                    <div className="bg-slate-900 text-white p-14 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-orange/30 transition-colors" />
                        <div className="relative z-10">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-60">Heat Risk Score</h2>
                            <div className="flex items-baseline gap-4">
                                <span className="text-9xl font-black italic tracking-tighter">{score}°</span>
                                <span className={`text-2xl font-black uppercase px-6 py-2 rounded-2xl border ${
                                    level === 'extreme' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                                    level === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                                    'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                }`}>{level}</span>
                            </div>
                            <p className="mt-8 text-xl text-slate-400 font-medium max-w-xl leading-relaxed">
                                {reasons[0] || "Atmospheric conditions analyzed. Conditions are stable."}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Persona Context</h3>
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-slate-900 text-white rounded-[2rem]">
                                <Users size={32} />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900 capitalize">{persona?.replace('_', ' ') || 'General'}</p>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{duration.replace('_', '-')} min exposure</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 space-y-3">
                        {reasons.slice(1, 3).map((r, i) => (
                            <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="h-2 w-2 bg-brand-orange rounded-full mt-2 shrink-0" />
                                <p className="text-sm font-medium text-slate-600 leading-snug">{r}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Map & Safe Windows Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-[400px]">
                    <HeatMap 
                      centerLat={19.0760} 
                      centerLon={72.8777} 
                      intensity={score} 
                      weather={weather} 
                      onLocationSelect={onLocationSelect}
                    />
                </div>
                <div className="bg-emerald-50 p-10 rounded-[3rem] border border-emerald-100 flex flex-col justify-center">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-6 flex items-center gap-2">
                        <span className="w-4 h-0.5 bg-emerald-500 rounded-full" />
                        Optimal Window
                    </h3>
                    <p className="text-4xl font-black text-emerald-900 leading-[1.1] tracking-tight">
                        Best period for work:<br/> 
                        <span className="text-emerald-600">6:00 AM – 9:45 AM</span>
                    </p>
                    <p className="mt-6 text-emerald-700/60 font-medium">Risk levels are lowest during early morning atmospheric cooling.</p>
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
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-[320px] h-full border-r border-slate-200 hidden lg:block overflow-y-auto bg-white">
            <VerticalNav activeTab={activeTab} onTabChange={onTabChange} />
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 h-full overflow-y-auto no-scrollbar p-12">
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
