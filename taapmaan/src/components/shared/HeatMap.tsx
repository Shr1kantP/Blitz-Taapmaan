import React, { useEffect, useRef, useState } from 'react';
import { Maximize, X } from './Icons';
import { WeatherData } from '../../types/weather';
import { calculateRisk } from '../../lib/heatIndex';

interface HeatMapProps {
  centerLat?: number;
  centerLon?: number;
  intensity?: number;
  weather?: WeatherData;
  onLocationSelect?: (lat: number, lon: number) => void;
}

const MUMBAI_MICRO_ZONES = [
  { name: "Colaba", lat: 18.9067, lon: 72.8147 },
  { name: "Worli", lat: 19.0176, lon: 72.8174 },
  { name: "Dadar", lat: 19.0178, lon: 72.8478 },
  { name: "Bandra", lat: 19.0522, lon: 72.8258 },
  { name: "Juhu", lat: 19.1000, lon: 72.8270 },
  { name: "Andheri", lat: 19.1200, lon: 72.8500 },
  { name: "Borivali", lat: 19.2313, lon: 72.8522 },
  { name: "Thane", lat: 19.2183, lon: 72.9781 },
  { name: "Navi Mumbai", lat: 19.0330, lon: 73.0297 },
  { name: "Chembur", lat: 19.0622, lon: 72.8974 },
  { name: "Powai", lat: 19.1176, lon: 72.9060 },
  { name: "Sion", lat: 19.0390, lon: 72.8619 },
  { name: "Goregaon", lat: 19.1663, lon: 72.8450 },
  { name: "Malad", lat: 19.1874, lon: 72.8484 },
  { name: "Vashi", lat: 19.0745, lon: 72.9978 },
  { name: "Lower Parel", lat: 18.9950, lon: 72.8270 },
  { name: "Kurla", lat: 19.0607, lon: 72.8836 }
];

const MUMBAI_SAFE_ZONES = [
  { name: "Sanjay Gandhi National Park", lat: 19.2288, lon: 72.9182 },
  { name: "Aarey Forest", lat: 19.1415, lon: 72.8837 },
  { name: "Shivaji Park", lat: 19.0267, lon: 72.8378 },
  { name: "Hanging Gardens", lat: 18.9568, lon: 72.8222 },
  { name: "Bandra Fort Garden", lat: 19.0413, lon: 72.8193 },
  { name: "IIT Powai Greenery", lat: 19.1334, lon: 72.9133 }
];

