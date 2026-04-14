import React from 'react';
import { ArrowLeft, ArrowRight } from './Icons';

interface StepperNavProps {
  currentScreen: number;
  totalScreens: number;
  onNext: () => void;
  onBack: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
}

const StepperNav: React.FC<StepperNavProps> = ({ 
  currentScreen, 
  totalScreens, 
  onNext, 
  onBack, 
  nextDisabled,
  nextLabel = "Next"
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex items-center justify-between z-50 md:sticky md:rounded-b-[44px]">
      <button 
        onClick={onBack}
        disabled={currentScreen === 1}
        className={`p-4 rounded-2xl flex items-center gap-2 font-bold transition-all ${
          currentScreen === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <ArrowLeft size={20} />
        <span className="hidden sm:inline">Back</span>
      </button>

      <div className="flex gap-2">
        {Array.from({ length: totalScreens }).map((_, i) => (
          <div 
            key={i} 
            className={`h-2 rounded-full transition-all duration-300 ${
              i + 1 === currentScreen 
                ? 'w-8 bg-brand-orange' 
                : i + 1 < currentScreen 
                  ? 'w-2 bg-brand-orange/40' 
                  : 'w-2 bg-gray-200'
            }`}
          />
        ))}
      </div>

      <button 
        onClick={onNext}
        disabled={nextDisabled}
        className={`px-8 py-4 rounded-2xl bg-brand-orange text-white font-black flex items-center gap-2 shadow-lg shadow-orange-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100`}
      >
        <span>{nextLabel}</span>
        {nextLabel.includes('Next') && <ArrowRight size={20} />}
      </button>
    </div>
  );
};

export default StepperNav;
