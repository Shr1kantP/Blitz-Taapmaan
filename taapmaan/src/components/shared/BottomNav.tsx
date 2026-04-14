import React from 'react';
import { Home, BarChart3, MessageSquare, Menu } from './Icons';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'forecast', label: 'Timeline', icon: BarChart3 },
    { id: 'chat', label: 'AI Pilot', icon: MessageSquare },
    { id: 'settings', label: 'Config', icon: Menu },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pt-4">
      <div className="glass glass--rounded-xl flex items-center justify-around p-2 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border border-white/20">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'bg-slate-900 text-white scale-110 shadow-lg' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
