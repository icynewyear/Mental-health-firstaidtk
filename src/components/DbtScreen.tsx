import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Wind, 
  Zap, 
  ShieldAlert, 
  Volume2, 
  Droplet, 
  Activity, 
  HelpCircle, 
  Check, 
  Smile, 
  HeartHandshake, 
  Eye, 
  Shuffle, 
  Compass, 
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Soothing synth feedback generator
const playSynthNote = (freq: number, type: 'sine' | 'triangle' = 'sine', duration = 0.4, gainVal = 0.05) => {
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

// DBT ACCEPTS distraction items
const ACCEPTS_ITEMS = {
  activities: [
    "Clean one small surface in your room, focusing fully on the motion.",
    "Listen to your favorite fast-paced song and tap your fingers to the beat.",
    "Draw a simple doodle on a piece of scrap paper, then tear it up gently.",
    "Brew a hot cup of tea or glass of cold water and observe the vapor or ice.",
    "Go for a short 2-minute walk around the room, noticing how your heels strike the floor."
  ],
  contributing: [
    "Text a friend or family member a small, unexpected compliment.",
    "Do a quick, small favor for someone near you without saying anything.",
    "Write a kind, encouraging anonymous note and leave it somewhere visible.",
    "Think of someone you care about and spend 30 seconds wishing them well.",
    "Water a nearby houseplant or tidy a shared space for others."
  ],
  comparisons: [
    "Recall a time you felt intense overwhelm but got through it safely.",
    "Think about how much you have grown and learned over the past year.",
    "Compare your current physical safe environment with a chaotic moment.",
    "Think of someone who is struggling with similar issues and feel connected to them.",
    "Remind yourself that distress is like a wave—it reaches a peak, then naturally falls."
  ],
  emotions: [
    "Watch a short, funny animal clip or read a quick joke.",
    "Listen to comforting, peaceful ambient nature sounds (e.g., rain or waves).",
    "Read a beautiful, reassuring poem or look at a piece of inspiring art.",
    "Look at warm photos of happy memories, friends, or beloved pets.",
    "Put on a song with the exact opposite energy of your current distress."
  ],
  pushingAway: [
    "Write down your current distress on a virtual box, lock it, and imagine shelving it for 2 hours.",
    "Tell yourself, 'I am setting this feeling aside for just a moment to catch my breath.'",
    "Imagine your worrying thoughts as autumn leaves falling into a stream and floating away.",
    "Mentally place a gentle, sturdy barrier between yourself and the external trigger.",
    "Visualize packing your current worry into an air-tight container and shutting the lid."
  ],
  thoughts: [
    "Count backwards from 100 by 7 (100, 93, 86, 79, ...).",
    "Look around you and name 5 blue items, 4 round items, and 3 wooden items.",
    "Spell your name backwards, then spell 5 other common words backwards.",
    "Recite the lyrics of a song or a poem from memory as accurately as possible.",
    "Describe a complex object near you (like a watch or plant) in high, technical detail."
  ],
  sensations: [
    "Hold an ice cube in your bare hand and notice the transition from cold to stinging.",
    "Splash freezing cold water on your forehead and cheeks to trigger your vagal response.",
    "Massage your temples or jaw joints firmly for 30 seconds to release tension.",
    "Squeeze a pillow as hard as you can for 10 seconds, then let it go completely.",
    "Take a deep, slow sniff of a strong scent like peppermint, lavender, or citrus."
  ]
};

// Opposite Action Config
interface OppositeActionConfig {
  emotion: string;
  emoji: string;
  trigger: string;
  impulse: string;
  action: string;
  tip: string;
}

const OPPOSITE_ACTIONS: OppositeActionConfig[] = [
  {
    emotion: "Anger & Rage",
    emoji: "🔥",
    trigger: "Perceived unfairness, boundary violations, or frustration.",
    impulse: "Attack, yell, assert dominance, or retaliate.",
    action: "Gently walk away, use a soft & respectful tone, and actively practice deep breathing to quiet the heat.",
    tip: "Unclench your fists, open your palms facing upward (Willing Hands), and relax your shoulders."
  },
  {
    emotion: "Fear & Anxiety",
    emoji: "😰",
    trigger: "Perceived threat, danger, or social failure.",
    impulse: "Avoid, run away, escape, or procrastinate.",
    action: "Gently approach what scares you, stay in the situation, and remind yourself that thoughts are not threats.",
    tip: "Stand up straight, take deep belly breaths, and proceed step-by-step without rushing."
  },
  {
    emotion: "Sadness & Depression",
    emoji: "🌧️",
    trigger: "Loss, failure, or loneliness.",
    impulse: "Withdraw, isolate, crawl into bed, and stay passive.",
    action: "Get active! Walk outside, engage in a physical activity, or reach out and connect with one person.",
    tip: "Set a tiny 5-minute timer to do something active. Action precedes motivation."
  },
  {
    emotion: "Shame & Guilt",
    emoji: "🫣",
    trigger: "Believing you broke a moral code or failed social standards.",
    impulse: "Hide, deny, over-apologize, or self-punish.",
    action: "If guilt is unjustified, hold your head high, speak up, and stop apologizing. If justified, repair the mistake and move on.",
    tip: "Notice if the shame is telling you that you are fundamentally bad. Gently separate your actions from your self-worth."
  }
];

export const SimulatorDBT: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'stop' | 'tipp' | 'accepts' | 'opposite' | 'wise'>('stop');

  // --- STOP SKILL STATE ---
  const [stopStep, setStopStep] = useState<number>(0);
  const [stopObserveText, setStopObserveText] = useState<string>('');
  const [stopObserveSensation, setStopObserveSensation] = useState<string>('');

  // --- TIPP SKILL STATE ---
  const [tippSubMode, setTippSubMode] = useState<'temp' | 'exercise' | 'breathing' | 'muscle'>('temp');
  
  // Temperature splash
  const [tempTimer, setTempTimer] = useState<number>(15);
  const [isTempActive, setIsTempActive] = useState<boolean>(false);
  const tempIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Intense Exercise tap
  const [exerciseCount, setExerciseCount] = useState<number>(0);
  const [exerciseMax, setExerciseMax] = useState<number>(40);
  const [exerciseTimer, setExerciseTimer] = useState<number>(10);
  const [isExerciseActive, setIsExerciseActive] = useState<boolean>(false);
  const exerciseIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Paced Breathing
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [breathSeconds, setBreathSeconds] = useState<number>(4);
  const breathIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Muscle relaxation
  const [muscleStep, setMuscleStep] = useState<number>(0);
  const [muscleSecs, setMuscleSecs] = useState<number>(5);
  const [isMuscleTense, setIsMuscleTense] = useState<boolean>(false);
  const muscleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- ACCEPTS STATE ---
  const [acceptsCategory, setAcceptsCategory] = useState<keyof typeof ACCEPTS_ITEMS>('activities');
  const [acceptsIndex, setAcceptsIndex] = useState<number>(0);

  // --- OPPOSITE ACTION STATE ---
  const [selectedActionIndex, setSelectedActionIndex] = useState<number>(0);
  const [committedAction, setCommittedAction] = useState<boolean>(false);

  // --- WISE MIND STATE ---
  const [reasonableText, setReasonableText] = useState<string>('');
  const [emotionalText, setEmotionalText] = useState<string>('');
  const [wiseMindCreated, setWiseMindCreated] = useState<boolean>(false);
  const [wiseMindResult, setWiseMindResult] = useState<string>('');

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (tempIntervalRef.current) clearInterval(tempIntervalRef.current);
      if (exerciseIntervalRef.current) clearInterval(exerciseIntervalRef.current);
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
      if (muscleIntervalRef.current) clearInterval(muscleIntervalRef.current);
    };
  }, []);

  // TEMPERATURE TIMER EFFECT
  useEffect(() => {
    if (isTempActive) {
      tempIntervalRef.current = setInterval(() => {
        setTempTimer((prev) => {
          if (prev <= 1) {
            setIsTempActive(false);
            if (tempIntervalRef.current) clearInterval(tempIntervalRef.current);
            playSynthNote(440, 'sine', 0.8, 0.08); // High clear pitch when finished
            setTimeout(() => playSynthNote(554, 'sine', 0.8, 0.08), 150);
            return 15;
          }
          if (prev % 3 === 0) {
            playSynthNote(330, 'triangle', 0.3, 0.04); // Soothing water pulse sound
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (tempIntervalRef.current) clearInterval(tempIntervalRef.current);
    }
    return () => {
      if (tempIntervalRef.current) clearInterval(tempIntervalRef.current);
    };
  }, [isTempActive]);

  // EXERCISE TIMER EFFECT
  useEffect(() => {
    if (isExerciseActive) {
      exerciseIntervalRef.current = setInterval(() => {
        setExerciseTimer((prev) => {
          if (prev <= 1) {
            setIsExerciseActive(false);
            if (exerciseIntervalRef.current) clearInterval(exerciseIntervalRef.current);
            playSynthNote(349, 'triangle', 0.6, 0.06);
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (exerciseIntervalRef.current) clearInterval(exerciseIntervalRef.current);
    }
    return () => {
      if (exerciseIntervalRef.current) clearInterval(exerciseIntervalRef.current);
    };
  }, [isExerciseActive]);

  // PACED BREATHING EFFECT
  useEffect(() => {
    if (activeTab === 'tipp' && tippSubMode === 'breathing') {
      setBreathSeconds(breathPhase === 'inhale' ? 4 : 6);
      breathIntervalRef.current = setInterval(() => {
        setBreathSeconds((prev) => {
          if (prev <= 1) {
            setBreathPhase((current) => {
              const nextPhase = current === 'inhale' ? 'exhale' : 'inhale';
              playSynthNote(nextPhase === 'inhale' ? 392 : 261, 'sine', 0.5, 0.04);
              return nextPhase;
            });
            return 0; // reset via state trigger
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
    }
    return () => {
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
    };
  }, [activeTab, tippSubMode, breathPhase]);

  // MUSCLE RELAX TIMER EFFECT
  const triggerMuscleHold = () => {
    setIsMuscleTense(true);
    setMuscleSecs(5);
    playSynthNote(220, 'triangle', 0.3, 0.05);

    if (muscleIntervalRef.current) clearInterval(muscleIntervalRef.current);
    muscleIntervalRef.current = setInterval(() => {
      setMuscleSecs((prev) => {
        if (prev <= 1) {
          setIsMuscleTense(false);
          clearInterval(muscleIntervalRef.current!);
          playSynthNote(523, 'sine', 0.6, 0.05); // High clear tone on relax
          return 5;
        }
        playSynthNote(220, 'triangle', 0.1, 0.03); // Low tension pulse
        return prev - 1;
      });
    }, 1000);
  };

  // ACCEPTS navigation helper
  const nextAcceptsItem = () => {
    const list = ACCEPTS_ITEMS[acceptsCategory];
    setAcceptsIndex((prev) => (prev + 1) % list.length);
    playSynthNote(349, 'sine', 0.1, 0.03);
  };

  // Generate Wise Mind synthesis
  const handleGenerateWiseMind = () => {
    if (!reasonableText.trim() && !emotionalText.trim()) return;
    setWiseMindCreated(true);
    playSynthNote(440, 'sine', 0.5, 0.06);
    setTimeout(() => playSynthNote(659, 'sine', 0.6, 0.05), 180);

    const r = reasonableText.trim() || "Do the sensible task";
    const e = emotionalText.trim() || "My intense fear and anger";
    setWiseMindResult(
      `While my feelings tell me: "${e}", and logic reminds me: "${r}", my Wise Mind chooses to take a steady breath, honor both aspects, and respond with patience.`
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F8F6] p-4 overflow-y-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center space-x-2.5">
          <button 
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-xl hover:bg-[#E1E8E3] text-[#4A6741] transition active:scale-95 cursor-pointer border-0 bg-transparent flex items-center justify-center"
          >
            <ArrowLeft size={16} className="stroke-[2.5]" />
          </button>
          <div className="text-left">
            <span className="text-[9px] font-black tracking-widest text-[#4A6741] uppercase">Dialectical Aid</span>
            <h2 className="text-sm font-black text-slate-800 leading-none mt-0.5">DBT Calm Center</h2>
          </div>
        </div>
        <div className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider">
          Crisis SOS
        </div>
      </div>

      {/* Activated State Quick Tip Banner */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-2.5 mb-4 text-left flex items-start space-x-2">
        <ShieldAlert size={14} className="text-amber-700 mt-0.5 shrink-0" />
        <p className="text-[9px] text-amber-800 leading-normal font-sans">
          <strong>Activated right now?</strong> Tap <strong>STOP</strong> or <strong>TIPP</strong> below immediately. These are physical circuits built to bypass overwhelming fight-or-flight loops.
        </p>
      </div>

      {/* Main Mode Navigation (Rounded Tablets) */}
      <div className="flex overflow-x-auto space-x-1.5 pb-2.5 scrollbar-none shrink-0 border-b border-[#CBD9CC]/30 mb-3.5">
        <button
          onClick={() => { setActiveTab('stop'); playSynthNote(261, 'sine', 0.15); }}
          className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-tight transition shrink-0 cursor-pointer ${
            activeTab === 'stop' 
              ? 'bg-[#4A6741] text-white shadow-xs' 
              : 'bg-white hover:bg-[#E1E8E3]/50 text-slate-600 border border-slate-200/50'
          }`}
        >
          🛑 STOP
        </button>
        <button
          onClick={() => { setActiveTab('tipp'); playSynthNote(294, 'sine', 0.15); }}
          className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-tight transition shrink-0 cursor-pointer ${
            activeTab === 'tipp' 
              ? 'bg-[#4A6741] text-white shadow-xs' 
              : 'bg-white hover:bg-[#E1E8E3]/50 text-slate-600 border border-slate-200/50'
          }`}
        >
          ❄️ TIPP Reset
        </button>
        <button
          onClick={() => { setActiveTab('accepts'); playSynthNote(330, 'sine', 0.15); }}
          className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-tight transition shrink-0 cursor-pointer ${
            activeTab === 'accepts' 
              ? 'bg-[#4A6741] text-white shadow-xs' 
              : 'bg-white hover:bg-[#E1E8E3]/50 text-slate-600 border border-slate-200/50'
          }`}
        >
          🎯 Distract
        </button>
        <button
          onClick={() => { setActiveTab('opposite'); playSynthNote(349, 'sine', 0.15); }}
          className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-tight transition shrink-0 cursor-pointer ${
            activeTab === 'opposite' 
              ? 'bg-[#4A6741] text-white shadow-xs' 
              : 'bg-white hover:bg-[#E1E8E3]/50 text-slate-600 border border-slate-200/50'
          }`}
        >
          ⚖️ Opposite Action
        </button>
        <button
          onClick={() => { setActiveTab('wise'); playSynthNote(392, 'sine', 0.15); }}
          className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-tight transition shrink-0 cursor-pointer ${
            activeTab === 'wise' 
              ? 'bg-[#4A6741] text-white shadow-xs' 
              : 'bg-white hover:bg-[#E1E8E3]/50 text-slate-600 border border-slate-200/50'
          }`}
        >
          ⚖️ Wise Mind
        </button>
      </div>

      {/* Screen Interactive Workspace */}
      <div className="flex-1 flex flex-col min-h-0 bg-white border border-[#CBD9CC]/30 rounded-[28px] p-4 shadow-sm overflow-y-auto text-left relative">
        <AnimatePresence mode="wait">
          
          {/* 1. STOP SKILL SCREEN */}
          {activeTab === 'stop' && (
            <motion.div
              key="stop-screen"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full"
            >
              <div className="mb-3">
                <h3 className="text-xs font-black text-slate-800 flex items-center space-x-1.5">
                  <span>The S.T.O.P. Skill</span>
                </h3>
                <p className="text-[9px] text-slate-400 mt-0.5 leading-snug">
                  Pause immediate impulses and regain conscious control step-by-step.
                </p>
              </div>

              {/* Progress Stepper indicators */}
              <div className="grid grid-cols-4 gap-1.5 mb-4">
                {['S', 'T', 'O', 'P'].map((letter, idx) => (
                  <button
                    key={letter}
                    onClick={() => { setStopStep(idx); playSynthNote(261 + idx * 30, 'sine', 0.1); }}
                    className={`py-1 rounded-xl text-[10px] font-black tracking-tight transition-all duration-200 border cursor-pointer ${
                      idx === stopStep 
                        ? 'bg-[#4A6741] border-[#4A6741] text-white shadow-xs' 
                        : idx < stopStep 
                        ? 'bg-[#EBF2EC] border-[#CBD9CC] text-[#4A6741]'
                        : 'bg-slate-50 border-slate-100 text-slate-400'
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>

              {/* Step Detail Content */}
              <div className="flex-1 flex flex-col justify-center py-2">
                {stopStep === 0 && (
                  <div className="text-center flex flex-col items-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 animate-pulse">
                      <ShieldAlert size={28} className="stroke-[2]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Step 1: STOP</h4>
                      <p className="text-[10px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                        Do not react right now. Freeze! Your emotions are trying to force you into action. Pause for a split second. Take control of your muscles.
                      </p>
                    </div>
                  </div>
                )}

                {stopStep === 1 && (
                  <div className="text-center flex flex-col items-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                      <Wind size={26} className="animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Step 2: TAKE A BREATH</h4>
                      <p className="text-[10px] text-slate-500 max-w-xs mx-auto leading-relaxed mb-1">
                        Take a slow, deep breath in... and let it fall out completely. Focus on the cool air hitting your throat.
                      </p>
                      <span className="inline-block px-3 py-1 rounded-full bg-[#EBF2EC] text-[#4A6741] text-[9px] font-bold">
                        Breathe slowly
                      </span>
                    </div>
                  </div>
                )}

                {stopStep === 2 && (
                  <div className="space-y-3">
                    <div className="text-center">
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Step 3: OBSERVE YOUR INNER STATE</h4>
                      <p className="text-[9.5px] text-slate-500 max-w-xs mx-auto leading-relaxed mt-1">
                        What thoughts are running? What is happening in your body? Check any that apply:
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Racing thoughts", "Tight chest", 
                        "Urge to fight/escape", "Hot skin temperature",
                        "Spiraling worry", "Shortness of breath"
                      ].map((item) => (
                        <button
                          key={item}
                          onClick={() => {
                            setStopObserveSensation(item);
                            playSynthNote(311, 'sine', 0.1, 0.03);
                          }}
                          className={`p-2 rounded-xl text-left text-[9px] border transition cursor-pointer font-sans leading-tight ${
                            stopObserveSensation === item 
                              ? 'bg-[#EBF2EC] border-[#4A6741] text-[#4A6741] font-bold' 
                              : 'bg-slate-50 border-slate-200/50 text-slate-600 hover:bg-slate-100/50'
                          }`}
                        >
                          {stopObserveSensation === item ? '✓ ' : ''}{item}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-1.5 mt-2">
                      <label className="text-[9px] font-bold text-slate-500 block">Describe what you observe briefly:</label>
                      <input
                        type="text"
                        value={stopObserveText}
                        onChange={(e) => setStopObserveText(e.target.value)}
                        placeholder="e.g. My heart is beating so fast and I feel angry"
                        className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-2.5 py-1.5 text-[10px] text-slate-700 placeholder-slate-400 outline-none focus:bg-white focus:border-[#4A6741]"
                      />
                    </div>
                  </div>
                )}

                {stopStep === 3 && (
                  <div className="text-center flex flex-col items-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-[#EBF2EC] border border-[#CBD9CC] flex items-center justify-center text-[#4A6741]">
                      <Check size={26} className="stroke-[3]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Step 4: PROCEED MINDFULLY</h4>
                      <p className="text-[10px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                        You have successfully paused your impulse. Remind yourself: <strong>"This emotion will pass, and I can choose how to act right now."</strong> Take one calm, supportive step.
                      </p>
                    </div>

                    {stopObserveText && (
                      <div className="bg-[#FAF8F5] border border-[#F2ECE4] p-2.5 rounded-2xl text-[9px] italic text-slate-600 max-w-xs">
                        "Acknowledged feeling: {stopObserveText}. Moving forward with peace."
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Next Button / Loop Back */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setStopStep((prev) => (prev > 0 ? prev - 1 : 3));
                    playSynthNote(220, 'sine', 0.1);
                  }}
                  className="px-3 py-1.5 text-[9px] font-bold text-slate-400 hover:text-slate-600 transition"
                >
                  Previous
                </button>

                <button
                  onClick={() => {
                    if (stopStep < 3) {
                      setStopStep(stopStep + 1);
                      playSynthNote(330, 'sine', 0.15);
                    } else {
                      setStopStep(0);
                      setStopObserveText('');
                      setStopObserveSensation('');
                      playSynthNote(440, 'sine', 0.3);
                    }
                  }}
                  className="bg-[#4A6741] text-white px-4 py-1.5 rounded-xl text-[10px] font-bold tracking-tight shadow-xs hover:bg-[#3D5535] transition active:scale-98 cursor-pointer"
                >
                  {stopStep < 3 ? 'Next Step' : 'Restart STOP'}
                </button>
              </div>
            </motion.div>
          )}

          {/* 2. TIPP RESET SKILLS */}
          {activeTab === 'tipp' && (
            <motion.div
              key="tipp-screen"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full"
            >
              <div className="mb-2">
                <h3 className="text-xs font-black text-slate-800">T.I.P.P. Circuit Breakers</h3>
                <p className="text-[9px] text-slate-400 leading-snug">
                  Physiologically reduce heart rate and calm your central nervous system rapidly.
                </p>
              </div>

              {/* Mini tabs for T, I, P, P */}
              <div className="flex space-x-1 mb-3.5 border-b border-slate-100 pb-1.5 overflow-x-auto shrink-0 scrollbar-none">
                {[
                  { id: 'temp', label: '🌡️ Temperature', bg: 'hover:bg-blue-50/50 text-blue-700' },
                  { id: 'exercise', label: '🏃 Intense Exercise', bg: 'hover:bg-amber-50/50 text-amber-700' },
                  { id: 'breathing', label: '🌬️ Paced Breath', bg: 'hover:bg-emerald-50/50 text-emerald-700' },
                  { id: 'muscle', label: '💪 Muscle Release', bg: 'hover:bg-indigo-50/50 text-indigo-700' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setTippSubMode(item.id as any);
                      playSynthNote(349, 'sine', 0.1);
                    }}
                    className={`px-2 py-1 rounded-lg text-[9px] font-extrabold tracking-tight transition shrink-0 cursor-pointer ${
                      tippSubMode === item.id 
                        ? 'bg-slate-100 text-slate-800 border border-slate-300' 
                        : 'text-slate-400 bg-transparent hover:text-slate-600'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 flex flex-col justify-center py-1">
                {/* A. Temperature */}
                {tippSubMode === 'temp' && (
                  <div className="space-y-3.5 text-center flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 relative">
                      <Droplet size={26} className="animate-bounce" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Cold Shock Simulator</h4>
                      <p className="text-[9.5px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                        Splashing ice-cold water on your face triggers the <strong>Mammalian Dive Reflex</strong>, which instantly slows your heart rate.
                      </p>
                    </div>

                    <div className="w-full max-w-[200px] bg-slate-50 p-2 rounded-2xl border border-slate-200/50 text-left">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-bold text-slate-500">Dive reflex hold time:</span>
                        <span className="text-[12px] font-mono font-bold text-sky-700">{tempTimer}s</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-sky-500 h-full transition-all duration-1000"
                          style={{ width: `${(tempTimer / 15) * 100}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => setIsTempActive(!isTempActive)}
                      className={`px-6 py-2 rounded-2xl text-[10px] font-black tracking-wider uppercase transition shadow-sm cursor-pointer ${
                        isTempActive 
                          ? 'bg-rose-500 text-white hover:bg-rose-600' 
                          : 'bg-sky-600 text-white hover:bg-sky-700'
                      }`}
                    >
                      {isTempActive ? 'Stop / Lift Face' : 'Start Virtual Splash'}
                    </button>
                  </div>
                )}

                {/* B. Intense Exercise */}
                {tippSubMode === 'exercise' && (
                  <div className="space-y-3 text-center flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                      <Activity size={24} className="animate-pulse" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Rapid Shake-Out</h4>
                      <p className="text-[9.5px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                        When adrenaline spirals, burn it off with fast physical motion. Tap the release button as fast as you can to shake off energy!
                      </p>
                    </div>

                    <div className="w-full max-w-[200px] bg-slate-50 p-2 rounded-xl border border-slate-200/50">
                      <div className="flex justify-between text-[9px] text-slate-500 mb-1">
                        <span>Timer: {exerciseTimer}s</span>
                        <span>Energy Released: {exerciseCount}/{exerciseMax}</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-amber-500 h-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (exerciseCount / exerciseMax) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          if (!isExerciseActive) {
                            setIsExerciseActive(true);
                            setExerciseCount(0);
                            setExerciseTimer(10);
                            playSynthNote(220, 'triangle', 0.2);
                          } else {
                            if (exerciseCount < exerciseMax) {
                              setExerciseCount(prev => prev + 1);
                              playSynthNote(220 + exerciseCount * 8, 'triangle', 0.1, 0.04);
                            } else {
                              playSynthNote(523, 'sine', 0.5);
                            }
                          }
                        }}
                        className={`w-28 py-4 rounded-2xl text-[11px] font-black tracking-wider uppercase transition shadow-sm select-none cursor-pointer ${
                          !isExerciseActive 
                            ? 'bg-slate-800 text-white hover:bg-slate-900' 
                            : 'bg-amber-500 text-white hover:bg-amber-600 active:scale-95'
                        }`}
                      >
                        {!isExerciseActive ? 'Begin Tapping' : 'TAP RAPIDLY!'}
                      </button>

                      {isExerciseActive && (
                        <button
                          onClick={() => {
                            setIsExerciseActive(false);
                            setExerciseCount(0);
                            setExerciseTimer(10);
                          }}
                          className="px-2.5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 text-[9px] font-bold"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* C. Paced Breathing */}
                {tippSubMode === 'breathing' && (
                  <div className="space-y-4 text-center flex flex-col items-center">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Paced Calming Loop</h4>
                      <p className="text-[9.5px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                        Exhaling longer than inhaling triggers your parasympathetic system to force immediate cardiovascular calm.
                      </p>
                    </div>

                    {/* Breathing circle animation */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <div 
                        className={`absolute rounded-full transition-all duration-1000 ease-in-out ${
                          breathPhase === 'inhale' 
                            ? 'bg-emerald-100 border-2 border-emerald-400 w-24 h-24' 
                            : 'bg-emerald-50 border border-emerald-200 w-14 h-14'
                        }`}
                      />
                      <div className="z-10 text-center">
                        <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wide block">
                          {breathPhase}
                        </span>
                        <span className="text-[14px] font-mono font-bold text-emerald-700">
                          {breathSeconds}s
                        </span>
                      </div>
                    </div>

                    <div className="text-[9px] text-slate-400 italic">
                      {breathPhase === 'inhale' ? 'Inhale slowly... fill your belly' : 'Exhale completely... release all tension'}
                    </div>
                  </div>
                )}

                {/* D. Muscle Relaxation */}
                {tippSubMode === 'muscle' && (
                  <div className="space-y-3.5 text-center flex flex-col items-center">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Paired Muscle Reset</h4>
                      <p className="text-[9.5px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                        Squeeze muscles hard for 5 seconds, then drop them. Notice the physical sensation of warmth and release.
                      </p>
                    </div>

                    {/* Step selection */}
                    <div className="flex justify-center space-x-1 mb-2">
                      {['Shoulders 🤷', 'Fists ✊', 'Jaw 😬'].map((label, idx) => (
                        <button
                          key={label}
                          onClick={() => { setMuscleStep(idx); setIsMuscleTense(false); setMuscleSecs(5); playSynthNote(220, 'sine', 0.1); }}
                          className={`px-2 py-0.5 rounded-md text-[8.5px] font-bold border transition ${
                            muscleStep === idx 
                              ? 'bg-indigo-50 border-indigo-300 text-indigo-700' 
                              : 'bg-white border-slate-200 text-slate-500'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <div className="w-full max-w-[200px] bg-slate-50 p-2.5 rounded-2xl border border-slate-200/50 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-bold text-slate-500">
                          {isMuscleTense ? '🔥 Squeeze tightly!' : '🍃 Relax completely...'}
                        </span>
                        {isMuscleTense && (
                          <span className="text-[10px] font-mono font-bold text-indigo-700">{muscleSecs}s</span>
                        )}
                      </div>
                      <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${isMuscleTense ? 'bg-indigo-500' : 'bg-emerald-500'}`}
                          style={{ width: isMuscleTense ? `${(muscleSecs / 5) * 100}%` : '100%' }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={triggerMuscleHold}
                      disabled={isMuscleTense}
                      className={`px-5 py-2 rounded-2xl text-[9.5px] font-black tracking-wider uppercase transition shadow-sm ${
                        isMuscleTense 
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
                      }`}
                    >
                      {isMuscleTense ? 'Squeezing...' : 'Squeeze Now'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* 3. ACCEPTS DISTRACTION SCREEN */}
          {activeTab === 'accepts' && (
            <motion.div
              key="accepts-screen"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full"
            >
              <div className="mb-2">
                <h3 className="text-xs font-black text-slate-800 flex items-center space-x-1.5">
                  <span>A.C.C.E.P.T.S. Distractions</span>
                </h3>
                <p className="text-[9px] text-slate-400 leading-snug">
                  Break emotional momentum by redirecting your attention to simple, comfortable tasks.
                </p>
              </div>

              {/* Categorized Pills */}
              <div className="flex space-x-1 pb-1.5 overflow-x-auto shrink-0 scrollbar-none border-b border-slate-100">
                {[
                  { id: 'activities', label: 'A - Activities' },
                  { id: 'contributing', label: 'C - Contribution' },
                  { id: 'comparisons', label: 'C - Comparison' },
                  { id: 'emotions', label: 'E - Emotions' },
                  { id: 'pushingAway', label: 'P - Push Away' },
                  { id: 'thoughts', label: 'T - Thoughts' },
                  { id: 'sensations', label: 'S - Sensations' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setAcceptsCategory(cat.id as any);
                      setAcceptsIndex(0);
                      playSynthNote(349, 'sine', 0.1);
                    }}
                    className={`px-2 py-1 rounded-lg text-[8px] font-black tracking-tight transition shrink-0 cursor-pointer ${
                      acceptsCategory === cat.id 
                        ? 'bg-purple-100 text-purple-700 font-bold border border-purple-200' 
                        : 'text-slate-400 bg-slate-50 border border-slate-200/40'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Card Container for item */}
              <div className="flex-1 flex flex-col justify-center py-5">
                <div className="bg-[#FAF8F5] border border-[#F2ECE4] p-4 rounded-3xl text-center space-y-3 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-800 mx-auto">
                    <Shuffle size={16} />
                  </div>
                  <div className="min-h-[55px] flex items-center justify-center">
                    <p className="text-[10px] font-sans font-medium text-slate-700 leading-relaxed max-w-xs px-2">
                      {ACCEPTS_ITEMS[acceptsCategory][acceptsIndex]}
                    </p>
                  </div>
                  <button
                    onClick={nextAcceptsItem}
                    className="mx-auto flex items-center space-x-1 text-[#4A6741] text-[9px] font-black hover:text-[#3D5535] transition cursor-pointer"
                  >
                    <Shuffle size={10} />
                    <span>Generate Another Idea</span>
                  </button>
                </div>
              </div>

              <div className="text-center text-[9px] text-slate-400 italic">
                Focus entirely on the action. Engage your senses completely.
              </div>
            </motion.div>
          )}

          {/* 4. OPPOSITE ACTION SCREEN */}
          {activeTab === 'opposite' && (
            <motion.div
              key="opposite-screen"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full"
            >
              <div className="mb-2">
                <h3 className="text-xs font-black text-slate-800">Opposite Action Selector</h3>
                <p className="text-[9px] text-slate-400 leading-snug">
                  Act the exact opposite of your urge to break destructive emotional feedback loops.
                </p>
              </div>

              {/* Grid Selector */}
              <div className="grid grid-cols-4 gap-1 mb-3">
                {OPPOSITE_ACTIONS.map((item, idx) => (
                  <button
                    key={item.emotion}
                    onClick={() => {
                      setSelectedActionIndex(idx);
                      setCommittedAction(false);
                      playSynthNote(261 + idx * 30, 'sine', 0.1);
                    }}
                    className={`p-1 py-1.5 rounded-xl text-center border transition-all duration-250 cursor-pointer ${
                      selectedActionIndex === idx 
                        ? 'bg-amber-50 border-amber-300 text-amber-800 font-bold scale-[1.02]' 
                        : 'bg-slate-50 border-slate-200/50 text-slate-500'
                    }`}
                  >
                    <span className="text-[14px] block mb-0.5">{item.emoji}</span>
                    <span className="text-[8px] font-black uppercase tracking-tight leading-none block truncate">
                      {item.emotion.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Dynamic Action Card */}
              <div className="flex-1 space-y-3.5 flex flex-col justify-center py-2">
                <div className="bg-[#FAF8F5] border border-[#F2ECE4] p-3 rounded-2xl text-left space-y-2">
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Natural Urge</span>
                    <p className="text-[9.5px] font-medium text-rose-800 leading-relaxed font-sans">
                      ❌ {OPPOSITE_ACTIONS[selectedActionIndex].impulse}
                    </p>
                  </div>

                  <div className="border-t border-slate-200/50 pt-2">
                    <span className="text-[8px] font-black text-[#4A6741] uppercase tracking-wider block">Opposite Action</span>
                    <p className="text-[10px] font-bold text-slate-800 leading-relaxed font-sans">
                      ✅ {OPPOSITE_ACTIONS[selectedActionIndex].action}
                    </p>
                  </div>

                  <div className="bg-white/80 border border-slate-100 p-2 rounded-xl text-[9px] text-slate-500 leading-snug">
                    💡 <strong>Coping Hack:</strong> {OPPOSITE_ACTIONS[selectedActionIndex].tip}
                  </div>
                </div>

                {/* Commitment Checkbox */}
                <button
                  onClick={() => {
                    setCommittedAction(!committedAction);
                    playSynthNote(committedAction ? 261 : 523, 'sine', 0.2, 0.05);
                  }}
                  className={`w-full p-2.5 rounded-2xl text-[9.5px] font-bold flex items-center justify-center space-x-2 border transition cursor-pointer ${
                    committedAction 
                      ? 'bg-[#EBF2EC] border-[#CBD9CC] text-[#4A6741]' 
                      : 'bg-[#4A6741] border-[#4A6741] text-white hover:bg-[#3D5535]'
                  }`}
                >
                  <div className="w-4 h-4 rounded-md border flex items-center justify-center bg-white">
                    {committedAction && <Check size={11} className="text-[#4A6741] stroke-[3]" />}
                  </div>
                  <span>{committedAction ? '✓ Committed to the action!' : 'Commit to opposite action now'}</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* 5. WISE MIND决策 helper */}
          {activeTab === 'wise' && (
            <motion.div
              key="wise-screen"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full"
            >
              <div className="mb-2">
                <h3 className="text-xs font-black text-slate-800 flex items-center space-x-1.5">
                  <Compass size={14} className="text-[#4A6741]" />
                  <span>The Wise Mind Compass</span>
                </h3>
                <p className="text-[9px] text-slate-400 leading-snug">
                  Combine the facts of your Reasonable Mind with the feelings of your Emotional Mind.
                </p>
              </div>

              <div className="flex-1 flex flex-col justify-center space-y-3.5 py-1">
                {!wiseMindCreated ? (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[12px]">😰</span>
                        <label className="text-[9px] font-extrabold text-rose-700 uppercase tracking-wider block">
                          Emotional Mind (What my fears/feelings urge me to do)
                        </label>
                      </div>
                      <input
                        type="text"
                        value={emotionalText}
                        onChange={(e) => setEmotionalText(e.target.value)}
                        placeholder="e.g. Shut off the phone and run away from conflict"
                        className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-2.5 py-1.5 text-[9.5px] text-slate-700 placeholder-slate-400 outline-none focus:bg-white focus:border-[#4A6741]"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[12px]">🧐</span>
                        <label className="text-[9px] font-extrabold text-blue-700 uppercase tracking-wider block">
                          Reasonable Mind (What are the hard cold facts/consequences)
                        </label>
                      </div>
                      <input
                        type="text"
                        value={reasonableText}
                        onChange={(e) => setReasonableText(e.target.value)}
                        placeholder="e.g. Flight makes the issue bigger; they want to help me"
                        className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-2.5 py-1.5 text-[9.5px] text-slate-700 placeholder-slate-400 outline-none focus:bg-white focus:border-[#4A6741]"
                      />
                    </div>

                    <button
                      onClick={handleGenerateWiseMind}
                      disabled={!reasonableText.trim() && !emotionalText.trim()}
                      className={`w-full py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition ${
                        reasonableText.trim() || emotionalText.trim() 
                          ? 'bg-[#4A6741] text-white hover:bg-[#3D5535] cursor-pointer' 
                          : 'bg-slate-100 text-slate-400 border border-slate-200/50 cursor-not-allowed'
                      }`}
                    >
                      Synthesize Wise Mind Path
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3.5 text-center flex flex-col items-center">
                    <div className="w-11 h-11 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 animate-pulse">
                      <Layers size={22} />
                    </div>

                    <div className="bg-[#FAF8F5] border border-[#F2ECE4] p-3.5 rounded-2xl text-left shadow-xs">
                      <span className="text-[8px] font-black text-indigo-700 uppercase tracking-wider block mb-1">
                        Your Wise Mind Integration:
                      </span>
                      <p className="text-[10px] text-slate-700 leading-relaxed font-sans italic font-medium">
                        {wiseMindResult}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setWiseMindCreated(false);
                        setReasonableText('');
                        setEmotionalText('');
                        playSynthNote(349, 'sine', 0.2);
                      }}
                      className="text-[#4A6741] text-[9px] font-black tracking-tight cursor-pointer"
                    >
                      Clear and Synthesize Another Path
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
