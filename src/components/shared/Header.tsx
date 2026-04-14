import React from 'react';
import { Share2, MapPin, Menu } from './Icons';

interface HeaderProps {
  city: string;
  level?: string;
  temp?: number;
  dataSource?: string;
  updatedAt?: string;
}

const Header: React.FC<HeaderProps> = ({ city, level, temp, dataSource, updatedAt }) => {
  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'TAAPMAAN Heat Alert',
        text: `Extreme heat risk in ${city}! Stay safe.`,
        url: window.location.href,
      }).catch(() => {});
    }
  };

  return (
    <header className="sticky top-0 z-50 p-4 transition-all animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="glass glass--rounded-xl flex items-center justify-between p-4 shadow-2xl border border-white/20">
        <div className="flex items-center gap-4">
          <button className="p-3 hover:bg-slate-100 rounded-2xl transition-all active:scale-90">
            <Menu size={22} className="text-slate-900" />
          </button>
          
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-[-0.05em] text-slate-900 leading-none">TAAPMAAN</h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                <MapPin size={10} className="text-brand-orange" /> {city}
              </span>
              {updatedAt && (
                <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">Synced {updatedAt}</span>
              )}
              <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border flex items-center gap-1 transition-all ${
                dataSource === 'api' 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                    : 'bg-orange-50 text-orange-600 border-orange-200'
                }`}>
                {dataSource === 'api' && <span className="h-1 w-1 bg-emerald-500 rounded-full animate-pulse" />}
                {dataSource === 'api' ? 'Realtime API' : 'Shared Context'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
            <div className="hidden sm:flex flex-col text-right mr-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Urban Temp</p>
                <p className="text-xl font-black text-slate-900 leading-none">{temp}<span className="text-sm">°C</span></p>
            </div>
            <button 
                onClick={handleShare}
                className="w-12 h-12 flex items-center justify-center glass rounded-2xl text-slate-900 hover:text-brand-orange transition-all active:scale-95"
            >
                <Share2 size={20} />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
