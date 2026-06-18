import React, { useState, useEffect } from 'react';
import { Home, Leaf, Compass, BookOpen, Phone, Wifi, Battery, Signal, Brain, Shield } from 'lucide-react';
import { ActiveScreen, MoodLogEntry } from '../types';
import {
  SimulatorDashboard,
  SimulatorBreathing,
  SimulatorGrounding,
  SimulatorRelief,
  SimulatorEmergency,
  SimulatorHistory
} from './SimulatorScreens';
import {
  SimulatorReframing,
  SimulatorHabit,
  SimulatorGratitude,
  SimulatorSomatic,
  SimulatorSafetyPlan
} from './ToolkitScreens';
import {
  SimulatorWorryBox,
  SimulatorEMDR,
  SimulatorEmotionWheel,
  SimulatorVagusHacks,
  SimulatorPanicSOS
} from './ExtendedToolkitScreens';
import {
  SimulatorSomaticHub,
  SimulatorCbtHub,
  SimulatorSafetyHub
} from './HubScreens';

interface AndroidMockupProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  stressLevel: number;
  setStressLevel: (level: number) => void;
  loggedMood: string | null;
  setLoggedMood: (mood: string | null) => void;
  moodHistory: MoodLogEntry[];
  showDebugMenu: boolean;
  setShowDebugMenu: (show: boolean) => void;
  resetMoodData: () => void;
  seedRandomData: () => void;
}

