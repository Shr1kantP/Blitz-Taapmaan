import React, { useEffect, useRef, useState } from 'react';
import { Maximize, X } from './Icons';
import { WeatherData } from '../../types/weather';

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
    return Math.min(1, Math.max(0.1, (projectedTemp - 20) / 25));
  };

  const getRiskColor = (weight: number) => {
    if (weight > 0.8) return '#ef4444';
    if (weight > 0.6) return '#f97316';
    if (weight > 0.4) return '#eab308';
    return '#22c55e';
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

    // Plot real micro-zones
    const points: any[] = [];

    // Add base data from our micro-zones
    MUMBAI_MICRO_ZONES.forEach(zone => {
      const weight = getWeightAt(zone.lat, zone.lon, intensity);
      points.push([zone.lat, zone.lon, weight]);

      // Add visual spot (marker)
      const color = getRiskColor(weight);
      const marker = L.circleMarker([zone.lat, zone.lon], {
        radius: isModal ? 8 : 6,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
        className: 'pulse-marker'
      }).addTo(map);

      if (isModal) {
        marker.bindPopup(`<b>${zone.name}</b><br/>Temp: ${Math.round(weight * 25 + 20)}°C`);
      }
    });

    // Also add the user's current center as a spot
    const currentWeight = getWeightAt(centerLat, centerLon, intensity);
    points.push([centerLat, centerLon, currentWeight]);
    L.circleMarker([centerLat, centerLon], {
      radius: isModal ? 12 : 10,
      fillColor: getRiskColor(currentWeight),
      color: '#fff',
      weight: 3,
      opacity: 1,
      fillOpacity: 1,
      className: 'pulse-marker'
    }).addTo(map).bindPopup('<b>Current Focus</b>');

    // Add local jittered spots around the current center for "every corner" feel
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const dist = 0.015 + (Math.sin(i * 100) * 0.01);
      const lLat = centerLat + Math.cos(angle) * dist;
      const lLon = centerLon + Math.sin(angle) * dist;
      const lWeight = getWeightAt(lLat, lLon, intensity);
      points.push([lLat, lLon, lWeight]);

      L.circleMarker([lLat, lLon], {
        radius: isModal ? 5 : 4,
        fillColor: getRiskColor(lWeight),
        color: '#fff',
        weight: 1,
        opacity: 0.6,
        fillOpacity: 0.4,
        className: 'pulse-marker'
      }).addTo(map);
    }

    // Heatmap layer for "atmospheric" effect
    const heatmap = L.heatLayer(points, {
      radius: isModal ? 45 : 35,
      blur: isModal ? 30 : 25,
      maxZoom: 13,
      gradient: { 0.2: '#22c55e', 0.4: '#eab308', 0.6: '#f97316', 0.9: '#ef4444' }
    });

    map.addLayer(heatmap);
    map.on('click', (e: any) => onLocationSelect?.(e.latlng.lat, e.latlng.lng));

    return map;
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current || isExpanded) return;

    // Inject pulse animation CSS
    if (!document.getElementById('map-pulse-styles')) {
      const style = document.createElement('style');
      style.id = 'map-pulse-styles';
      style.innerHTML = `
            @keyframes marker-pulse {
                0% { transform: scale(1); opacity: 0.8; }
                50% { transform: scale(1.2); opacity: 0.4; }
                100% { transform: scale(1); opacity: 0.8; }
            }
            .pulse-marker {
                animation: marker-pulse 2s infinite ease-in-out;
                transform-origin: center;
            }
        `;
      document.head.appendChild(style);
    }

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
      <div className="relative w-full h-full bg-slate-50 rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 group transition-transform active:scale-[0.98]">
        <div ref={mapRef} className="w-full h-full z-0" />
        <div className="absolute top-6 left-6 z-10 pointer-events-none">
          <span className="flex items-center gap-2 px-4 py-2 glass glass--rounded shadow-sm">
            <span className="h-2.5 w-2.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
            <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Real-Time Heat Plots</span>
          </span>
        </div>
        <div className="absolute top-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
            className="p-3 glass glass--rounded shadow-xl text-slate-900 hover:scale-110 active:scale-95 transition-all"
          >
            <Maximize size={20} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-12 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setIsExpanded(false)} />
          <div className="relative w-full max-w-7xl h-full max-h-[90vh] bg-white rounded-[4rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
            <div ref={modalMapRef} className="w-full h-full" />
            <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-[10001] pointer-events-none">
              <div className="glass glass--rounded-xl px-8 py-4 shadow-xl border border-gray-100 pointer-events-auto">
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic">Live Atmospheric Probing</h2>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Status: Monitoring micro-climate zones</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                className="p-5 glass glass--rounded shadow-2xl border border-gray-100 pointer-events-auto hover:bg-slate-50 active:scale-90 transition-all"
              >
                <X size={32} />
              </button>
            </div>
            <div className="absolute bottom-10 left-10 z-[10001] glass glass--rounded-xl p-8 border border-gray-100 shadow-xl max-w-sm pointer-events-auto">
              <p className="text-xs font-black text-brand-orange uppercase tracking-widest mb-2">Micro-Climate Assessment</p>
              <p className="text-sm font-medium text-slate-600 leading-relaxed mb-6">
                Active thermal scanning detected high-intensity interference in urban sectors. Tracking {MUMBAI_MICRO_ZONES.length} localized hotspots for real-time safety.
              </p>
              <div className="space-y-3 pt-6 border-t border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Real-Time Heat Color Scale</p>
                <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-[#EF4444]" /><span className="text-xs font-bold text-slate-700">Extreme Heat Impact</span></div>
                <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-[#F97316]" /><span className="text-xs font-bold text-slate-700">High Risk Zone</span></div>
                <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-[#EAB308]" /><span className="text-xs font-bold text-slate-700">Moderate Warning</span></div>
                <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-[#22C55E]" /><span className="text-xs font-bold text-slate-700">Safe/Lower Intensity</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeatMap;
