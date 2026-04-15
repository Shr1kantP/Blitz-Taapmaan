import React from 'react';

export const Icon = ({ children, size = 24, className = "" }: { children: React.ReactNode, size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {children}
  </svg>
);

export const Share2 = (props: any) => (
  <Icon {...props}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></Icon>
);

export const MapPin = (props: any) => (
  <Icon {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></Icon>
);

export const Wind = (props: any) => (
  <Icon {...props}><path d="M9 18c1.5 0 3-1.5 3-3s-1.5-3-3-3"/><path d="M15 12c1.5 0 3-1.5 3-3s-1.5-3-3-3"/><path d="M3 15h12"/><path d="M3 9h15"/></Icon>
);

export const Droplets = (props: any) => (
  <Icon {...props}><path d="M7 16.3c2.2 0 4-1.8 4-4 0-3.3-4-8-4-8s-4 4.7-4 8c0 2.2 1.8 4 4 4z"/><path d="M17 16.3c2.2 0 4-1.8 4-4 0-3.3-4-8-4-8s-4 4.7-4 8c0 2.2 1.8 4 4 4z"/></Icon>
);

export const Sun = (props: any) => (
  <Icon {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/></Icon>
);

export const Gauge = (props: any) => (
  <Icon {...props}><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></Icon>
);

export const Sunrise = (props: any) => (
  <Icon {...props}><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 1 0-8 0"/></Icon>
);

export const Sunset = (props: any) => (
  <Icon {...props}><path d="M12 13V5"/><path d="m4.93 15.07 1.41-1.41"/><path d="M2 9h2"/><path d="M20 9h2"/><path d="m19.07 15.07-1.41-1.41"/><path d="M22 22H2"/><path d="m16 9-4 4-4-4"/><path d="M16 22a4 4 0 1 0-8 0"/></Icon>
);

export const Sparkles = (props: any) => (
  <Icon {...props}><path d="m12 3 1.912 4.013L18 9l-4.088 2.087L12 15l-1.912-4.013L6 9l4.088-2.087L12 3z"/><path d="M5 3L4 4.5 5 6 3.5 5 2 6 3 4.5 2 3 3.5 4z"/><path d="m20 17-1 1.5 1 1.5-1.5-1-1.5 1 1-1.5-1-1.5 1.5 1z"/></Icon>
);

export const Send = (props: any) => (
  <Icon {...props}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></Icon>
);

export const Loader2 = (props: any) => (
  <Icon {...props} className={"animate-spin " + props.className}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></Icon>
);

export const ArrowLeft = (props: any) => (
  <Icon {...props}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></Icon>
);

export const ArrowRight = (props: any) => (
  <Icon {...props}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></Icon>
);

export const HardHat = (props: any) => (
  <Icon {...props}><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15v-3a8 8 0 0 1 16 0v3"/></Icon>
);

export const User = (props: any) => (
  <Icon {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>
);

export const Baby = (props: any) => (
  <Icon {...props}><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/></Icon>
);

export const Users = (props: any) => (
  <Icon {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Icon>
);

export const Navigation = (props: any) => (
  <Icon {...props}><polygon points="3 11 22 2 13 21 11 13 3 11"/></Icon>
);

export const Thermometer = (props: any) => (
  <Icon {...props}><line x1="14" y1="4" x2="14" y2="4"/><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></Icon>
);

export const Droplet = (props: any) => (
  <Icon {...props}><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></Icon>
);

export const Clock = (props: any) => (
  <Icon {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Icon>
);

export const ShieldCheck = (props: any) => (
  <Icon {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></Icon>
);

export const AlertTriangle = (props: any) => (
  <Icon {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></Icon>
);

export const BarChart3 = (props: any) => (
  <Icon {...props}><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></Icon>
);

export const HelpCircle = (props: any) => (
  <Icon {...props}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></Icon>
);
export const X = (props: any) => (
  <Icon {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></Icon>
);
export const Home = (props: any) => (
  <Icon {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Icon>
);
export const MessageSquare = (props: any) => (
  <Icon {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Icon>
);
export const Menu = (props: any) => (
  <Icon {...props}><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></Icon>
);
export const Maximize = (props: any) => (
  <Icon {...props}><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></Icon>
);

export const Settings = (props: any) => (
  <Icon {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></Icon>
);
<<<<<<< HEAD:taapmaan/src/components/shared/Icons.tsx
=======

export const LocateFixed = (props: any) => (
  <Icon {...props}><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/></Icon>
);
>>>>>>> 41d1fb3 (Fixed Notification system):src/components/shared/Icons.tsx
