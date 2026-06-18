import React, { useState, useEffect } from 'react';
import { AndroidMockup } from './components/AndroidMockup';
import { CodeViewer } from './components/CodeViewer';
import { androidProjectFiles } from './androidCode';
import { ActiveScreen, MoodLogEntry } from './types';
import { Leaf, Compass, BookOpen, Phone, Terminal, Heart, Settings, Milestone } from 'lucide-react';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('dashboard');
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(5); // Defaults to DashboardScreen.kt (index 5)
  
  // Simulated State to persist across tab switches in the phone
  const [showDebugMenu, setShowDebugMenu] = useState<boolean>(false);
  const [stressLevel, setStressLevel] = useState<number>(() => {
    const saved = localStorage.getItem('safespace_stress_level');
    return saved ? parseInt(saved, 10) : 3;
  });
  const [loggedMood, setLoggedMood] = useState<string | null>(() => {
    return localStorage.getItem('safespace_logged_mood');
  });

  const [moodHistory, setMoodHistory] = useState<MoodLogEntry[]>(() => {
    const saved = localStorage.getItem('safespace_mood_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback to defaults
      }
    }
    return [
      { day: 'Mon', moodValue: 1, moodLabel: '🌊', stress: 4, hasData: true },
      { day: 'Tue', moodValue: 1, moodLabel: '⛈️', stress: 6, hasData: true },
      { day: 'Wed', moodValue: 0, moodLabel: 'No Data', stress: 5, hasData: false },
      { day: 'Thu', moodValue: 1, moodLabel: '🍃', stress: 3, hasData: true },
      { day: 'Fri', moodValue: 0, moodLabel: 'No Data', stress: 5, hasData: false },
      { day: 'Sat', moodValue: 1, moodLabel: '🌊', stress: 4, hasData: true },
      { day: 'Today', moodValue: 0, moodLabel: 'No Data', stress: 5, hasData: false },
    ];
  });

  const resetMoodData = () => {
    setLoggedMood(null);
    setStressLevel(5);
    const defaults = [
      { day: 'Mon', moodValue: 1, moodLabel: '🌊', stress: 3, hasData: true },
      { day: 'Tue', moodValue: 0, moodLabel: 'No Data', stress: 5, hasData: false },
      { day: 'Wed', moodValue: 1, moodLabel: '🌊', stress: 3, hasData: true },
      { day: 'Thu', moodValue: 0, moodLabel: 'No Data', stress: 5, hasData: false },
      { day: 'Fri', moodValue: 1, moodLabel: '🌊', stress: 3, hasData: true },
      { day: 'Sat', moodValue: 0, moodLabel: 'No Data', stress: 5, hasData: false },
      { day: 'Today', moodValue: 0, moodLabel: 'No Data', stress: 5, hasData: false },
    ];
    setMoodHistory(defaults);
  };

  const seedRandomData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
    const availableEmojis = ['🍃', '🌊', '⛈️', '😰', '🧘', '🪴', '🍵', '✨', '☕'];
    const randomHistory = days.map((day) => {
      const hasData = Math.random() > 0.3; // 70% data, 30% no data
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
      const stress = Math.floor(Math.random() * 10) + 1; // 1 to 10
      return {
        day,
        moodValue: 1,
        moodLabel: emoji,
        stress,
        hasData: true,
      };
    });

    const todayVal = randomHistory[6];
    if (todayVal.hasData) {
      setLoggedMood(todayVal.moodLabel);
      setStressLevel(todayVal.stress);
    } else {
      setLoggedMood(null);
      setStressLevel(5);
    }
    setMoodHistory(randomHistory);
  };

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

  // Sync today's active values directly from loggedMood & stressLevel
  useEffect(() => {
    setMoodHistory(prev => prev.map(entry => {
      if (entry.day === 'Today') {
        const hasData = loggedMood !== null;
        return {
          ...entry,
          hasData,
          moodValue: hasData ? 1 : 0,
          moodLabel: loggedMood || 'No Data',
          stress: hasData ? stressLevel : 5
        };
      }
      return entry;
    }));
  }, [loggedMood, stressLevel]);

  // Sync simulator screens to active Kotlin Files
  useEffect(() => {
    switch (activeScreen) {
      case 'dashboard':
      case 'somaticHub':
      case 'cbtHub':
      case 'safetyHub':
        setSelectedFileIndex(5); // DashboardScreen.kt
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

    }
  }, [activeScreen]);

  // Derive recommended file index for status highlight
  const getRecommendedFileIndex = (): number => {
    switch (activeScreen) {
      case 'dashboard':
      case 'somaticHub':
      case 'cbtHub':
      case 'safetyHub':
        return 5;
      case 'breathing': return 3;
      case 'grounding': return 4;
      case 'relief': return 7;
      case 'emergency': return 6;
      case 'reframing': return 8;
      case 'habit': return 9;
      case 'gratitude': return 10;
      case 'somatic': return 11;
      case 'safetyPlan': return 12;

      default: return 5;
    }
  };

  const recommendedFileIndex = getRecommendedFileIndex();

  return (
    <div className="min-h-screen bg-[#F1F5F2] text-slate-800 flex flex-col font-sans selection:bg-[#E1E8E3] selection:text-[#4A6741]">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#A8C69F]/35 blur-[100px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#608271]/20 blur-[120px] pointer-events-none select-none z-0" />

      {/* Header Bar */}
      <header className="w-full bg-white/60 backdrop-blur-md border-b border-[#E1E8E3]/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center space-x-3 text-left">
            <div className="bg-[#4A6741] text-white p-2.5 rounded-2xl shadow-sm flex items-center justify-center">
              <Leaf size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none font-sans">Safe Space Studio</h1>
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#4A6741] block mt-1">Jetpack Compose Kotlin Prototype</span>
            </div>
          </div>

          {/* Quick Stats / Info Row */}
          <div className="flex items-center space-x-6 text-[10px] font-mono shrink-0 select-none">
            <button 
              onClick={() => setShowDebugMenu(!showDebugMenu)}
              className="flex items-center space-x-1.5 text-slate-600 bg-[#E1E8E3]/60 hover:bg-[#E1E8E3] active:scale-95 transition px-3 py-1.5 rounded-2xl border border-white/40 cursor-pointer"
              title="Click to open Developer Sandbox debug menu"
            >
              <Milestone size={13} className="text-[#4A6741]" />
              <span>Compose 2.0 (Compiler plugin) ⚙️</span>
            </button>
            <button 
              onClick={() => setShowDebugMenu(!showDebugMenu)}
              className="flex items-center space-x-1.5 text-slate-600 bg-[#E1E8E3]/60 hover:bg-[#E1E8E3] active:scale-95 transition px-3 py-1.5 rounded-2xl border border-white/40 cursor-pointer"
              title="Click to open Developer Sandbox debug menu"
            >
              <Settings size={13} className="text-[#608271]" />
              <span>Offline M3 UI Architecture</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col space-y-8 z-10">
        
        {/* Dynamic Studio banner */}
        <section className="bg-white/60 backdrop-blur-md rounded-[32px] p-6 lg:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-white/50 text-left flex flex-col md:flex-row items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-black text-[#4A6741] tracking-tight font-sans">Android Kotlin Prototype & Generator</h2>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              Experience the interactive web-based mental health companion in the simulated phone, and instantly grab the fully production-ready, modular <strong>Jetpack Compose</strong> code elements matching the active view. Ideal for rapid offline android app developments.
            </p>
          </div>

          <div className="flex shrink-0 items-center space-x-2.5 bg-[#4A6741] text-white text-[11px] font-bold px-4.5 py-3 rounded-2xl shadow-sm">
            <Heart size={16} fill="currentColor" className="text-white" />
            <span>Responsive & Offline-First Kit</span>
          </div>
        </section>

        {/* Double-Pane View Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Simulated Android Phone (4 columns on lg, 5 on xl) */}
          <div className="lg:col-span-5 xl:col-span-4 w-full">
            <div className="sticky top-24">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3 text-center lg:text-left">
                📱 Interactive Device Simulator
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
                seedRandomData={seedRandomData}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Android Studio Developer Suite (7 columns on lg, 8 on xl) */}
          <div className="lg:col-span-7 xl:col-span-8 w-full flex flex-col space-y-4">
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

        {/* Bottom Architectural Guide Cards */}
        <section className="bg-slate-900 text-slate-100 rounded-[32px] p-6 lg:p-8 border border-slate-800 shadow-xl text-left">
          <div className="flex items-center space-x-2.5 mb-5 mb-5">
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
      </main>

      {/* Footer credit blocks */}
      <footer className="bg-[#E1E8E3]/20 py-6 text-center border-t border-[#E1E8E3]/60 select-none text-[11px] text-slate-500 mt-12 z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© 2026 Mental Health First Aid — Made with ❤️ for Jetpack Compose & Android developers.</p>
          <div className="flex space-x-4 text-slate-400 font-medium">
            <span className="hover:text-slate-600 cursor-pointer">Offline Safe</span>
            <span>•</span>
            <span className="hover:text-slate-600 cursor-pointer">Material You M3</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
