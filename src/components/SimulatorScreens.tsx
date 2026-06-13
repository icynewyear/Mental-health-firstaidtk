import React, { useState, useEffect, useRef } from 'react';
import { Leaf, Compass, BookOpen, Phone, ArrowLeft, ArrowRight, Heart, Save, Plus, Trash2, CheckCircle2, Smartphone, Zap, Music, CloudRain, Waves, Volume2, VolumeX } from 'lucide-react';
import { ActiveScreen, BreathingType, CopingStatement, GroundingStep } from '../types';
import { startAmbientSound, stopAmbientSound, setAmbientVolume } from '../utils/audioSynth';

// ============================================================================
// 1. DASHBOARD SCREEN
// ============================================================================
interface DashboardProps {
  onNavigate: (route: ActiveScreen) => void;
  stressLevel: number;
  setStressLevel: (level: number) => void;
  loggedMood: string | null;
  setLoggedMood: (mood: string | null) => void;
}

export const SimulatorDashboard: React.FC<DashboardProps> = ({
  onNavigate,
  stressLevel,
  setStressLevel,
  loggedMood,
  setLoggedMood,
}) => {
  const moods = [
    { emoji: '🍃', label: 'Calm', bg: 'bg-[#E1E8E3] text-[#4A6741]' },
    { emoji: '🌊', label: 'Steady', bg: 'bg-[#A8C69F]/40 text-[#4A6741]' },
    { emoji: '⛈️', label: 'Anxious', bg: 'bg-[#FAF2E8] text-[#D9534F]' },
    { emoji: '🚨', label: 'Panic', bg: 'bg-[#FDF1F0] text-[#D9534F]' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F1F5F2] p-5 overflow-y-auto">
      {/* Greeting */}
      <div className="text-left mt-4 mb-5">
        <span className="text-[10px] font-bold text-[#4A6741] uppercase tracking-widest bg-[#E1E8E3] px-2 py-0.5 rounded">OFFLINE FIRST</span>
        <h2 className="text-2xl font-bold text-[#4A6741] tracking-tight mt-1.5 font-sans">Safe Space</h2>
        <p className="text-xs text-slate-500 mt-1">Take a moment. You are safe, and you are here.</p>
      </div>

      {/* Mood Check-In Widget */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 shadow-sm border border-white/60 flex flex-col mb-4">
        <span className="text-[10px] font-bold text-slate-400 text-left uppercase tracking-wider mb-1.5">Daily Check-In</span>
        <span className="text-xs font-semibold text-[#4A6741] text-left mb-3">How is your nervous system feeling?</span>
        
        <div className="grid grid-cols-4 gap-1.5 mb-2.5">
          {moods.map((m) => (
            <button
              key={m.label}
              onClick={() => setLoggedMood(m.label)}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl transition hover:scale-105 active:scale-95 ${
                loggedMood === m.label
                  ? `${m.bg} border-2 border-current font-bold`
                  : 'bg-white/50 text-slate-600 border border-[#E1E8E3]'
              }`}
            >
              <span className="text-base mb-0.5">{m.emoji}</span>
              <span className="text-[9px] font-bold tracking-tight">{m.label}</span>
            </button>
          ))}
        </div>

        {loggedMood && (
          <div className="bg-[#E1E8E3] text-[#4A6741] rounded-xl p-2 text-center text-[10px] font-bold animate-pulse">
            Logged: <span className="underline">{loggedMood}</span>. Try box breathing below.
          </div>
        )}
      </div>

      {/* Interactive Stress Level Level Meter */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 shadow-sm border border-white/60 flex flex-col mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stress Level</span>
          <span className="text-[10px] font-bold text-[#4A6741] bg-[#E1E8E3] px-2 py-0.5 rounded-full">Level {stressLevel}/10</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={stressLevel}
          onChange={(e) => setStressLevel(parseInt(e.target.value))}
          className="w-full accent-[#4A6741] h-1 bg-[#E1E8E3] rounded-lg appearance-none cursor-pointer my-2.5"
        />
        <div className="flex justify-between text-[9px] font-bold text-slate-400">
          <span>Peaceful (1)</span>
          <span>Moderate (5)</span>
          <span>Crisis (10)</span>
        </div>
      </div>

      {/* Grid Modules */}
      <span className="text-[10px] font-bold text-slate-400 text-left uppercase tracking-widest mb-2.5">Relief Modules</span>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Breathing */}
        <button
          onClick={() => onNavigate('breathing')}
          className="bg-white/70 hover:bg-[#E1E8E3]/50 border border-white/80 text-[#4A6741] transition rounded-[24px] p-4 text-left flex flex-col justify-between h-28 shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="bg-[#4A6741] text-white p-1.5 rounded-full w-fit">
            <Leaf size={14} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide">Guided Breath</h3>
            <p className="text-[9px] text-[#4A6741]/70 mt-0.5 leading-tight">Soothe anxiety with simple visual circles.</p>
          </div>
        </button>

        {/* Sensory grounding */}
        <button
          onClick={() => onNavigate('grounding')}
          className="bg-white/70 hover:bg-[#E1E8E3]/50 border border-white/80 text-[#608271] transition rounded-[24px] p-4 text-left flex flex-col justify-between h-28 shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="bg-[#608271] text-white p-1.5 rounded-full w-fit">
            <Compass size={14} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide">Sensory Grid</h3>
            <p className="text-[9px] text-[#608271]/70 mt-0.5 leading-tight">Focus focus on physical senses.</p>
          </div>
        </button>

        {/* Coping statements */}
        <button
          onClick={() => onNavigate('relief')}
          className="bg-white/70 hover:bg-[#E1E8E3]/50 border border-white/80 text-[#4A6741]/95 transition rounded-[24px] p-4 text-left flex flex-col justify-between h-28 shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="bg-[#A8C69F] text-[#4A6741] p-1.5 rounded-full w-fit">
            <BookOpen size={14} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide">Coping Vault</h3>
            <p className="text-[9px] text-[#4A6741]/70 mt-0.5 leading-tight">Reminders that you are secure.</p>
          </div>
        </button>

        {/* Hotlines */}
        <button
          onClick={() => onNavigate('emergency')}
          className="bg-[#D9534F]/5 hover:bg-[#D9534F]/10 border border-[#D9534F]/10 text-[#D9534F] transition rounded-[24px] p-4 text-left flex flex-col justify-between h-28 shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="bg-[#D9534F] text-white p-1.5 rounded-full w-fit">
            <Phone size={14} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide">Crisis Lines</h3>
            <p className="text-[9px] opacity-80 mt-0.5 leading-tight font-medium">Direct dialing channels for backup.</p>
          </div>
        </button>
      </div>

      {/* Safety Footer note */}
      <div className="mt-auto pt-4 border-t border-slate-100">
        <p className="text-[9px] text-slate-400 text-center leading-relaxed font-medium">
          🔒 Offline Shield Active. No cloud databases connected. Your data never leaves this web local storage.
        </p>
      </div>
    </div>
  );
};


// ============================================================================
// 2. GUIDED BREATHING SCREEN
// ============================================================================

// Configuration for breathing paces matching Geometric Balance theme
const BREATHING_CONFIG = {
  box: {
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    bg: 'bg-gradient-to-br from-[#608271] to-[#4A6741]',
    accent: 'text-[#4A6741] border-[#A8C69F]',
    glow: 'shadow-[0_20px_40px_rgba(74,103,65,0.35)]',
  },
  calm: {
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0, // No second hold in 4-7-8
    bg: 'bg-gradient-to-br from-[#7AA095] to-[#608271]',
    accent: 'text-[#608271] border-[#A8C69F]',
    glow: 'shadow-[0_20px_40px_rgba(96,130,113,0.3)]',
  },
};

export const SimulatorBreathing: React.FC = () => {
  const [breathingMode, setBreathingMode] = useState<BreathingType>('box');
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [isHapticPulsing, setIsHapticPulsing] = useState(false);
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'waves'>('none');
  const [ambientVolume, setAmbientVolumeState] = useState(0.4);

  const activeConf = BREATHING_CONFIG[breathingMode];

  // Quick helper to trigger navigator vibration cleanly
  const triggerHaptic = (pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Safe fallback
      }
    }
  };

  // Map state to human-friendly verbal instructions and scale
  const getPhaseDetails = () => {
    switch (phase) {
      case 'inhale':
        return { label: 'Inhale', scale: 'scale-135', color: 'text-[#4A6741]', sub: 'Fill your lungs gently' };
      case 'hold1':
        return { label: 'Hold', scale: 'scale-135', color: 'text-[#608271]', sub: 'Retain the calming oxygen' };
      case 'exhale':
        return { label: 'Exhale', scale: 'scale-100', color: 'text-[#4A6741]', sub: 'Release all physical tension' };
      case 'hold2':
        return { label: 'Hold & Rest', scale: 'scale-100', color: 'text-[#608271]', sub: 'A moment of stillness' };
    }
  };

  const details = getPhaseDetails();

  // Play nature soundtrack when running
  useEffect(() => {
    if (isRunning && ambientSound !== 'none') {
      startAmbientSound(ambientSound, ambientVolume);
    } else {
      stopAmbientSound();
    }
    return () => {
      stopAmbientSound();
    };
  }, [isRunning, ambientSound]);

  // Sync volume slider adjustment immediately
  useEffect(() => {
    setAmbientVolume(ambientVolume);
  }, [ambientVolume]);

  // Control breathing states with a clean, decoupled timer
  useEffect(() => {
    if (!isRunning) {
      setPhase('inhale');
      setSecondsLeft(activeConf.inhale);
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) {
          return prev - 1;
        } else {
          // Time to transition to the next phase!
          let nextPhase: 'inhale' | 'hold1' | 'exhale' | 'hold2' = 'inhale';
          
          if (breathingMode === 'box') {
            switch (phase) {
              case 'inhale':
                nextPhase = 'hold1';
                break;
              case 'hold1':
                nextPhase = 'exhale';
                break;
              case 'exhale':
                nextPhase = 'hold2';
                break;
              case 'hold2':
                nextPhase = 'inhale';
                setCycleCount((c) => c + 1);
                break;
            }
          } else {
            // Calm breath: 4 inhale, 7 hold, 8 exhale, repeat (doesn't have hold2)
            switch (phase) {
              case 'inhale':
                nextPhase = 'hold1';
                break;
              case 'hold1':
                nextPhase = 'exhale';
                break;
              case 'exhale':
                nextPhase = 'inhale';
                setCycleCount((c) => c + 1);
                break;
              default:
                nextPhase = 'inhale';
                break;
            }
          }
          
          if (hapticsEnabled) {
            triggerHaptic(25);
            setIsHapticPulsing(true);
            setTimeout(() => setIsHapticPulsing(false), 200);
          }
          
          setPhase(nextPhase);
          return BREATHING_CONFIG[breathingMode][nextPhase];
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase, breathingMode, hapticsEnabled]);

  // Adjust timers instantly when switching modes
  useEffect(() => {
    setIsRunning(false);
    setPhase('inhale');
    setSecondsLeft(activeConf.inhale);
    setCycleCount(0);
  }, [breathingMode]);

  // Gentle haptic feedback confirm cue
  const toggleHaptics = () => {
    const nextVal = !hapticsEnabled;
    setHapticsEnabled(nextVal);
    if (nextVal) {
      triggerHaptic(20);
      setIsHapticPulsing(true);
      setTimeout(() => setIsHapticPulsing(false), 150);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F1F5F2] p-3.5 justify-between">
      {/* Top Banner and Description */}
      <div className="text-center mt-1">
        <h2 className="text-lg font-bold text-[#4A6741] leading-tight font-sans">Guided Breathing</h2>
        <p className="text-[10px] text-slate-500 px-4 mt-0.5">Soothe anxiety by matching your lungs to the expanding circle.</p>

        {/* Tab switcher */}
        <div className="flex w-full mt-2.5 bg-[#E1E8E3] rounded-2xl p-1">
          <button
            onClick={() => setBreathingMode('box')}
            className={`flex-1 text-[11px] font-bold py-1.5 rounded-xl transition ${
              breathingMode === 'box' ? 'bg-white shadow-sm text-[#4A6741]' : 'text-[#4A6741]/60'
            }`}
          >
            Square Breath (4-4-4-4)
          </button>
          <button
            onClick={() => setBreathingMode('calm')}
            className={`flex-1 text-[11px] font-bold py-1.5 rounded-xl transition ${
              breathingMode === 'calm' ? 'bg-white shadow-sm text-[#4A6741]' : 'text-[#4A6741]/60'
            }`}
          >
            Calm Breath (4-7-8)
          </button>
        </div>
      </div>

      {/* Main Animation Stage */}
      <div className="flex-1 flex flex-col items-center justify-center -my-1.5">
        <div className="relative flex items-center justify-center w-48 h-48">
          
          {/* Breathing expanding bubble aura */}
          <div
            className={`absolute rounded-full w-28 h-28 border-2 border-[#A8C69F] transition-all duration-1000 ease-in-out ${
              isRunning ? `${details.scale}` : 'scale-100'
            } ${isHapticPulsing ? 'border-solid border-opacity-90 border-[#4A6741] scale-102' : 'border-dashed border-opacity-40'}`}
          >
            <div className="w-full h-full rounded-full opacity-10 bg-[#A8C69F]" />
          </div>

          {/* Central actual solid bubble */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`absolute rounded-full w-20 h-20 flex flex-col justify-center items-center text-white border border-white/40 transition-all duration-1000 ease-in-out shadow-lg cursor-pointer hover:brightness-105 active:scale-95 focus:outline-none ${
              activeConf.bg
            } ${isRunning ? `${details.scale} ${activeConf.glow}` : 'scale-100 shadow'} ${
              isHapticPulsing ? 'brightness-110 saturate-110' : ''
            }`}
          >
            <span className="text-[10px] font-bold tracking-wider uppercase opacity-95 text-center leading-tight">
              {isRunning ? details.label : 'Tap to Start'}
            </span>
            {isRunning ? (
              <span className="text-xl font-black mt-0.5 leading-none">{secondsLeft}s</span>
            ) : (
              <span className="text-[8px] uppercase tracking-widest opacity-75 mt-0.5 font-bold">Ready</span>
            )}
          </button>

          {/* Visual Haptic Pulse Badge */}
          {isRunning && hapticsEnabled && (
            <div className={`absolute bottom-0 px-2 py-0.5 rounded-full text-[8px] font-bold bg-[#E1E8E3]/90 text-[#4A6741] border border-white/80 shadow-xs flex items-center gap-1 transition-all duration-150 ${isHapticPulsing ? 'scale-110 bg-[#A8C69F]/80' : 'scale-100 opacity-80'}`}>
              <span className={`w-1.5 h-1.5 rounded-full bg-[#4A6741] ${isHapticPulsing ? 'animate-ping' : ''}`} />
              <span className="font-mono uppercase tracking-wider">Haptic Pulse</span>
            </div>
          )}
        </div>

        {/* Dynamic breathing auxiliary labels */}
        <div className="h-10 text-center mt-1.5 px-6">
          {isRunning ? (
            <div className="animate-fade-in">
              <p className={`text-[11px] font-bold ${details.color}`}>{details.sub}</p>
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 italic">Tap the center circle to start.</p>
          )}
        </div>
      </div>

      {/* Controller Buttons */}
      <div className="w-full text-center flex flex-col space-y-1.5 mb-1 animate-fade-in">
        {/* Ambient Nature Sounds panel */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-2 px-3 border border-white flex flex-col space-y-1.5 text-[#4A6741] text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <Music size={12} className={isRunning && ambientSound !== 'none' ? "animate-spin" : ""} style={{ animationDuration: '4s' }} />
              <span className="text-[11px] font-bold">Ambient Sounds</span>
            </div>
            {ambientSound !== 'none' && (
              <span className="text-[8px] font-black uppercase text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded-sm tracking-widest animate-pulse">
                {isRunning ? 'Playing' : 'Ready'}
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => setAmbientSound('none')}
              className={`py-1 rounded-lg text-[10px] font-bold transition-all text-center ${
                ambientSound === 'none'
                  ? 'bg-[#4A6741] text-white shadow-xs'
                  : 'bg-[#E1E8E3]/60 text-[#4A6741] hover:bg-[#E1E8E3]'
              }`}
            >
              Mute
            </button>
            <button
              type="button"
              onClick={() => setAmbientSound('rain')}
              className={`py-1 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center space-x-1 ${
                ambientSound === 'rain'
                  ? 'bg-[#4A6741] text-white shadow-xs'
                  : 'bg-[#E1E8E3]/60 text-[#4A6741] hover:bg-[#E1E8E3]'
              }`}
            >
              <CloudRain size={10} />
              <span>Rain</span>
            </button>
            <button
              type="button"
              onClick={() => setAmbientSound('waves')}
              className={`py-1 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center space-x-1 ${
                ambientSound === 'waves'
                  ? 'bg-[#4A6741] text-white shadow-xs'
                  : 'bg-[#E1E8E3]/60 text-[#4A6741] hover:bg-[#E1E8E3]'
              }`}
            >
              <Waves size={10} />
              <span>Waves</span>
            </button>
          </div>

          {ambientSound !== 'none' && (
            <div className="flex items-center space-x-1.5 mt-0.5 animate-fade-in">
              <VolumeX size={10} className="text-slate-400 shrink-0" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={ambientVolume}
                onChange={(e) => setAmbientVolumeState(parseFloat(e.target.value))}
                className="flex-1 accent-[#4A6741] h-1 bg-[#E1E8E3] rounded-lg appearance-none cursor-pointer"
              />
              <Volume2 size={10} className="text-[#4A6741] shrink-0" />
              <span className="text-[9px] font-mono text-[#4A6741] min-w-[20px] text-right font-bold">
                {Math.round(ambientVolume * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Toggleable option for gentle haptics */}
        <div className="flex items-center justify-between bg-white/70 backdrop-blur-md rounded-2xl p-2 px-3 mb-0.5 border border-white">
          <div className="flex items-center space-x-2 text-[#4A6741]">
            <Smartphone size={13} className={isHapticPulsing ? "animate-bounce" : ""} />
            <span className="text-[11px] font-bold">Gentle Haptics</span>
          </div>
          <button
            type="button"
            onClick={toggleHaptics}
            className={`w-8 h-4 rounded-full transition-colors relative flex items-center p-0.5 ${
              hapticsEnabled ? 'bg-[#4A6741]' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-3 h-3 bg-white rounded-full shadow-xs transition-transform ${
                hapticsEnabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {cycleCount > 0 && (
          <div className="flex items-center justify-center space-x-2 mb-0.5">
            <div className="text-[10px] text-[#4A6741] font-bold bg-[#E1E8E3] px-3 py-0.5 rounded-full">
              ✓ Completed Cycles: {cycleCount}
            </div>
            <button
              type="button"
              onClick={() => {
                setCycleCount(0);
              }}
              className="text-[10px] text-slate-400 hover:text-red-500 hover:underline transition font-bold"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


// ============================================================================
// 3. 5-4-3-2-1 GROUNDING TECHNIQUE
// ============================================================================
export const SimulatorGrounding: React.FC = () => {
  const steps: GroundingStep[] = [
    { step: 5, label: 'See', prompt: 'Type 5 things you can see in this room.', placeholder: 'e.g. Lamp, window, desk...', color: 'bg-[#4A6741] focus-within:ring-[#A8C69F]', items: [] },
    { step: 4, label: 'Feel', prompt: 'Type 4 physical sensations you feel.', placeholder: 'e.g. Socks, feet on floor, soft seat...', color: 'bg-[#608271] focus-within:ring-[#A8C69F]', items: [] },
    { step: 3, label: 'Hear', prompt: 'Type 3 ambient sounds you can hear.', placeholder: 'e.g. Hum of clock, wind, footsteps...', color: 'bg-[#8CA883] focus-within:ring-[#E1E8E3]', items: [] },
    { step: 2, label: 'Smell', prompt: 'Type 2 aromas or odors in the room.', placeholder: 'e.g. Coffee, fresh sheet, soap...', color: 'bg-[#A8C69F] focus-within:ring-[#E1E8E3]', items: [] },
    { step: 1, label: 'Taste', prompt: 'Type 1 flavor in your mouth right now.', placeholder: 'e.g. Hint of toothpaste, mint, sweet...', color: 'bg-[#608271] focus-within:ring-[#E1E8E3]', items: [] },
  ];

  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [completedItems, setCompletedItems] = useState<{ [key: number]: string[] }>({
    5: [], 4: [], 3: [], 2: [], 1: [],
  });
  const [inputVal, setInputVal] = useState('');

  const currentStep = steps[activeStepIdx];
  const list = completedItems[currentStep.step] || [];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    if (list.length < currentStep.step) {
      setCompletedItems({
        ...completedItems,
        [currentStep.step]: [...list, inputVal.trim()],
      });
      setInputVal('');
    }
  };

  const handleNext = () => {
    if (activeStepIdx < steps.length - 1) {
      setActiveStepIdx(activeStepIdx + 1);
    }
  };

  const handleBack = () => {
    if (activeStepIdx > 0) {
      setActiveStepIdx(activeStepIdx - 1);
    }
  };

  const handleReset = () => {
    setActiveStepIdx(0);
    setCompletedItems({ 5: [], 4: [], 3: [], 2: [], 1: [] });
    setInputVal('');
  };

  return (
    <div className="flex flex-col h-full bg-[#F1F5F2] p-5 justify-between overflow-y-auto">
      {/* Title */}
      <div className="text-center mt-3 shrink-0">
        <h2 className="text-xl font-bold text-[#4A6741] leading-tight font-sans">5-4-3-2-1 Grounding</h2>
        <p className="text-[11px] text-slate-500 mt-1">Anchor your racing mind back into the concrete present moment.</p>
        
        {/* Progress indicator */}
        <div className="w-full bg-[#E1E8E3] h-1.5 rounded-full mt-4 overflow-hidden flex">
          <div
            className="bg-[#4A6741] h-full transition-all duration-300"
            style={{ width: `${((activeStepIdx + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Grid Status Indicator Panels mapped from raw HTML structure */}
      <div className="grid grid-cols-5 gap-1.5 my-3.5 text-center shrink-0">
        {steps.map((s, idx) => {
          const isCurrent = idx === activeStepIdx;
          const isDone = completedItems[s.step]?.length >= s.step;
          return (
            <div 
              key={s.step} 
              onClick={() => {
                setActiveStepIdx(idx);
                setInputVal('');
              }}
              className={`py-2 rounded-xl cursor-pointer border transition text-center ${
                isCurrent 
                  ? 'bg-[#E1E8E3] border-[#4A6741] text-[#4A6741] font-bold shadow-xs' 
                  : isDone
                    ? 'bg-white/90 border-[#A8C69F] text-[#4A6741]'
                    : 'bg-white/40 border-transparent text-slate-400 hover:bg-white/60'
              }`}
            >
              <div className="text-sm font-black">{s.step}</div>
              <div className="text-[8px] uppercase font-bold tracking-tight opacity-70">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Main active interactive card container */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-4 shadow-sm border border-white flex flex-col justify-between flex-1 mb-4 space-y-3.5">
        {/* Badge header */}
        <div className="text-center">
          <span className="bg-[#E1E8E3] text-[#4A6741] text-[9px] font-bold px-3 py-1 rounded-full uppercase">
            TASK {activeStepIdx + 1} of 5
          </span>
          <h3 className="text-xl font-bold tracking-tight text-[#4A6741] mt-2.5 flex items-center justify-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${currentStep.color.split(' ')[0]}`} />
            <span>Identify {currentStep.step} × {currentStep.label}</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-1 italic leading-relaxed">Name or list items you observe directly.</p>
        </div>

        {/* Listed current sensory answers */}
        <div className="flex-1 flex flex-col space-y-1.5 justify-center py-1 max-h-[160px] overflow-y-auto">
          {list.map((item, id) => (
            <div key={id} className="bg-white/60 border border-[#E1E8E3] px-3 py-2 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-700 animate-fade-in shadow-2xs">
              <span className="truncate">{item}</span>
              <CheckCircle2 size={13} className="text-[#4A6741] shrink-0 ml-2" />
            </div>
          ))}

          {/* Placeholders for remaining answers */}
          {Array.from({ length: currentStep.step - list.length }).map((_, id) => (
            <div key={id} className="bg-[#F1F5F2]/40 border border-dashed border-[#E1E8E3] px-3 py-2 rounded-xl text-[11px] text-slate-400 italic text-left">
              Empty {currentStep.label} target slot {list.length + id + 1}...
            </div>
          ))}
        </div>

        {/* Input box */}
        {list.length < currentStep.step ? (
          <form onSubmit={handleAddItem} className="flex gap-1.5">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={currentStep.placeholder}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-[#4A6741] transition"
            />
            <button
              type="submit"
              className={`px-3.5 py-2 text-xs font-bold text-white rounded-xl ${currentStep.color.split(' ')[0]} hover:opacity-95 transition shadow-sm active:scale-95`}
            >
              Add
            </button>
          </form>
        ) : (
          <div className="bg-[#E1E8E3] rounded-2xl p-2.5 text-center border border-[#A8C69F]/40 animate-bounce">
            <span className="text-[10px] font-bold text-[#4A6741]">✓ Step {currentStep.label} Complete! Ready.</span>
          </div>
        )}
      </div>

      {/* Navigation footer */}
      <div className="flex justify-between items-center mb-1 gap-3">
        <button
          onClick={handleBack}
          disabled={activeStepIdx === 0}
          className={`flex-1 py-3 text-xs font-bold rounded-2xl border transition ${
            activeStepIdx === 0
              ? 'border-[#E1E8E3]/60 text-slate-300 cursor-not-allowed'
              : 'border-[#E1E8E3] text-[#4A6741] hover:bg-white/80 bg-white/40'
          }`}
        >
          Back
        </button>

        {activeStepIdx < steps.length - 1 ? (
          <button
            onClick={handleNext}
            className={`flex-1 py-3 text-xs font-bold rounded-2xl text-white transition shadow ${currentStep.color.split(' ')[0]}`}
          >
            Next Step
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="flex-1 py-3 text-xs font-bold rounded-2xl text-white bg-[#4A6741] hover:bg-[#3E5536] transition shadow"
          >
            All Done! Reset
          </button>
        )}
      </div>
    </div>
  );
};


// ============================================================================
// 4. COPING STATEMENTS SCREEN
// ============================================================================
export const SimulatorRelief: React.FC = () => {
  const initialStatements: CopingStatement[] = [
    { id: '1', text: 'This feeling is uncomfortable, but it is temporary and it will pass.', category: 'Panic', saved: true },
    { id: '2', text: 'My racing heart is just an adrenaline spike. I am physically safe.', category: 'Panic', saved: true },
    { id: '3', text: 'I am doing the best I can, and that is absolutely enough.', category: 'Anxiety', saved: false },
    { id: '4', text: 'Focus on this single second. This moment is all I need to manage.', category: 'Grounding', saved: false },
    { id: '5', text: 'Deep slow breaths are signaling safety to my nervous system right now.', category: 'Stress', saved: true },
    { id: '6', text: 'Anxiety is just a strong bodily sensation; it cannot hurt me.', category: 'Anxiety', saved: false },
  ];

  const [statements, setStatements] = useState<CopingStatement[]>(() => {
    const saved = localStorage.getItem('aid_coping_statements');
    return saved ? JSON.parse(saved) : initialStatements;
  });

  const [filter, setFilter] = useState<string>('All');
  const [newText, setNewText] = useState('');
  const [newCat, setNewCat] = useState<'Anxiety' | 'Panic' | 'Grounding' | 'Stress'>('Anxiety');

  useEffect(() => {
    localStorage.setItem('aid_coping_statements', JSON.stringify(statements));
  }, [statements]);

  const toggleSave = (id: string) => {
    setStatements(
      statements.map((s) => (s.id === id ? { ...s, saved: !s.saved } : s))
    );
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newStatement: CopingStatement = {
      id: Date.now().toString(),
      text: newText.trim(),
      category: newCat,
      saved: true,
    };

    setStatements([newStatement, ...statements]);
    setNewText('');
  };

  const handleDelete = (id: string) => {
    setStatements(statements.filter((s) => s.id !== id));
  };

  const categories = ['All', 'Panic', 'Anxiety', 'Grounding', 'Stress', 'Saved Only'];

  const filtered = statements.filter((s) => {
    if (filter === 'All') return true;
    if (filter === 'Saved Only') return s.saved;
    return s.category === filter;
  });

  return (
    <div className="flex flex-col h-full bg-[#F1F5F2] p-5 justify-between overflow-y-auto">
      {/* Title */}
      <div className="text-center mt-3">
        <h2 className="text-xl font-bold text-[#4A6741] leading-tight font-sans">Coping Vault</h2>
        <p className="text-[11px] text-slate-500 mt-1">Grounding logic and reassuring affirmations to read during crisis.</p>

        {/* Horizontal scroll filter pills */}
        <div className="flex gap-1.5 overflow-x-auto py-3 no-scrollbar shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold shrink-0 transition ${
                filter === cat
                  ? 'bg-[#4A6741] text-white shadow-sm'
                  : 'bg-[#E1E8E3] text-[#4A6741] hover:bg-[#A8C69F]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* List content area */}
      <div className="flex-1 flex flex-col space-y-2.5 overflow-y-auto pr-1 my-3 max-h-[300px]">
        {filtered.length === 0 ? (
          <div className="text-center py-10 bg-white/70 rounded-3xl border border-dashed border-[#E1E8E3] px-4">
            <p className="text-xs text-slate-400 italic">No affirmations listed in this category...</p>
          </div>
        ) : (
          filtered.map((s) => (
            <div
              key={s.id}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-3.5 shadow-xs border border-white flex flex-col justify-between space-y-3 shrink-0"
            >
              <p className="text-xs text-slate-700 font-semibold leading-relaxed text-left italic">
                "{s.text}"
              </p>
              
              <div className="flex items-center justify-between text-[10px]">
                <span className="bg-[#E1E8E3] text-[#4A6741] font-bold px-2 py-0.5 rounded-md">
                  {s.category}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleSave(s.id)}
                    className={`p-1 rounded-full transition ${s.saved ? 'text-[#D9534F]' : 'text-slate-300 hover:text-slate-400'}`}
                  >
                    <Heart size={13} fill={s.saved ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-1 rounded-full text-slate-300 hover:text-rose-500 transition"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add new local statement form bottom */}
      <form onSubmit={handleAdd} className="bg-white/90 backdrop-blur-md rounded-3xl p-3.5 border border-[#E1E8E3] flex flex-col space-y-2 shrink-0">
        <textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Type a calming statement, e.g. 'I am safe here'..."
          className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-[#4A6741] transition resize-none h-14"
        />
        
        <div className="flex justify-between items-center gap-2">
          <select
            value={newCat}
            onChange={(e: any) => setNewCat(e.target.value)}
            className="text-[10px] font-bold text-[#4A6741] bg-[#E1E8E3] border-none p-2 rounded-xl focus:outline-none"
          >
            <option value="Anxiety">Anxiety</option>
            <option value="Panic">Panic</option>
            <option value="Grounding">Grounding</option>
            <option value="Stress">Stress</option>
          </select>
          
          <button
            type="submit"
            className="flex items-center bg-[#4A6741] hover:bg-[#3E5536] text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm active:scale-95 space-x-1"
          >
            <Plus size={13} />
            <span>Add to Vault</span>
          </button>
        </div>
      </form>
    </div>
  );
};


// ============================================================================
// 5. EMERGENCY CONTACTS SCREEN
// ============================================================================
export const SimulatorEmergency: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [savedContact, setSavedContact] = useState<{ name: string; phone: string } | null>(() => {
    const data = localStorage.getItem('aid_emergency_contact');
    return data ? JSON.parse(data) : null;
  });

  const [simulatedDialOpen, setSimulatedDialOpen] = useState(false);
  const [dialedNum, setDialedNum] = useState('');

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const contact = { name: name.trim(), phone: phone.trim() };
    setSavedContact(contact);
    localStorage.setItem('aid_emergency_contact', JSON.stringify(contact));
    setName('');
    setPhone('');
  };

  const handleTriggerDial = (number: string) => {
    setDialedNum(number);
    setSimulatedDialOpen(true);
  };

  const handleDeleteContact = () => {
    setSavedContact(null);
    localStorage.removeItem('aid_emergency_contact');
  };

  return (
    <div className="flex flex-col h-full bg-[#F1F5F2] p-5 justify-between overflow-y-auto">
      {/* Title */}
      <div className="text-center mt-3 shrink-0">
        <h2 className="text-xl font-bold text-[#4A6741] leading-tight font-sans">Crisis & Hotlines</h2>
        <p className="text-[11px] text-slate-500 mt-1">Instant offline lines and key local supporters to reach right away.</p>
      </div>

      {/* Main Hotline list */}
      <div className="flex-1 flex flex-col space-y-4 my-4">
        {/* National Hotlines card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 shadow-sm border border-white flex flex-col text-left space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confidential Aid</span>
          
          {/* Hotline: 988 */}
          <div className="flex justify-between items-center bg-[#D9534F]/5 p-2.5 rounded-2xl border border-[#D9534F]/10">
            <div className="max-w-[70%]">
              <h4 className="text-xs font-bold text-[#D9534F]">988 Suicide & Crisis</h4>
              <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Call/SMS free confidential mental counseling 24/7.</p>
            </div>
            <button
              onClick={() => handleTriggerDial('988')}
              className="bg-[#D9534F] hover:bg-[#C1403E] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-sm active:scale-95 flex items-center space-x-1"
            >
              <Phone size={12} />
              <span>Dial</span>
            </button>
          </div>

          {/* Text Line */}
          <div className="flex justify-between items-center bg-[#E1E8E3]/40 p-2.5 rounded-2xl border border-[#E1E8E3]/60">
            <div className="max-w-[70%]">
              <h4 className="text-xs font-bold text-slate-800">Crisis Text Line (741741)</h4>
              <p className="text-[10px] text-slate-500 leading-tight mt-0.5">SMS text HOME to 741741 to connect directly.</p>
            </div>
            <button
              onClick={() => handleTriggerDial('741741')}
              className="bg-[#608271] hover:bg-[#4A6741] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-sm active:scale-95"
            >
              SMS
            </button>
          </div>
        </div>

        {/* Custom Personal Contact Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 shadow-sm border border-white flex flex-col text-left space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personal Network</span>

          {savedContact ? (
            <div className="flex justify-between items-center bg-[#E1E8E3]/40 p-3 rounded-2xl border border-[#E1E8E3]/80">
              <div className="max-w-[65%]">
                <h4 className="text-xs font-bold text-[#4A6741] truncate">{savedContact.name}</h4>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{savedContact.phone}</p>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleTriggerDial(savedContact.phone)}
                  className="bg-[#4A6741] hover:bg-[#3E5536] text-white font-bold text-xs p-2 rounded-xl transition shadow"
                >
                  <Phone size={13} />
                </button>
                <button
                  onClick={handleDeleteContact}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-500 p-2 rounded-xl transition"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveContact} className="flex flex-col space-y-2">
              <p className="text-[10px] text-slate-400">Add a family member, trusted friend, or therapist contact:</p>
              <input
                type="text"
                required
                placeholder="Support person name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-[#4A6741] transition"
              />
              <input
                type="tel"
                required
                placeholder="Phone number or extension..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-[#4A6741] transition font-mono"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-[#4A6741] hover:bg-[#3E5536] text-white font-bold text-xs rounded-xl transition shadow active:scale-95"
              >
                Save Contact Device-Only
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Simulated dial overlay popup */}
      {simulatedDialOpen && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 rounded-[45px] flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full p-6 text-center text-white shadow-2xl flex flex-col justify-between h-72">
            <div>
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/40 px-3 py-1 rounded-full">
                SIMULATED DIAL INTENT
              </span>
              <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                App dispatched a mobile dial action via system Android intent:
              </p>
              <h3 className="text-3xl font-black mt-2 text-[#D9534F] font-mono tracking-widest">{dialedNum}</h3>
            </div>

            <p className="text-[10px] text-slate-500 max-w-[80%] mx-auto leading-tight italic">
              On an actual phone, this action safely boots your standard Native Dialing screen with phone number prefilled.
            </p>

            <button
              onClick={() => setSimulatedDialOpen(false)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-xs font-bold transition-colors border border-slate-700 uppercase tracking-wider"
            >
              Hang Up / Close
            </button>
          </div>
        </div>
      )}

      {/* Disclaimer bottom advice block */}
      <span className="text-[8px] text-slate-500 leading-tight bg-[#E1E8E3]/60 p-2 rounded-xl border border-[#A8C69F]/30 shrink-0 select-none">
        ⚠️ First Aid apps are support tools and do not substitute for expert psychiatric or professional care. If physically unsafe, please contact local emergency services immediately.
      </span>
    </div>
  );
};
