import React from 'react';
import { HardHat, User, Baby, Users } from '../shared/Icons';
import { UserProfile } from '../../types/weather';

interface PersonaPickerProps {
  selected: UserProfile | null;
  onSelect: (p: UserProfile) => void;
}

const personas = [
  { id: 'outdoor_worker', name: 'Outdoor Worker', icon: <HardHat />, note: 'Duration penalty applies' },
  { id: 'elderly', name: 'Elderly (65+)', icon: <User />, note: '10% higher sensitivity' },
  { id: 'child', name: 'Child', icon: <Baby />, note: '-5°F threshold adjustment' },
  { id: 'general', name: 'General Public', icon: <Users />, note: 'Standard risk profile' },
];

const PersonaPicker: React.FC<PersonaPickerProps> = ({ selected, onSelect }) => {
  return (
    <div className="p-6 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Who is this for?</h2>
        <p className="text-gray-500 font-medium">Heat index calculations are adjusted based on physiological sensitivity.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {personas.map((p) => {
          const isSelected = selected === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id as UserProfile)}
              className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border-[1.5px] min-h-[160px] transition-all duration-300 ${
                isSelected 
                  ? 'border-brand-orange bg-brand-orange-light shadow-xl shadow-orange-100 scale-[1.02]' 
                  : 'border-gray-100 bg-white hover:border-orange-200'
              }`}
            >
              <div className={`p-4 rounded-2xl mb-4 transition-colors ${isSelected ? 'bg-brand-orange text-white' : 'bg-gray-50 text-gray-400'}`}>
                {React.cloneElement(p.icon as React.ReactElement, { size: 32 })}
              </div>
              <h3 className={`font-black text-sm mb-1 ${isSelected ? 'text-brand-orange' : 'text-gray-900'}`}>{p.name}</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight text-center">{p.note}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PersonaPicker;
