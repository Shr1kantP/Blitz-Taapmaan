import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useAppState } from '../hooks/useAppState';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { calculateRisk } from '../lib/heatIndex';
import { DEFAULT_WEATHER } from '../lib/mockData';
import { WeatherData } from '../types/weather';

// Components
import Header from '../components/shared/Header';
import StepperNav from '../components/shared/StepperNav';
import PersonaPicker from '../components/screens/PersonaPicker';
import ConditionsInput from '../components/screens/ConditionsInput';
import RiskDashboard from '../components/screens/RiskDashboard';
import HourlyTimeline from '../components/screens/HourlyTimeline';
import AIChatScreen from '../components/screens/AIChatScreen';
import PhoneFrame from '../components/desktop/PhoneFrame';
import DesktopDashboard from '../components/desktop/DesktopDashboard';
import Drawer from '../components/shared/Drawer';
import VerticalNav from '../components/shared/VerticalNav';
import { AppState } from '../hooks/useAppState';

export default function Home() {
  const { state, updateState, nextScreen, prevScreen } = useAppState();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [weather, setWeather] = useState<WeatherData>(DEFAULT_WEATHER);
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setHydrated(true);
    refreshData();
  }, [state.city]);

  const refreshData = async (lat?: number, lon?: number) => {
    const query = lat && lon ? `lat=${lat}&lon=${lon}` : `city=${state.city}`;
    
    // Fetch current weather
    fetch(`/api/weather?${query}`)
      .then(res => res.json())
      .then(data => setWeather(data))
      .catch(() => {});

    // Fetch hourly projection
    fetch(`/api/hourly?${query}`)
      .then(res => res.json())
      .then(data => setHourlyData(data))
      .catch(() => {});
  };

  const handleLocationSelect = (lat: number, lon: number) => {
    refreshData(lat, lon);
    setActiveTab('forecast');
  };

  if (!hydrated) return null;

  const risk = calculateRisk(
    state.temp || weather.temp, 
    state.humidity || weather.humidity, 
    state.persona || 'general', 
    state.exposureDuration
  );

  const renderScreen = () => {
    // Stage 1: Onboarding
    if (state.currentScreen === 1) return <PersonaPicker currentPersona={state.persona} onSelect={(p) => updateState({ persona: p })} />;
    if (state.currentScreen === 2) return (
        <ConditionsInput 
          city={state.city} temp={weather.temp} humidity={weather.humidity} 
          duration={state.exposureDuration} activity={state.activityType}
          onChange={updateState} 
        />
    );

    // Stage 2: Tabbed Dashboard
    switch (activeTab) {
      case 'home':
        return (
          <RiskDashboard 
            weather={weather}
            score={risk.score}
            level={risk.level}
            reasons={risk.reasons}
            persona={state.persona}
            duration={state.exposureDuration}
            onViewTimeline={() => setActiveTab('forecast')}
            onLocationSelect={handleLocationSelect}
          />
        );
      case 'forecast':
        return <HourlyTimeline hourly={hourlyData} />;
      case 'chat':
        return <AIChatScreen score={risk.score} level={risk.level} city={weather.city} persona={state.persona || 'general'} />;
      case 'settings':
        return (
          <div className="p-10 text-center space-y-6">
            <h2 className="text-3xl font-black">Preferences</h2>
            <div className="p-8 glass glass--rounded-xl space-y-4">
                <button 
                  onClick={() => { updateState({ currentScreen: 1 }); setActiveTab('home'); }}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold"
                >
                    Reset Persona Profile
                </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const isNextDisabled = state.currentScreen === 1 && !state.persona;

  const mobileContent = (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {state.currentScreen > 2 && (
        <>
            <Header 
              city={weather.city} 
              level={risk.level} 
              temp={weather.temp} 
              dataSource={weather.dataSource || 'open-meteo'} 
              updatedAt={weather.updatedAt} 
              onMenuClick={() => setIsDrawerOpen(true)}
            />
            <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                <div className="h-full p-4">
                    <VerticalNav activeTab={activeTab} onTabChange={setActiveTab} onClose={() => setIsDrawerOpen(false)} />
                </div>
            </Drawer>
        </>
      )}
      
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {renderScreen()}
      </main>

      {state.currentScreen <= 2 && (
        <StepperNav 
            currentScreen={state.currentScreen}
            totalScreens={2}
            onNext={nextScreen}
            onBack={prevScreen}
            nextDisabled={isNextDisabled}
            nextLabel={state.currentScreen === 2 ? "Go Live →" : "Next"}
        />
      )}
    </div>
  );

  if (isDesktop) {
    // If we're still in onboarding phase on desktop, show the form
    if (state.currentScreen <= 2) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <Head>
            <title>Setup | TAAPMAAN</title>
          </Head>
          <div className="w-full max-w-2xl bg-white rounded-[4rem] shadow-2xl p-12 animate-in fade-in zoom-in-95 duration-500">
            {renderScreen()}
            <div className="mt-12">
              <StepperNav 
                  currentScreen={state.currentScreen}
                  totalScreens={2}
                  onNext={nextScreen}
                  onBack={prevScreen}
                  nextDisabled={isNextDisabled}
                  nextLabel={state.currentScreen === 2 ? "Launch Dashboard →" : "Next Step"}
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-50 overflow-hidden">
        <Head>
          <title>TAAPMAAN | Urban Heat Safety</title>
        </Head>
        <DesktopDashboard 
          weather={weather}
          score={risk.score}
          level={risk.level}
          reasons={risk.reasons}
          persona={state.persona}
          duration={state.exposureDuration}
          hourly={hourlyData}
          onLocationSelect={handleLocationSelect}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          state={state}
          updateState={updateState}
        />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>TAAPMAAN | Urban Heat Safety</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>
      {mobileContent}
    </>
  );
}
