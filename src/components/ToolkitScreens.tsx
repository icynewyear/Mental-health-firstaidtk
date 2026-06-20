import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Check, Sparkles, Smile, RotateCcw, Shield, Heart, HelpCircle, Activity, Info, Edit2 } from 'lucide-react';
import { ReframedThought, HabitItem, GratitudeSlip, SafetyPlanData } from '../types';

// ============================================================================
// HELPERS
// ============================================================================
const DISTORTIONS = [
  { name: 'Catastrophizing', desc: 'Predicting the absolute worst scenario regardless of the actual situation.' },
  { name: 'All-or-Nothing', desc: 'Viewing things as completely black-or-white. Anything less than perfect is a failure.' },
  { name: 'Mind Reading', desc: 'Assuming people are thinking negatively of you without any actual evidence.' },
  { name: 'Emotional Reasoning', desc: 'Believing your negative feelings represent reality ("I feel stupid, so I must be").' },
  { name: 'Overgeneralization', desc: 'Taking a single negative event and viewing it as an endless pattern of defeat.' },
];

// ============================================================================
// 1. INTERACTIVE COGNITIVE REFRAMING DESK (CBT EXERCISE)
// ============================================================================
interface ReframingProps {
  onBack: () => void;
}

export const SimulatorReframing: React.FC<ReframingProps> = ({ onBack }) => {
  const [negative, setNegative] = useState('');
  const [distortion, setDistortion] = useState(DISTORTIONS[0].name);
  const [rational, setRational] = useState('');
  const [logs, setLogs] = useState<ReframedThought[]>(() => {
    const saved = localStorage.getItem('safespace_reframing_log');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('safespace_reframing_log', JSON.stringify(logs));
  }, [logs]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!negative.trim() || !rational.trim()) return;

    const newLog: ReframedThought = {
      id: Date.now().toString(),
      negative: negative.trim(),
      distortion,
      rational: rational.trim(),
      timestamp: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    setLogs([newLog, ...logs]);
    setNegative('');
    setRational('');
  };

  const handleDelete = (id: string) => {
    setLogs(logs.filter(l => l.id !== id));
  };

  const currentDistortionDesc = DISTORTIONS.find(d => d.name === distortion)?.desc || '';

  return (
    <div className="flex flex-col h-full bg-[#F1F5F2] p-5 overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mt-3 mb-2 shrink-0">
        <button
          onClick={onBack}
          className="text-[#4A6741] hover:bg-[#E1E8E3] rounded-full p-1.5 transition border-0 bg-transparent cursor-pointer flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none font-mono">Finding Perspective</span>
        <div className="w-8 h-8" />
      </div>

      <div className="text-center mb-3.5 shrink-0">
        <h2 className="text-lg font-black text-[#4A6741] leading-tight font-sans">Thought Reframer</h2>
        <p className="text-[10px] text-slate-500 mt-0.5 max-w-[90%] mx-auto leading-tight">
          Gently untangle anxious thoughts or harsh assumptions to find a kinder, more balanced point of view.
        </p>
      </div>

      {/* Main interactive form wrapper - unconstrained to allow natural scrolling */}
      <div className="flex flex-col space-y-4 pb-6">
        <form onSubmit={handleSave} className="bg-white/90 backdrop-blur border border-[#E1E8E3] rounded-3xl p-3.5 shadow-sm space-y-3.5 text-left">
          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">1. My automatic or worrying thought</label>
            <textarea
              required
              rows={2}
              placeholder="e.g. I made one error in my slide, so now my supervisor will definitely fire me..."
              value={negative}
              onChange={(e) => setNegative(e.target.value)}
              className="w-full text-[10.5px] px-3 py-2 bg-slate-50 border border-[#CBD9CC] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4A6741] focus:bg-white text-slate-800 leading-tight transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">2. Recognizing the pattern</label>
            <textarea
              readOnly
              value={distortion}
              onClick={() => {}} // dummy action
              className="hidden" // we can keep select or just let user see select
            />
            <select
              value={distortion}
              onChange={(e) => setDistortion(e.target.value)}
              className="w-full text-[10.5px] px-2.5 py-2 bg-slate-50 border border-[#CBD9CC] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4A6741] font-bold text-slate-700 bg-white"
            >
              {DISTORTIONS.map(d => (
                <option key={d.name} value={d.name}>{d.name}</option>
              ))}
            </select>
            <p className="text-[8.5px] text-[#4A6741] bg-[#4A6741]/5 p-2 rounded-lg italic leading-tight border border-[#4A6741]/10">
              💡 <strong>{distortion}:</strong> {currentDistortionDesc}
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">3. A gentler, balanced reframe</label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Everyone makes mistakes. My boss praised my overall delivery, and one slide typo is normal."
              value={rational}
              onChange={(e) => setRational(e.target.value)}
              className="w-full text-[10.5px] px-3 py-2 bg-slate-50 border border-[#CBD9CC] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4A6741] focus:bg-white text-slate-800 leading-tight transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#4A6741] hover:bg-[#3E5536] text-white rounded-xl font-bold text-xs shadow-sm transition active:scale-98 cursor-pointer border-0 flex items-center justify-center space-x-1.5"
          >
            <Sparkles size={11.5} className="text-white animate-pulse" />
            <span>Save Reframed Thought</span>
          </button>
        </form>

        {/* History Log */}
        <div className="space-y-2 select-none">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block text-left">Your Reframing History</span>
          
          {logs.length === 0 ? (
            <div className="bg-white/40 border border-[#E1E8E3]/50 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-slate-400 italic font-medium">No saved reframes yet. Add one above to start exploring gentler views!</p>
            </div>
          ) : (
            logs.map(log => (
              <div key={log.id} className="bg-white/80 border border-slate-100 rounded-2xl p-3 text-left space-y-2 relative shadow-xs">
                <button
                  onClick={() => handleDelete(log.id)}
                  className="absolute top-2.5 right-2.5 text-slate-300 hover:text-red-500 transition p-1 rounded-full hover:bg-slate-50 border-0 bg-transparent cursor-pointer"
                  title="Remove"
                >
                  <Trash2 size={11} />
                </button>
                <div className="pr-5">
                  <span className="text-[8px] font-bold text-[#4A6741] bg-[#4A6741]/10 px-2 py-0.5 rounded-full font-mono">{log.distortion}</span>
                  <span className="text-[8px] text-slate-400 ml-2 font-mono">{log.timestamp}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 border-l-2 border-red-200 pl-2 italic max-w-full truncate leading-tight">
                    "{log.negative}"
                  </p>
                  <p className="text-[10.5px] text-slate-700 font-bold bg-[#4A6741]/5 p-2 rounded-xl text-emerald-800 border border-[#4A6741]/10 leading-tight">
                    🌱 {log.rational}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="shrink-0 pt-2 border-t border-slate-100/80 text-center flex items-center justify-center gap-1">
        <Info size={10} className="text-[#4A6741]" />
        <span className="text-[8.5px] text-slate-400 italic">Taking time to find alternative views helps our minds feel calmer over time.</span>
      </div>
    </div>
  );
};


// ============================================================================
// 2. EVERYDAY BASICS SELF-CARE CHECKLIST
// ============================================================================
interface HabitProps {
  onBack: () => void;
}

export const SimulatorHabit: React.FC<HabitProps> = ({ onBack }) => {
  const [habits, setHabits] = useState<HabitItem[]>(() => {
    const saved = localStorage.getItem('safespace_daily_habits');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If they have old clinical ones, let's migrate them to new clean ones.
        if (parsed.length > 0 && (parsed[0].name.includes('Circadian') || parsed[0].name.includes('Biological') || parsed[0].name.includes('Compliance'))) {
          localStorage.removeItem('safespace_daily_habits');
        } else {
          return parsed;
        }
      } catch (e) {
        // Safe play
      }
    }
    return [
      { id: '1', name: 'Catch some morning sunlight (10-15m)', completed: false, category: 'Light & Air', icon: '☀️' },
      { id: '2', name: 'Drink a glass of cooling fresh water', completed: false, category: 'Hydration', icon: '💧' },
      { id: '3', name: 'Go for a gentle, easy walk outside', completed: false, category: 'Movement', icon: '🚶' },
      { id: '4', name: 'Take a slow, deep calming breath', completed: false, category: 'Mindfulness', icon: '🍃' },
      { id: '5', name: 'Enjoy a warm or nourishing meal', completed: false, category: 'Nourishment', icon: '🥗' },
      { id: '6', name: 'Reach out or check in with a friend', completed: false, category: 'Connection', icon: '🗣️' },
      { id: '7', name: 'Enjoy some screen-free quiet time', completed: false, category: 'Rest', icon: '📴' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('safespace_daily_habits', JSON.stringify(habits));
  }, [habits]);

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const handleReset = () => {
    setHabits(prev => prev.map(h => ({ ...h, completed: false })));
  };

  const completedCount = habits.filter(h => h.completed).length;
  const isExcellent = completedCount >= 5;

  return (
    <div className="flex flex-col h-full bg-[#F1F5F2] p-5 overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mt-3 mb-2 shrink-0">
        <button
          onClick={onBack}
          className="text-[#4A6741] hover:bg-[#E1E8E3] rounded-full p-1.5 transition border-0 bg-transparent cursor-pointer flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none font-mono">Everyday Care</span>
        <button
          onClick={handleReset}
          className="text-slate-400 hover:text-[#4A6741] text-[9px] font-black uppercase tracking-wider bg-white rounded-lg px-2 py-1 border border-slate-100 transition cursor-pointer"
        >
          Reset
        </button>
      </div>

      <div className="text-center mb-3 shrink-0">
        <h2 className="text-lg font-black text-[#4A6741] leading-tight font-sans font-sans">Everyday Basics</h2>
        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
          Sometimes, caring for our physical needs is the gentlest way to help support a peaceful mind. Let's check in on the basics.
        </p>
      </div>

      {/* Progress Box */}
      <div className="bg-white border border-[#E1E8E3] rounded-3xl p-3.5 shadow-2xs mb-3 flex flex-col items-center shrink-0">
        <div className="flex justify-between items-center w-full mb-1.5 text-[10.5px]">
          <span className="font-extrabold text-slate-700">My Self-Care Basics</span>
          <span className="font-black text-[#4A6741] font-mono">{completedCount}/{habits.length} Done</span>
        </div>
        {/* Animated Bar */}
        <div className="w-full h-2.5 bg-slate-150 rounded-full overflow-hidden select-none mb-1.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${isExcellent ? 'bg-[#4A6741]' : 'bg-amber-600'}`}
            style={{ width: `${(completedCount / habits.length) * 100}%` }}
          />
        </div>
        <p className="text-[9px] text-center font-bold text-slate-500 leading-tight">
          {completedCount === 0 && '🌱 Take a gentle step. Tap any item below when you\'ve done it.'}
          {completedCount > 0 && completedCount < 4 && '💡 Step by step. Each little bit of support helps your mind rest.'}
          {completedCount >= 4 && completedCount < habits.length && '🌟 Beautiful. You are treating yourself with wonderful kindness today!'}
          {completedCount === habits.length && '🌿 How wonderful. All the simple basics are attended to!'}
        </p>
      </div>

      {/* Habits List wrapper - unconstrained to allow natural scrolling */}
      <div className="flex flex-col space-y-1.5 pb-6">
        {habits.map(h => (
          <button
            key={h.id}
            onClick={() => toggleHabit(h.id)}
            className={`w-full text-left rounded-2xl p-2.5 border transition cursor-pointer text-slate-800 flex items-center justify-between gap-3 ${
              h.completed
                ? 'bg-[#EBF2EC]/70 border-[#4A6741]/40 shadow-2xs scale-[0.99]'
                : 'bg-white border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <span className="text-base select-none">{h.icon}</span>
              <div className="min-w-0">
                <p className={`text-[10px] font-black ${h.completed ? 'text-slate-800 line-through opacity-85' : 'text-slate-800'}`}>
                  {h.name}
                </p>
                <span className="text-[7.5px] uppercase font-mono text-slate-400 tracking-wider font-extrabold block leading-none mt-1">
                  {h.category} Category
                </span>
              </div>
            </div>

            <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition select-none ${
              h.completed ? 'bg-[#4A6741] border-[#4A6741] text-white' : 'border-slate-300 bg-slate-50'
            }`}>
              {h.completed && <Check size={11} className="stroke-[3.5]" />}
            </div>
          </button>
        ))}
      </div>

      <div className="shrink-0 pt-2 border-t border-slate-100/80 text-center flex items-center justify-center gap-1">
        <Activity size={10} className="text-[#4A6741]" />
        <span className="text-[8.5px] text-slate-400">Sleep, fresh air, and drinking water are simple ways to help support your mind and body.</span>
      </div>
    </div>
  );
};


// ============================================================================
// 3. GRATITUDE JAR (AMPLIFYING JOY SLIPS)
// ============================================================================
interface GratitudeProps {
  onBack: () => void;
  isDarkMode?: boolean;
}

export const SimulatorGratitude: React.FC<GratitudeProps> = ({ onBack, isDarkMode = false }) => {
  const [gratitudeText, setGratitudeText] = useState('');
  const [slips, setSlips] = useState<GratitudeSlip[]>(() => {
    const saved = localStorage.getItem('safespace_gratitude_jar');
    return saved ? JSON.parse(saved) : [];
  });

  const [drawnSlip, setDrawnSlip] = useState<GratitudeSlip | null>(null);

  useEffect(() => {
    localStorage.setItem('safespace_gratitude_jar', JSON.stringify(slips));
  }, [slips]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gratitudeText.trim()) return;

    const newSlip: GratitudeSlip = {
      id: Date.now().toString(),
      text: gratitudeText.trim(),
      timestamp: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      hue: Math.floor(Math.random() * 360),
    };

    setSlips([...slips, newSlip]);
    setGratitudeText('');
  };

  const drawMemory = () => {
    if (slips.length === 0) return;
    const index = Math.floor(Math.random() * slips.length);
    setDrawnSlip(slips[index]);
  };

  const handleEmptyJar = () => {
    if (window.confirm('Empty your warm memories?')) {
      setSlips([]);
      setDrawnSlip(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F1F5F2] p-5 overflow-y-auto no-scrollbar relative">
      {/* Header */}
      <div className="flex items-center justify-between mt-3 mb-2 shrink-0">
        <button
          onClick={onBack}
          className="text-[#4A6741] hover:bg-[#E1E8E3] rounded-full p-1.5 transition border-0 bg-transparent cursor-pointer flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none font-mono">Dopamine Lift</span>
        {slips.length > 0 ? (
          <button
            onClick={handleEmptyJar}
            className="text-slate-400 hover:text-red-500 font-bold text-[9px] cursor-pointer bg-transparent border-0"
          >
            Empty Jar
          </button>
        ) : <div className="w-8 h-8" />}
      </div>

      <div className="text-center mb-3 shrink-0">
        <h2 className="text-lg font-black text-[#4A6741] leading-tight font-sans">Gratitude Jar</h2>
        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
          Drop written gems of gratitude inside. Draw memories back out when things look dark.
        </p>
      </div>

      {/* Main double segment wrapper - unconstrained to allow natural scrolling */}
      <div className="flex flex-col space-y-4 pb-6">
        
        {/* The visual Jar */}
        <div className="bg-white/80 p-3.5 rounded-3xl border border-white flex flex-col items-center shadow-xs">
          {/* Glass Jar container */}
          <div className="relative w-28 h-32 border-[3px] border-[#4A6741]/40 rounded-b-[40px] rounded-t-2xl flex flex-wrap content-end justify-center gap-1.5 p-2 bg-slate-50/10 shadow-inner select-none mb-3 overflow-hidden">
            {/* Lids */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-[#4A6741]/60 rounded-full" />
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-12 h-1.5 bg-[#4A6741]/50 rounded-full" />
            
            {/* Glare line */}
            <div className="absolute left-2.5 top-5 w-1 h-20 bg-white/45 rounded-full pointer-events-none" />

            {/* Slips stacked */}
            {slips.map((slip, i) => (
              <div
                key={slip.id}
                className="w-4 h-4 rounded-md filter scale-95 shadow-2xs brightness-105 animate-bounce"
                style={{
                  backgroundColor: `hsla(${slip.hue}, 80%, 80%, 0.95)`,
                  border: `1px solid hsla(${slip.hue}, 80%, 45%, 0.25)`,
                  transform: `rotate(${(i * 35) % 80 - 40}deg)`,
                  marginTop: '-3px'
                }}
                title={slip.text}
              />
            ))}

            {slips.length === 0 && (
              <span className="text-[8.5px] italic text-slate-300 font-bold block mb-12 animate-pulse">Empty Jar</span>
            )}
          </div>

          <p className="text-[10px] font-mono text-slate-400 font-bold leading-none mb-3 uppercase tracking-wider">
            {slips.length} {slips.length === 1 ? 'memory' : 'memories'} in the Jar
          </p>

          <button
            onClick={drawMemory}
            disabled={slips.length === 0}
            className={`w-full py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider transition border-0 ${
              slips.length === 0
                ? 'bg-slate-100 text-slate-350 cursor-not-allowed'
                : 'bg-[#608271] text-white hover:bg-[#4A6741] cursor-pointer shadow-sm active:scale-97'
            }`}
          >
            🔮 Draw Random memory
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-white/90 border border-slate-100 p-3 rounded-2xl flex flex-col space-y-2 text-left">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider leading-none">Drop a new memory</label>
          <input
            type="text"
            required
            maxLength={110}
            placeholder="Today I loved..."
            value={gratitudeText}
            onChange={(e) => setGratitudeText(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-[10.5px] px-3 py-2 rounded-xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#4A6741] transition text-slate-800"
          />
          <button
            type="submit"
            className="py-2 bg-[#4A6741]/90 hover:bg-[#4A6741] active:scale-[0.98] transition font-bold text-[10px] text-white rounded-xl uppercase tracking-wider border-0 cursor-pointer"
          >
            Fold and Drop in ➔
          </button>
        </form>
      </div>

      {/* DRAW POPUP MODAL */}
      {drawnSlip && (
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm z-50 rounded-[35px] flex items-center justify-center p-6 animate-fade-in select-none">
          <div
            className="w-full h-fit rounded-[32px] p-5 text-center shadow-2xl flex flex-col justify-between items-center relative animate-slide-up border transition-all duration-300"
            style={{
              backgroundColor: isDarkMode ? `hsla(${drawnSlip.hue}, 30%, 14%, 0.98)` : `hsla(${drawnSlip.hue}, 92%, 96%, 0.98)`,
              borderColor: isDarkMode ? `hsla(${drawnSlip.hue}, 50%, 40%, 0.5)` : `hsla(${drawnSlip.hue}, 80%, 45%, 0.3)`
            }}
          >
            {/* Soft background decor */}
            <div className="absolute top-4 left-4 text-2xl select-none opacity-20">✨</div>
            <div className="absolute bottom-4 right-4 text-2xl select-none opacity-20">🤍</div>

            <div className="space-y-3.5 py-4 w-full h-full">
              <span 
                className="text-[8.5px] uppercase font-black tracking-widest block" 
                style={{ color: isDarkMode ? `hsl(${drawnSlip.hue}, 80%, 75%)` : `hsl(${drawnSlip.hue}, 50%, 25%)` }}
              >
                Memories Re-emerging • {drawnSlip.timestamp}
              </span>
              
              <p 
                className="text-sm font-black italic max-w-[90%] mx-auto leading-relaxed"
                style={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}
              >
                "{drawnSlip.text}"
              </p>
            </div>

            <div className="mt-4 flex flex-col xs:flex-row gap-2.5 w-full justify-center">
              <button
                onClick={() => setDrawnSlip(null)}
                className="px-4 py-2 rounded-full font-extrabold text-[10.5px] uppercase tracking-wider text-white border-0 transition active:scale-95 cursor-pointer shadow-xs flex-1"
                style={{ backgroundColor: `hsl(${drawnSlip.hue}, 60%, 32%)` }}
              >
                Put Back in Jar 🔄
              </button>
              <button
                onClick={() => {
                  setSlips(slips.filter(s => s.id !== drawnSlip.id));
                  setDrawnSlip(null);
                }}
                className="px-4 py-2 rounded-full font-extrabold text-[10.5px] uppercase tracking-wider hover:opacity-90 border transition active:scale-95 cursor-pointer shadow-xs flex-1 bg-transparent"
                style={{ 
                  color: isDarkMode ? `hsl(${drawnSlip.hue}, 85%, 80%)` : `hsl(${drawnSlip.hue}, 70%, 24%)`,
                  borderColor: isDarkMode ? `hsla(${drawnSlip.hue}, 80%, 45%, 0.6)` : `hsla(${drawnSlip.hue}, 80%, 45%, 0.25)`
                }}
                title="Permanently remove this memory from the jar"
              >
                Discard Memory 🗑️
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="shrink-0 pt-2 border-t border-slate-100/80 text-center flex items-center justify-center gap-1">
        <Sparkles size={10} className="text-[#4A6741]" />
        <span className="text-[8.5px] text-slate-400">Taking time to note small bits of joy helps us appreciate the beauty in each day.</span>
      </div>
    </div>
  );
};


// ============================================================================
// 4. PROGRESSIVE SOMATIC MUSCLE RELIEF (ACUTE SQUEEZE REGION TRAINER)
// ============================================================================
interface SomaticProps {
  onBack: () => void;
}

const MUSCLE_REGIONS = [
  {
    name: 'Fists & Forearms',
    action: 'TENSE: Squeeze both fists tight. Curl elbows. Squeeze until knuckles turn pale.',
    release: 'RELEASE: Clean spread fingers. Lay palms open, heavy, totally warm and soft.',
    emoji: '✊'
  },
  {
    name: 'Shoulders & Neck',
    action: 'TENSE: Shrug shoulders high toward ear lobes. Pull neck downward. Squeeze hard.',
    release: 'RELEASE: Drops shoulders. Let gravity pull them fully down. Melt chest muscles.',
    emoji: '🙋'
  },
  {
    name: 'Face, Eyes & Jaw',
    action: 'TENSE: Clench jaws. Wrinkle forehead. Scrunch eyes tight. Hold hard facial grimace.',
    release: 'RELEASE: Melt lips and cheeks parted slightly. Relax the brow into absolute blank. Soft eyelids.',
    emoji: '😬'
  },
  {
    name: 'Torso & Abdomen',
    action: 'TENSE: Pull bellies in tight toward spine. Clench ribcage muscles flat.',
    release: 'RELEASE: Expand stomach out. Breathe deeply into abdomen. Let bellies rise fully.',
    emoji: '🧘'
  },
  {
    name: 'Calves & Feet',
    action: 'TENSE: Curl toe pads down. Clench calves stiff. Flex feet rigid.',
    release: 'RELEASE: Point toes straight, heavy. Let ankles flop out relaxed. Feel warm tingling.',
    emoji: '👣'
  },
];

const PMR_SPEEDS = {
  fast: { name: 'Fast', tense: 5, release: 6 },
  normal: { name: 'Normal', tense: 10, release: 12 },
  slow: { name: 'Slow', tense: 15, release: 18 }
};

export const SimulatorSomatic: React.FC<SomaticProps> = ({ onBack }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [phase, setPhase] = useState<'tense' | 'release'>('tense');
  const [pmrSpeed, setPmrSpeed] = useState<'fast' | 'normal' | 'slow'>('fast');
  const [timerLeft, setTimerLeft] = useState(PMR_SPEEDS.fast.tense);
  const [exerciseActive, setExerciseActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (exerciseActive && timerLeft > 0) {
      interval = setInterval(() => {
        setTimerLeft(t => t - 1);
      }, 1000);
    } else if (exerciseActive && timerLeft === 0) {
      const config = PMR_SPEEDS[pmrSpeed];
      // Toggle phase automatically
      if (phase === 'tense') {
        setPhase('release');
        setTimerLeft(config.release); // Release stage gets release seconds to relax
        try {
          // Play comforting bell release frequency
          playSomaticPulse(587.33); // D5 pitch chime
        } catch (e) {}
      } else {
        // Move to next muscle region automatically if not at end
        if (activeIdx < MUSCLE_REGIONS.length - 1) {
          setActiveIdx(a => a + 1);
          setPhase('tense');
          setTimerLeft(config.tense);
        } else {
          // End of cycle
          setExerciseActive(false);
          setPhase('tense');
          setTimerLeft(config.tense);
        }
      }
    }
    return () => clearInterval(interval);
  }, [exerciseActive, timerLeft, phase, pmrSpeed, activeIdx]);

  const handleToggleActive = () => {
    const config = PMR_SPEEDS[pmrSpeed];
    if (!exerciseActive) {
      setExerciseActive(true);
      setTimerLeft(phase === 'tense' ? config.tense : config.release);
      try {
        playSomaticPulse(220); // Deep focal base frequency
      } catch (e) {}
    } else {
      setExerciseActive(false);
    }
  };

  const handleSpeedChange = (speed: 'fast' | 'normal' | 'slow') => {
    setPmrSpeed(speed);
    const config = PMR_SPEEDS[speed];
    setTimerLeft(phase === 'tense' ? config.tense : config.release);
  };

  const handleNavRegion = (newIdx: number) => {
    setActiveIdx(newIdx);
    setPhase('tense');
    setTimerLeft(PMR_SPEEDS[pmrSpeed].tense);
  };

  const playSomaticPulse = (freq: number) => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;
      const ctx = new AudioCtxClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
  
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch(err) {
      // Audio context may require guest tap
    }
  };

  const currentRegion = MUSCLE_REGIONS[activeIdx];

  return (
    <div className="flex flex-col h-full bg-[#F1F5F2] p-5 justify-between overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mt-3 mb-2 shrink-0">
        <button
          onClick={onBack}
          className="text-[#4A6741] hover:bg-[#E1E8E3] rounded-full p-1.5 transition border-0 bg-transparent cursor-pointer flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none font-mono">Gentle Somatic Release</span>
        <div className="w-8 h-8" />
      </div>

      <div className="text-center mb-3 shrink-0">
        <h2 className="text-lg font-black text-[#4A6741] leading-tight font-sans font-sans">Muscle Tension Release</h2>
        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
          Tightening and then fully releasing your muscles is a beautiful way to gently signal safety and ease to your body.
        </p>
      </div>

      {/* Main Guided Pacing Node */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-sm border border-white flex flex-col items-center justify-center text-center select-none shrink-0 mb-3.5">
        <span className="text-[8.5px] font-black tracking-widest uppercase text-[#4A6741] bg-[#4A6741]/10 px-3 py-1 rounded-full mb-3">
          Region {activeIdx + 1} of {MUSCLE_REGIONS.length} • {currentRegion.name}
        </span>

        {/* Pulsing focal ring */}
        <div className="relative w-24 h-24 flex items-center justify-center select-none mb-3.5">
          <div
            className={`absolute inset-0 rounded-full transition-all duration-1000 ${
              exerciseActive 
                ? phase === 'tense' 
                  ? 'bg-amber-600/15 scale-[1.06] animate-pulse' 
                  : 'bg-emerald-600/15 scale-[1.12] animate-ping'
                : 'bg-slate-100'
            }`}
          />
          <div
            className={`absolute inset-2.5 rounded-full border flex flex-col items-center justify-center transition shadow-sm bg-white ${
              exerciseActive 
                ? phase === 'tense' ? 'border-amber-400' : 'border-emerald-400'
                : 'border-slate-200'
            }`}
          >
            {exerciseActive ? (
              <div className="text-center leading-none">
                <span className={`text-[10px] font-black uppercase tracking-wider block ${phase === 'tense' ? 'text-amber-750' : 'text-emerald-700'}`}>
                  {phase === 'tense' ? 'Squeeze' : 'Let Go'}
                </span>
                <span className="text-2xl font-black text-slate-850 block font-mono mt-1">{timerLeft}s</span>
              </div>
            ) : (
              <span className="text-2xl select-none">{currentRegion.emoji}</span>
            )}
          </div>
        </div>

        {/* Action instruction text */}
        <p className={`text-[11.5px] leading-snug font-bold min-h-12 px-2 py-1 select-none ${
          exerciseActive && phase === 'release' ? 'text-emerald-800' : 'text-slate-800'
        }`}>
          {exerciseActive 
            ? phase === 'tense' ? currentRegion.action : currentRegion.release
            : 'Press "Begin Gentle Tension Release" below, then gently follow along muscle group by muscle group.'
          }
        </p>

        {/* Controls */}
        <div className="w-full flex items-center justify-center gap-1.5 mt-2">
          {!exerciseActive ? (
            <button
              onClick={handleToggleActive}
              className="px-5 py-2.5 bg-[#4A6741] hover:bg-[#3D5535] text-white font-extrabold text-[10px] uppercase tracking-wider rounded-full transition active:scale-95 cursor-pointer border-0 shadow-xs"
            >
              Begin Gentle Tension Release
            </button>
          ) : (
            <button
              onClick={handleToggleActive}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-full transition active:scale-95 cursor-pointer border-0"
            >
              Mute Guide
            </button>
          )}

          <button
            onClick={() => {
              const nextIdx = (activeIdx + 1) % MUSCLE_REGIONS.length;
              handleNavRegion(nextIdx);
            }}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition cursor-pointer border-0 flex items-center justify-center"
            title="Next Step"
          >
            ➔
          </button>
        </div>
      </div>

      {/* Regions navigation bar dots */}
      <div className="flex justify-center space-x-1.5 shrink-0 mb-3 select-none">
        {MUSCLE_REGIONS.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleNavRegion(idx)}
            className={`w-2 h-2 rounded-full cursor-pointer transition border-0 ${
              activeIdx === idx ? 'bg-[#4A6741] scale-110' : 'bg-slate-250 hover:bg-slate-350'
            }`}
          />
        ))}
      </div>

      {/* PMR Pace Options Card */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-2.5 px-3 border border-white flex flex-col space-y-1.5 text-[#4A6741] text-left shrink-0 mb-4 animate-fade-in select-none">
        <div className="flex items-center space-x-1.5">
          <Activity size={12} />
          <span className="text-[11px] font-bold font-sans">Relaxation Pace</span>
        </div>
        <div className="flex w-full bg-[#E1E8E3] rounded-2xl p-1">
          {[
            { val: 'fast' as const, label: 'Fast (5s)' },
            { val: 'normal' as const, label: 'Normal (10s)' },
            { val: 'slow' as const, label: 'Slow (15s)' }
          ].map(s => (
            <button
              key={s.val}
              type="button"
              onClick={() => handleSpeedChange(s.val)}
              className={`flex-1 text-[10px] font-bold py-1.5 rounded-xl transition cursor-pointer border-0 ${
                pmrSpeed === s.val ? 'bg-white shadow-xs text-[#4A6741]' : 'text-[#4A6741]/60 hover:text-[#4A6741]/85'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="shrink-0 pt-2 border-t border-slate-100/80 text-center flex items-center justify-center gap-1">
        <Activity size={10} className="text-[#4A6741]" />
        <span className="text-[8.5px] text-slate-400">Releasing physical tension is a gentle way to remind your body that it is safe to rest.</span>
      </div>
    </div>
  );
};


// ============================================================================
// 5. GENTLE PERSONAL SAFETY PLAN BUILDER
// ============================================================================
interface SafetyProps {
  onBack: () => void;
}

const STEP_EXAMPLES: Record<string, string[]> = {
  warningSigns: [
    'Feeling physically tense or restless in the evening',
    'Not wanting to reply to texts or answer messages',
    'Shallow breathing or holding your breath unconsciously',
    'Clenching your jaw or feeling sudden neck stiffness'
  ],
  copingStrategies: [
    'Do a 4-7-8 mindful breathing cycle for 2 minutes',
    'Listen to gentle forest stream or soft rainfall sounds',
    'Splash cool water on your face to slow your heart rate',
    'Step away to stretch your shoulders and neck slowly'
  ],
  socialOutlets: [
    'A peaceful corner in your local community library',
    'A quiet bench in the park under a shady tree',
    'A warm, cozy independent neighborhood coffee shop',
    'Strolling down a familiar, quiet and calm street'
  ],
  keySupporters: [
    'A close, non-judgmental friend or trusted buddy',
    'A supportive sibling or family member',
    'Crisis Support Helpline (Call or Text 988)',
    'Crisis Text Line (Text HOME to 741741)',
    'The Trevor Project LGBTQ+ Support (Call 1-866-488-7386 or Text START to 678-678)'
  ],
  safeEnvironments: [
    'Under a soft, heavy blanket with lights turned low',
    'A comfortable chair with gentle, soothing music',
    'A cozy spot on my bedroom rug with nice pillows',
    'A clean, dimly lit room with a warm mug of tea'
  ]
};

export const SimulatorSafetyPlan: React.FC<SafetyProps> = ({ onBack }) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [tempText, setTempText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [plan, setPlan] = useState<SafetyPlanData>(() => {
    const saved = localStorage.getItem('safespace_safety_plan');
    return saved ? JSON.parse(saved) : {
      warningSigns: [],
      copingStrategies: [],
      socialOutlets: [],
      keySupporters: [],
      safeEnvironments: [],
    };
  });

  useEffect(() => {
    localStorage.setItem('safespace_safety_plan', JSON.stringify(plan));
  }, [plan]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempText.trim()) return;

    setPlan(prev => {
      const updated = { ...prev };
      const val = tempText.trim();
      switch (activeStep) {
        case 1: updated.warningSigns = [...prev.warningSigns, val]; break;
        case 2: updated.copingStrategies = [...prev.copingStrategies, val]; break;
        case 3: updated.socialOutlets = [...prev.socialOutlets, val]; break;
        case 4: updated.keySupporters = [...prev.keySupporters, val]; break;
        case 5: updated.safeEnvironments = [...prev.safeEnvironments, val]; break;
      }
      return updated;
    });
    setTempText('');
  };

  const handleRemove = (key: keyof SafetyPlanData, index: number) => {
    setPlan(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index)
    }));
  };

  // Steps definition array
  const STEPS_REF = [
    { id: 1, title: 'My Signs of Tension', key: 'warningSigns' as const, sub: 'Notice how you feel physically or emotionally when stress starts to rise.' },
    { id: 2, title: 'What Helps Me Calm Down', key: 'copingStrategies' as const, sub: 'Simple practices you can do by yourself to feel comfortable.' },
    { id: 3, title: 'My Comforting Places', key: 'socialOutlets' as const, sub: 'Locations, parks, or cozy spots that help you feel naturally peaceful.' },
    { id: 4, title: 'People I Can Reach Out To', key: 'keySupporters' as const, sub: 'Dearest, trusted friends, supportive family, or lines to contact.' },
    { id: 5, title: 'My Peaceful Spaces', key: 'safeEnvironments' as const, sub: 'Spaces where you feel completely comfortable and able to rest.' },
  ];

  const currStep = STEPS_REF[activeStep - 1];
  const itemsList = plan[currStep.key];

  return (
    <div className="flex flex-col h-full bg-[#F1F5F2] p-5 overflow-y-auto no-scrollbar select-none">
      {/* Header */}
      <div className="flex items-center justify-between mt-3 mb-2 shrink-0">
        <button
          onClick={onBack}
          className="text-[#4A6741] hover:bg-[#E1E8E3] rounded-full p-1.5 transition border-0 bg-transparent cursor-pointer flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest leading-none font-mono">My Safety Plan</span>
        <div className="w-8 h-8" />
      </div>

      <div className="text-center mb-3 shrink-0">
        <h2 className="text-lg font-black text-[#4A6741] leading-tight font-sans">Safety & Comfort Plan</h2>
        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
          A personalized crisis safety blueprint based on gold-standard steps to maintain tranquility and seek kind support.
        </p>
      </div>

      {/* Mode Switcher */}
      {!isEditing ? (
        /* ================================================= */
        /* VIEW MODE: Beautiful Compiled Safety Plan Display */
        /* ================================================= */
        <div className="flex flex-col space-y-3.5 pb-6">
          {/* Prominent Edit Action Element */}
          <button
            onClick={() => setIsEditing(true)}
            className="w-full flex items-center justify-center space-x-1.5 py-2.5 px-4 bg-slate-900 text-white font-extrabold text-[11px] rounded-2xl hover:bg-slate-800 active:scale-98 transition shadow-sm border-0 cursor-pointer"
          >
            <Edit2 size={12} className="animate-pulse" />
            <span>Edit My Safety Plan</span>
          </button>

          {/* List of custom styled safety sections */}
          <div className="space-y-3">
            {STEPS_REF.map(s => {
              const currentList = plan[s.key];
              const getEmojiForStep = (id: number) => {
                switch(id) {
                  case 1: return '⚠️';
                  case 2: return '🧘';
                  case 3: return '🌎';
                  case 4: return '📞';
                  case 5: return '🏡';
                  default: return '✨';
                }
              };
              return (
                <div key={s.id} className="bg-white/95 rounded-2xl p-3.5 border border-[#CAD9CC]/65 text-left shadow-xs hover:scale-[1.01] transition-transform duration-200">
                  <div className="flex items-center space-x-1.5 mb-2">
                    <span className="text-xs">{getEmojiForStep(s.id)}</span>
                    <span className="font-extrabold text-[9.5px] text-[#4A6741] uppercase tracking-wide">{s.title}</span>
                  </div>
                  {currentList.length > 0 ? (
                    <div className="space-y-1.5 pl-0.5">
                      {currentList.map((item, idx) => (
                        <div key={idx} className="text-[10.5px] text-slate-700 font-semibold leading-relaxed bg-[#F1F5F2]/45 py-1 px-2.5 rounded-xl border border-slate-100 flex items-start gap-1">
                          <Check size={10} className="text-emerald-600 mt-1 shrink-0 stroke-[3]" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1.5 pl-0.5">
                      <div className="text-[8.5px] font-black text-slate-400 tracking-wider uppercase mb-1">Suggested Examples:</div>
                      {STEP_EXAMPLES[s.key].slice(0, 2).map((item, idx) => (
                        <div key={idx} className="text-[10px] text-slate-450 leading-relaxed bg-[#F8FAFC]/90 py-1 px-2.5 rounded-xl border border-dashed border-slate-200/80 flex items-start gap-1 select-none">
                          <span className="text-slate-300 mt-0.5">•</span>
                          <span>{item}</span>
                        </div>
                      ))}
                      <p className="text-[8px] text-slate-400 italic mt-1 font-medium pl-1">
                        No custom items added yet. Tap "Edit" to customize.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Supportive note */}
          <div className="bg-emerald-50/50 rounded-2xl p-3 border border-emerald-100/60 text-left select-none relative overflow-hidden flex items-center space-x-2">
            <Shield size={14} className="text-emerald-600 shrink-0" />
            <p className="text-[9.5px] font-bold text-emerald-800 leading-tight">
              Reviewing these details regularly reinforces calming pathways in the mind. Set simple, caring reminders to stay centered.
            </p>
          </div>
        </div>
      ) : (
        /* ================================================= */
        /* EDIT MODE: Step-by-Step Interactive Form Editor    */
        /* ================================================= */
        <div className="flex flex-col space-y-3.5 pb-6">
          {/* Step circles navigation */}
          <div className="flex justify-between items-center bg-white/70 border border-slate-100 p-2 rounded-2xl select-none shrink-0 gap-1 overflow-x-auto no-scrollbar">
            {STEPS_REF.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveStep(s.id as any)}
                className={`w-6.5 h-6.5 rounded-full flex items-center justify-center text-[9.5px] font-black transition border-0 cursor-pointer ${
                  activeStep === s.id
                    ? 'bg-[#4A6741] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-150'
                }`}
              >
                {s.id}
              </button>
            ))}
          </div>

          {/* Work area block */}
          <div className="bg-white/95 rounded-3xl p-3.5 border border-[#CAD9CC]/50 shadow-sm text-left">
            <span className="text-[8px] font-bold text-[#4A6741] uppercase tracking-wider block">Step {currStep.id} of 5</span>
            <h3 className="text-xs font-black text-slate-800 leading-tight mt-0.5 mb-1">{currStep.title}</h3>
            <p className="text-[9px] text-slate-405 leading-tight mb-3 font-medium">{currStep.sub}</p>

            {/* Form */}
            <form onSubmit={handleAdd} className="flex gap-2 mb-3">
              <input
                type="text"
                required
                placeholder="e.g. Add details..."
                value={tempText}
                onChange={(e) => setTempText(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 text-[10.5px] rounded-xl focus:outline-none focus:bg-white text-slate-800 focus:border-[#4A6741]/55"
              />
              <button
                type="submit"
                className="bg-[#4A6741] hover:bg-[#3E5536] text-white p-2 rounded-xl flex items-center justify-center transition border-0 cursor-pointer shadow-xs"
              >
                <Plus size={13} />
              </button>
            </form>

            {/* active list records */}
            <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar pl-0.5">
              {itemsList.length === 0 ? (
                <p className="text-[9.5px] italic text-slate-350 pr-2 leading-snug py-2 text-center font-bold">Your custom list is currently empty. Add items using the box above or tap the suggestions below!</p>
              ) : (
                itemsList.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-[#F1F5F2]/50 hover:bg-[#F1F5F2] border border-slate-100 rounded-xl p-2 select-none">
                    <span className="text-[10px] text-slate-700 font-semibold font-sans leading-tight break-all flex-1 pr-3">
                      ✔ {item}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemove(currStep.key, idx)}
                      className="text-slate-355 hover:text-red-500 transition border-0 bg-transparent cursor-pointer p-1"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Quick addition chips */}
            <div className="mt-4 pt-3 border-t border-slate-150">
              <span className="text-[8.5px] font-black text-[#4A6741] uppercase tracking-wider block mb-2">💡 Tap Example to Add Immediately:</span>
              <div className="flex flex-wrap gap-1.5">
                {STEP_EXAMPLES[currStep.key].map((item, idx) => {
                  const isAlreadyAdded = itemsList.includes(item);
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAlreadyAdded}
                      onClick={() => {
                        setPlan(prev => ({
                          ...prev,
                          [currStep.key]: [...prev[currStep.key], item]
                        }));
                      }}
                      className={`text-[9.5px] font-semibold py-1 px-2 rounded-full transition cursor-pointer text-left border active:scale-95 text-xs ${
                        isAlreadyAdded 
                          ? 'bg-slate-50 text-slate-350 border-slate-100 cursor-not-allowed opacity-60' 
                          : 'bg-[#F1F5F2] text-slate-700 border-slate-200/60 hover:bg-[#E2ECE4] hover:text-[#4A6741] hover:border-[#CAD9CC]'
                      }`}
                    >
                      {isAlreadyAdded ? '✓ Added' : `+ ${item}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Done action */}
          <button
            onClick={() => setIsEditing(false)}
            className="w-full flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-[#4A6741] hover:bg-[#3E5536] text-white font-black text-xs rounded-2xl transition border-0 cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <Check size={14} />
            <span>Done & Preview Plan</span>
          </button>
        </div>
      )}

      <div className="shrink-0 pt-2 border-t border-slate-100/80 text-center flex items-center justify-center gap-1">
        <Shield size={10} className="text-[#4A6741]" />
        <span className="text-[8.5px] text-slate-400">A personalized plan is a warm and helpful way to care for yourself.</span>
      </div>
    </div>
  );
};
