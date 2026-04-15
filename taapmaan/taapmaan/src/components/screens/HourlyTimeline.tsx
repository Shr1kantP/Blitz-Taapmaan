import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { RISK_COLORS } from '../../lib/heatIndex';
import { ShieldCheck, AlertTriangle, BarChart3 } from '../shared/Icons';

Chart.register(...registerables);

interface HourlyTimelineProps {
    hourly?: any[];
}

const HourlyTimeline: React.FC<HourlyTimelineProps> = ({ hourly = [] }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !hourly || hourly.length === 0) return;

    if (chartInstance.current) {
        chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const labels = hourly.map(d => d.hour);
    const scores = hourly.map(d => Math.round(d.score));
    const levels = hourly.map(d => d.riskLevel);

    chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Heat Index (°C)',
                data: scores,
                borderColor: '#F97316',
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const {ctx, chartArea} = chart;
                    if (!chartArea) return null;
                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, 'rgba(249, 115, 22, 0.4)');
                    gradient.addColorStop(1, 'rgba(249, 115, 22, 0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                pointBackgroundColor: levels.map(l => RISK_COLORS[l as keyof typeof RISK_COLORS] || '#4ade80'),
                pointBorderColor: '#fff',
                pointBorderWidth: 4,
                pointRadius: 6,
                pointHoverRadius: 8,
                borderWidth: 4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1E293B',
                    titleFont: { weight: 'bold', size: 14 },
                    padding: 12,
                    cornerRadius: 16,
                    callbacks: {
                        label: (ctx) => ` Heat Index: ${ctx.parsed.y}°C`
                    }
                }
            },
            scales: {
                y: {
                    min: 20,
                    max: 50,
                    grid: { display: false },
                    ticks: { font: { weight: 'bold', size: 10 }, color: '#94A3B8' }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { weight: 'bold', size: 10 }, color: '#94A3B8' }
                }
            }
        }
    });

    return () => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
    };
  }, [hourly]);

  // Dynamic recommendation based on hourly data
  const safeWindows = hourly
    .filter(d => d.riskLevel === 'low' || d.riskLevel === 'moderate')
    .slice(0, 2)
    .map(d => d.hour);

  const dangerWindows = hourly
    .filter(d => d.riskLevel === 'extreme' || d.riskLevel === 'high')
    .slice(0, 1)
    .map(d => d.hour);

  return (
    <div className="p-0 sm:p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-visible">
      <div className="mb-4">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Localized Safety Timeline</h2>
        <p className="text-gray-500 font-medium tracking-tight italic">"Tracking micro-climate shifts at your exact location."</p>
      </div>

      <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar">
        {safeWindows.length > 0 && (
            <span className="flex-shrink-0 px-4 py-2 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100 flex items-center gap-2">
                <ShieldCheck size={14} /> Low Risk: {safeWindows[0]}
            </span>
        )}
        {dangerWindows.length > 0 && (
            <span className="flex-shrink-0 px-4 py-2 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100 flex items-center gap-2">
                <AlertTriangle size={14} /> Peak Heat: {dangerWindows[0]}
            </span>
        )}
      </div>

      {/* Actual Chart.js Visualization */}
      <div className="glass glass--rounded-xl p-10 shadow-xl min-h-[450px] relative">
        <div className="absolute top-8 left-10 flex items-center gap-2">
            <div className="p-2 bg-brand-orange/10 text-brand-orange rounded-xl">
                <BarChart3 size={18} />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-Time Probe</p>
                <p className="text-xs font-bold text-slate-900 leading-none">Localized Severity Curve</p>
            </div>
        </div>
        
        <div className="w-full h-[320px] mt-12">
            <canvas ref={chartRef} />
        </div>
      </div>

      {safeWindows.length > 0 && (
        <div className="bg-brand-orange text-white p-8 rounded-[3rem] shadow-xl shadow-orange-100 flex items-center gap-8 group hover:scale-[1.01] transition-all">
            <div className="p-4 bg-white/20 rounded-3xl group-hover:rotate-12 transition-transform">
                <ShieldCheck size={40} />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Recommended Window</p>
                <p className="text-2xl font-black leading-tight">Safest period starts around {safeWindows[0]}</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default HourlyTimeline;
