import { useState, useEffect } from 'react';
import { AppState, UserProfile, ActivityType, ExposureDuration } from '../types/weather';

const STORAGE_KEY = 'taapmaan_app_state';

const initialState: AppState = {
  persona: null,
  city: "Mumbai",
  temp: 32,
  humidity: 65,
  exposureDuration: "30_60",
  activityType: "walking",
  phoneNumber: "",
  currentScreen: 1,
};

export function useAppState() {
  const [state, setState] = useState<AppState>(initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setState(parsed);
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isInitialized]);

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

  return { state, updateState, nextScreen, prevScreen, isInitialized };
}
