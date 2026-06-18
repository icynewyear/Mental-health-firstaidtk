import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Check, Sparkles, Smile, RotateCcw, Shield, Heart, HelpCircle, Activity, Info } from 'lucide-react';
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
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none font-mono">Cognitive Audit</span>
        <div className="w-8 h-8" />
      </div>

      <div className="text-center mb-3.5 shrink-0">
        <h2 className="text-lg font-black text-[#4A6741] leading-tight font-sans">Thought Reframer</h2>
        <p className="text-[10px] text-slate-500 mt-0.5 max-w-[90%] mx-auto leading-tight">
          Deconstruct anxious automatic loops of cognitive distortion into balanced, realistic perspectives.
        </p>
      </div>

      {/* Main interactive form wrapper - unconstrained to allow natural scrolling */}
      <div className="flex flex-col space-y-4 pb-6">
        <form onSubmit={handleSave} className="bg-white/90 backdrop-blur border border-[#E1E8E3] rounded-3xl p-3.5 shadow-sm space-y-3.5 text-left">
          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">1. My Automatic Negative Thought</label>
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
            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">2. Identify the Distortion</label>
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
            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">3. Balanced Reframe (Rational Thought)</label>
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
            <span>Store Reframed Thought</span>
          </button>
        </form>

        {/* History Log */}
        <div className="space-y-2 select-none">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block text-left">Your Reframing History</span>
          
          {logs.length === 0 ? (
            <div className="bg-white/40 border border-[#E1E8E3]/50 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-slate-400 italic font-medium">No reframes saved yet today. Break the cycle above!</p>
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
        <span className="text-[8.5px] text-slate-400 italic">CBT practices build brand new automatic neural responses.</span>
      </div>
    </div>
  );
};


// ============================================================================
// 2. NEURO-BASICS HABIT CHECKLIST (BIOLOGICAL WELLNESS RESILIENCE)
// ============================================================================
interface HabitProps {
  onBack: () => void;
}

