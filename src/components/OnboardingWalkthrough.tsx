import React, { useState } from 'react';
import { 
  Shield, 
  Activity, 
  PlusCircle, 
  Compass, 
  FileText, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Check, 
  Sparkles, 
  Download, 
  Heart, 
  Wind,
  Plus
} from 'lucide-react';

interface OnboardingWalkthroughProps {
  onClose: () => void;
  isDarkMode: boolean;
}

export const OnboardingWalkthrough: React.FC<OnboardingWalkthroughProps> = ({ onClose, isDarkMode }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Interactive slide states for high fidelity simulation
  // Slide 2: Stress Tracker
  const [demoStress, setDemoStress] = useState(6);
  // Slide 3: Custom Tracking
  const [demoTrackers, setDemoTrackers] = useState<string[]>(['Sleep Quality', 'Water Intake']);
  const [newTrackerName, setNewTrackerName] = useState('');
  // Slide 4: Core Skills
  const [demoBreatheActive, setDemoBreatheActive] = useState(false);
  const [demoBreatheSecs, setDemoBreatheSecs] = useState(4);
  const [demoBreathePhase, setDemoBreathePhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');
  const [breatheTimerId, setBreatheTimerId] = useState<NodeJS.Timeout | null>(null);
  // Slide 5: Clinician Export
  const [exportComplete, setExportComplete] = useState(false);

  const startDemoBreathe = () => {
    if (breatheTimerId) {
      clearInterval(breatheTimerId);
      setBreatheTimerId(null);
      setDemoBreatheActive(false);
      return;
    }
    
    setDemoBreatheActive(true);
    let seconds = 4;
    let phase: 'Inhale' | 'Hold' | 'Exhale' | 'Pause' = 'Inhale';
    
    setDemoBreatheSecs(4);
    setDemoBreathePhase('Inhale');

    const timer = setInterval(() => {
      seconds -= 1;
      if (seconds <= 0) {
        seconds = 4;
        if (phase === 'Inhale') phase = 'Hold';
        else if (phase === 'Hold') phase = 'Exhale';
        else if (phase === 'Exhale') phase = 'Pause';
        else phase = 'Inhale';
      }
      setDemoBreatheSecs(seconds);
      setDemoBreathePhase(phase);
    }, 1000);

    setBreatheTimerId(timer);
  };

  React.useEffect(() => {
    return () => {
      if (breatheTimerId) clearInterval(breatheTimerId);
    };
  }, [breatheTimerId]);

  const handleNext = () => {
    if (currentSlide < 4) {
      setCurrentSlide(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('safespace_has_seen_onboarding', 'true');
    // Dispatch custom event so parent can listen if needed
    window.dispatchEvent(new Event('safespace_onboarding_completed'));
    onClose();
  };

  const addDemoTracker = () => {
    const trimmed = newTrackerName.trim();
    if (trimmed && !demoTrackers.includes(trimmed)) {
      setDemoTrackers(prev => [...prev, trimmed]);
      setNewTrackerName('');
    }
  };

  const triggerMockDownload = () => {
    setExportComplete(true);
    setTimeout(() => {
      setExportComplete(false);
    }, 4000);
  };

  // Stress level color helper
  const getStressColor = (level: number) => {
    if (level <= 3) return 'from-teal-400 to-emerald-500 text-teal-800';
    if (level <= 6) return 'from-amber-400 to-orange-500 text-amber-900';
    return 'from-rose-400 to-red-500 text-rose-950';
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none`}>
      <div className={`w-full max-w-[340px] h-[550px] rounded-[36px] flex flex-col overflow-hidden border relative shadow-2xl transition-all duration-300 ${
        isDarkMode 
          ? 'bg-[#181C19] border-zinc-800 text-zinc-100' 
          : 'bg-[#FAFBF9] border-[#E1E8E3] text-slate-800'
      }`}>
        
        {/* Top Header - Skip & Title */}
        <div className="flex justify-between items-center px-6 pt-6 pb-2 shrink-0">
          <div className="flex items-center space-x-1">
            <span className="text-[9px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-[#E1E8E3] text-[#4A6741] dark:bg-[#2A3728] dark:text-[#8CB483]">
              Toolkit Guide
            </span>
          </div>
          <button 
            id="onboarding-skip-btn"
            onClick={handleComplete}
            className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 uppercase tracking-wider bg-transparent border-0 cursor-pointer p-1"
          >
            Skip
          </button>
        </div>

        {/* Dynamic Slides Container */}
        <div className="flex-1 overflow-y-auto px-6 py-2 flex flex-col justify-between scrollbar-none">
          
          {/* Slide 1: Welcome & Overview */}
          {currentSlide === 0 && (
            <div className="flex-1 flex flex-col justify-center space-y-4 animate-fade-in">
              <div className="w-14 h-14 rounded-[22px] bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto shadow-sm">
                <Shield size={28} className="stroke-[1.8]" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-black tracking-tight text-[#4A6741] dark:text-[#8CB483]">
                  Your Secure SafeSpace
                </h3>
                <p className="text-[11.5px] font-medium leading-relaxed text-slate-500 dark:text-zinc-400">
                  Welcome to a highly private mental health toolkit designed 100% offline-first. Your tracking logs, coping notes, and settings are saved completely on your local device. No servers, no sign-ups, and no cloud leaks.
                </p>
              </div>

              {/* Interactive Mock Dashboard Preview */}
              <div className="bg-slate-50 dark:bg-zinc-900/60 p-3 rounded-2xl border border-slate-100 dark:border-zinc-800/80 space-y-2 text-[10px] text-left">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-800 pb-1.5">
                  <span className="font-bold text-[#4A6741] dark:text-[#8CB483]">✓ Local Encryption Verified</span>
                  <span className="text-[8px] px-1.5 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold font-mono">100% PRIVATE</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">🧘</span>
                  <div className="flex-1">
                    <span className="font-bold block text-slate-700 dark:text-zinc-300">Daily Balance Active</span>
                    <span className="text-[8px] text-slate-400">Ready to self-soothe or track state</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Slide 2: Stress Tracker */}
          {currentSlide === 1 && (
            <div className="flex-1 flex flex-col justify-center space-y-4 animate-fade-in">
              <div className="w-14 h-14 rounded-[22px] bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto shadow-sm">
                <Activity size={28} className="stroke-[1.8]" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-black tracking-tight text-[#4A6741] dark:text-[#8CB483]">
                  Track Emotional Intensity
                </h3>
                <p className="text-[11.5px] font-medium leading-relaxed text-slate-500 dark:text-zinc-400">
                  Log your nervous system alert level from 1 (Deep Calm) to 10 (Crisis Mode). Map sudden spikes, and save custom logs to identify environmental triggers.
                </p>
              </div>

              {/* Interactive Mock Stress Tracker */}
              <div className="bg-slate-50 dark:bg-zinc-900/60 p-3.5 rounded-2xl border border-slate-100 dark:border-zinc-800/80 space-y-3 text-left">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-slate-500 dark:text-zinc-400">Interactive Demo Slider</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-gradient-to-r ${getStressColor(demoStress)}`}>
                    Level {demoStress}
                  </span>
                </div>
                
                <input 
                  type="range"
                  min={1}
                  max={10}
                  value={demoStress}
                  onChange={(e) => setDemoStress(parseInt(e.target.value, 10))}
                  className="w-full accent-[#4A6741] cursor-pointer"
                />
                
                <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>1 Calm</span>
                  <span>5 Mid</span>
                  <span>10 Crisis</span>
                </div>
              </div>
            </div>
          )}

          {/* Slide 3: Custom Tracking */}
          {currentSlide === 2 && (
            <div className="flex-1 flex flex-col justify-center space-y-4 animate-fade-in">
              <div className="w-14 h-14 rounded-[22px] bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 mx-auto shadow-sm">
                <PlusCircle size={28} className="stroke-[1.8]" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-black tracking-tight text-[#4A6741] dark:text-[#8CB483]">
                  Custom Metrics Setup
                </h3>
                <p className="text-[11.5px] font-medium leading-relaxed text-slate-500 dark:text-zinc-400">
                  No two minds are alike. Calibrate your dashboard with personalized metrics. Track factors like sleep, cognitive worry level, or water intake on standard 1-10 scales.
                </p>
              </div>

              {/* Interactive Custom Metric Creation Demo */}
              <div className="bg-slate-50 dark:bg-zinc-900/60 p-3 rounded-2xl border border-slate-100 dark:border-zinc-800/80 space-y-2.5 text-left">
                <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-widest block leading-none">Your Customized Scales</span>
                
                <div className="flex flex-wrap gap-1">
                  {demoTrackers.map(tracker => (
                    <span 
                      key={tracker}
                      className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950 border border-purple-100 dark:border-purple-900 text-purple-800 dark:text-purple-300 flex items-center gap-1"
                    >
                      ✓ {tracker}
                    </span>
                  ))}
                </div>

                <div className="flex gap-1.5">
                  <input 
                    type="text"
                    placeholder="Try adding 'Sleep Quality'..."
                    value={newTrackerName}
                    onChange={(e) => setNewTrackerName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') addDemoTracker();
                    }}
                    className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-2.5 py-1 text-[9.5px] flex-1 focus:outline-none focus:border-[#4A6741]"
                  />
                  <button 
                    onClick={addDemoTracker}
                    className="p-1 rounded-xl bg-[#4A6741] text-white hover:bg-[#3d5535] flex items-center justify-center cursor-pointer border-0 w-6 h-6"
                    title="Add Custom Tracker"
                  >
                    <Plus size={12} className="stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Slide 4: Core Skills */}
          {currentSlide === 3 && (
            <div className="flex-1 flex flex-col justify-center space-y-4 animate-fade-in">
              <div className="w-14 h-14 rounded-[22px] bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900 flex items-center justify-center text-sky-600 dark:text-sky-400 mx-auto shadow-sm">
                <Compass size={28} className="stroke-[1.8]" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-black tracking-tight text-[#4A6741] dark:text-[#8CB483]">
                  Science-Backed Coping Tools
                </h3>
                <p className="text-[11.5px] font-medium leading-relaxed text-slate-500 dark:text-zinc-400">
                  When nervous system overload sets in, bypass logical thought. Engage immediately with box breathing simulators, somatic sensory-grounding exercises, or muscle tension guides.
                </p>
              </div>

              {/* Interactive Breathing Demo */}
              <div className="bg-[#FAFBF9] dark:bg-zinc-900 border border-[#E1E8E3] dark:border-zinc-800 p-3 rounded-2xl flex items-center justify-between">
                <div className="text-left space-y-1">
                  <span className="text-[8px] font-black uppercase text-emerald-800 dark:text-emerald-400 tracking-wider">Breathing Coach</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                      {demoBreatheActive ? demoBreathePhase : 'Box Breathing'}
                    </span>
                    {demoBreatheActive && (
                      <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">{demoBreatheSecs}s</span>
                    )}
                  </div>
                </div>

                <button 
                  onClick={startDemoBreathe}
                  className={`text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border-0 cursor-pointer shadow-xs transition-all ${
                    demoBreatheActive 
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' 
                      : 'bg-emerald-50 text-[#4A6741] hover:bg-[#E1E8E3]'
                  }`}
                >
                  {demoBreatheActive ? 'Stop' : 'Try Breath'}
                </button>
              </div>
            </div>
          )}

          {/* Slide 5: Clinician Export */}
          {currentSlide === 4 && (
            <div className="flex-1 flex flex-col justify-center space-y-4 animate-fade-in">
              <div className="w-14 h-14 rounded-[22px] bg-[#FAF8F5] dark:bg-amber-950/20 border border-[#F2ECE4] dark:border-amber-900/40 flex items-center justify-center text-amber-700 dark:text-amber-400 mx-auto shadow-sm">
                <FileText size={28} className="stroke-[1.8]" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-black tracking-tight text-[#4A6741] dark:text-[#8CB483]">
                  Bridges To Clinician Care
                </h3>
                <p className="text-[11.5px] font-medium leading-relaxed text-slate-500 dark:text-zinc-400">
                  Securely compile your daily logs, stress levels, notes, and mood trends into a privacy-preserving export. Effortlessly download PDF or CSV files to share with your psychologist or therapist.
                </p>
              </div>

              {/* Interactive Report Export Simulator */}
              <div className="bg-slate-50 dark:bg-zinc-900/60 p-3.5 rounded-2xl border border-slate-100 dark:border-zinc-800/80 text-center space-y-2.5">
                {exportComplete ? (
                  <div className="space-y-1 py-1.5">
                    <span className="text-emerald-600 dark:text-emerald-400 block text-lg">🎉</span>
                    <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 block">Report Compiled!</span>
                    <p className="text-[8px] text-slate-400 leading-normal">
                      safespace_report.csv successfully exported completely offline.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[8.5px] text-slate-450 text-left leading-normal">
                      Ready to compile 7 days of local tracker details for care coordination.
                    </p>
                    <button 
                      onClick={triggerMockDownload}
                      className="w-full bg-[#4A6741] hover:bg-[#3d5535] text-white font-extrabold text-[10px] py-2 rounded-xl transition duration-200 cursor-pointer border-0 flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Download size={11} className="stroke-[2.5]" />
                      <span>Compile Offline Report</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom Indicators & Actions */}
          <div className="pt-4 border-t border-slate-100/60 dark:border-zinc-800/60 flex flex-col space-y-4 shrink-0">
            {/* Dots */}
            <div className="flex justify-center space-x-1.5">
              {[0, 1, 2, 3, 4].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer border-0 p-0 ${
                    currentSlide === idx 
                      ? 'w-4 bg-[#4A6741] dark:bg-[#8CB483]' 
                      : 'w-1.5 bg-slate-350 dark:bg-zinc-700'
                  }`}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Back & Next Controls */}
            <div className="flex justify-between gap-3 pb-2">
              <button
                onClick={handlePrev}
                disabled={currentSlide === 0}
                className={`flex-1 font-bold text-[11px] py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-1 border cursor-pointer ${
                  currentSlide === 0
                    ? 'opacity-0 pointer-events-none'
                    : isDarkMode
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ChevronLeft size={12} className="stroke-[2.5]" />
                <span>Back</span>
              </button>

              <button
                onClick={handleNext}
                className="flex-1 font-black text-[11px] py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-1 cursor-pointer border-0 bg-[#4A6741] hover:bg-[#3d5535] text-white shadow-sm"
              >
                <span>{currentSlide === 4 ? 'Get Started' : 'Next'}</span>
                <ChevronRight size={12} className="stroke-[2.5]" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
