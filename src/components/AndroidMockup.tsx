import React, { useState, useEffect } from 'react';
import { Home, Leaf, Compass, BookOpen, Phone, Wifi, Battery, Signal } from 'lucide-react';
import { ActiveScreen } from '../types';
import {
  SimulatorDashboard,
  SimulatorBreathing,
  SimulatorGrounding,
  SimulatorRelief,
  SimulatorEmergency
} from './SimulatorScreens';

interface AndroidMockupProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  stressLevel: number;
  setStressLevel: (level: number) => void;
  loggedMood: string | null;
  setLoggedMood: (mood: string | null) => void;
}

export const AndroidMockup: React.FC<AndroidMockupProps> = ({
  activeScreen,
  setActiveScreen,
  stressLevel,
  setStressLevel,
  loggedMood,
  setLoggedMood,
}) => {
  const [timeState, setTimeState] = useState('14:05');

  // Sync virtual clock with actual system time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours().toString().padStart(2, '0');
      let minutes = now.getMinutes().toString().padStart(2, '0');
      setTimeState(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Map route names to friendly display titles
  const getScreenTitle = () => {
    switch (activeScreen) {
      case 'dashboard': return 'Dashboard';
      case 'breathing': return 'Breathe';
      case 'grounding': return 'Sensory Grid';
      case 'relief': return 'Coping Statements';
      case 'emergency': return 'Crisis Dial';
    }
  };

  return (
    <div className="relative mx-auto flex flex-col items-center select-none" style={{ width: '310px' }}>
      {/* Phone side buttons */}
      <div className="absolute right-[-4px] top-28 w-1 h-14 bg-slate-400 rounded-l-md shadow-inner z-0" />
      <div className="absolute right-[-4px] top-48 w-1 h-8 bg-slate-300 rounded-l-md shadow-inner z-0" />

      {/* Main High-Fidelity Phone Outer Case */}
      <div className="relative w-[302px] h-[610px] bg-slate-950 rounded-[46px] p-2.5 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.45)] border-4 border-slate-800 flex flex-col shrink-0 overflow-hidden z-10 hover:border-slate-700 transition">
        
        {/* Dynamic Notch / Punch Hole Speaker */}
        <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-slate-950 rounded-full flex justify-center items-center z-50">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-800 mr-2" />
          <div className="w-14 h-1 bg-slate-900 rounded-full" />
        </div>

        {/* Screen inner content area */}
        <div className="w-full h-full bg-[#F1F5F2] rounded-[38px] overflow-hidden flex flex-col relative">
          
          {/* Status Bar */}
          <div className="h-9 bg-[#F1F5F2] px-5 flex items-center justify-between text-slate-700 font-bold text-[10px] select-none shrink-0 pt-1 z-35">
            <span className="font-sans font-extrabold tracking-tight text-slate-600">{timeState}</span>
            
            <div className="flex items-center space-x-1 text-slate-600">
              <span className="text-[8px] font-bold text-[#4A6741] tracking-wider bg-[#E1E8E3] px-1.5 py-0.5 rounded mr-1">Offline</span>
              <Signal size={10} className="stroke-[2.5]" />
              <Wifi size={10} className="stroke-[2.5]" />
              <Battery size={11} className="stroke-[2.5] fill-slate-600" />
            </div>
          </div>

          {/* Active View Router */}
          <div className="flex-1 w-full overflow-hidden relative">
            {activeScreen === 'dashboard' && (
              <SimulatorDashboard
                onNavigate={(route) => setActiveScreen(route)}
                stressLevel={stressLevel}
                setStressLevel={setStressLevel}
                loggedMood={loggedMood}
                setLoggedMood={setLoggedMood}
              />
            )}
            {activeScreen === 'breathing' && (
              <SimulatorBreathing />
            )}
            {activeScreen === 'grounding' && (
              <SimulatorGrounding />
            )}
            {activeScreen === 'relief' && (
              <SimulatorRelief />
            )}
            {activeScreen === 'emergency' && (
              <SimulatorEmergency />
            )}
          </div>

          {/* Material Design 3 Bottom Navigation bar */}
          <div className="bg-[#F1F5F2]/95 backdrop-blur border-t border-[#E1E8E3]/60 flex justify-around items-center h-16 px-1.5 shrink-0 z-40">
            {/* Nav: Dashboard */}
            <button
              onClick={() => setActiveScreen('dashboard')}
              className="flex flex-col items-center justify-center flex-1 py-1"
            >
              <div className={`p-1.5 px-3.5 rounded-full transition duration-300 flex items-center justify-center ${
                activeScreen === 'dashboard' ? 'bg-[#E1E8E3] text-[#4A6741] scale-102' : 'text-slate-400 hover:text-slate-500'
              }`}>
                <Home size={15} className="stroke-[2.5]" />
              </div>
              <span className={`text-[8px] font-black tracking-wide mt-1 ${activeScreen === 'dashboard' ? 'text-[#4A6741] font-bold' : 'text-slate-400'}`}>
                Home
              </span>
            </button>

            {/* Nav: Breathing */}
            <button
              onClick={() => setActiveScreen('breathing')}
              className="flex flex-col items-center justify-center flex-1 py-1"
            >
              <div className={`p-1.5 px-3.5 rounded-full transition duration-300 flex items-center justify-center ${
                activeScreen === 'breathing' ? 'bg-[#E1E8E3] text-[#4A6741] scale-102' : 'text-slate-400 hover:text-slate-500'
              }`}>
                <Leaf size={15} className="stroke-[2.5]" />
              </div>
              <span className={`text-[8px] font-black tracking-wide mt-1 ${activeScreen === 'breathing' ? 'text-[#4A6741] font-bold' : 'text-slate-400'}`}>
                Breathe
              </span>
            </button>

            {/* Nav: Grounding */}
            <button
              onClick={() => setActiveScreen('grounding')}
              className="flex flex-col items-center justify-center flex-1 py-1"
            >
              <div className={`p-1.5 px-3.5 rounded-full transition duration-300 flex items-center justify-center ${
                activeScreen === 'grounding' ? 'bg-[#E1E8E3] text-[#4A6741] scale-102' : 'text-slate-400 hover:text-slate-500'
              }`}>
                <Compass size={15} className="stroke-[2.5]" />
              </div>
              <span className={`text-[8px] font-black tracking-wide mt-1 ${activeScreen === 'grounding' ? 'text-[#4A6741] font-bold' : 'text-slate-400'}`}>
                Ground
              </span>
            </button>

            {/* Nav: Coping Relief */}
            <button
              onClick={() => setActiveScreen('relief')}
              className="flex flex-col items-center justify-center flex-1 py-1"
            >
              <div className={`p-1.5 px-3.5 rounded-full transition duration-300 flex items-center justify-center ${
                activeScreen === 'relief' ? 'bg-[#E1E8E3] text-[#4A6741] scale-102' : 'text-slate-400 hover:text-slate-500'
              }`}>
                <BookOpen size={15} className="stroke-[2.5]" />
              </div>
              <span className={`text-[8px] font-black tracking-wide mt-1 ${activeScreen === 'relief' ? 'text-[#4A6741] font-bold' : 'text-slate-400'}`}>
                Coping
              </span>
            </button>

            {/* Nav: Emergency Crisis */}
            <button
              onClick={() => setActiveScreen('emergency')}
              className="flex flex-col items-center justify-center flex-1 py-1"
            >
              <div className={`p-1.5 px-3.5 rounded-full transition duration-300 flex items-center justify-center ${
                activeScreen === 'emergency' ? 'bg-[#E1E8E3] text-[#4A6741] scale-102' : 'text-slate-400 hover:text-slate-500'
              }`}>
                <Phone size={15} className="stroke-[2.5]" />
              </div>
              <span className={`text-[8px] font-black tracking-wide mt-1 ${activeScreen === 'emergency' ? 'text-[#4A6741] font-bold' : 'text-slate-400'}`}>
                Crisis
              </span>
            </button>
          </div>

          {/* Android Gesture Pill handle */}
          <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-slate-950/60 rounded-full z-50 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