export const SimulatorHabit: React.FC<HabitProps> = ({ onBack }) => {
  const [habits, setHabits] = useState<HabitItem[]>(() => {
    const saved = localStorage.getItem('safespace_daily_habits');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', name: 'Circadian Sunlight (10m in AM)', completed: false, category: 'Circadian', icon: '☀️' },
      { id: '2', name: 'Biological Hydration (8 glasses)', completed: false, category: 'Hydration', icon: '💧' },
      { id: '3', name: 'Endorphin Walk (15m body move)', completed: false, category: 'Movement', icon: '🚶' },
      { id: '4', name: 'Vagus Resonant Deep Breathing', completed: false, category: 'Vagus', icon: '🍃' },
      { id: '5', name: 'Microbiome Balance Nutrient Meal', completed: false, category: 'Nourishment', icon: '🥗' },
      { id: '6', name: 'Oxytocin Support Check-in', completed: false, category: 'Social Connection', icon: '🗣️' },
      { id: '7', name: 'Screen-Free Chill Period (30m)', completed: false, category: 'Melatonin', icon: '📴' },
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
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none font-mono">Resilience Audit</span>
        <button
          onClick={handleReset}
          className="text-slate-400 hover:text-[#4A6741] text-[9px] font-black uppercase tracking-wider bg-white rounded-lg px-2 py-1 border border-slate-100 transition cursor-pointer"
        >
          Reset
        </button>
      </div>

      <div className="text-center mb-3 shrink-0">
        <h2 className="text-lg font-black text-[#4A6741] leading-tight font-sans">Neuro-Vitals Tracker</h2>
        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
          Verify neurotransmitter essentials before concluding distress is mental. Fix biology first.
        </p>
      </div>

      {/* Progress Compliance Box */}
      <div className="bg-white border border-[#E1E8E3] rounded-3xl p-3.5 shadow-2xs mb-3 flex flex-col items-center shrink-0">
        <div className="flex justify-between items-center w-full mb-1.5 text-[10.5px]">
          <span className="font-extrabold text-slate-700">Daily Compliance Index</span>
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
          {completedCount === 0 && '🧬 Activate neurochemistry! Tap elements below.'}
          {completedCount > 0 && completedCount < 4 && '💡 Incremental steps stabilize nervous response.'}
          {completedCount >= 4 && completedCount < habits.length && '🌟 Brain resilience active. Good dopamine support!'}
          {completedCount === habits.length && '👑 Complete biological balance! System optimized.'}
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
        <span className="text-[8.5px] text-slate-400">Sleep, light, hydration are physiological stress counterweights.</span>
      </div>
    </div>
  );
};


// ============================================================================
// 3. GRATITUDE JAR (AMPLIFYING JOY SLIPS)
// ============================================================================
interface GratitudeProps {
  onBack: () => void;
}

export const SimulatorGratitude: React.FC<GratitudeProps> = ({ onBack }) => {
  const [gratitudeText, setGratitudeText] = useState('');
  const [slips, setSlips] = useState<GratitudeSlip[]>(() => {
    const saved = localStorage.getItem('safespace_gratitude_jar');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'Quiet morning sitting with sweet warm peppermint tea', timestamp: 'Jun 10', hue: 145 },
      { id: '2', text: 'Friend text me an silly inside joke out of nowhere', timestamp: 'Jun 12', hue: 35 },
      { id: '3', text: 'Sound of heavy rain pattering on the window glass', timestamp: 'Today', hue: 200 }
    ];
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
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 rounded-[35px] flex items-center justify-center p-6 animate-fade-in select-none">
          <div
            className="w-full h-fit rounded-[32px] p-5 text-center shadow-2xl flex flex-col justify-between items-center relative animate-slide-up border"
            style={{
              backgroundColor: `hsla(${drawnSlip.hue}, 92%, 96%, 0.98)`,
              borderColor: `hsla(${drawnSlip.hue}, 80%, 45%, 0.3)`
            }}
          >
            {/* Soft background decor */}
            <div className="absolute top-4 left-4 text-2xl select-none opacity-20">✨</div>
            <div className="absolute bottom-4 right-4 text-2xl select-none opacity-20">🤍</div>

            <div className="space-y-3.5 py-4 w-full h-full text-slate-800">
              <span className="text-[8.5px] uppercase font-black tracking-widest text-[#4A6741]" style={{ color: `hsl(${drawnSlip.hue}, 50%, 25%)` }}>
                Memories Re-emerging • {drawnSlip.timestamp}
              </span>
              
              <p className="text-sm font-black italic max-w-[90%] mx-auto leading-relaxed text-slate-800">
                "{drawnSlip.text}"
              </p>
            </div>

            <button
              onClick={() => setDrawnSlip(null)}
              className="mt-4 px-6 py-2 rounded-full font-extrabold text-[10px] uppercase tracking-wider text-white border-0 transition active:scale-95 cursor-pointer shadow-sm"
              style={{ backgroundColor: `hsl(${drawnSlip.hue}, 60%, 32%)` }}
            >
              Put Back in Jar ✕
            </button>
          </div>
        </div>
      )}

      <div className="shrink-0 pt-2 border-t border-slate-100/80 text-center flex items-center justify-center gap-1">
        <Sparkles size={10} className="text-[#4A6741]" />
        <span className="text-[8.5px] text-slate-400">Gratitude retrains brains to notice resource abundances.</span>
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

