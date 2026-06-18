import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Lock, Trash2, Key, Play, Pause, Sparkles, Smile, RefreshCw, Volume2, ShieldAlert, HeartHandshake, Eye, AlertCircle, Info, Activity } from 'lucide-react';

// ============================================================================
// HELPERS FOR EXPLAINABILITY
// ============================================================================
const playFrequencySound = (freq: number, type: 'sine' | 'triangle' | 'sawtooth' = 'sine', duration = 0.5, gainVal = 0.08) => {
  try {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtxClass) return;
    const ctx = new AudioCtxClass();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gainNode.gain.setValueAtTime(gainVal, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {}
};

// ============================================================================
// 1. WORRY BOX (CBT WORRY POSTPONEMENT CONTAINER)
// ============================================================================
interface WorryItem {
  id: string;
  text: string;
  duration: number; // in minutes
  lockedAt: number; // timestamp
}

export const SimulatorWorryBox: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [worryText, setWorryText] = useState('');
  const [delayMins, setDelayMins] = useState(15);
  const [worries, setWorries] = useState<WorryItem[]>(() => {
    const saved = localStorage.getItem('safespace_worries');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('safespace_worries', JSON.stringify(worries));
  }, [worries]);

  const handleLockWorry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!worryText.trim()) return;

    const newItem: WorryItem = {
      id: Date.now().toString(),
      text: worryText.trim(),
      duration: delayMins,
      lockedAt: Date.now(),
    };

    setWorries([newItem, ...worries]);
    setWorryText('');
    playFrequencySound(180, 'sine', 0.8, 0.05); // Resonant locking sound
  };

  const handleUnlockEarly = (id: string) => {
    if (window.confirm('CBT guidance: Are you sure you are ready to examine this worry now, or can it wait for scheduled Worry Time?')) {
      setWorries(worries.filter(w => w.id !== id));
      playFrequencySound(330, 'sine', 0.4, 0.06);
    }
  };

  const getRemainingTimeText = (worry: WorryItem) => {
    const elapsedMs = Date.now() - worry.lockedAt;
    const elapsedMins = elapsedMs / (1000 * 60);
    const remaining = Math.max(0, worry.duration - elapsedMins);
    if (remaining <= 0) return 'Ready for Worry Time';
    return `${Math.ceil(remaining)} minutes left`;
  };

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
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none font-mono">Rumination Delay</span>
        <div className="w-8 h-8" />
      </div>

      <div className="text-center mb-3 shrink-0">
        <h2 className="text-lg font-black text-[#4A6741] leading-tight font-sans">Visual Worry Lockbox</h2>
        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
          CBT technique: Delaying worry reduces obsessive rumination. Deposit your worry here, schedule scheduled worry slots, and clear your active mind.
        </p>
      </div>

      {/* Main Form container */}
      <div className="flex flex-col space-y-4 pb-6">
        <form onSubmit={handleLockWorry} className="bg-white/95 rounded-3xl p-4 border border-slate-100 shadow-sm text-left space-y-3.5">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Identify what is worrying you right now</label>
            <textarea
              required
              rows={2}
              maxLength={180}
              placeholder="e.g. Will I mess up my speaking assignment tomorrow?"
              value={worryText}
              onChange={(e) => setWorryText(e.target.value)}
              className="w-full text-[10.5px] px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:bg-white text-slate-800 leading-tight transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Set rumination delay period</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[15, 30, 60, 180].map(mins => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDelayMins(mins)}
                  className={`py-1 rounded-lg text-[9px] font-bold border cursor-pointer transition ${
                    delayMins === mins
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {mins >= 60 ? `${mins/60}h` : `${mins}m`}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#4A6741] hover:bg-[#3E5536] text-white rounded-xl font-bold text-xs shadow-sm transition active:scale-98 cursor-pointer border-0 flex items-center justify-center space-x-1.5"
          >
            <Lock size={12} className="stroke-[2.5]" />
            <span>Lock & Postpone Worry</span>
          </button>
        </form>

        {/* Lockbox state */}
        <div className="space-y-2 text-left">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Safe locked worries ({worries.length})</span>
          {worries.length === 0 ? (
            <div className="bg-white/40 border border-[#E1E8E3]/50 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-slate-400 italic font-medium">Your lockbox is empty. No thoughts are currently restricted.</p>
            </div>
          ) : (
            worries.map(item => {
              const isReady = (Date.now() - item.lockedAt) / (1000 * 60) >= item.duration;
              return (
                <div key={item.id} className="bg-white/90 border border-slate-100 rounded-2xl p-3 flex justify-between items-center gap-3">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${
                      isReady ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600 hover:scale-105'
                    }`}>
                      <Lock size={13} className={isReady ? 'opacity-40' : ''} />
                    </div>
                    <div className="min-w-0">
                      {isReady ? (
                        <p className="text-[10.5px] text-slate-800 font-bold leading-tight">{item.text}</p>
                      ) : (
                        <p className="text-[10px] text-slate-400 italic filter select-none blur-[2px] leading-tight select-none">
                          Worry locked inside box
                        </p>
                      )}
                      <span className="text-[7.5px] font-bold uppercase font-mono mt-0.5 block leading-none text-slate-400">
                        ⏳ {getRemainingTimeText(item)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUnlockEarly(item.id)}
                    className="p-2 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition border-0 bg-transparent cursor-pointer"
                    title="Examine & Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. BILATERAL STIMULATION PACER (EMDR DOWN-REGULATION)