const HeatMap: React.FC<HeatMapProps> = ({
  centerLat = 19.0760,
  centerLon = 72.8777,
  intensity = 32,
  weather,
  onLocationSelect
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const modalMapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const modalMapInstance = useRef<any>(null);

  // Hyper-Localized Heat Model (Matches api/weather.ts)
  const getWeightAt = (lat: number, lon: number, baseWeight: number) => {
    const spatialJitter = (
      Math.sin(lat * 800) * 4 +
      Math.cos(lon * 1200) * 3 +
      Math.sin((lat + lon) * 400) * 2
    );
    const projectedTemp = baseWeight + spatialJitter;
    // Map temperature score to 0-1 weight
    return Math.min(1, Math.max(0.1, (projectedTemp - 20) / 25));
  };

  const getMockAQI = (weight: number) => {
    return Math.round(50 + (weight * 120));
  };

  const addInteractionZone = (map: any, zone: any, weight: number, type: string, isModal: boolean) => {
    const L = (window as any).L;
    const temp = Math.round(weight * 25 + 20);
    const humidity = Math.round(40 + (weight * 30));
    const aqi = getMockAQI(weight);
    const risk = calculateRisk(temp, humidity, 'general', 'under_30');

    const interactionZone = L.circleMarker([zone.lat, zone.lon], {
      radius: isModal ? 30 : 20,
      fillColor: 'transparent',
      stroke: false,
      interactive: true
    }).addTo(map);

    const tooltipContent = `
      <div class="p-4 bg-slate-900/95 backdrop-blur-xl text-white rounded-xl border border-white/20 shadow-2xl min-w-[200px] pointer-events-none">
        <div class="flex justify-between items-start mb-3">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-brand-orange">${type}</p>
            <h4 class="text-xl font-black italic tracking-tighter">${zone.name}</h4>
          </div>
          <div class="px-3 py-1 bg-white/10 rounded-full text-[8px] font-black uppercase tracking-tighter border border-white/10" style="color: white; background: rgba(255,255,255,0.1)">${risk.level}</div>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mt-4 border-t border-white/10 pt-4">
          <div>
            <p class="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Temperature</p>
            <p class="text-lg font-black">${temp}°C</p>
          </div>
          <div>
            <p class="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Humidity</p>
            <p class="text-lg font-black">${humidity}%</p>
          </div>
          <div>
            <p class="text-[8px] font-bold text-slate-400 uppercase tracking-widest">AQI Index</p>
            <p class="text-lg font-black ${aqi > 100 ? 'text-orange-400' : 'text-emerald-400'}">${aqi}</p>
          </div>
          <div>
            <p class="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Exposure Risk</p>
            <p class="text-lg font-black text-brand-orange">High Strength</p>
          </div>
        </div>
      </div>
    `;

    interactionZone.bindTooltip(tooltipContent, {
      direction: 'top',
      offset: [0, -10],
      className: 'stats-tooltip',
      opacity: 1,
      sticky: true
    });

    interactionZone.on('click', () => {
      onLocationSelect?.(zone.lat, zone.lon);
    });
  };

  const setupMap = (element: HTMLDivElement, isModal: boolean) => {
    const L = (window as any).L;
    if (!L || !L.heatLayer) return null;

    const map = L.map(element, {
      zoomControl: isModal,
      attributionControl: isModal,
      dragging: isModal,
      scrollWheelZoom: isModal,
      touchZoom: isModal
    }).setView([centerLat, centerLon], isModal ? 12 : 11);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      opacity: 0.9
    }).addTo(map);

    const points: any[] = [];

    MUMBAI_MICRO_ZONES.forEach((zone: any) => {
      const weight = getWeightAt(zone.lat, zone.lon, intensity);
      points.push([zone.lat, zone.lon, weight]);
      addInteractionZone(map, zone, weight, "Urban Sector", isModal);
    });

    MUMBAI_SAFE_ZONES.forEach((zone: any) => {
      const weight = getWeightAt(zone.lat, zone.lon, Math.max(25, intensity - 10));
      const finalWeight = weight * 0.4;
      points.push([zone.lat, zone.lon, finalWeight]);
      addInteractionZone(map, zone, finalWeight, "Green Belt", isModal);
    });

    const currentWeight = getWeightAt(centerLat, centerLon, intensity);
    points.push([centerLat, centerLon, currentWeight]);
    addInteractionZone(map, { name: "Current Location", lat: centerLat, lon: centerLon }, currentWeight, "Target Area", isModal);

    const heatmap = L.heatLayer(points, {
      radius: isModal ? 85 : 70,
      blur: isModal ? 50 : 45,
      maxZoom: 13,
      gradient: { 
        0.05: '#22c55e',
        0.25: '#eab308', 
        0.5: '#f97316', 
        0.8: '#ef4444' 
      }
    });

    map.addLayer(heatmap);
    map.on('click', (e: any) => onLocationSelect?.(e.latlng.lat, e.latlng.lng));

    return map;
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!document.getElementById('map-interaction-styles')) {
      const style = document.createElement('style');
      style.id = 'map-interaction-styles';
      style.innerHTML = `
        .stats-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .stats-tooltip::before {
          display: none !important;
        }
        .leaflet-tooltip-pane {
          z-index: 12000 !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current || isExpanded) return;

    const instance = setupMap(mapRef.current, false);
    if (instance) mapInstance.current = instance;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [centerLat, centerLon, intensity, isExpanded]);

  useEffect(() => {
    if (!isExpanded || typeof window === 'undefined' || !modalMapRef.current) return;

    const instance = setupMap(modalMapRef.current, true);
    if (instance) modalMapInstance.current = instance;

    return () => {
      if (modalMapInstance.current) {
        modalMapInstance.current.remove();
        modalMapInstance.current = null;
      }
    };
  }, [isExpanded, centerLat, centerLon, intensity]);

  return (
    <>
      <div className="relative w-full h-full bg-slate-50 rounded-xl overflow-hidden shadow-2xl border border-gray-100 group transition-transform active:scale-[0.98]">
        <div ref={mapRef} className="w-full h-full z-0" />
        <div className="absolute top-6 left-6 z-10 pointer-events-none">
          <span className="flex items-center gap-2 px-4 py-2 glass glass--rounded shadow-sm">
            <span className="h-2.5 w-2.5 bg-red-600 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
            <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Regional Heat Zones</span>
          </span>
        </div>
        <div className="absolute top-6 right-6 z-10 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
            className="p-3 glass glass--rounded shadow-xl text-slate-900 hover:scale-110 active:scale-95 transition-all"
          >
            <Maximize size={20} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 lg:p-12 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => setIsExpanded(false)} />
          <div className="relative w-full h-full lg:max-w-7xl lg:max-h-[90vh] bg-white lg:rounded-xl shadow-2xl border-white/20 overflow-hidden animate-in slide-in-from-bottom-10 lg:zoom-in-95 duration-500">
            <div ref={modalMapRef} className="w-full h-full" />
            
            {/* Minimal Status Bar */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-[10001] pointer-events-none">
              <div className="bg-white/90 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-xl border border-slate-100 pointer-events-auto">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                    <h2 className="text-[10px] font-black text-slate-900 tracking-tighter uppercase italic">Live Probe: {weather?.city || 'Sector'}</h2>
                </div>
              </div>
              
              <button
                onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-full shadow-2xl pointer-events-auto active:scale-90 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tight Legend */}
            <div className="absolute bottom-10 left-6 right-6 z-[10001] pointer-events-none lg:pointer-events-auto flex flex-col items-start gap-4">
                <div className="bg-white/95 backdrop-blur-xl p-6 rounded-xl border border-slate-100 shadow-2xl max-w-[280px] pointer-events-auto">
                    <p className="text-[9px] font-black text-brand-orange uppercase tracking-[0.2em] mb-4">Heat Intensity Scale</p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                            <span className="text-[8px] font-bold text-slate-700 uppercase">Extreme</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
                            <span className="text-[8px] font-bold text-slate-700 uppercase">High</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
                            <span className="text-[8px] font-bold text-slate-700 uppercase">Moderate</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                            <span className="text-[8px] font-bold text-slate-700 uppercase">Safe</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeatMap;