export const SimulatorSomatic: React.FC<SomaticProps> = ({ onBack }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [phase, setPhase] = useState<'tense' | 'release'>('tense');
  const [timerLeft, setTimerLeft] = useState(5);
  const [exerciseActive, setExerciseActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (exerciseActive && timerLeft > 0) {
      interval = setInterval(() => {
        setTimerLeft(t => t - 1);
      }, 1000);
    } else if (exerciseActive && timerLeft === 0) {
      // Toggle phase automatically
      if (phase === 'tense') {
        setPhase('release');
        setTimerLeft(6); // Release stage gets 6 seconds to relax
        try {
          // Play comforting bell release frequency
          playSomaticPulse(587.33); // D5 pitch chime
        } catch (e) {}
      } else {
        // Move to next muscle region automatically if not at end
        if (activeIdx < MUSCLE_REGIONS.length - 1) {
          setActiveIdx(a => a + 1);
          setPhase('tense');
          setTimerLeft(5);
        } else {
          // End of cycle
          setExerciseActive(false);
          setPhase('tense');
          setTimerLeft(5);
        }
      }
    }
    return () => clearInterval(interval);
  }, [exerciseActive, timerLeft, phase]);

  const handleToggleActive = () => {
    if (!exerciseActive) {
      setExerciseActive(true);
      setTimerLeft(5);
      setPhase('tense');
      try {
        playSomaticPulse(220); // Deep focal base frequency
      } catch (e) {}
    } else {
      setExerciseActive(false);
    }
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
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none font-mono">Somatic Vagus</span>
        <div className="w-8 h-8" />
      </div>

      <div className="text-center mb-3 shrink-0">
        <h2 className="text-lg font-black text-[#4A6741] leading-tight font-sans font-sans">Somatic Lock-Release</h2>
        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
          Physical anxiety locks into muscle fibers. Squeeze tight then melt to cheat heart rate spikes.
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
                  {phase}
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
            : 'Press "Begin Somatic Protocol" below, then lock each muscle group specified.'
          }
        </p>

        {/* Controls */}
        <div className="w-full flex items-center justify-center gap-1.5 mt-2">
          {!exerciseActive ? (
            <button
              onClick={handleToggleActive}
              className="px-5 py-2.5 bg-[#4A6741] hover:bg-[#3D5535] text-white font-extrabold text-[10px] uppercase tracking-wider rounded-full transition active:scale-95 cursor-pointer border-0 shadow-xs"
            >
              Begin Somatic Protocol
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
              setActiveIdx(prev => (prev + 1) % MUSCLE_REGIONS.length);
              setPhase('tense');
              if (exerciseActive) setTimerLeft(5);
            }}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition cursor-pointer border-0 flex items-center justify-center"
            title="Next Step"
          >
            ➔
          </button>
        </div>
      </div>

      {/* Regions navigation bar dots */}
      <div className="flex justify-center space-x-1.5 shrink-0 mb-4 select-none">
        {MUSCLE_REGIONS.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setActiveIdx(idx);
              setPhase('tense');
              if (exerciseActive) setTimerLeft(5);
            }}
            className={`w-2 h-2 rounded-full cursor-pointer transition border-0 ${
              activeIdx === idx ? 'bg-[#4A6741] scale-110' : 'bg-slate-250 hover:bg-slate-350'
            }`}
          />
        ))}
      </div>

      <div className="shrink-0 pt-2 border-t border-slate-100/80 text-center flex items-center justify-center gap-1">
        <Activity size={10} className="text-[#4A6741]" />
        <span className="text-[8.5px] text-slate-400">PMR resets neurological alarm loops by exhausting somatic fibers.</span>
      </div>
    </div>
  );
};


// ============================================================================
// 5. INTERACTIVE STANLEY-BROWN CLINICAL-GRADE SAFETY PLAN BUILDER
// ============================================================================
interface SafetyProps {
  onBack: () => void;
}

