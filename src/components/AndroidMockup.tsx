import React, { useState, useEffect, useRef } from 'react';
import { Home, Leaf, Compass, BookOpen, Phone, Wifi, Battery, Signal, Brain, Shield, Lock, Unlock, Fingerprint, Delete } from 'lucide-react';
import { ActiveScreen, MoodLogEntry, CustomScaleConfig } from '../types';
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
import { SimulatorResources } from './ResourcesScreen';
import { SimulatorDBT } from './DbtScreen';

interface PhoneLockScreenProps {
  pin: string;
  onUnlockSuccess: () => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

const PhoneLockScreen: React.FC<PhoneLockScreenProps> = ({
  pin,
  onUnlockSuccess,
  onCancel,
  isDarkMode,
}) => {
  const [typedPin, setTypedPin] = useState<string>('');
  const [shake, setShake] = useState<boolean>(false);

  const handleKeyPress = (num: string) => {
    if (typedPin.length >= 4) return;
    const nextVal = typedPin + num;
    setTypedPin(nextVal);
    
    if (nextVal.length === 4) {
      if (nextVal === pin) {
        setTimeout(() => {
          onUnlockSuccess();
        }, 200);
      } else {
        setShake(true);
        setTimeout(() => {
          setTypedPin('');
          setShake(false);
        }, 800);
      }
    }
  };

  const handleDelete = () => {
    if (typedPin.length > 0) {
      setTypedPin(typedPin.slice(0, -1));
    }
  };

  return (
    <div className={`w-full h-full flex flex-col p-6 font-sans justify-between ${
      isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-800'
    }`}>
      {/* Upper header */}
      <div className="flex flex-col items-center pt-8 text-center select-none">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
          isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
        }`}>
          <Lock size={16} className="animate-pulse text-[#4A6741] dark:text-[#a8c69f]" />
        </div>
        <h4 className="text-[12px] font-black uppercase tracking-wider">App Lock Protected</h4>
        <p className="text-[10px] text-slate-400 max-w-[200px] leading-relaxed mt-2">
          Enter your 4-Digit App PIN to access private care records and logs.
        </p>
      </div>

      {/* Visual Dots for PIN entry */}
      <div className="flex flex-col items-center justify-center my-6 space-y-3">
        <div className={`flex justify-center space-x-4 ${shake ? 'animate-bounce' : ''}`}>
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = typedPin.length > idx;
            return (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${
                  shake 
                    ? 'bg-red-500 border-red-600' 
                    : isFilled 
                      ? isDarkMode ? 'bg-[#a8c69f] border-transparent scale-110' : 'bg-[#4A6741] border-transparent scale-110'
                      : isDarkMode ? 'bg-transparent border-slate-700' : 'bg-transparent border-slate-300'
                }`}
              />
            );
          })}
        </div>

        {shake ? (
          <p className="text-[9.5px] text-red-500 font-extrabold">
            Incorrect Unlock PIN!
          </p>
        ) : (
          <p className="text-[8.5px] text-slate-400">
            Please enter your secret code
          </p>
        )}
      </div>

      {/* Numeric PIN Pad Grid */}
      <div className="grid grid-cols-3 gap-x-6 gap-y-3 max-w-[210px] mx-auto select-none mb-6">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
          <button
            key={num}
            onClick={() => handleKeyPress(num)}
            className={`w-10 h-10 text-[13px] font-black rounded-full font-sans transition-all flex items-center justify-center cursor-pointer border-0 ${
              isDarkMode 
                ? 'bg-slate-800 text-slate-100 hover:bg-slate-700 active:scale-95' 
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:scale-95'
            }`}
          >
            {num}
          </button>
        ))}
        {/* Cancel/Back */}
        <button
          onClick={onCancel}
          className={`w-10 h-10 text-[8.5px] font-extrabold uppercase rounded-full transition-all flex items-center justify-center cursor-pointer border-0 bg-transparent ${
            isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Cancel
        </button>
        {/* 0 */}
        <button
          onClick={() => handleKeyPress('0')}
          className={`w-10 h-10 text-[13px] font-black rounded-full font-sans transition-all flex items-center justify-center cursor-pointer border-0 ${
            isDarkMode 
              ? 'bg-slate-800 text-slate-100 hover:bg-slate-750 active:scale-95' 
              : 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:scale-95'
          }`}
        >
          0
        </button>
        {/* Backspace */}
        <button
          onClick={handleDelete}
          className={`w-10 h-10 text-[10px] font-bold rounded-full transition-all flex items-center justify-center cursor-pointer border bg-transparent ${
            isDarkMode ? 'text-slate-400 border-transparent hover:text-slate-200' : 'text-slate-500 border-transparent hover:text-slate-700'
          }`}
          title="Backspace"
        >
          <Delete size={14} />
        </button>
      </div>
      
      {/* Helper Footer text */}
      <p className="text-[7.5px] text-slate-400 text-center uppercase tracking-wider select-none font-mono py-1 border-t border-slate-100/10">
        🛡️ Secure Local Access Only
      </p>
    </div>
  );
};

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
  restoreAllToDefaults: () => void;
  seedRandomData: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  developerUnlocked?: boolean;
  setDeveloperUnlocked?: React.Dispatch<React.SetStateAction<boolean>>;
  stressNotes: string;
  setStressNotes: (notes: string) => void;
  customScales?: CustomScaleConfig[];
  setCustomScales?: React.Dispatch<React.SetStateAction<CustomScaleConfig[]>>;
  todayCustomScaleValues?: Record<string, number>;
  setTodayCustomScaleValues?: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  submittedToday: boolean;
  setSubmittedToday: (val: boolean) => void;
  keyboardCustomEmoji: string | null;
  setKeyboardCustomEmoji: (val: string | null) => void;
  timeTravelNextDay?: () => void;
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
  restoreAllToDefaults,
  seedRandomData,
  isDarkMode,
  setIsDarkMode,
  developerUnlocked,
  setDeveloperUnlocked,
  stressNotes,
  setStressNotes,
  customScales = [],
  setCustomScales,
  todayCustomScaleValues = {},
  setTodayCustomScaleValues,
  submittedToday,
  setSubmittedToday,
  keyboardCustomEmoji,
  setKeyboardCustomEmoji,
  timeTravelNextDay,
}) => {
  const [timeState, setTimeState] = useState('14:05');
  const [offlinePillClicks, setOfflinePillClicks] = useState(0);

  const handleOfflinePillClick = () => {
    setOfflinePillClicks(prev => {
      const next = prev + 1;
      if (next >= 5) {
        if (setDeveloperUnlocked) {
          setDeveloperUnlocked(curr => {
            const nextState = !curr;
            localStorage.setItem('safespace_developer_unlocked', String(nextState));
            return nextState;
          });
        }
        return 0;
      }
      return next;
    });
  };

  // Lock protection & biometric states
  const [unlockRequired, setUnlockRequired] = useState<boolean>(() => {
    return localStorage.getItem('safespace_device_unlock_required') === 'true';
  });
  const [unlockPin, setUnlockPin] = useState<string>(() => {
    return localStorage.getItem('safespace_device_unlock_pin') || '1234';
  });
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  // Lock when returning to dashboard or non-guarded screens
  useEffect(() => {
    if (activeScreen === 'dashboard' || activeScreen === 'somaticHub' || activeScreen === 'cbtHub' || activeScreen === 'safetyHub') {
      setIsUnlocked(false);
    }
  }, [activeScreen]);

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
      case 'resources': return 'Resource Web Links';
      default: return 'Mental Health Toolkit';
    }
  };

  const isGuardedScreen = ['history', 'reframing', 'habit', 'gratitude', 'safetyPlan', 'worryBox'].includes(activeScreen);
  const showLockScreen = isGuardedScreen && unlockRequired && !isUnlocked;

  return (
    <div className="w-full flex flex-col select-none">
      {/* Main High-Fidelity Fluid App Container (Completely Frameless) */}
      <div className={`w-full flex flex-col relative ${isDarkMode ? 'simulator-dark-mode' : ''}`}>
        
          {/* Active View Router */}
          <div className="flex-1 w-full font-sans">
            {showLockScreen ? (
              <PhoneLockScreen
                pin={unlockPin}
                onUnlockSuccess={() => setIsUnlocked(true)}
                onCancel={() => setActiveScreen('dashboard')}
                isDarkMode={isDarkMode}
              />
            ) : (
              <>
                {activeScreen === 'dashboard' && (
                  <SimulatorDashboard
                    onNavigate={(route) => setActiveScreen(route)}
                    stressLevel={stressLevel}
                    setStressLevel={setStressLevel}
                    loggedMood={loggedMood}
                    setLoggedMood={setLoggedMood}
                    moodHistory={moodHistory}
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                    unlockRequired={unlockRequired}
                    setUnlockRequired={setUnlockRequired}
                    unlockPin={unlockPin}
                    setUnlockPin={setUnlockPin}
                    stressNotes={stressNotes}
                    setStressNotes={setStressNotes}
                    customScales={customScales}
                    setCustomScales={setCustomScales}
                    todayCustomScaleValues={todayCustomScaleValues}
                    setTodayCustomScaleValues={setTodayCustomScaleValues}
                    submittedToday={submittedToday}
                    setSubmittedToday={setSubmittedToday}
                    keyboardCustomEmoji={keyboardCustomEmoji}
                    setKeyboardCustomEmoji={setKeyboardCustomEmoji}
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
                    stressLevel={stressLevel}
                    setStressLevel={setStressLevel}
                    loggedMood={loggedMood}
                    setLoggedMood={setLoggedMood}
                    stressNotes={stressNotes}
                    setStressNotes={setStressNotes}
                    customScales={customScales}
                    setCustomScales={setCustomScales}
                    todayCustomScaleValues={todayCustomScaleValues}
                    setTodayCustomScaleValues={setTodayCustomScaleValues}
                  />
                )}

                {activeScreen === 'reframing' && (
                  <SimulatorReframing onBack={() => setActiveScreen('cbtHub')} />
                )}
                {activeScreen === 'habit' && (
                  <SimulatorHabit onBack={() => setActiveScreen('cbtHub')} />
                )}
                {activeScreen === 'gratitude' && (
                  <SimulatorGratitude onBack={() => setActiveScreen('cbtHub')} isDarkMode={isDarkMode} />
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
                {activeScreen === 'dbt' && (
                  <SimulatorDBT onBack={() => setActiveScreen('cbtHub')} />
                )}
                {activeScreen === 'resources' && (
                  <SimulatorResources onBack={() => setActiveScreen('safetyHub')} />
                )}
              </>
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
              
              <div className={`rounded-t-[32px] p-5 shadow-2xl flex flex-col pb-8 border-t animate-slide-up select-none transition-colors duration-250 ${
                isDarkMode ? 'bg-slate-900 border-slate-800/80 text-slate-100' : 'bg-white border-[#E1E8E3]/85 text-slate-800'
              }`}>
                {/* Grab handle */}
                <div className={`w-12 h-1 rounded-full mx-auto mb-4 animate-pulse ${
                  isDarkMode ? 'bg-slate-700' : 'bg-slate-200'
                }`} />
                
                <div className="text-left mb-4">
                  <div className="flex items-center space-x-1.5">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono ${
                      isDarkMode ? 'text-amber-400 bg-amber-950/40' : 'text-amber-600 bg-amber-50'
                    }`}>DEBUG MODE</span>
                    <span className={`text-[10px] font-black tracking-widest uppercase ${
                      isDarkMode ? 'text-[#a8c69f]' : 'text-[#4A6741]'
                    }`}>Sandbox Controls</span>
                  </div>
                  <h3 className={`text-sm font-bold mt-1 font-sans leading-none ${
                    isDarkMode ? 'text-[#a8c69f]' : 'text-[#4A6741]'
                  }`}>Developer Controls</h3>
                  <p className={`text-[10px] mt-1.5 leading-relaxed ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Instantly simulate physical tracking states or wipe database records cleanly.
                  </p>
                </div>
                
                {/* Actions Row/Grid */}
                <div className="flex flex-col space-y-2.5">
                  <button
                    onClick={() => {
                      seedRandomData();
                    }}
                    className={`w-full flex items-center justify-between active:scale-98 transition rounded-2xl p-3 text-left cursor-pointer border-0 ${
                      isDarkMode ? 'bg-[#4A6741]/20 hover:bg-[#4A6741]/35' : 'bg-[#E1E8E3] hover:bg-[#D1DBCF]'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className={`text-[11px] font-bold leading-tight ${
                        isDarkMode ? 'text-[#a8c69f]' : 'text-[#4A6741]'
                      }`}>
                        🎲 Seed Random 7-Day Data
                      </span>
                      <span className={`text-[9px] mt-0.5 font-sans leading-none ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>Mocks random mood & stress trends</span>
                    </div>
                  </button>

                  {timeTravelNextDay && (
                    <button
                      onClick={() => {
                        timeTravelNextDay();
                      }}
                      className={`w-full flex items-center justify-between active:scale-98 transition rounded-2xl p-3 text-left cursor-pointer border ${
                        isDarkMode 
                          ? 'bg-[#4A6741]/20 hover:bg-[#4A6741]/35 border-[#4A6741]/30' 
                          : 'bg-[#E1E8E3] hover:bg-[#D1DBCF] border-[#CBD9CC]'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className={`text-[11px] font-bold leading-tight ${
                          isDarkMode ? 'text-[#a8c69f]' : 'text-[#4A6741]'
                        }`}>
                          📅 Jump to Next Day (Time-Travel)
                        </span>
                        <span className={`text-[9px] mt-0.5 font-sans leading-none ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>Simulates a midnight rollover, resetting logs & input fields cleanly</span>
                      </div>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      resetMoodData();
                    }}
                    className={`w-full flex items-center justify-between active:scale-98 transition rounded-2xl p-3 text-left cursor-pointer border ${
                      isDarkMode 
                        ? 'bg-red-950/25 hover:bg-red-900/30 border-red-900/30' 
                        : 'bg-red-50 hover:bg-red-100 border-red-100'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className={`text-[11px] font-bold leading-tight ${
                        isDarkMode ? 'text-red-400' : 'text-red-600'
                      }`}>
                        🗑️ Reset Tracking Data
                      </span>
                      <span className={`text-[9px] mt-0.5 font-sans leading-none ${
                        isDarkMode ? 'text-red-300/60' : 'text-red-400'
                      }`}>Wipes check-ins and sets default log history</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      restoreAllToDefaults();
                    }}
                    className={`w-full flex items-center justify-between active:scale-98 transition rounded-2xl p-3 text-left cursor-pointer border ${
                      isDarkMode 
                        ? 'bg-slate-800/40 hover:bg-slate-850 border-slate-800' 
                        : 'bg-[#f8fafc] hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className={`text-[11px] font-bold leading-tight ${
                        isDarkMode ? 'text-slate-350 text-slate-200' : 'text-slate-700'
                      }`}>
                        🔄 Restore All to Defaults
                      </span>
                      <span className={`text-[9px] mt-0.5 font-sans leading-none ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>Wipes all custom logs, entries, and settings</span>
                    </div>
                  </button>

                  <div className={`rounded-2xl p-3 text-left border ${
                    isDarkMode ? 'bg-slate-800/30 border-slate-800/80' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <span className={`text-[9px] uppercase font-extrabold tracking-wider leading-none block mb-1 ${
                      isDarkMode ? 'text-slate-500' : 'text-slate-400'
                    }`}>Active State Insights</span>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Stress Value: <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{stressLevel}/10</span></span>
                      <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Today`s Mood: <span className={`font-bold ${isDarkMode ? 'text-[#a8c69f]' : 'text-[#4A6741]'}`}>{loggedMood || 'Steady (Default)'}</span></span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowDebugMenu(false)}
                  className={`mt-5 w-full active:scale-95 text-white text-[11px] font-black py-2.5 rounded-2xl transition cursor-pointer shadow-md leading-none border-0 ${
                    isDarkMode ? 'bg-[#4A6741] hover:bg-[#58794f]' : 'bg-[#4A6741] hover:bg-[#3D5535]'
                  }`}
                >
                  Close Developer Panel
                </button>
              </div>
            </div>
          )}

      </div>
    </div>
  );
};