// ============================================================================
export const SimulatorEMDR: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [speedSec, setSpeedSec] = useState(2.5); // Animation cycle speed
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0); // 0 = left, 1 = right
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isPlaying) {
      // Toggle positions every (speedSec / 2) seconds
      const ms = (speedSec * 1000) / 2;
      timerRef.current = setInterval(() => {
        setPosition(prev => {
          const next = prev === 0 ? 1 : 0;
          // Soft sound on bouncing target limits
          playFrequencySound(next === 0 ? 280 : 360, 'sine', 0.15, 0.04);
          return next;
        });
      }, ms);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speedSec]);

  const handleToggle = () => {
    setIsPlaying(p => !p);
  };

  return (
    <div className="flex flex-col h-full bg-[#F1F5F2] p-5 justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mt-3 mb-2 shrink-0">
        <button
          onClick={onBack}
          className="text-[#4A6741] hover:bg-[#E1E8E3] rounded-full p-1.5 transition border-0 bg-transparent cursor-pointer flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-[10px] font-bold text-[#4A6741] uppercase tracking-widest leading-none font-mono">Bilateral Focus</span>
        <div className="w-8 h-8" />
      </div>

      <div className="text-center mb-4 shrink-0">
        <h2 className="text-lg font-black text-[#4A6741] leading-tight font-sans">Gentle Flow Eye Pacer</h2>
        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
          Keep your head steady and comfortable. Let your eyes follow the moving icon. Gentle, slow side-to-side tracking is a simple way to help calm your thoughts.
        </p>
      </div>

      {/* The Visual Track */}
      <div className="bg-white/95 rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col items-center justify-center space-y-6 flex-1 select-none max-h-[300px] mb-4">
        {/* Track slot */}
        <div className="w-full h-12 bg-slate-100 rounded-full border border-slate-200.5 relative flex items-center px-2 select-none overflow-hidden">
          {/* Moving bead */}
          <div
            className="w-8 h-8 rounded-full bg-indigo-600 shadow-md transition-all ease-in-out duration-500 absolute select-none flex items-center justify-center text-[10px] text-white font-black"
            style={{
              left: position === 0 ? '0.5rem' : 'calc(100% - 2.5rem)',
              transitionDuration: `${(speedSec * 1000) / 2}ms`
            }}
          >
            👁️
          </div>
        </div>

        {/* Adjusters */}
        <div className="w-full flex justify-between items-center text-[10.5px] select-none">
          <span className="font-extrabold text-slate-600 font-mono">Pacer Cycle Speed</span>
          <div className="flex items-center space-x-1.5 select-none font-mono font-bold">
            {[1.5, 2.5, 3.8].map(s => (
              <button
                key={s}
                onClick={() => setSpeedSec(s)}
                className={`px-2 py-1 rounded-lg border text-[9.5px] cursor-pointer transition ${
                  speedSec === s ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-650'
                }`}
              >
                {s === 1.5 ? 'Fast' : s === 2.5 ? 'Medium' : 'Slow'}
              </button>
            ))}
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={handleToggle}
          className={`w-full py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition border-0 cursor-pointer flex items-center justify-center space-x-2 shadow-xs ${
            isPlaying ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-[#4A6741] text-white hover:bg-[#3D5535]'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause size={13} className="fill-white" />
              <span>Pause Eye Pacer</span>
            </>
          ) : (
            <>
              <Play size={13} className="fill-white" />
              <span>Begin Gentle Movement</span>
            </>
          )}
        </button>
      </div>

      <div className="shrink-0 pt-2 border-t border-slate-100/80 text-center flex items-center justify-center gap-1.5">
        <Sparkles size={11.5} className="text-[#4A6741]" />
        <span className="text-[8.5px] text-slate-400">A simple focus point that encourages your mind to settle.</span>
      </div>
    </div>
  );
};

// ============================================================================
// 3. INTERACTIVE EMOTION WHEEL & FOCUS PROMPTS
// ============================================================================
const CORE_EMOTIONS = [
  { name: 'Sadness', hue: 210, icon: '😢', prompts: ['Describe what feels lost or unfinished.', 'If tears had words, what would they say?'] },
  { name: 'Anger', hue: 0, icon: '🔥', prompts: ['What boundary of yours was crossed?', 'Write down your raw frustration with zero filter.'] },
  { name: 'Fear / Panic', hue: 280, icon: '🫨', prompts: ['What is the core threat your brain is predicting?', 'How can we assure your body it is physically safe?'] },
  { name: 'Numbing', hue: 130, icon: '😶‍🌫️', prompts: ['Pinpoint where the emotional weight sits in your torso.', 'What are you avoiding feeling right now?'] },
  { name: 'Worthy', hue: 45, icon: '✨', prompts: ['Describe a small choice you handled gracefully today.', 'Who makes you feel secure being yourself?'] },
];

export const SimulatorEmotionWheel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [promptIdx, setPromptIdx] = useState(0);
  const [journalText, setJournalText] = useState('');
  const [journalLogs, setJournalLogs] = useState<{ id: string; category: string; prompt: string; text: string; time: string }[]>(() => {
    const saved = localStorage.getItem('safespace_journal_logs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('safespace_journal_logs', JSON.stringify(journalLogs));
  }, [journalLogs]);

  const selectEmotion = (idx: number) => {
    setSelectedIdx(idx);
    setPromptIdx(0);
    setJournalText('');
    playFrequencySound(350 + idx * 40, 'sine', 0.25, 0.05);
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalText.trim() || selectedIdx === null) return;

    const emotionalCore = CORE_EMOTIONS[selectedIdx];
    const logVal = {
      id: Date.now().toString(),
      category: emotionalCore.name,
      prompt: emotionalCore.prompts[promptIdx],
      text: journalText.trim(),
      time: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    setJournalLogs([logVal, ...journalLogs]);
    setJournalText('');
    setSelectedIdx(null);
    playFrequencySound(522, 'sine', 0.6, 0.05); // Validation high chime
  };

  const handleRemoveLog = (id: string) => {
    setJournalLogs(journalLogs.filter(l => l.id !== id));
  };

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
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none font-mono">Cognitive Venting</span>
        <div className="w-8 h-8" />
      </div>

      <div className="text-center mb-3 shrink-0">
        <h2 className="text-lg font-black text-[#4A6741] leading-tight font-sans font-sans">Emotion Wheel & Journal</h2>
        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
          Select your primary mood below to retrieve specialized prompts for therapeutic writing. Expressing raw feelings acts as a safety valve.
        </p>
      </div>

      {/* Interactive content */}
      <div className="flex flex-col space-y-4 pb-6">
        
        {/* Circular selection badges */}
        <div className="bg-white/95 rounded-3xl p-3 border border-slate-100 shadow-2xs select-none">
          <p className="text-[9px] font-black uppercase text-slate-400 mb-2 leading-none">Select active feeling segment:</p>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {CORE_EMOTIONS.map((v, i) => (
              <button
                key={v.name}
                type="button"
                onClick={() => selectEmotion(i)}
                className={`px-3 py-2 rounded-2xl text-[10px] font-extrabold border transition cursor-pointer flex items-center space-x-1.5 select-none ${
                  selectedIdx === i
                    ? 'text-white border-transparent'
                    : 'bg-slate-50 border-slate-205 text-slate-700 hover:bg-slate-100'
                }`}
                style={{
                  backgroundColor: selectedIdx === i ? `hsl(${v.hue}, 50%, 35%)` : undefined,
                  borderColor: selectedIdx === i ? 'transparent' : undefined
                }}
              >
                <span>{v.icon}</span>
                <span>{v.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Targeted Prompts Area */}
        {selectedIdx !== null && (
          <form onSubmit={handleSaveDraft} className="bg-white rounded-3xl p-4 border border-[#4A6741]/20 shadow-xs text-left animate-slide-up space-y-3.5">
            <div className="flex justify-between items-center text-[9px] leading-tight font-black uppercase tracking-wider text-slate-400">
              <span>{CORE_EMOTIONS[selectedIdx].name} prompt</span>
              <button
                type="button"
                onClick={() => setPromptIdx((promptIdx + 1) % CORE_EMOTIONS[selectedIdx].prompts.length)}
                className="text-[#4A6741] font-bold cursor-pointer hover:underline bg-transparent border-0"
              >
                🔄 Shift prompt
              </button>
            </div>

            <p className="text-[11px] font-bold text-slate-800 leading-snug">
              " {CORE_EMOTIONS[selectedIdx].prompts[promptIdx]} "
            </p>

            <textarea
              required
              rows={3}
              placeholder="Scribble your therapeutic reponse here..."
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              className="w-full text-[10.5px] px-3 py-2 bg-slate-50 border border-slate-150 rounded-xl focus:outline-none focus:bg-white text-slate-800 leading-tight transition"
            />

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setSelectedIdx(null)}
                className="w-1/3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-[10px] transition cursor-pointer border-0"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-[10px] transition cursor-pointer border-0 flex items-center justify-center space-x-1"
              >
                <Smile size={11} className="stroke-[2.5]" />
                <span>Save Entry to Device</span>
              </button>
            </div>
          </form>
        )}

        {/* Saved Journals Logs */}
        <div className="space-y-2 text-left">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-sans">Venting history ({journalLogs.length})</span>
          {journalLogs.length === 0 ? (
            <div className="bg-white/40 border border-[#E1E8E3]/50 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-slate-400 italic font-medium">Clear of logged writings. Let it all out when needed!</p>
            </div>
          ) : (
            journalLogs.map(log => (
              <div key={log.id} className="bg-white border border-slate-100 p-3 rounded-2xl relative shadow-xs">
                <button
                  onClick={() => handleRemoveLog(log.id)}
                  className="absolute top-2.5 right-2.5 text-slate-350 hover:text-red-500 transition border-0 bg-transparent cursor-pointer p-0.5"
                  title="Remove Entry"
                >
                  ✕
                </button>
                <div className="flex items-center space-x-2 leading-none mb-1.5">
                  <span className="text-[8px] font-black uppercase bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-mono">{log.category} Vent</span>
                  <span className="text-[8.5px] font-mono text-slate-400">{log.time}</span>
                </div>
                <p className="text-[8.5px] italic text-slate-400 block max-w-[85%] mb-1 select-none leading-tight font-medium">Prompt: "{log.prompt}"</p>
                <p className="text-[10.5px] text-slate-800 font-medium leading-normal whitespace-pre-wrap">{log.text}</p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

// ============================================================================
// 4. NERVOUS SYSTEM COMFORT RESETS
// ============================================================================
const VAGUS_HACKS = [
  {
    name: 'Gentle Placed Breath',
    sub: 'Heart-rate reassurance',
    steps: 'Take a small breath in, close your lips, and gently breathe out against closed lips or a mock straw for 6 seconds. This sends immediate comforting signals to your heart and body.',
    duration: 6,
    icon: '👃'
  },
  {
    name: 'Horizon Eye Stretch',
    sub: 'Slow the active mind',
    steps: 'Without moving your head, slowly look as far to the right as is comfortable. Relax your shoulders, and hold for 15 seconds until you feel a natural stretch or yawn/sigh. Repeat on the left.',
    duration: 15,
    icon: '👁️'
  },
  {
    name: 'Restful Hand Cradle',
    sub: 'Tension lock release',
    steps: 'Rest your hands softly behind your head or neck. Shifting only your eyes, look far right. Relax, breathing comfortably, until you feel your tension gently ease or melt away.',
    duration: 20,
    icon: '🙌'
  },
  {
    name: 'Soft Ear Rub Soothe',
    sub: 'Soothing body connection',
    steps: 'With a clean fingertip, locate the small dip inside your outer ear just above the lobe. Gently massage in small, slow circles. This simple touch helps trigger a natural feeling of ease.',
    duration: 12,
    icon: '👂'
  },
];

export const SimulatorVagusHacks: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(VAGUS_HACKS[0].duration);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setTimeLeft(VAGUS_HACKS[activeIdx].duration);
    setRunning(false);
  }, [activeIdx]);

  useEffect(() => {
    let int: any = null;
    if (running && timeLeft > 0) {
      int = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (running && timeLeft === 0) {
      setRunning(false);
      try {
        playFrequencySound(660, 'sine', 1.0, 0.08); // Sweet release chime
      } catch (e) {}
    }
    return () => clearInterval(int);
  }, [running, timeLeft]);

  const handleToggle = () => {
    if (!running) {
      setRunning(true);
      try {
        playFrequencySound(350, 'sine', 0.4, 0.05);
      } catch (e) {}
    } else {
      setRunning(false);
    }
  };

  const currentHack = VAGUS_HACKS[activeIdx];

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
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none font-mono">Calming Resets</span>
        <div className="w-8 h-8" />
      </div>

      <div className="text-center mb-3 shrink-0">
        <h2 className="text-lg font-black text-[#4A6741] leading-tight font-sans">Sensory Body Resets</h2>
        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
          Simple physical holds help send cues of safety to your body. Choose an option below to find gentle relaxation whenever you need a pause.
        </p>
      </div>

      {/* Main Guided Pacer */}
      <div className="bg-white/95 rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center select-none shrink-0 mb-3.5 space-y-3.5">
        <span className="text-[8.5px] font-black tracking-widest uppercase text-[#4A6741] bg-[#4A6741]/10 px-3 py-1 rounded-full">
          Exercise {activeIdx + 1} of {VAGUS_HACKS.length} • {currentHack.name}
        </span>

        {/* Simple Ring design */}
        <div className="relative w-22 h-22 flex items-center justify-center select-none">
          <div
            className={`absolute inset-0 rounded-full transition-all duration-1000 ${
              running ? 'bg-[#4A6741]/10 scale-[1.08] animate-pulse border border-[#4A6741]/25' : 'bg-slate-50'
            }`}
          />
          <div className="absolute inset-2 rounded-full border border-slate-150 flex flex-col items-center justify-center bg-white shadow-2xs">
            {running ? (
              <div className="leading-none text-center">
                <span className="text-[8.5px] uppercase font-black tracking-wider text-[#4A6741] block">STAY</span>
                <span className="text-xl font-bold font-mono text-slate-800 block mt-0.5">{timeLeft}s</span>
              </div>
            ) : (
              <span className="text-2xl select-none">{currentHack.icon}</span>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <h4 className="text-[11.5px] font-black text-slate-800 leading-none">{currentHack.name}</h4>
          <span className="text-[8px] font-bold text-[#4A6741] font-mono uppercase tracking-wider">{currentHack.sub}</span>
        </div>

        <p className="text-[10.5px] text-slate-500 leading-relaxed font-semibold min-h-16 px-2.5">
          {currentHack.steps}
        </p>

        {/* Actions bar */}
        <div className="flex items-center space-x-2 justify-center w-full">
          <button
            onClick={handleToggle}
            className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider transition border-0 cursor-pointer shadow-2xs ${
              running ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-[#4A6741] text-white hover:bg-[#3D5535]'
            }`}
          >
            {running ? 'Pause Timer' : 'Start Timer'}
          </button>

          <button
            onClick={() => setActiveIdx((activeIdx + 1) % VAGUS_HACKS.length)}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full cursor-pointer transition border-0"
            title="Next Exercise"
          >
            ➔
          </button>
        </div>
      </div>

      {/* Pagination bullets */}
      <div className="flex justify-center space-x-1 shrink-0 mb-3 select-none">
        {VAGUS_HACKS.map((v, i) => (
          <button
            key={v.name}
            type="button"
            onClick={() => setActiveIdx(i)}
            className={`w-2 h-2 rounded-full cursor-pointer transition border-0 ${
              activeIdx === i ? 'bg-[#4A6741] scale-110' : 'bg-slate-200 hover:bg-slate-350'
            }`}
          />
        ))}
      </div>

      <div className="shrink-0 pt-2 border-t border-slate-100/80 text-center flex items-center justify-center gap-1">
        <Activity size={10} className="text-[#4A6741]" />
        <span className="text-[8.5px] text-slate-400">Gentle physical holds help tell your body that it is safe to relax.</span>
      </div>
    </div>
  );
};

