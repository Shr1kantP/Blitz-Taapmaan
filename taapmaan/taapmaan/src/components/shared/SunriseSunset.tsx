import React from 'react';
import { Sunrise, Sunset } from './Icons';

interface SunriseSunsetProps {
  sunrise: string;
  sunset: string;
}

const SunriseSunset: React.FC<SunriseSunsetProps> = ({ sunrise, sunset }) => {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden relative">
      <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">Sun Position</h3>
      
      <div className="relative h-24 mb-6">
        {/* The Arc */}
        <div className="absolute inset-0 border-t-2 border-dashed border-orange-200 rounded-t-full"></div>
        
        {/* The Sun on the arc (visual mock) */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.6)] border-4 border-white"></div>
        
        {/* Horizon Line */}
        <div className="absolute bottom-0 w-full h-[1px] bg-gray-100"></div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-orange-50 p-2 rounded-xl text-orange-500">
            <Sunrise size={18} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Sunrise</p>
            <p className="text-sm font-bold text-gray-800">{sunrise}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-right">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Sunset</p>
            <p className="text-sm font-bold text-gray-800">{sunset}</p>
          </div>
          <div className="bg-indigo-50 p-2 rounded-xl text-indigo-500">
            <Sunset size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SunriseSunset;
