import { useState } from 'react';
import { AppState, UserProfile, ActivityType, ExposureDuration } from '../types/weather';

export function useAppState() {
  const [state, setState] = useState<AppState>({
    persona: null,
    city: "Mumbai",
    temp: 32,
    humidity: 65,
    exposureDuration: "30_60",
    activityType: "walking",
    phoneNumber: "",
    currentScreen: 1,
  });

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const nextScreen = () => {
    if (state.currentScreen < 4) {
      updateState({ currentScreen: (state.currentScreen + 1) as any });
    }
  };

  const prevScreen = () => {
    if (state.currentScreen > 1) {
      updateState({ currentScreen: (state.currentScreen - 1) as any });
    }
  };

  return { state, updateState, nextScreen, prevScreen };
}
