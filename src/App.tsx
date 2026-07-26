import React, { useState, useEffect } from 'react';
import { AndroidMockup } from './components/AndroidMockup';
import { CodeViewer } from './components/CodeViewer';
import { androidProjectFiles } from './androidCode';
import { ActiveScreen, MoodLogEntry } from './types';
import { Leaf, Compass, BookOpen, Phone, Terminal, Heart, Settings, Milestone } from 'lucide-react';
import { ClinicianPortal } from './components/ClinicianPortal';
import { PwaPrompt } from './components/PwaPrompt';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Helper to calculate the Sunday date string ('YYYY-MM-DD') of the current calendar week
function getStartOfWeekDate(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
  const diff = d.getDate() - day; // subtract the day index to get Sunday
  const sunday = new Date(d.setDate(diff));
  const y = sunday.getFullYear();
  const m = String(sunday.getMonth() + 1).padStart(2, '0');
  const r = String(sunday.getDate()).padStart(2, '0');
  return `${y}-${m}-${r}`;
}

// Generates Sunday-to-Saturday structure with empty/cleared logs for all days by default
function getDefaultWeekHistory(): MoodLogEntry[] {
  return WEEKDAYS.map((day) => {
    return { day, moodValue: 0, moodLabel: 'No Data', stress: 5, hasData: false };
  });
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('dashboard');
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(5); // Defaults to DashboardScreen.kt (index 5)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('safespace_dark_mode');
    return saved === 'true';
  });
  
  // Secret Developer Mode state - hidden by default
  const [developerUnlocked, setDeveloperUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('safespace_developer_unlocked') === 'true';
  });
  const [logoClicks, setLogoClicks] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [clinicianData, setClinicianData] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'clinician') {
      return params.get('data');
    }
    return null;
  });

  // Simulated State to persist across tab switches in the phone
  const [showDebugMenu, setShowDebugMenu] = useState<boolean>(false);
  const [stressLevel, setStressLevel] = useState<number>(() => {
    const saved = localStorage.getItem('safespace_stress_level');
    return saved ? parseInt(saved, 10) : 3;
  });
  const [loggedMood, setLoggedMood] = useState<string | null>(() => {
    return localStorage.getItem('safespace_logged_mood');
  });
  const [stressNotes, setStressNotes] = useState<string>(() => {
    const savedNotes = localStorage.getItem('safespace_stress_notes');
    if (savedNotes !== null) return savedNotes;
    try {
      const savedHist = localStorage.getItem('safespace_mood_history');
      if (savedHist) {
        const parsed = JSON.parse(savedHist);
        const todayIndex = new Date().getDay();
        const todayAbbr = WEEKDAYS[todayIndex];
        const todayEntry = parsed.find((item: any) => item.day === todayAbbr);
        if (todayEntry && todayEntry.notes) return todayEntry.notes;
      }
    } catch (e) {}
    return '';
  });

  const [moodHistory, setMoodHistory] = useState<MoodLogEntry[]>(() => {
    const currentWeekSunday = getStartOfWeekDate();
    const savedWeekSunday = localStorage.getItem('safespace_current_week_sunday');
    
    // Clear the week and start over if we have entered a brand-new week
    if (savedWeekSunday && savedWeekSunday !== currentWeekSunday) {
      localStorage.setItem('safespace_current_week_sunday', currentWeekSunday);
      const clean = getDefaultWeekHistory();
      localStorage.setItem('safespace_mood_history', JSON.stringify(clean));
      localStorage.removeItem('safespace_logged_mood');
      localStorage.setItem('safespace_stress_level', '5');
      return clean;
    }

    const saved = localStorage.getItem('safespace_mood_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length === 7) {
          // Align and map any loaded entries (or legacy schema blocks) to standard Sun-to-Sat week
          const todayIndex = new Date().getDay();
          const todayAbbr = WEEKDAYS[todayIndex];
          const aligned = WEEKDAYS.map(dayName => {
            const matched = parsed.find((item: any) => 
              item.day === dayName || 
              (item.day === 'Today' && dayName === todayAbbr)
            );
            if (matched) {
              return { ...matched, day: dayName };
            }
            return { day: dayName, moodValue: 0, moodLabel: 'No Data', stress: 5, hasData: false };
          });
          return aligned;
        }
      } catch (e) {
        // Fallback below
      }
    }
    
    // Default initial save
    localStorage.setItem('safespace_current_week_sunday', currentWeekSunday);
    const clean = getDefaultWeekHistory();
    localStorage.setItem('safespace_mood_history', JSON.stringify(clean));
    return clean;
  });

  const resetMoodData = () => {
    setLoggedMood(null);
    setStressLevel(5);
    const clean = getDefaultWeekHistory();
    setMoodHistory(clean);
  };

  const restoreAllToDefaults = () => {
    localStorage.clear();
    setLoggedMood(null);
    setStressLevel(3);
    const clean = getDefaultWeekHistory();
    setMoodHistory(clean);
    window.location.reload();
  };

  const seedRandomData = () => {
    const todayIndex = new Date().getDay();
    const availableEmojis = ['🍃', '🌊', '⛈️', '😰', '🧘', '🪴', '🍵', '✨', '☕'];
    const randomHistory = WEEKDAYS.map((day, idx) => {
      // Seed values for Sunday through Today of the current week only (future remains empty)
      if (idx <= todayIndex) {
        const hasData = Math.random() > 0.2; // 80% logged
        if (!hasData) {
          return {
            day,
            moodValue: 0,
            moodLabel: 'No Data',
            stress: 5,
            hasData: false,
          };
        }
        const emoji = availableEmojis[Math.floor(Math.random() * availableEmojis.length)];
        const stress = Math.floor(Math.random() * 8) + 1; // 1 to 8
        return {
          day,
          moodValue: 1,
          moodLabel: emoji,
          stress,
          hasData: true,
        };
      } else {
        return {
          day,
          moodValue: 0,
          moodLabel: 'No Data',
          stress: 5,
          hasData: false,
        };
      }
    });

    const todayVal = randomHistory[todayIndex];
    if (todayVal.hasData) {
      localStorage.setItem('safespace_logged_mood', todayVal.moodLabel);
      localStorage.setItem('safespace_stress_level', todayVal.stress.toString());
    } else {
      localStorage.removeItem('safespace_logged_mood');
      localStorage.setItem('safespace_stress_level', '3');
    }
    localStorage.setItem('safespace_mood_history', JSON.stringify(randomHistory));

    // Seed monthly simulation logs as well
    const mockMonthly: Record<string, { moodValue: number; moodLabel: string; stress: number; hasData: boolean }> = {};
    const seedForMonth = (monthStr: string, totalDays: number, monthNum: number) => {
      for (let day = 1; day <= totalDays; day++) {
        const dateKey = `2026-${monthStr}-${day.toString().padStart(2, '0')}`;
        const pseudoRandom = Math.sin(day * 13 + monthNum * 37) * 10000;
        const val = pseudoRandom - Math.floor(pseudoRandom);
        const hasData = val > 0.35; // ~65% check-in
        
        if (hasData) {
          const stress = Math.floor((val * 99) % 8) + 1; // 1 to 8
          let emoji = '🍃';
          if (stress <= 3) emoji = '🍃';
          else if (stress <= 5) emoji = '🌊';
          else if (stress <= 7) emoji = '⛈️';
          else emoji = '😰';

          mockMonthly[dateKey] = {
            moodValue: 1,
            moodLabel: emoji,
            stress,
            hasData: true
          };
        } else {
          mockMonthly[dateKey] = {
            moodValue: 0,
            moodLabel: 'No Data',
            stress: 5,
            hasData: false
          };
        }
      }
    };
    seedForMonth('04', 30, 4); // April
    seedForMonth('05', 31, 5); // May
    seedForMonth('06', 30, 6); // June
    localStorage.setItem('safespace_monthly_data', JSON.stringify(mockMonthly));

    window.location.reload();
  };

  // Verify week rollover state on mount
  useEffect(() => {
    const currentWeekSunday = getStartOfWeekDate();
    const savedWeekSunday = localStorage.getItem('safespace_current_week_sunday');
    if (savedWeekSunday !== currentWeekSunday) {
      localStorage.setItem('safespace_current_week_sunday', currentWeekSunday);
      const clean = getDefaultWeekHistory();
      setMoodHistory(clean);
      setLoggedMood(null);
      setStressLevel(5);
      setStressNotes('');
      localStorage.removeItem('safespace_stress_notes');
    }
  }, []);

  // Persist stressNotes to local storage on change
  useEffect(() => {
    localStorage.setItem('safespace_stress_notes', stressNotes);
  }, [stressNotes]);

  // Persist stressLevel to local storage on change
  useEffect(() => {
    localStorage.setItem('safespace_stress_level', stressLevel.toString());
  }, [stressLevel]);

  // Persist loggedMood to local storage on change
  useEffect(() => {
    if (loggedMood !== null) {
      localStorage.setItem('safespace_logged_mood', loggedMood);
    } else {
      localStorage.removeItem('safespace_logged_mood');
    }
  }, [loggedMood]);

  // Persist moodHistory to local storage on change
  useEffect(() => {
    localStorage.setItem('safespace_mood_history', JSON.stringify(moodHistory));
  }, [moodHistory]);

  // Persist isDarkMode to local storage on change
  useEffect(() => {
    localStorage.setItem('safespace_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  // Automatically clear toast message after 3.5 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleLogoClick = () => {
    setLogoClicks(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setDeveloperUnlocked(curr => {
          const nextState = !curr;
          localStorage.setItem('safespace_developer_unlocked', String(nextState));
          if (nextState) {
            setToastMessage("Secure Sandbox Environment Activated 🔐");
          } else {
            setToastMessage("Private Environment Active 🍃");
          }
          return nextState;
        });
        return 0;
      }
      return next;
    });
  };

  // Sync today's active values directly from loggedMood, stressLevel, and stressNotes
  useEffect(() => {
    const todayIndex = new Date().getDay();
    const todayAbbr = WEEKDAYS[todayIndex];
    
    setMoodHistory(prev => {
      const todayEntry = prev.find(entry => entry.day === todayAbbr);
      const hasData = loggedMood !== null || stressNotes !== '';
      const targetMoodLabel = loggedMood || 'No Data';
      const targetStress = (loggedMood !== null || stressNotes !== '') ? stressLevel : 5;
      const targetMoodValue = loggedMood !== null ? 1 : 0;
      const targetNotes = stressNotes;
      
      if (todayEntry && 
          todayEntry.hasData === hasData && 
          todayEntry.moodLabel === targetMoodLabel && 
          todayEntry.stress === targetStress &&
          todayEntry.moodValue === targetMoodValue &&
          todayEntry.notes === targetNotes) {
        return prev; // Performance optimization: skip state update if data matches perfectly
      }
      
      return prev.map(entry => {
        if (entry.day === todayAbbr) {
          return {
            ...entry,
            hasData,
            moodValue: targetMoodValue,
            moodLabel: targetMoodLabel,
            stress: targetStress,
            notes: targetNotes
          };
        }
        return entry;
      });
    });
  }, [loggedMood, stressLevel, stressNotes]);

  // Sync simulator screens to active Kotlin Files
  useEffect(() => {
    switch (activeScreen) {
      case 'dashboard':
      case 'somaticHub':
        setSelectedFileIndex(18); // SomaticHubScreen.kt
        break;
      case 'cbtHub':
        setSelectedFileIndex(19); // CbtHubScreen.kt
        break;
      case 'safetyHub':
        setSelectedFileIndex(20); // SafetyHubScreen.kt
        break;
      case 'breathing':
        setSelectedFileIndex(3); // GuidedBreathingScreen.kt
        break;
      case 'grounding':
        setSelectedFileIndex(4); // GroundingExerciseScreen.kt
        break;
      case 'relief':
        setSelectedFileIndex(7); // CopingReliefScreen.kt
        break;
      case 'emergency':
        setSelectedFileIndex(6); // EmergencyContactsScreen.kt
        break;
      case 'reframing':
        setSelectedFileIndex(8); // ThoughtReframerScreen.kt
        break;
      case 'habit':
        setSelectedFileIndex(9); // NeuroVitalsScreen.kt
        break;
      case 'gratitude':
        setSelectedFileIndex(10); // GratitudeJarScreen.kt
        break;
      case 'somatic':
        setSelectedFileIndex(11); // SomaticRelaxationScreen.kt
        break;
      case 'safetyPlan':
        setSelectedFileIndex(12); // StanleyBrownSafetyPlan.kt
        break;
      case 'worryBox':
        setSelectedFileIndex(13); // WorryLockboxScreen.kt
        break;
      case 'emdr':
        setSelectedFileIndex(14); // EmdrPacerScreen.kt
        break;
      case 'emotionWheel':
        setSelectedFileIndex(15); // EmotionWheelScreen.kt
        break;
      case 'vagusHacks':
        setSelectedFileIndex(16); // VagusResetScreen.kt
        break;
      case 'panicSOS':
        setSelectedFileIndex(17); // PanicRescueScreen.kt
        break;
      case 'resources':
        setSelectedFileIndex(21); // SimpleResourcesScreen.kt
        break;
      default:
        setSelectedFileIndex(5); // DashboardScreen.kt
        break;
    }
  }, [activeScreen]);

  // Derive recommended file index for status highlight
  const getRecommendedFileIndex = (): number => {
    switch (activeScreen) {
      case 'dashboard': return 5;
      case 'somaticHub': return 18;
      case 'cbtHub': return 19;
      case 'safetyHub': return 20;
      case 'breathing': return 3;
      case 'grounding': return 4;
      case 'relief': return 7;
      case 'emergency': return 6;
      case 'reframing': return 8;
      case 'habit': return 9;
      case 'gratitude': return 10;
      case 'somatic': return 11;
      case 'safetyPlan': return 12;
      case 'worryBox': return 13;
      case 'emdr': return 14;
      case 'emotionWheel': return 15;
      case 'vagusHacks': return 16;
      case 'panicSOS': return 17;
      case 'resources': return 21;
      default: return 5;
    }
  };

  const recommendedFileIndex = getRecommendedFileIndex();

  if (clinicianData) {
    return (
      <ClinicianPortal 
        dataString={clinicianData} 
        onExit={() => {
          const newUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
          setClinicianData(null);
        }} 
      />
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#0f1411] text-slate-100 selection:bg-[#2e4432] selection:text-[#a8c69f]' : 'bg-[#F1F5F2] text-slate-800 selection:bg-[#E1E8E3] selection:text-[#4A6741]'}`}>
      
      {/* Decorative Blur Orbs */}
      <div className={`absolute top-10 left-10 w-72 h-72 rounded-full blur-[100px] pointer-events-none select-none z-0 transition-colors duration-300 ${isDarkMode ? 'bg-[#38563a]/25' : 'bg-[#A8C69F]/35'}`} />
      <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-[120px] pointer-events-none select-none z-0 transition-colors duration-300 ${isDarkMode ? 'bg-[#2e4432]/15' : 'bg-[#608271]/20'}`} />

      {/* Header Bar */}
      <header className={`w-full sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${isDarkMode ? 'bg-[#151c17]/80 border-slate-800/80 text-white' : 'bg-white/60 border-[#E1E8E3]/80'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand (Secret tap combo to toggle developer workspace) */}
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-3 text-left bg-transparent border-0 p-0 focus:outline-none cursor-pointer active:scale-98 transition-transform select-none"
            title="Mental Health Companion"
          >
            <div className={`p-2.5 rounded-2xl shadow-sm flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-[#38563a] text-[#a8c69f]' : 'bg-[#4A6741] text-white'}`}>
              <Leaf size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className={`text-lg font-black tracking-tight leading-none font-sans transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Mental Health Toolkit</h1>
              <span className={`text-[10px] uppercase font-extrabold tracking-widest block mt-1 transition-colors duration-300 ${
                developerUnlocked 
                  ? 'text-amber-500 animate-pulse' 
                  : (isDarkMode ? 'text-[#a8c69f]' : 'text-[#4A6741]')
              }`}>
                {developerUnlocked ? '🛠️ Developer Workspace' : '🍃 Interactive Coping Companion'}
              </span>
            </div>
          </button>

          {/* Quick Stats / Info Row */}
          <div className="flex items-center space-x-4 sm:space-x-6 text-[10px] font-mono shrink-0 select-none">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`flex items-center justify-center w-8 h-8 active:scale-95 transition rounded-2xl border cursor-pointer ${
                isDarkMode 
                  ? 'text-slate-100 bg-[#253229]/80 hover:bg-[#253229] border-emerald-950/60 shadow-md' 
                  : 'text-slate-600 bg-[#E1E8E3]/60 hover:bg-[#E1E8E3] border-white/40'
              }`}
              title="Toggle Dark Mode"
            >
              <span>{isDarkMode ? '☀️' : '🌙'}</span>
            </button>
            {developerUnlocked && (
              <>
                <button 
                  onClick={() => setShowDebugMenu(!showDebugMenu)}
                  className={`flex items-center space-x-1.5 active:scale-95 transition px-3 py-1.5 rounded-2xl border cursor-pointer ${
                    isDarkMode 
                      ? 'text-slate-100 bg-[#253229]/80 hover:bg-[#253229] border-emerald-950/60 shadow-md' 
                      : 'text-slate-600 bg-[#E1E8E3]/60 hover:bg-[#E1E8E3] border-white/40'
                  }`}
                  title="Click to open Developer Sandbox debug menu"
                >
                  <Milestone size={13} className={isDarkMode ? 'text-[#a8c69f]' : 'text-[#4A6741]'} />
                  <span>Compose 2.0 (Compiler plugin) ⚙️</span>
                </button>
                <button 
                  onClick={() => setShowDebugMenu(!showDebugMenu)}
                  className={`flex items-center space-x-1.5 active:scale-95 transition px-3 py-1.5 rounded-2xl border cursor-pointer ${
                    isDarkMode 
                      ? 'text-slate-100 bg-[#253229]/80 hover:bg-[#253229] border-emerald-950/60 shadow-md' 
                      : 'text-slate-600 bg-[#E1E8E3]/60 hover:bg-[#E1E8E3] border-white/40'
                  }`}
                  title="Click to open Developer Sandbox debug menu"
                >
                  <Settings size={13} className={isDarkMode ? 'text-[#a8c69f]' : 'text-[#608271]'} />
                  <span>Offline M3 UI Architecture</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Container Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col space-y-8 z-10">
        
        {/* Dynamic Studio banner */}
        {developerUnlocked && (
          <section className={`backdrop-blur-md rounded-[32px] p-6 lg:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] text-left flex flex-col md:flex-row items-center md:justify-between gap-6 transition-all duration-300 border ${
            isDarkMode 
              ? 'bg-[#151c17]/60 border-slate-800/50 text-slate-100' 
              : 'bg-white/60 border-white/50'
          }`}>
            <div className="max-w-2xl">
              <h2 className={`text-2xl md:text-3xl font-black tracking-tight font-sans transition-colors duration-300 ${
                isDarkMode ? 'text-[#a8c69f]' : 'text-[#4A6741]'
              }`}>Android Kotlin Prototype & Generator</h2>
              <p className={`text-sm mt-2 leading-relaxed transition-colors duration-300 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-500'
              }`}>
                Experience the interactive web-based mental health companion, and instantly grab the fully production-ready, modular <strong>Jetpack Compose</strong> code elements matching the active view. Ideal for rapid offline android app developments.
              </p>
            </div>

            <div className={`flex shrink-0 items-center space-x-2.5 text-white text-[11px] font-bold px-4.5 py-3 rounded-2xl shadow-sm transition-colors duration-300 ${
              isDarkMode ? 'bg-[#38563a]' : 'bg-[#4A6741]'
            }`}>
              <Heart size={16} fill="currentColor" className="text-white" />
              <span>Responsive & Offline-First Kit</span>
            </div>
          </section>
        )}

        {/* Double-Pane View Section vs Centered View Section */}
        {developerUnlocked ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Fluid Interactive Care Companion */}
            <div className="lg:col-span-6 xl:col-span-5 w-full">
              <div className="sticky top-24">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3 text-center lg:text-left">
                  🍃 Interactive Care Companion
                </span>
                <AndroidMockup
                  activeScreen={activeScreen}
                  setActiveScreen={setActiveScreen}
                  stressLevel={stressLevel}
                  setStressLevel={setStressLevel}
                  loggedMood={loggedMood}
                  setLoggedMood={setLoggedMood}
                  moodHistory={moodHistory}
                  showDebugMenu={showDebugMenu}
                  setShowDebugMenu={setShowDebugMenu}
                  resetMoodData={resetMoodData}
                  restoreAllToDefaults={restoreAllToDefaults}
                  seedRandomData={seedRandomData}
                  isDarkMode={isDarkMode}
                  setIsDarkMode={setIsDarkMode}
                  developerUnlocked={developerUnlocked}
                  setDeveloperUnlocked={setDeveloperUnlocked}
                  stressNotes={stressNotes}
                  setStressNotes={setStressNotes}
                />
              </div>
            </div>

            {/* RIGHT COLUMN: Android Studio Developer Suite */}
            <div className="lg:col-span-6 xl:col-span-7 w-full flex flex-col space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3 text-left">
                  💻 Android Studio Code Workspace
                </span>
                <CodeViewer
                  files={androidProjectFiles}
                  selectedFileIndex={selectedFileIndex}
                  setSelectedFileIndex={setSelectedFileIndex}
                  recommendedFileIndex={recommendedFileIndex}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-full relative z-10">
              <AndroidMockup
                activeScreen={activeScreen}
                setActiveScreen={setActiveScreen}
                stressLevel={stressLevel}
                setStressLevel={setStressLevel}
                loggedMood={loggedMood}
                setLoggedMood={setLoggedMood}
                moodHistory={moodHistory}
                showDebugMenu={showDebugMenu}
                setShowDebugMenu={setShowDebugMenu}
                resetMoodData={resetMoodData}
                restoreAllToDefaults={restoreAllToDefaults}
                seedRandomData={seedRandomData}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                developerUnlocked={developerUnlocked}
                setDeveloperUnlocked={setDeveloperUnlocked}
                stressNotes={stressNotes}
                setStressNotes={setStressNotes}
              />
            </div>
            
            {/* Elegant secret hint for users */}
            <p 
              onClick={handleLogoClick}
              className={`text-[10.5px] mt-8 select-none font-mono tracking-wide hover:opacity-100 transition-all duration-300 cursor-pointer text-center px-4 py-1.5 rounded-full border shadow-xs ${
                isDarkMode 
                  ? 'text-slate-400 hover:text-[#a8c69f] border-slate-800 bg-[#151c17]/30' 
                  : 'text-slate-500 hover:text-[#4A6741] border-[#E1E8E3] bg-white/40'
              }`}
            >
              🔒 Safe & Private Space
            </p>
          </div>
        )}

        {/* Bottom Architectural Guide Cards */}
        {developerUnlocked && (
          <section className="bg-slate-900 text-slate-100 rounded-[32px] p-6 lg:p-8 border border-slate-800 shadow-xl text-left">
            <div className="flex items-center space-x-2.5 mb-5">
              <Terminal className="text-emerald-400 shrink-0" size={20} />
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Architectural Specifications</span>
            </div>

            <h3 className="text-xl font-bold tracking-tight text-white mb-2">Modern Android Architectural Best Practices</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6 max-w-3xl">
              This module has been architecturalized using Google's official <strong>Guide to App Architecture</strong>. Here’s how these components translate cleanly to clean enterprise-grade applications.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1.5">Unidirectional Data Flow</span>
                <h4 className="text-sm font-bold text-white mb-2">StateFlow & MVVM</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Kotlin's StateFlow inside ViewModel holds UI state observables. It ensures that standard configurations or orientation changes never destroy transient inputs like active breathing cycles or grounding counts.
                </p>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1.5">Declarative UI</span>
                <h4 className="text-sm font-bold text-white mb-2">Material Design 3 Compose</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Material 3 utilizes standard token systems (surfaceVariant, primaryContainer) and animations (`animateFloatAsState`, `tween`) to build smooth, hardware-accelerated breathing rings and dynamic step trackers with zero XML clutter.
                </p>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1.5">Local Persistence</span>
                <h4 className="text-sm font-bold text-white mb-2">SharedPreferences & DataStore</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Critical tools like Personal Support Contacts reside directly on the device using basic Context-level SharedPreferences. This guarantees immediate startup and dials, even without network availability.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Floating Elegant Toast System */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-50 max-w-sm animate-bounce">
          <div className={`rounded-2xl p-4 shadow-2xl border flex items-center space-x-3 transition-all duration-300 ${
            isDarkMode 
              ? 'bg-[#151c17] border-emerald-900/60 text-slate-100' 
              : 'bg-white border-[#E1E8E3] text-slate-800'
          }`}>
            <div className={`p-1.5 rounded-xl ${isDarkMode ? 'bg-[#38563a] text-emerald-400' : 'bg-[#e8f2e9] text-[#4A6741]'}`}>
              <Leaf size={16} />
            </div>
            <p className="text-xs font-black tracking-wide leading-normal pr-1">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* PWA Prompt / Guide Modal System */}
      <PwaPrompt isDarkMode={isDarkMode} />

      {/* Footer credit blocks */}
      <footer className={`py-6 text-center border-t select-none text-[11px] mt-12 z-10 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-slate-900/40 border-slate-800/60 text-slate-400' 
          : 'bg-[#E1E8E3]/20 border-[#E1E8E3]/60 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© 2026 Mental Health Toolkit — Made with ❤️ for Jetpack Compose & Android developers.</p>
          <div className="flex space-x-4 text-slate-400 font-medium font-mono">
            <span className={isDarkMode ? 'hover:text-slate-200 cursor-pointer' : 'hover:text-slate-600 cursor-pointer'}>Offline Safe</span>
            <span>•</span>
            <span className={isDarkMode ? 'hover:text-slate-200 cursor-pointer' : 'hover:text-slate-600 cursor-pointer'}>Material You M3</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
