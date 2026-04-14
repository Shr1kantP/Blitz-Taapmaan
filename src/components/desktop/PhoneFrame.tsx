import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center h-screen sticky top-0 bg-slate-50">
      <div className="phone-frame scale-90 lg:scale-100 origin-center transition-transform duration-500">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-gray-200 rounded-b-[2rem] z-50 flex items-center justify-center p-1">
            <div className="w-16 h-1 bg-gray-300 rounded-full"></div>
        </div>
        <div className="h-full w-full bg-white overflow-hidden flex flex-col pt-8">
            {children}
        </div>
      </div>
    </div>
  );
};

export default PhoneFrame;