// ============================================================================
// 5. 1-TAP ACUTE PANIC SOS AUTO-PACED GROUNDING ANCHOR
// ============================================================================
export const SimulatorPanicSOS: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secLeft, setSecLeft] = useState(5);
  const [active, setActive] = useState(false);

  const SOS_STEPS = [
    { text: 'Acknowledge this wave of feeling. You are in a safe place. This is just a temporary surge of energy. Let it wash past you gently.', tone: 220, duration: 6, label: 'GENTLE WAVE' },
    { text: 'Look around you. Find 3 cozy or comforting blue/green items in your local room right now. Feel your breath slow down.', tone: 290, duration: 8, label: 'SENSORY REFocus' },
    { text: 'Breathe in slowly and comfortably for 4 seconds... hold for 4 seconds... breathe out softly for 5 seconds.', tone: 320, duration: 11, label: 'SLOW CHEST BREATH' },
    { text: 'Place your feet flat and solid on the floor. Feel the ground beneath you supporting you. You are held safe.', tone: 200, duration: 7, label: 'FEEL THE GROUND' },
    { text: 'You did wonderfully. The surge is settling down, and you have survived the peak. Take a quiet, gentle breath.', tone: 440, duration: 6, label: 'GENTLE RECOVERY' }
  ];

  useEffect(() => {
    if (!active) {
      setPhaseIdx(0);
      setSecLeft(5);
      return;
    }

    setSecLeft(SOS_STEPS[phaseIdx].duration);
    try {
      // Direct heavy resonant grounding sound
      playFrequencySound(SOS_STEPS[phaseIdx].tone, 'triangle', 0.8, 0.1);
    } catch (e) {}

  }, [active, phaseIdx]);

  useEffect(() => {
    let timerID: any = null;
    if (active && secLeft > 0) {
      timerID = setInterval(() => {
        setSecLeft(s => s - 1);
      }, 1000);
    } else if (active && secLeft === 0) {
      if (phaseIdx < SOS_STEPS.length - 1) {
        setPhaseIdx(p => p + 1);
      } else {
        // Loop back or finish
        setActive(false);
      }
    }
    return () => clearInterval(timerID);
  }, [active, secLeft, phaseIdx]);

  const handleStartPanicShield = () => {
    setPhaseIdx(0);
    setActive(true);
  };

  const currentStepInfo = SOS_STEPS[phaseIdx];

  return (
    <div className="flex flex-col h-full bg-[#1A1110] p-5 justify-between relative text-amber-50">
      {/* Red Ambient Alarm Background */}
      <div className="absolute inset-0 bg-red-950/10 pointer-events-none mix-blend-overlay z-0" />

      {/* Close button top corner */}
      <div className="flex justify-between items-center mt-3 z-10 shrink-0">
        <button
          onClick={onBack}
          className="text-amber-50 hover:bg-white/10 rounded-full p-1.5 transition border-0 bg-transparent cursor-pointer flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-[10px] font-black uppercase tracking-widest text-[#FCA5A5] font-mono leading-none">Comfort Rescue Space</span>
        <div className="w-8 h-8" />
      </div>

      <div className="text-center z-10 mt-2.5 mb-1 select-none shrink-0">
        <div className="text-xl mb-1 select-none">⭐️</div>
        <h2 className="text-lg font-black text-rose-300 leading-tight">Calm Rescue Space</h2>
        <p className="text-[9.5px] text-red-150 max-w-[85%] mx-auto leading-normal">
          A soft helper for high-stress moments. Tap the heart below, and let the paced step-by-step guidance support you.
        </p>
      </div>

      {/* Central Visual somatic reactor */}
      <div className="flex-1 flex flex-col justify-center items-center z-10 space-y-4 my-2 shrink-0">
        {!active ? (
          <button
            onClick={handleStartPanicShield}
            className="w-32 h-32 bg-rose-950 hover:bg-rose-900 border-[3px] border-rose-500 rounded-full flex flex-col justify-center items-center cursor-pointer transition-all duration-300 hover:scale-[1.04] active:scale-97 select-none shadow-lg shadow-rose-950/40 relative group"
          >
            <div className="absolute inset-0 bg-rose-500/10 rounded-full animate-ping pointer-events-none" />
            <ShieldAlert size={36} className="text-rose-400 group-hover:animate-pulse" />
            <span className="text-[10px] text-rose-200 mt-2 font-black uppercase tracking-widest leading-none font-sans">TAP TO START</span>
          </button>
        ) : (
          <div className="w-full text-center space-y-4 px-2 max-w-[280px]">
            {/* Pulsing breathing expansion circles strictly proportional with stage duration */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center select-none">
              <div className="absolute inset-0 bg-rose-500/10 rounded-full animate-ping duration-1500" />
              <div className="absolute inset-2.5 bg-rose-950/90 rounded-full border border-rose-550 flex flex-col items-center justify-center">
                <span className="text-xl font-bold font-mono text-rose-300 leading-none">{secLeft}s</span>
              </div>
            </div>

            <div className="space-y-1 mt-1">
              <span className="text-[8.5px] font-black tracking-widest text-[#F87171] bg-rose-950/80 border border-rose-900 px-3 py-1 rounded-full uppercase leading-none inline-block">
                {currentStepInfo.label}
              </span>
              <p className="text-[11.5px] font-bold text-rose-50 border-l border-rose-500 pl-3 leading-relaxed py-1.5 text-left bg-rose-950/30 rounded-r-xl">
                {currentStepInfo.text}
              </p>
            </div>

            <button
              onClick={() => setActive(false)}
              className="py-1 px-4 text-[9px] font-extrabold uppercase bg-red-900 hover:bg-red-800 text-white rounded-full transition cursor-pointer border-0 mt-3"
            >
              Pause Exercise
            </button>
          </div>
        )}
      </div>

      <div className="shrink-0 pt-2 border-t border-rose-950/70 text-center flex items-center justify-center gap-1.5 z-10">
        <HeartHandshake size={11} className="text-rose-400" />
        <span className="text-[8px] text-red-200 uppercase font-mono tracking-widest">You are safe. Please take all the time you need to reset.</span>
      </div>
    </div>
  );
};
