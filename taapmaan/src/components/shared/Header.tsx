import React from 'react';
import { Share2, MapPin, Menu } from './Icons';

interface HeaderProps {
  city: string;
  level?: string;
  temp?: number;
  dataSource?: string;
  updatedAt?: string;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ city, level, temp, dataSource, updatedAt, onMenuClick }) => {
  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'TAAPMAAN Heat Alert',
        text: `Live check in ${city}! Stay safe.`,
        url: window.location.href,
      }).catch(() => {});
    }
  };

  return (
    <header className="sticky top-0 z-50 p-6 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] flex items-center justify-between px-6 py-5 shadow-xl shadow-slate-200/50 border border-white">
        <div className="flex items-center gap-5">
          <button 
            onClick={onMenuClick}
            className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-2xl transition-all active:scale-90 border border-slate-100"
          >
            <Menu size={20} className="text-slate-900" />
          </button>
          
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter text-slate-900 leading-none">TAAPMAAN</h1>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-[10px] font-black text-slate-900 flex items-center gap-1 uppercase tracking-tight">
                {city}
              </span>
              <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">
                {updatedAt || 'Live Now'}
              </span>
              <div className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border border-slate-100 bg-slate-50 text-slate-400`}>
                {dataSource === 'api' || dataSource === 'open-meteo' ? 'Open-Meteo' : 'Shared'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
                <p className="text-lg font-black text-slate-900 leading-none italic">{temp}<span className="text-xs uppercase ml-0.5 mt-1">°</span></p>
            </div>
            <button 
                onClick={handleShare}
                className="w-10 h-10 flex items-center justify-center bg-slate-900 rounded-2xl text-white shadow-lg shadow-slate-900/20 active:scale-95"
            >
                <Share2 size={16} />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
