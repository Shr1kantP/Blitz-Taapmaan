import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, Thermometer, Droplets, Clock } from '../shared/Icons';
import { ActivityType, ExposureDuration } from '../../types/weather';

interface ConditionsInputProps {
  city: string;
  temp: number;
  humidity: number;
  duration: ExposureDuration;
  activity: ActivityType;
  phoneNumber?: string;
  onChange: (updates: any) => void;
}

const activities: {id: ActivityType, label: string, desc: string}[] = [
    { id: "sitting", label: "Resting", desc: "Minimal effort" },
    { id: "walking", label: "Moving", desc: "Walking or light yoga" },
    { id: "heavy_labour", label: "Intense", desc: "Running or heavy work" }
];

const durations: {id: ExposureDuration, label: string}[] = [
    { id: "under_30", label: "< 30 mins" },
    { id: "30_60", label: "Mid Range" }, // Human labeling
    { id: "over_60", label: "Long Stay" }
];

const ConditionsInput: React.FC<ConditionsInputProps> = ({ 
  city, temp, humidity, duration, activity, phoneNumber, onChange 
}) => {
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    if (!city || city === "Mumbai") {
        handleDetect();
    }
  }, []);

  const handleDetect = () => {
    setDetecting(true);
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(`/api/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
            const data = await res.json();
            onChange({ city: data.city, temp: data.temp, humidity: data.humidity });
          } catch (e) {
            console.error("Weather fetch failed", e);
          } finally {
            setDetecting(false);
          }
        },
        () => setDetecting(false)
      );
    } else {
      setDetecting(false);
    }
  };

  return (
    <div className="p-6 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="mb-10 space-y-2">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">The Setup.</h2>
        <p className="text-slate-500 font-medium text-lg italic">"Heat affects everyone differently. Tell us your plan."</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="glass glass--rounded-xl p-6 flex flex-col gap-4 shadow-xl border border-white/40">
            <p className="text-[10px] text-brand-orange font-black uppercase tracking-widest">Target Zone</p>
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900">{city}</h3>
                <button 
                    onClick={handleDetect}
                    className={`flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold transition-all hover:bg-slate-800 ${detecting ? 'animate-pulse' : ''}`}
                >
                    <Navigation size={14} />
                    {detecting ? 'Locating...' : 'Refresh'}
                </button>
            </div>
          </div>

          <div className="glass glass--rounded-xl p-6 flex flex-col gap-4 shadow-xl border border-white/40">
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">Direct Connection</p>
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <input 
                        type="tel" 
                        placeholder="WhatsApp Number (e.g. 919876543210)"
                        value={phoneNumber || ''}
                        onChange={(e) => onChange({ phoneNumber: e.target.value })}
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-100 placeholder:text-slate-300"
                    />
                </div>
            </div>
          </div>
      </div>

      <div className="space-y-12">
        {/* Sliders with Human Labels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Thermometer size={14} className="text-brand-orange" /> Temp
                </label>
                <span className="text-2xl font-black text-slate-900">{temp}°C</span>
            </div>
            <input 
              type="range" min="20" max="50" value={temp}
              onChange={(e) => onChange({ temp: Number(e.target.value) })}
              className="w-full accent-brand-orange h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer"
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Droplets size={14} className="text-cyan-500" /> Humidity
                </label>
                <span className="text-2xl font-black text-slate-900">{humidity}%</span>
            </div>
            <input 
              type="range" min="20" max="100" value={humidity}
              onChange={(e) => onChange({ humidity: Number(e.target.value) })}
              className="w-full accent-cyan-500 h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="h-px bg-slate-100 w-full relative">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Activity Detail</span>
        </div>

        {/* Activity Cards */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {activities.map((a) => (
              <button
                key={a.id}
                onClick={() => onChange({ activityType: a.id })}
                className={`p-6 rounded-xl text-left transition-all border-2 flex items-center justify-between ${
                  activity === a.id 
                    ? 'border-brand-orange bg-orange-50/30' 
                    : 'border-slate-50 bg-slate-50/50 grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
                }`}
              >
                <div>
                    <p className="text-lg font-black text-slate-900">{a.label}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{a.desc}</p>
                </div>
                {activity === a.id && <div className="w-4 h-4 rounded-full bg-brand-orange shadow-lg shadow-orange-200" />}
              </button>
            ))}
          </div>
        </div>

        {/* Duration Pills */}
        <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Exposure Stretch</label>
            <div className="flex flex-wrap gap-2">
                {durations.map((d) => (
                    <button
                        key={d.id}
                        onClick={() => onChange({ exposureDuration: d.id })}
                        className={`px-8 py-4 rounded-full text-xs font-black transition-all ${
                            duration === d.id 
                            ? 'bg-slate-900 text-white shadow-2xl' 
                            : 'bg-slate-50 text-slate-400 border border-slate-100'
                        }`}
                    >
                        {d.label}
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ConditionsInput;