export const AndroidMockup: React.FC<AndroidMockupProps> = ({
  activeScreen,
  setActiveScreen,
  stressLevel,
  setStressLevel,
  loggedMood,
  setLoggedMood,
  moodHistory,
  showDebugMenu,
  setShowDebugMenu,
  resetMoodData,
  seedRandomData,
}) => {
  const [timeState, setTimeState] = useState('14:05');
  const [offlinePillClicks, setOfflinePillClicks] = useState(0);

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
      case 'somaticHub': return 'Somatic Hub';
      case 'cbtHub': return 'CBT Mind Hub';
      case 'safetyHub': return 'Safety SOS Hub';
      case 'breathing': return 'Breathe';
      case 'grounding': return 'Sensory Grounding';
      case 'relief': return 'Coping Statements';
      case 'emergency': return 'Crisis Dial';
      case 'history': return 'Care History & Logs';
      case 'reframing': return 'Thought Reframer';
      case 'habit': return 'Everyday Basics';
      case 'gratitude': return 'Gratitude Jar';
      case 'somatic': return 'Muscle Release';
      case 'safetyPlan': return 'My Safety Plan';
      default: return 'Safe Space';
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
          <div className="flex-1 w-full overflow-hidden relative font-sans">
            {activeScreen === 'dashboard' && (
              <SimulatorDashboard
                onNavigate={(route) => setActiveScreen(route)}
                stressLevel={stressLevel}
                setStressLevel={setStressLevel}
                loggedMood={loggedMood}
                setLoggedMood={setLoggedMood}
                moodHistory={moodHistory}
              />
            )}
            {activeScreen === 'somaticHub' && (
              <SimulatorSomaticHub
                onNavigate={(route) => setActiveScreen(route)}
                onBack={() => setActiveScreen('dashboard')}
              />
            )}
            {activeScreen === 'cbtHub' && (
              <SimulatorCbtHub
                onNavigate={(route) => setActiveScreen(route)}
                onBack={() => setActiveScreen('dashboard')}
              />
            )}
            {activeScreen === 'safetyHub' && (
              <SimulatorSafetyHub
                onNavigate={(route) => setActiveScreen(route)}
                onBack={() => setActiveScreen('dashboard')}
              />
            )}
            {activeScreen === 'breathing' && (
              <SimulatorBreathing onBack={() => setActiveScreen('somaticHub')} />
            )}
            {activeScreen === 'grounding' && (
              <SimulatorGrounding 
                onTriggerDebug={() => setShowDebugMenu(!showDebugMenu)} 
                onBack={() => setActiveScreen('somaticHub')} 
              />
            )}
            {activeScreen === 'relief' && (
              <SimulatorRelief onBack={() => setActiveScreen('cbtHub')} />
            )}
            {activeScreen === 'emergency' && (
              <SimulatorEmergency 
                onNavigate={(route) => setActiveScreen(route)} 
                onBack={() => setActiveScreen('safetyHub')}
              />
            )}
            {activeScreen === 'history' && (
              <SimulatorHistory
                moodHistory={moodHistory}
                onNavigate={(route) => setActiveScreen(route)}
                resetMoodData={resetMoodData}
                seedRandomData={seedRandomData}
              />
            )}

            {activeScreen === 'reframing' && (
              <SimulatorReframing onBack={() => setActiveScreen('cbtHub')} />
            )}
            {activeScreen === 'habit' && (
              <SimulatorHabit onBack={() => setActiveScreen('cbtHub')} />
            )}
            {activeScreen === 'gratitude' && (
              <SimulatorGratitude onBack={() => setActiveScreen('cbtHub')} />
            )}
            {activeScreen === 'somatic' && (
              <SimulatorSomatic onBack={() => setActiveScreen('somaticHub')} />
            )}
            {activeScreen === 'safetyPlan' && (
              <SimulatorSafetyPlan onBack={() => setActiveScreen('safetyHub')} />
            )}
            {activeScreen === 'worryBox' && (
              <SimulatorWorryBox onBack={() => setActiveScreen('cbtHub')} />
            )}
            {activeScreen === 'emdr' && (
              <SimulatorEMDR onBack={() => setActiveScreen('somaticHub')} />
            )}
            {activeScreen === 'emotionWheel' && (
              <SimulatorEmotionWheel onBack={() => setActiveScreen('cbtHub')} />
            )}
            {activeScreen === 'vagusHacks' && (
              <SimulatorVagusHacks onBack={() => setActiveScreen('somaticHub')} />
            )}
            {activeScreen === 'panicSOS' && (
              <SimulatorPanicSOS onBack={() => setActiveScreen('safetyHub')} />
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

            {/* Nav: Body (Somatic) */}
            <button
              onClick={() => setActiveScreen('somaticHub')}
              className="flex flex-col items-center justify-center flex-1 py-1"
            >
              <div className={`p-1.5 px-3.5 rounded-full transition duration-300 flex items-center justify-center ${
                ['somaticHub', 'breathing', 'grounding', 'vagusHacks', 'somatic', 'emdr'].includes(activeScreen) ? 'bg-[#E1E8E3] text-[#4A6741] scale-102' : 'text-slate-400 hover:text-slate-500'
              }`}>
                <Leaf size={15} className="stroke-[2.5]" />
              </div>
              <span className={`text-[8px] font-black tracking-wide mt-1 ${
                ['somaticHub', 'breathing', 'grounding', 'vagusHacks', 'somatic', 'emdr'].includes(activeScreen) ? 'text-[#4A6741] font-bold' : 'text-slate-400'
              }`}>
                Body
              </span>
            </button>

            {/* Nav: Mind (CBT) */}
            <button
              onClick={() => setActiveScreen('cbtHub')}
              className="flex flex-col items-center justify-center flex-1 py-1"
            >
              <div className={`p-1.5 px-3.5 rounded-full transition duration-300 flex items-center justify-center ${
                ['cbtHub', 'reframing', 'worryBox', 'emotionWheel', 'relief', 'gratitude', 'habit'].includes(activeScreen) ? 'bg-[#E1E8E3] text-[#4A6741] scale-102' : 'text-slate-400 hover:text-slate-500'
              }`}>
                <Brain size={15} className="stroke-[2.5]" />
              </div>
              <span className={`text-[8px] font-black tracking-wide mt-1 ${
                ['cbtHub', 'reframing', 'worryBox', 'emotionWheel', 'relief', 'gratitude', 'habit'].includes(activeScreen) ? 'text-[#4A6741] font-bold' : 'text-slate-400'
              }`}>
                Mind
              </span>
            </button>

            {/* Nav: Safety (SOS) */}
            <button
              onClick={() => setActiveScreen('safetyHub')}
              className="flex flex-col items-center justify-center flex-1 py-1"
            >
              <div className={`p-1.5 px-3.5 rounded-full transition duration-300 flex items-center justify-center ${
                ['safetyHub', 'panicSOS', 'safetyPlan', 'emergency'].includes(activeScreen) ? 'bg-[#E1E8E3] text-[#4A6741] scale-102' : 'text-slate-400 hover:text-slate-500'
              }`}>
                <Shield size={15} className="stroke-[2.5]" />
              </div>
              <span className={`text-[8px] font-black tracking-wide mt-1 ${
                ['safetyHub', 'panicSOS', 'safetyPlan', 'emergency'].includes(activeScreen) ? 'text-[#4A6741] font-bold' : 'text-slate-400'
              }`}>
                Safety
              </span>
            </button>
          </div>

          {/* Android M3 Style Developer Bottom Sheet Overlay */}
          {showDebugMenu && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col justify-end z-50 animate-fade-in">
              {/* Back-Dismiss click area */}
              <div className="flex-1" onClick={() => setShowDebugMenu(false)} />
              
              <div className="bg-white rounded-t-[32px] p-5 shadow-2xl flex flex-col pb-8 border-t border-[#E1E8E3]/85 animate-slide-up select-none">
                {/* Grab handle */}
                <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4 animate-pulse" />
                
                <div className="text-left mb-4">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-mono">DEBUG MODE</span>
                    <span className="text-[10px] font-black tracking-widest text-[#4A6741] uppercase">Sandbox Controls</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#4A6741] mt-1 font-sans leading-none">Developer Controls</h3>
                  <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                    Instantly simulate physical tracking states or wipe database records cleanly.
                  </p>
                </div>
                
                {/* Actions Row/Grid */}
                <div className="flex flex-col space-y-2.5">
                  <button
                    onClick={() => {
                      seedRandomData();
                    }}
                    className="w-full flex items-center justify-between bg-[#E1E8E3] hover:bg-[#D1DBCF] active:scale-98 transition rounded-2xl p-3 text-left cursor-pointer border-0"
                  >
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-[#4A6741] leading-tight">
                        🎲 Seed Random 7-Day Data
                      </span>
                      <span className="text-[9px] text-slate-500 mt-0.5 font-sans leading-none">Mocks random mood & stress trends</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      resetMoodData();
                    }}
                    className="w-full flex items-center justify-between bg-red-50 hover:bg-red-100 active:scale-98 transition rounded-2xl p-3 text-left cursor-pointer border border-red-100"
                  >
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-red-600 leading-tight">
                        🗑️ Reset Tracking Data
                      </span>
                      <span className="text-[9px] text-red-400 mt-0.5 font-sans leading-none">Wipes check-ins and sets default log history</span>
                    </div>
                  </button>

                  <div className="bg-slate-50 rounded-2xl p-3 text-left border border-slate-100">
                    <span className="text-[9px] uppercase font-extrabold tracking-wider text-slate-400 leading-none block mb-1">Active State Insights</span>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500">Stress Value: <span className="font-bold text-slate-700">{stressLevel}/10</span></span>
                      <span className="text-slate-500">Today's Mood: <span className="font-bold text-[#4A6741]">{loggedMood || 'Steady (Default)'}</span></span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowDebugMenu(false)}
                  className="mt-5 w-full bg-[#4A6741] hover:bg-[#3D5535] active:scale-95 text-white text-[11px] font-black py-2.5 rounded-2xl transition cursor-pointer shadow-md leading-none border-0"
                >
                  Close Developer Panel
                </button>
              </div>
            </div>
          )}

          {/* Android Gesture Pill handle */}
          <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-slate-950/60 rounded-full z-50 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