export const SimulatorSafetyPlan: React.FC<SafetyProps> = ({ onBack }) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [tempText, setTempText] = useState('');

  const [plan, setPlan] = useState<SafetyPlanData>(() => {
    const saved = localStorage.getItem('safespace_safety_plan');
    return saved ? JSON.parse(saved) : {
      warningSigns: ['Racing thoughts in the evenings', 'Isolating from family texts'],
      copingStrategies: ['Resonant box breathing for 5 minutes', 'Tibetan Singing bowl ambient mixer preset'],
      socialOutlets: ['A busy local green neighborhood coffee house', 'Sisters phone line'],
      keySupporters: ['My main roommate (John): 555-0129', 'Primary guardian (Mom)'],
      safeEnvironments: ['Quiet bathroom with the lock on', 'A local nature park bench'],
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
    { id: 1, title: 'Warning Signs', key: 'warningSigns' as const, sub: 'Recognize your somatic tell-tales & emotional ticks that predict distress.' },
    { id: 2, title: 'Internal Coping', key: 'copingStrategies' as const, sub: 'Actions you do entirely by yourself without talking to anyone.' },
    { id: 3, title: 'Social Venues / Outlets', key: 'socialOutlets' as const, sub: 'Locations, cafes, parks or forums that naturally distract your focus.' },
    { id: 4, title: 'Key Supporter Contacts', key: 'keySupporters' as const, sub: 'Dearest, trusted friends or family members to call in severe crisis.' },
    { id: 5, title: 'Safe Environments', key: 'safeEnvironments' as const, sub: 'Physically secure rooms or spots where you can shelter temporarily.' },
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
        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest leading-none font-mono">Stanley-Brown Plan</span>
        <div className="w-8 h-8" />
      </div>

      <div className="text-center mb-3 shrink-0">
        <h2 className="text-lg font-black text-[#4A6741] leading-tight font-sans">Shield of Safety</h2>
        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
          Establish clinical-grade contingency steps on-device to navigate high-risk emotional spikes.
        </p>
      </div>

      {/* Main steps cards wrapper - unconstrained to allow natural scrolling */}
      <div className="flex flex-col space-y-3.5 pb-6">
        {/* Step indicator pills */}
        <div className="flex justify-between items-center bg-white/70 border border-slate-100 p-2 rounded-2xl select-none shrink-0 gap-1 overflow-x-auto no-scrollbar">
          {STEPS_REF.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveStep(s.id as any)}
              className={`w-6.5 h-6.5 rounded-full flex items-center justify-center text-[9.5px] font-black transition border-0 cursor-pointer ${
                activeStep === s.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-105 text-slate-450 hover:bg-slate-150'
              }`}
            >
              {s.id}
            </button>
          ))}
        </div>

        {/* Interactive Workspace Area Card */}
        <div className="bg-white/95 rounded-3xl p-3.5 border border-[#CAD9CC]/50 shadow-sm text-left">
          <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-wider block">Step {currStep.id} of 5</span>
          <h3 className="text-xs font-black text-[#4A6741] leading-tight mt-0.5 mb-1">{currStep.title}</h3>
          <p className="text-[9px] text-slate-400 leading-tight mb-3 font-medium">{currStep.sub}</p>

          {/* Form to append */}
          <form onSubmit={handleAdd} className="flex gap-2 mb-3">
            <input
              type="text"
              required
              placeholder="e.g. Add actionable item..."
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 text-[10.5px] rounded-xl focus:outline-none focus:bg-white text-slate-800"
            />
            <button
              type="submit"
              className="bg-[#4A6741] hover:bg-[#3E5536] text-white p-2 rounded-xl flex items-center justify-center transition border-0 cursor-pointer shadow-xs"
            >
              <Plus size={13} />
            </button>
          </form>

          {/* Active List of custom step records */}
          <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar pl-0.5">
            {itemsList.length === 0 ? (
              <p className="text-[9.5px] italic text-slate-350 pr-2 leading-none py-2 text-center font-bold">No custom plans filed under this step. Compose some!</p>
            ) : (
              itemsList.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-[#F1F5F2]/50 hover:bg-[#F1F5F2] border border-slate-100 rounded-xl p-2 select-none">
                  <span className="text-[10px] text-slate-700 font-semibold font-sans leading-tight leading-none break-all flex-1 pr-3">
                    ✔ {item}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(currStep.key, idx)}
                    className="text-slate-350 hover:text-red-500 transition border-0 bg-transparent cursor-pointer p-0.5"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Plan Compilation Card Previewer */}
        <div className="bg-slate-900 text-slate-100 rounded-[24px] p-3 shadow-inner border border-slate-800 text-left select-none relative overflow-hidden">
          {/* Subtle safety emblem */}
          <Shield size={65} className="absolute right-[-15px] bottom-[-15px] text-slate-800/60 pointer-events-none select-none" />
          <div className="flex items-center space-x-1 mb-2">
            <Shield size={12} className="text-emerald-400" />
            <span className="text-[8px] font-black tracking-wider uppercase text-slate-400 font-mono">My Consolidated Shield of Safety</span>
          </div>

          <div className="space-y-2 relative z-10">
            {STEPS_REF.map(s => {
              const currentList = plan[s.key];
              return (
                <div key={s.id} className="text-[9.5px]">
                  <span className="font-extrabold text-indigo-400">{s.id}. {s.title}:</span>{' '}
                  <span className="text-slate-200">
                    {currentList.length > 0 ? currentList.join(' • ') : <span className="text-slate-600 italic">None logged</span>}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="shrink-0 pt-2 border-t border-slate-100/80 text-center flex items-center justify-center gap-1">
        <Shield size={10} className="text-[#4A6741]" />
        <span className="text-[8.5px] text-slate-400">The Stanley-Brown blueprint is used globally to secure crisis defense.</span>
      </div>
    </div>
  );
};
