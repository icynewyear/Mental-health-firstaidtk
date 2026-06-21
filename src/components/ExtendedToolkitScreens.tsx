import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Lock, Trash2, Key, Play, Pause, Sparkles, Smile, RefreshCw, Volume2, ShieldAlert, HeartHandshake, Eye, AlertCircle, Info, Activity, Wind } from 'lucide-react';

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
    setWorries(worries.filter(w => w.id !== id));
    try {
      playFrequencySound(330, 'sine', 0.4, 0.06);
    } catch (e) {}
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
  const [hapticsEnabled, setHapticsEnabled] = useState(false);
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
          
          // Optional haptic vibration pulse
          if (hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
            try {
              navigator.vibrate(60);
            } catch (err) {}
          }
          
          return next;
        });
      }, ms);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speedSec, hapticsEnabled]);

  const handleToggle = () => {
    setIsPlaying(p => !p);
  };

  return (
    <div className="flex flex-col h-full bg-[#F1F5F2] overflow-y-auto select-none">
      <div className="flex flex-col min-h-full p-3.5 justify-between space-y-4">
        {/* Header */}
        <div className="text-center mt-1 relative shrink-0">
          <button
            onClick={onBack}
            className="absolute left-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-200 text-slate-500 bg-transparent border-0 cursor-pointer transition active:scale-95 flex items-center justify-center shrink-0"
            title="Go Back"
          >
            <ArrowLeft size={13} className="stroke-[3]" />
          </button>
          <h2 className="text-lg font-bold text-[#4A6741] leading-tight font-sans">Gentle Flow Eye Pacer</h2>
          <p className="text-[10px] text-slate-500 px-4 mt-0.5 font-sans">Let your eyes gently trace the moving icon to help soothe and settle busy thoughts.</p>
        </div>

        {/* The Visual Track Stage */}
        <div className="bg-white/95 rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col items-center justify-center flex-1 select-none min-h-[140px] max-h-[300px]">
          {/* Track slot */}
          <div className="w-full h-12 bg-slate-100 rounded-full border border-slate-200.5 relative flex items-center px-1.5 select-none overflow-hidden">
            {/* Moving bead */}
            <div
              className="w-8 h-8 rounded-full bg-[#4A6741] shadow-md transition-all ease-in-out absolute select-none flex items-center justify-center text-[11px] text-white font-black"
              style={{
                left: position === 0 ? '0.5rem' : 'calc(100% - 2.5rem)',
                transitionDuration: `${(speedSec * 1000) / 2}ms`
              }}
            >
              👁️
            </div>
          </div>
          
          <div className="text-center mt-4">
            {isPlaying ? (
              <p className="text-[10px] text-slate-400 italic animate-pulse font-sans">Follow the gaze-pacer left and right...</p>
            ) : (
              <p className="text-[10px] text-slate-400 italic font-sans">Tap "Begin Gentle Movement" below to start.</p>
            )}
          </div>
        </div>

        {/* Controller Options matching breathing config */}
        <div className="w-full text-center flex flex-col space-y-1.5 shrink-0 animate-fade-in">
          {/* Eye Pacer Speed option card */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-2 px-3 border border-white flex flex-col space-y-1.5 text-[#4A6741] text-left">
            <div className="flex items-center space-x-1.5">
              <Eye size={12} />
              <span className="text-[11px] font-bold font-sans">Pacer Speed</span>
            </div>
            <div className="flex w-full bg-[#E1E8E3] rounded-2xl p-1">
              {[
                { val: 3.8, label: 'Slow (3.8s)' },
                { val: 2.5, label: 'Medium (2.5s)' },
                { val: 1.5, label: 'Fast (1.5s)' }
              ].map(s => (
                <button
                  key={s.val}
                  type="button"
                  onClick={() => setSpeedSec(s.val)}
                  className={`flex-1 text-[10px] font-bold py-1.5 rounded-xl transition cursor-pointer border-0 ${
                    speedSec === s.val ? 'bg-white shadow-xs text-[#4A6741]' : 'text-[#4A6741]/60 hover:text-[#4A6741]/85'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gentle Haptics Toggle Option Card */}
          <div className="flex items-center justify-between bg-white/70 backdrop-blur-md rounded-2xl p-2 px-3 border border-white text-left">
            <div className="flex items-center space-x-2 text-[#4A6741]">
              <Activity size={13} className={isPlaying && hapticsEnabled ? "animate-pulse" : ""} />
              <span className="text-[11px] font-bold font-sans">Gentle Haptics</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const nextVal = !hapticsEnabled;
                setHapticsEnabled(nextVal);
                if (nextVal && typeof navigator !== 'undefined' && navigator.vibrate) {
                  try {
                    navigator.vibrate(35);
                  } catch (e) {}
                }
              }}
              className={`w-8 h-4 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer border-0 ${
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

          {/* Start/Pause Control Button */}
          <button
            onClick={handleToggle}
            className={`w-full py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition border-0 cursor-pointer flex items-center justify-center space-x-2 shadow-xs ${
              isPlaying ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-[#4A6741] text-white hover:bg-[#3D5535]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause size={13} className="fill-white" />
                <span className="font-sans">Pause Eye Pacer</span>
              </>
            ) : (
              <>
                <Play size={13} className="fill-white" />
                <span className="font-sans">Begin Gentle Movement</span>
              </>
            )}
          </button>
        </div>

        <div className="shrink-0 pt-2 border-t border-slate-100/80 text-center flex items-center justify-center gap-1.5">
          <Sparkles size={11.5} className="text-[#4A6741]" />
          <span className="text-[8.5px] text-slate-400">A simple focus point that encourages your mind to settle.</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. INTERACTIVE EMOTION WHEEL & FOCUS PROMPTS
// ============================================================================
const CORE_EMOTIONS = [
  {
    name: 'Sadness',
    hue: 210,
    icon: '😢',
    prompts: [
      'Describe what feels lost or unfinished.',
      'If tears had words, what would they say?',
      'Where in your body do you feel this sadness most heavily?',
      'What is a gentle way you can offer yourself comfort right now?',
      'Write about a time you felt sad but eventually found peace again.',
      'What does this sadness want you to pay attention to or protect?',
      'If you could hug your younger self right now, what would you tell them?',
      'Describe a place, real or imaginary, where you feel completely safe to cry.',
      'What is a small, easy thing that brought you comfort in the past?',
      'Write a letter to your sadness, acknowledging its presence without judgment.',
      'What is something you need to let go of to lighten your emotional load?',
      'Name three small things you are grateful for even in this heavy moment.',
      'How can you practice self-compassion today without trying to "fix" anything?',
      'Write down the kindest words a friend could say to you right now.',
      'Describe a quiet moment of beauty or stillness you noticed recently.'
    ]
  },
  {
    name: 'Anger',
    hue: 0,
    icon: '🔥',
    prompts: [
      'What boundary of yours was crossed?',
      'Write down your raw frustration with zero filter.',
      'Underneath your anger, is there any sadness, fear, or hurt hiding?',
      'If your anger was a physical object, what would it look like and what is it made of?',
      'Describe a healthy way you can physically channel or release this building energy.',
      'What is a constructive action you can take to protect your boundaries?',
      'If you could speak to the person or situation causing this without consequences, what would you say?',
      'What are three things in this situation that you have absolute control over?',
      'What does this anger reveal about what you deeply care about or value?',
      'Write about a time you successfully negotiated a difficult boundary.',
      'How does your body feel when anger rises, and how can you help it relax?',
      'What is a gentle boundary script you can use to communicate your needs clearly?',
      'If this anger had a message of self-protection, what is it trying to warn you about?',
      'Write down all the unfair parts of this situation without censoring yourself.',
      'What is one small step toward resolution or peace that you can take today.'
    ]
  },
  {
    name: 'Fear / Panic',
    hue: 280,
    icon: '🫨',
    prompts: [
      'What is the core threat your brain is predicting?',
      'How can we assure your body it is physically safe?',
      'Look around you. What are three physical objects that remind you that you are safe in this room?',
      'If your fear was a small, scared child, how would you comfort them?',
      'Write down the absolute worst-case scenario, and then write the most likely realistic scenario.',
      'Describe how your body feels right now and focus on slowing down your breathing.',
      'What has helped you get through moments of high anxiety or panic in the past?',
      'What is a peaceful memory or place that you can visualize in detail right now?',
      'Write down three reassuring coping statements (e.g., "This feeling will pass").',
      'How can you gently bring your awareness back to the present moment?',
      'What is a physical sensation you can focus on (like feet on the floor) to anchor yourself?',
      'If this panic had a voice, what is it trying to protect you from?',
      'Write a short message to your fearful thoughts telling them it is okay to rest now.',
      'Describe a time you faced a fear and survived, proving your own resilience.',
      'What is one tiny action you can do in the next five minutes to feel more grounded.'
    ]
  },
  {
    name: 'Numbing',
    hue: 130,
    icon: '😶‍🌫️',
    prompts: [
      'Pinpoint where the emotional weight sits in your torso.',
      'What are you avoiding feeling right now?',
      'Touch three different textures around you and write down how they feel.',
      'If your numbness was a protective shield, what is it shielding you from?',
      'Describe the temperature of your body right now (hands, feet, face).',
      'What is one tiny spark of feeling (even if slight or uncomfortable) you can detect?',
      'Write down whatever random, nonsense words come to mind to start waking up your expression.',
      'How does your chest feel when you take a deep, slow, intentional breath?',
      'If you allowed yourself to feel just 5% more of your environment, what would you notice?',
      'Describe a sound you can hear right now as if you were hearing it for the first time.',
      'What is one basic physical need (hunger, thirst, sleep, stretch) your body has right now?',
      'Write down what you would say to yourself if it was safe to let your guard down.',
      'Describe an activity or hobby that usually makes you feel alive or connected.',
      'If this numbness had a shape and weight, what would it look like?',
      'Write a gentle thank-you to your mind for trying to protect you by shutting down.'
    ]
  },
  {
    name: 'Worthy',
    hue: 45,
    icon: '✨',
    prompts: [
      'Describe a small choice you handled gracefully today.',
      'Who makes you feel secure being yourself?',
      'Write down three things you genuinely appreciate about your personality or character.',
      'Describe a difficult moment you got through in the past year and how you did it.',
      'What is a compliment you received recently that you can allow yourself to fully believe?',
      'Write about a time you helped someone or made someone feel happy.',
      'What are some unique strengths or skills you bring to your daily life?',
      'Describe a space where you feel completely accomplished and satisfied with yourself.',
      'What is a promise you made to yourself and successfully kept?',
      'Write down a list of three simple things that make you a valuable friend.',
      'Describe a hobby or interest that makes you feel excited and fulfilled.',
      'Write about a time you stood up for yourself or spoke your truth.',
      'What are three aspects of your growth that you are most proud of?',
      'How can you reward or treat yourself today as a celebration of who you are?',
      'Write a self-compassion letter to yourself celebrating your mistakes as part of learning.'
    ]
  },
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
                🔄 New prompt
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
  const [active, setActive] = useState(false);
  const [isVoicePaused, setIsVoicePaused] = useState(false);

  const SOS_STEPS = [
    { text: 'Acknowledge this wave of feeling. You are in a safe place. This is just a temporary surge of energy. Let it wash past you gently.', tone: 220, label: 'GENTLE WAVE' },
    { text: 'Look around you. Find 3 cozy or comforting items in your immediate surroundings right now. Feel your breath slow down.', tone: 277.18, label: 'SENSORY REFOCUS' },
    { text: 'Breathe in slowly and comfortably for 4 seconds... hold for 4 seconds... breathe out softly for 5 seconds.', tone: 329.63, label: 'SLOW CHEST BREATH' },
    { text: 'Place your feet flat and solid on the floor. Feel the ground beneath you supporting you. You are held safe.', tone: 220, label: 'FEEL THE GROUND' },
    { text: 'You did wonderfully. You are safe, secure, and grounded. If you need further grounding, feel free to restart this SOS guide or try one of our calming breathing exercises.', tone: 440, label: 'GENTLE RECOVERY' }
  ];

  const currentStepInfo = SOS_STEPS[phaseIdx];

  const speakStepText = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.resume();
        setIsVoicePaused(false);
        window.speechSynthesis.cancel();
        
        // Grab values set in Guided Breathing (SimulatorBreathing)
        const savedVoiceName = localStorage.getItem('mindfulVoiceName') || '';
        const savedRate = localStorage.getItem('mindfulVoiceRate') || localStorage.getItem('mindualVoiceRate');
        const savedPitch = localStorage.getItem('mindfulVoicePitch');
        const savedVolume = localStorage.getItem('mindfulVoiceVolume');

        const rate = savedRate ? parseFloat(savedRate) : 0.75;
        const pitch = savedPitch ? parseFloat(savedPitch) : 0.95;
        const volume = savedVolume ? parseFloat(savedVolume) : 0.85;

        const utterance = new SpeechSynthesisUtterance(text);
        
        const voicesList = window.speechSynthesis.getVoices();
        const matchingVoice = voicesList.find(v => v.name === savedVoiceName);
        
        if (matchingVoice) {
          utterance.voice = matchingVoice;
          utterance.lang = matchingVoice.lang;
        } else {
          // If no exact match, filter or pick an English base voice or any default
          const enVoices = voicesList.filter(v => v.lang.startsWith('en') || v.lang.startsWith('en-'));
          if (enVoices.length > 0) {
            const naturalVoice = enVoices.find(v => 
              v.name.toLowerCase().includes('natural') || 
              v.name.toLowerCase().includes('samantha') || 
              v.name.toLowerCase().includes('google')
            );
            utterance.voice = naturalVoice || enVoices[0];
            utterance.lang = utterance.voice.lang;
          } else if (voicesList.length > 0) {
            utterance.voice = voicesList[0];
            utterance.lang = voicesList[0].lang;
          } else {
            utterance.lang = 'en-US';
          }
        }

        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('SpeechSynthesis instruction read error:', err);
      }
    }
  };

  // Speaks when current step changes or becomes active
  useEffect(() => {
    if (active) {
      speakStepText(SOS_STEPS[phaseIdx].text);
    } else {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  }, [phaseIdx, active]);

  // Clean-up speech when leaving screen
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleStartPanicShield = () => {
    setPhaseIdx(0);
    setIsVoicePaused(false);
    setActive(true);
    try {
      playFrequencySound(SOS_STEPS[0].tone, 'sine', 1.0, 0.05);
    } catch (e) {}
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] overflow-y-auto relative text-blue-50 select-none">
      <div className="flex flex-col min-h-full p-4 justify-between space-y-4">
        {/* Soft Ambient Calming Background */}
        <div className="absolute inset-0 bg-blue-900/10 pointer-events-none mix-blend-overlay z-0" />

        {/* Header toolbar */}
        <div className="flex justify-between items-center mt-1 z-10 shrink-0">
          <button
            onClick={onBack}
            className="text-blue-50 hover:bg-white/10 rounded-full p-1.5 transition border-0 bg-transparent cursor-pointer flex items-center justify-center"
            title="Go Back"
          >
            <ArrowLeft size={16} />
          </button>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#93c5fd] font-mono leading-none">Comfort Rescue Space</span>
          <div className="w-8 h-8" />
        </div>

        {/* SOS MODE INTRO */}
        <div className="text-center z-10 select-none shrink-0">
          <h2 className="text-lg font-black text-blue-300 leading-tight font-sans">Calm Rescue Space</h2>
          <p className="text-[9.5px] text-blue-100 max-w-[90%] mx-auto font-sans">
            A paced 5-step audio-somatic grounding guide for high overload moments.
          </p>
        </div>

        {/* Central visual Grounding box */}
        <div className="flex-1 flex flex-col justify-center items-center z-10 py-1 shrink-0 w-full">
          {!active ? (
            <div className="flex flex-col items-center w-full max-w-[280px] space-y-4">
              <button
                onClick={handleStartPanicShield}
                className="w-24 h-24 bg-[#1e293b] hover:bg-[#334155] border-[3px] border-blue-500/50 rounded-full flex flex-col justify-center items-center cursor-pointer transition-all duration-300 hover:scale-[1.04] active:scale-97 select-none shadow-lg shadow-slate-900/40 relative group border-0 shrink-0"
              >
                <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping pointer-events-none" />
                <ShieldAlert size={28} className="text-blue-400 group-hover:animate-pulse" />
                <span className="text-[8px] text-blue-200 mt-1 font-black uppercase tracking-widest leading-none font-sans">TAP TO START</span>
              </button>

              {/* Explicit 5-step checklist preview */}
              <div className="w-full bg-slate-900/40 p-3 rounded-2xl border border-slate-800/60 text-left space-y-1.5 shrink-0">
                <span className="text-[8px] uppercase font-black tracking-widest text-blue-300 block border-b border-slate-800 pb-1">
                  🗺️ The 5-Step Somatic Pathway
                </span>
                <div className="space-y-1 text-[9.5px] leading-tight">
                  <div className="flex items-center space-x-1.5 text-slate-200">
                    <span className="text-blue-400 font-black">1.</span>
                    <span><strong className="text-blue-200">Gentle Wave</strong> - Soft emotional containment</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-200">
                    <span className="text-blue-400 font-black">2.</span>
                    <span><strong className="text-blue-200">Sensory Refocus</strong> - Calm focus finder</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-200">
                    <span className="text-blue-400 font-black">3.</span>
                    <span><strong className="text-blue-200">Slow Chest Breath</strong> - Respiratory vagus reset</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-200">
                    <span className="text-blue-400 font-black">4.</span>
                    <span><strong className="text-blue-200">Feel Grounded</strong> - Weight down sensory anchors</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-200">
                    <span className="text-blue-400 font-black">5.</span>
                    <span><strong className="text-blue-200">Gentle Recovery</strong> - Safe, loving consolidation</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full text-center space-y-3 px-2 max-w-[280px]">
              {/* Gently pulsing circle inside the rescue space */}
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center select-none my-3">
                {/* Outer halo */}
                <div className={`absolute inset-0 rounded-full bg-blue-500/10 transition-all duration-1000 ${
                  isVoicePaused ? 'animate-none opacity-20' : 'animate-pulse duration-[3000ms] ease-in-out'
                }`} />
                {/* Middle halo */}
                <div className={`absolute inset-4 rounded-full bg-blue-400/15 opacity-40 pointer-events-none transition-all duration-1000 ${
                  isVoicePaused ? 'animate-none opacity-10' : 'animate-ping duration-[4000ms]'
                }`} />
                {/* Core pulsing circle */}
                <div className={`absolute inset-8 bg-gradient-to-tr from-[#3b5b7b] to-[#4c7ba6] rounded-full border border-blue-300/40 shadow-lg flex flex-col items-center justify-center transition-all duration-1000 ${
                  isVoicePaused ? 'animate-none scale-95 opacity-80' : 'animate-pulse duration-[2000ms]'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full mb-1 transition-colors ${isVoicePaused ? 'bg-amber-400' : 'bg-blue-200'}`} />
                  <span className="text-[9px] uppercase font-bold tracking-widest text-blue-100/90 leading-none">
                    {isVoicePaused ? 'Paused' : 'Focus Here'}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 mt-0.5">
                {/* Clear Step progress status & Interactive Indicator dots */}
                <div className="flex justify-between items-center px-1">
                  <span className="text-[9px] font-black text-blue-300 font-mono tracking-wider">
                    STEP {phaseIdx + 1} OF 5
                  </span>
                  <div className="flex space-x-1">
                    {SOS_STEPS.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPhaseIdx(idx);
                        }}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 border-0 p-0 cursor-pointer ${
                          idx === phaseIdx
                            ? 'bg-blue-400 scale-125'
                            : idx < phaseIdx
                            ? 'bg-blue-600/60'
                            : 'bg-slate-700'
                        }`}
                        title={`Jump to step ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <span className="text-[8px] font-black tracking-widest text-blue-300 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full uppercase leading-none inline-block">
                  {currentStepInfo.label}
                </span>

                <p className="text-[11px] font-bold text-blue-50 border-l-[3px] border-blue-500 pl-3 leading-relaxed py-1.5 text-left bg-slate-800/30 rounded-r-xl font-sans min-h-[52px]">
                  {currentStepInfo.text}
                </p>
              </div>

              {/* Voice action controls */}
              <div className="flex gap-2 w-full pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.speechSynthesis) {
                      if (isVoicePaused) {
                        window.speechSynthesis.resume();
                        setIsVoicePaused(false);
                      } else {
                        window.speechSynthesis.pause();
                        setIsVoicePaused(true);
                      }
                    }
                  }}
                  className={`flex-1 py-1.5 px-2 text-[8.5px] font-black uppercase rounded-full transition cursor-pointer border-0 flex items-center justify-center gap-1.5 min-w-[100px] ${
                    isVoicePaused
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse'
                      : 'bg-amber-600 hover:bg-amber-500 text-white'
                  }`}
                >
                  {isVoicePaused ? '▶ Resume' : '⏸ Pause'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    speakStepText(currentStepInfo.text);
                    try {
                      playFrequencySound(currentStepInfo.tone, 'sine', 0.8, 0.04);
                    } catch (e) {}
                  }}
                  className="flex-1 py-1.5 px-2 text-[8.5px] font-black uppercase rounded-full transition cursor-pointer border border-slate-700 bg-slate-800 hover:bg-slate-700 text-amber-200 hover:text-white flex items-center justify-center gap-1.5"
                >
                  🔄 Restart
                </button>
              </div>

              {/* Step Navigation buttons */}
              <div className="flex gap-2 w-full">
                <button
                  type="button"
                  onClick={() => {
                    const prev = Math.max(0, phaseIdx - 1);
                    setPhaseIdx(prev);
                    setIsVoicePaused(false);
                    try {
                      playFrequencySound(SOS_STEPS[prev].tone, 'sine', 1.0, 0.05);
                    } catch (e) {}
                  }}
                  disabled={phaseIdx === 0}
                  className="flex-1 py-1 px-1.5 text-[8.5px] font-black uppercase bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-blue-200 rounded-full transition cursor-pointer border border-slate-700 hover:text-white"
                >
                  ◀ Prev
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsVoicePaused(false);
                    if (phaseIdx < SOS_STEPS.length - 1) {
                      const nextIdx = phaseIdx + 1;
                      setPhaseIdx(nextIdx);
                      try {
                        playFrequencySound(SOS_STEPS[nextIdx].tone, 'sine', 1.0, 0.05);
                      } catch (e) {}
                    } else {
                      // Restart from first step for step 5
                      setPhaseIdx(0);
                      try {
                        playFrequencySound(SOS_STEPS[0].tone, 'sine', 1.0, 0.05);
                      } catch (e) {}
                    }
                  }}
                  className="flex-1 py-1 px-1.5 text-[8.5px] font-black uppercase bg-[#3b5b7b] hover:bg-blue-600 text-white rounded-full transition cursor-pointer border-0"
                >
                  {phaseIdx === SOS_STEPS.length - 1 ? 'Start Over' : 'Next ▶'}
                </button>
              </div>

              <div className="pt-1 select-none">
                <button
                  type="button"
                  onClick={() => setActive(false)}
                  className="py-1 px-4 text-[8px] font-semibold uppercase bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition cursor-pointer border border-slate-750"
                >
                  Cancel SOS Guide
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 pt-2 border-t border-rose-950/70 text-center flex items-center justify-center gap-1.5 z-10">
          <HeartHandshake size={11} className="text-rose-400" />
          <span className="text-[8px] text-red-200 uppercase font-mono tracking-widest font-bold">You are safe. Please take all the time you need to reset.</span>
        </div>
      </div>
    </div>
  );
};
