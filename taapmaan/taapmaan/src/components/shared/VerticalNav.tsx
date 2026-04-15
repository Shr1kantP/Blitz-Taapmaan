import { Home, BarChart3, MessageSquare, Menu, X, Users, Settings, MapPin } from '../shared/Icons';

interface VerticalNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose?: () => void;
}

const VerticalNav: React.FC<VerticalNavProps> = ({ activeTab, onTabChange, onClose }) => {
  const links = [
    { id: 'home', label: 'Safety Dashboard', icon: Home },
    { id: 'map', label: 'Safety Map', icon: MapPin },
    { id: 'forecast', label: 'Heat Timeline', icon: BarChart3 },
    { id: 'chat', label: 'AI Safety Pilot', icon: MessageSquare },
    { id: 'settings', label: 'Account Profile', icon: Settings },
  ];

  return (
    <div className={`transition-all duration-500 flex flex-col items-center ${
        onClose 
            ? 'h-full w-full bg-white' 
            : 'h-[calc(100vh-64px)] my-8 ml-8 w-72 rounded-xl bg-white/80 backdrop-blur-2xl border border-slate-200/50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]'
    }`}>
      <div className="p-10 flex items-center justify-between w-full px-8 mb-12">
        <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter text-slate-900 leading-none">TAAPMAAN</h1>
            <p className="text-[8px] font-black uppercase text-brand-orange tracking-[0.3em] mt-1">Safety Console</p>
        </div>
        {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl lg:hidden">
                <X size={20} />
            </button>
        )}
      </div>

      <div className="flex-1 px-4 space-y-2 w-full">
        <p className="px-4 text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Navigation</p>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = activeTab === link.id;
          
          return (
            <button
              key={link.id}
              onClick={() => {
                onTabChange(link.id);
                onClose?.();
              }}
              className={`flex items-center w-full gap-4 px-6 py-4 rounded-xl mb-2 font-bold transition-all duration-300 ${
                isActive 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 scale-[1.02] z-10' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm tracking-tight">{link.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-6 w-full mt-auto">
        <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100/50 space-y-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-black shrink-0 border-2 border-white shadow-lg shadow-emerald-500/10">S</div>
                <div>
                    <p className="text-xs font-black text-slate-900">Shrikant</p>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">Live Connection</p>
                </div>
            </div>
            <button className="w-full py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">
                Sign Out
            </button>
        </div>
      </div>
    </div>
  );
};

// Simple Gear icon since I don't have Settings explicitly exported or want to be safe
const GearIcon = (props: any) => (
    <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={props.size || 24} 
    height={props.size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
    </svg>
);

export default VerticalNav;
