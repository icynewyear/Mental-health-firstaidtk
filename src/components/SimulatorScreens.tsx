import React, { useState, useEffect, useRef } from 'react';
import { 
  Leaf, 
  Compass, 
  BookOpen, 
  Phone, 
  ArrowLeft, 
  ArrowRight, 
  Heart, 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Smartphone, 
  Zap, 
  Music, 
  CloudRain, 
  Waves, 
  Volume2, 
  VolumeX, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Sliders, 
  Settings2, 
  Play,
  Star,
  Brain,
  Smile,
  Sparkles,
  Shield,
  Eye,
  Activity,
  Download,
  Check,
  Copy,
  FileText,
  Upload,
  MessageSquare
} from 'lucide-react';
import { ActiveScreen, BreathingType, CopingStatement, GroundingStep, MoodLogEntry, CustomScaleConfig } from '../types';
import { startAmbientSound, stopAmbientSound, setAmbientVolume } from '../utils/audioSynth';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ALL_TOOLS, getFavoriteToolIds, saveFavoriteToolIds, toggleFavoriteToolId, ToolDef } from '../utils/toolsData';
import { Reorder } from 'motion/react';

// Dynamic ToolIcon renderer mapping IDs to their pre-vetted Lucide icons
export const ToolIcon: React.FC<{ id: ActiveScreen; size?: number; className?: string }> = ({ id, size = 16, className = "" }) => {
  switch (id) {
    case 'breathing':
      return <Leaf size={size} className={className} />;
    case 'grounding':
      return <Compass size={size} className={className} />;
    case 'vagusHacks':
      return <Zap size={size} className={className} />;
    case 'somatic':
      return <Activity size={size} className={className} />;
    case 'emdr':
      return <Eye size={size} className={className} />;
    case 'reframing':
      return <Brain size={size} className={className} />;
    case 'worryBox':
      return <Smile size={size} className={className} />;
    case 'emotionWheel':
    case 'relief':
      return <BookOpen size={size} className={className} />;
    case 'gratitude':
      return <Sparkles size={size} className={className} />;
    case 'habit':
      return <Activity size={size} className={className} />;
    case 'panicSOS':
      return <Zap size={size} className={className} />;
    case 'safetyPlan':
      return <Shield size={size} className={className} />;
    case 'emergency':
      return <Phone size={size} className={className} />;
    default:
      return <Leaf size={size} className={className} />;
  }
};

// Custom Tooltip for the Recharts Mood Trend Chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if (!data.hasData || !data.moodValue) {
      return null;
    }
    const todayAbbr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
    const isToday = data.day === 'Today' || data.day === todayAbbr;
    return (
      <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-2.5 shadow-lg text-[10px] leading-relaxed select-none font-sans z-50">
        <p className="font-bold text-[#A8C69F]">{isToday ? 'Today' : `${data.day}`}</p>
        <p className="mt-0.5 text-slate-300">Mood: <span className="font-bold text-white">{data.moodLabel}</span></p>
        <p className="text-slate-300">Stress: <span className="font-bold text-white">{data.stress}/10</span></p>
      </div>
    );
  }
  return null;
};

// Helper to extract or fallback to an emoji from a day's logged data, without relying on strict intensity ranges
const extractEmoji = (moodLabel: string | undefined, moodValue?: number): string => {
  if (!moodLabel || moodLabel === 'No Data') return '🍃';
  const firstChar = Array.from(moodLabel)[0] as string | undefined;
  if (firstChar && firstChar.charCodeAt(0) > 255) {
    return firstChar;
  }
  // Fallback for older legacy log data types
  if (moodLabel.includes('Calm')) return '🍃';
  if (moodLabel.includes('Steady')) return '🌊';
  if (moodLabel.includes('Anxious')) return '⛈️';
  if (moodLabel.includes('Panic')) return '😰';
  
  if (moodValue === 4) return '🍃';
  if (moodValue === 3) return '🌊';
  if (moodValue === 2) return '⛈️';
  if (moodValue === 1) return '😰';
  return '🍃';
};

// Custom rendered Bar showing nervous system emoji corresponding to each day's mood
const RenderCustomBar = (props: any) => {
  const { x, y, width, height, payload } = props;
  if (!payload.hasData) return null;
  
  const emoji = extractEmoji(payload.moodLabel, payload.moodValue);
  const cx = x + width / 2;
  const cy = y;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill="#4A6741" opacity={0.3} rx={4} ry={4} />
      <circle cx={cx} cy={cy} r={8.5} fill="#FFFFFF" stroke="#D1DBCE" strokeWidth={1} style={{ filter: 'drop-shadow(0px 1px 1.5px rgba(0,0,0,0.1))' }} />
      <text
        x={cx}
        y={cy + 0.5}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={10}
        className="select-none pointer-events-none"
      >
        {emoji}
      </text>
    </g>
  );
};

// Larger floating Custom rendered Active Bar
const RenderCustomActiveBar = (props: any) => {
  const { x, y, width, height, payload } = props;
  if (!payload.hasData) return null;

  const emoji = extractEmoji(payload.moodLabel, payload.moodValue);
  const cx = x + width / 2;
  const cy = y;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill="#4A6741" opacity={0.6} rx={4} ry={4} />
      <circle cx={cx} cy={cy} r={12.5} fill="#4A6741" opacity={0.15} className="animate-pulse" />
      <circle cx={cx} cy={cy} r={11} fill="#FFFFFF" stroke="#4A6741" strokeWidth={1.5} style={{ filter: 'drop-shadow(0px 1.5px 3px rgba(0,0,0,0.2))' }} />
      <text
        x={cx}
        y={cy + 0.5}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        className="select-none pointer-events-none"
      >
        {emoji}
      </text>
    </g>
  );
};

// ============================================================================
// 1. DASHBOARD SCREEN
// ============================================================================
interface DashboardProps {
  onNavigate: (route: ActiveScreen) => void;
  stressLevel: number;
  setStressLevel: (level: number) => void;
  loggedMood: string | null;
  setLoggedMood: (mood: string | null) => void;
  moodHistory: MoodLogEntry[];
  isDarkMode?: boolean;
  setIsDarkMode?: (val: boolean) => void;
  unlockRequired?: boolean;
  setUnlockRequired?: (val: boolean) => void;
  unlockPin?: string;
  setUnlockPin?: (val: string) => void;
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
}

export const SimulatorDashboard: React.FC<DashboardProps> = ({
  onNavigate,
  stressLevel,
  setStressLevel,
  loggedMood,
  setLoggedMood,
  moodHistory,
  isDarkMode = false,
  setIsDarkMode,
  unlockRequired = false,
  setUnlockRequired,
  unlockPin = '1234',
  setUnlockPin,
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
}) => {
  const PREDEFINED_EMOJI_SETS = [
    {
      id: 'faces',
      name: 'Faces 😊',
      emojis: ['😌', '🙂', '😟', '😰']
    },
    {
      id: 'nature',
      name: 'Nature 🍃',
      emojis: ['🍃', '🌊', '⛈️', '🌿']
    },
    {
      id: 'weather',
      name: 'Weather ☀️',
      emojis: ['☀️', '⛅', '🌧️', '⚡']
    },
    {
      id: 'vibes',
      name: 'Vibes ✨',
      emojis: ['✨', '☕', '💭', '🔥']
    },
    {
      id: 'animals',
      name: 'Animals 🐾',
      emojis: ['🐾', '🕊️', '🐈', '🐕']
    }
  ];

  const [activeSetId, setActiveSetId] = useState<string>(() => {
    return localStorage.getItem('safespace_active_emoji_set_id') || 'faces';
  });

  const [showSelector, setShowSelector] = useState<boolean>(false);
  const [activeCustomSlotIndex, setActiveCustomSlotIndex] = useState<number>(0);
  const [customEmojiSet, setCustomEmojiSet] = useState<string[]>(() => {
    const saved = localStorage.getItem('safespace_custom_emoji_set_list');
    return saved ? JSON.parse(saved) : ['🧘', '🪴', '🍵', '🕯️'];
  });
  const [newCustomInput, setNewCustomInput] = useState<string>('');

  const [showKeyboardInput, setShowKeyboardInput] = useState<boolean>(false);
  const [phoneKeyboardInput, setPhoneKeyboardInput] = useState<string>('');

  const [customPinInput, setCustomPinInput] = useState<string>('');
  const [confirmPinInput, setConfirmPinInput] = useState<string>('');
  const [currentPinInput, setCurrentPinInput] = useState<string>('');
  const [currentPinVerified, setCurrentPinVerified] = useState<boolean>(false);
  const [currentPinError, setCurrentPinError] = useState<boolean>(false);
  const [confirmPinError, setConfirmPinError] = useState<boolean>(false);
  const [toggleOffBlockedMessage, setToggleOffBlockedMessage] = useState<boolean>(false);

  const [isAddingScale, setIsAddingScale] = useState(false);
  const [newScaleName, setNewScaleName] = useState('');

  const handleAddScale = () => {
    if (!newScaleName.trim()) return;
    const newId = `scale_${Date.now()}`;
    const newScale: CustomScaleConfig = {
      id: newId,
      name: newScaleName.trim()
    };
    setCustomScales?.(prev => [...prev, newScale]);
    setTodayCustomScaleValues?.(prev => ({
      ...prev,
      [newId]: 5
    }));
    setIsAddingScale(false);
    setNewScaleName('');
    setSubmittedToday(false);
  };

  const handleDeleteScale = (id: string) => {
    setCustomScales?.(prev => prev.filter(s => s.id !== id));
    setTodayCustomScaleValues?.(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setSubmittedToday(false);
  };

  useEffect(() => {
    if (!showSelector) {
      setCurrentPinInput('');
      setCustomPinInput('');
      setConfirmPinInput('');
      setCurrentPinVerified(false);
      setCurrentPinError(false);
      setConfirmPinError(false);
      setToggleOffBlockedMessage(false);
    }
  }, [showSelector]);

  const updateKeyboardCustomEmoji = (emoji: string | null) => {
    setKeyboardCustomEmoji(emoji);
    const todayStr = new Date().toDateString();
    if (emoji) {
      localStorage.setItem('safespace_kb_emoji_val', emoji);
      localStorage.setItem('safespace_kb_emoji_date', todayStr);
    } else {
      localStorage.removeItem('safespace_kb_emoji_val');
      localStorage.removeItem('safespace_kb_emoji_date');
    }
  };

  const activeSet = PREDEFINED_EMOJI_SETS.find(s => s.id === activeSetId) || {
    id: 'custom',
    name: 'My Set ⚙️',
    emojis: customEmojiSet
  };

  const handleSelectSet = (id: string) => {
    setActiveSetId(id);
    localStorage.setItem('safespace_active_emoji_set_id', id);
  };

  const updateCustomSlot = (val: string) => {
    if (!val) return;
    const newSet = [...customEmojiSet];
    newSet[activeCustomSlotIndex] = val.trim();
    // Guarantee 4 items
    while (newSet.length < 4) newSet.push('🧘');
    const sliced = newSet.slice(0, 4);
    setCustomEmojiSet(sliced);
    localStorage.setItem('safespace_custom_emoji_set_list', JSON.stringify(sliced));
  };

  const [favoriteIds, setFavoriteIds] = useState<ActiveScreen[]>(() => getFavoriteToolIds());
  const [showFavoritesManage, setShowFavoritesManage] = useState<boolean>(false);
  const [isReorderingFavorites, setIsReorderingFavorites] = useState<boolean>(false);

  useEffect(() => {
    const handleUpdate = () => {
      setFavoriteIds(getFavoriteToolIds());
    };
    window.addEventListener('safespace_favorites_updated', handleUpdate);
    return () => {
      window.removeEventListener('safespace_favorites_updated', handleUpdate);
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#F1F5F2] p-5 overflow-y-auto relative">
      {/* Phone custom keyboard picker input modal */}
      {showKeyboardInput && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-5 z-55">
          <div className="bg-white rounded-3xl p-5 shadow-xl border border-slate-100 flex flex-col space-y-4 w-60 text-center animate-scale-in">
            <div>
              <h3 className="text-sm font-bold text-[#4A6741]">Keyboard Custom Feel</h3>
              <p className="text-[9px] text-slate-400 mt-1 leading-normal">
                Type or paste any emoji from your phone keyboard to represent your feel today.
              </p>
            </div>

            <input
              type="text"
              maxLength={4}
              value={phoneKeyboardInput}
              onChange={(e) => setPhoneKeyboardInput(e.target.value)}
              className="bg-slate-50 border-2 border-[#CBD9CC] rounded-2xl px-2 py-2 text-3xl text-center focus:outline-none focus:ring-2 focus:ring-[#4A6741] w-20 h-16 mx-auto transition-all"
              placeholder="❓"
              autoFocus
            />

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowKeyboardInput(false);
                  setPhoneKeyboardInput('');
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2 rounded-xl text-[10px] cursor-pointer border-0 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const val = phoneKeyboardInput.trim();
                  if (val) {
                    setLoggedMood(val);
                    updateKeyboardCustomEmoji(val);
                    setShowKeyboardInput(false);
                    setPhoneKeyboardInput('');
                  }
                }}
                className="flex-1 bg-[#4A6741] hover:bg-[#3D5535] text-white font-bold py-2 rounded-xl text-[10px] cursor-pointer border-0 transition"
              >
                Apply Feel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configure Emoji Set Modal */}
      {showSelector && (
        <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs flex items-end justify-center z-50">
          <div className="bg-white rounded-t-[28px] w-full max-h-[88%] overflow-y-auto p-5 pb-8 shadow-2xl border-t border-slate-100 flex flex-col space-y-4 animate-slide-up text-left z-55 select-none">
            {/* Header */}
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider leading-none mb-1">Set Symbols Options</h3>
                <p className="text-[10px] text-slate-400">Choose a preset pack or make a custom set</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSelector(false)}
                className="text-[11px] font-bold text-[#4A6741] bg-[#E1E8E3] hover:bg-[#CBD9CC] hover:text-[#4A6741] px-2.5 py-1 rounded-full cursor-pointer border-0 transition"
              >
                Close ✕
              </button>
            </div>

            {/* Selector tabs */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none">Select Active Set</span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {PREDEFINED_EMOJI_SETS.map((set) => {
                  const isActive = activeSetId === set.id;
                  return (
                    <button
                      key={set.id}
                      type="button"
                      onClick={() => handleSelectSet(set.id)}
                      className={`text-[9px] font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer border-0 ${
                        isActive
                          ? 'bg-[#4A6741] text-white shadow-xs'
                          : 'bg-slate-50 text-[#4A6741] hover:bg-[#E1E8E3]/45'
                      }`}
                    >
                      {set.name}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => handleSelectSet('custom')}
                  className={`text-[9px] font-black px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-0.5 border-0 ${
                    activeSetId === 'custom'
                      ? 'bg-amber-600 text-white font-bold shadow-xs'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  <span>My Set ⚙️</span>
                </button>
              </div>
            </div>

            {/* Set Preview */}
            {activeSetId !== 'custom' && (
              <div className="space-y-2 pb-1 bg-[#F9FBF9] p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Set Preview</span>
                  <span className="text-[8px] font-black text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase">Active Pack</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {activeSet.emojis.map((emoji, idx) => (
                    <div 
                      key={idx} 
                      className="text-lg p-2 bg-white border border-slate-150 rounded-xl flex items-center justify-center shadow-2xs"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Emoji Set Panel */}
            {activeSetId === 'custom' && (
              <div className="flex flex-col space-y-3">
                <div className="bg-amber-50/50 p-2.5 rounded-2xl border border-amber-100">
                  <p className="text-[9.5px] text-amber-800 leading-normal">
                    <strong>Custom Slot Editor</strong>: Select one of the 4 slots below, then tap a suggestion or register yours!
                  </p>
                </div>

                {/* 4 Slots */}
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2, 3].map((idx) => {
                    const emoji = customEmojiSet[idx] || '🧘';
                    const isSelectedSlot = activeCustomSlotIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveCustomSlotIndex(idx)}
                        className={`p-2 rounded-2xl transition-all duration-200 flex flex-col items-center justify-center cursor-pointer border ${
                          isSelectedSlot
                            ? 'bg-[#E1E8E3] border-[#4A6741] ring-2 ring-[#4A6741]/40 scale-[1.03] shadow-xs'
                            : 'bg-slate-50 border-slate-150 hover:bg-white text-slate-800 shadow-2xs'
                        }`}
                      >
                        <span className="text-[7.5px] uppercase font-bold text-slate-400 mb-1">Slot {idx + 1}</span>
                        <span className="text-xl">{emoji}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Slot replacement input */}
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                  <span className="text-[9px] font-extrabold text-[#4A6741] uppercase tracking-wide block">
                    Update Slot {activeCustomSlotIndex + 1} ({customEmojiSet[activeCustomSlotIndex] || '🧘'})
                  </span>
                  
                  <input
                    type="text"
                    placeholder="Type or paste any emoji..."
                    value={newCustomInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewCustomInput(val);
                      if (val.trim()) {
                         updateCustomSlot(val);
                         setNewCustomInput('');
                      }
                    }}
                    className="bg-white border border-[#CBD9CC] rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4A6741] w-full"
                    maxLength={4}
                  />

                  {/* Suggestions */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200/40">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block w-full">Suggestions</span>
                    {['🌸', '🪐', '🍀', '🌈', '🌙', '🌌', '🎈', '🧸', '🍦', '🍕', '🎡', '🐈', '🧘', '🪴', '🍵', '🕯️', '💭'].map(sug => {
                      return (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => updateCustomSlot(sug)}
                          className="text-base p-1 rounded-lg hover:bg-[#E1E8E3] hover:scale-110 transition-all cursor-pointer border-0 bg-transparent"
                        >
                          {sug}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 🔒 App Security & Privacy Toggle */}
            <hr className="border-slate-100/70" />
            <div className="space-y-2 py-1 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex flex-col text-left max-w-[70%]">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider leading-none mb-1">App Lock Protection</span>
                  <span className="text-[10px] font-bold text-slate-700 leading-tight">Require 4-Digit App PIN</span>
                  <span className="text-[8px] text-slate-400 mt-1 leading-normal">Require entering a 4-digit PIN code to view/edit custom user logs & care history.</span>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (unlockRequired) {
                        // User wants to turn it OFF
                        if (currentPinVerified) {
                          if (setUnlockRequired) {
                            setUnlockRequired(false);
                            localStorage.setItem('safespace_device_unlock_required', 'false');
                            setCurrentPinVerified(false);
                            setToggleOffBlockedMessage(false);
                          }
                        } else {
                          // Block toggle off, require verification first
                          setToggleOffBlockedMessage(true);
                          setCurrentPinError(true);
                        }
                      } else {
                        // User wants to turn it ON (doesn't require previous PIN but we configure it)
                        if (setUnlockRequired) {
                          setUnlockRequired(true);
                          localStorage.setItem('safespace_device_unlock_required', 'true');
                          setCurrentPinVerified(false);
                          setToggleOffBlockedMessage(false);
                        }
                      }
                    }}
                    className={`w-9 h-5 rounded-full p-0.5 transition-all duration-200 cursor-pointer border-0 flex ${
                      unlockRequired ? 'bg-[#4A6741] justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
                  </button>
                </div>
              </div>

              {toggleOffBlockedMessage && (
                <div className="text-[8.5px] text-red-500 font-bold leading-normal p-2 rounded-lg bg-red-50 border border-red-100/50">
                  ⚠️ Please enter and verify your current 4-digit PIN below to disable App Lock Protection.
                </div>
              )}

              {unlockRequired && (
                <div className="pt-2 border-t border-slate-200/40 text-left space-y-2">
                  {!currentPinVerified ? (
                    <div className="flex flex-col space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase">Enter Current PIN to Unlock Settings</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="password"
                          maxLength={4}
                          value={currentPinInput}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                            setCurrentPinInput(val);
                            if (val.length === 4) {
                              if (val === unlockPin) {
                                setCurrentPinVerified(true);
                                setCurrentPinError(false);
                                setToggleOffBlockedMessage(false);
                                setCurrentPinInput('');
                              } else {
                                setCurrentPinError(true);
                              }
                            } else {
                              setCurrentPinError(false);
                            }
                          }}
                          className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg border border-slate-250 bg-white text-slate-800 placeholder-slate-400 w-24 text-center tracking-widest focus:outline-none focus:border-[#4A6741]"
                          placeholder="••••"
                        />
                        <span className="text-[8px] text-slate-400 leading-snug">
                          Verify current 4-Digit PIN to make any changes.
                        </span>
                      </div>
                      {currentPinError && (
                        <span className="text-[7.5px] text-red-500 font-bold block">
                          ❌ Incorrect Current PIN. Please try again.
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <div className="flex flex-col space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase">1. Enter Your New Custom PIN</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="password"
                            maxLength={4}
                            value={customPinInput}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                              setCustomPinInput(val);
                              setConfirmPinInput('');
                              setConfirmPinError(false);
                            }}
                            className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg border border-[#CBD9CC] bg-white text-slate-800 placeholder-slate-400 w-24 text-center tracking-widest focus:outline-none focus:border-[#4A6741]"
                            placeholder="••••"
                          />
                          <span className="text-[8px] text-slate-400 leading-snug">
                            Enter a brand new secret 4-digit code.
                          </span>
                        </div>
                        {customPinInput.length > 0 && customPinInput.length < 4 && (
                          <span className="text-[7.5px] text-amber-600 font-bold block">
                            • Enter exactly 4 digits
                          </span>
                        )}
                      </div>

                      {customPinInput.length === 4 && (
                        <div className="flex flex-col space-y-1 pt-1.5 border-t border-slate-100/50">
                          <label className="text-[9px] font-black text-slate-500 uppercase">2. Confirm / Repeat New PIN</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="password"
                              maxLength={4}
                              value={confirmPinInput}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                setConfirmPinInput(val);
                                if (val.length === 4) {
                                  if (val === customPinInput) {
                                    setConfirmPinError(false);
                                    if (setUnlockPin) {
                                      setUnlockPin(val);
                                      localStorage.setItem('safespace_device_unlock_pin', val);
                                    }
                                  } else {
                                    setConfirmPinError(true);
                                  }
                                } else {
                                  setConfirmPinError(false);
                                }
                              }}
                              className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg border border-[#CBD9CC] bg-white text-slate-800 placeholder-slate-400 w-24 text-center tracking-widest focus:outline-none focus:border-[#4A6741]"
                              placeholder="••••"
                            />
                            <span className="text-[8px] text-slate-400 leading-snug">
                              Retype the 4 digits to confirm accuracy.
                            </span>
                          </div>
                          {confirmPinError && (
                            <span className="text-[7.5px] text-red-500 font-bold block">
                              ❌ PINs do not match! Please verify your digits.
                            </span>
                          )}
                          {confirmPinInput.length === 4 && confirmPinInput === customPinInput && (
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[7.5px] text-emerald-600 font-bold block">
                                ✓ New PIN Verified & Saved!
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setCurrentPinVerified(false);
                                  setCustomPinInput('');
                                  setConfirmPinInput('');
                                }}
                                className="text-[7.5px] font-extrabold text-[#4A6741] uppercase tracking-wider bg-[#E1E8E3] px-2 py-0.5 rounded cursor-pointer border-0"
                              >
                                Lock Changes
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Greeting */}
      <div className="flex justify-between items-start mt-1.5 mb-4 select-none relative">
        <div className="text-left">
          <span className="text-[8.5px] font-black text-[#4A6741] uppercase tracking-wider bg-[#E1E8E3] px-2.5 py-0.5 rounded-full shadow-2xs">OFFLINE FIRST</span>
          <h2 className="text-xl font-black text-[#4A6741] tracking-tight mt-1.5 font-sans">Mental Health Toolkit</h2>
          <p className="text-[11px] font-semibold text-slate-500 mt-0.5 font-sans leading-tight">Take a moment. You are safe, validated, and supported.</p>
        </div>
        {setIsDarkMode && (
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center justify-center text-[10px] w-7 h-7 bg-white hover:bg-slate-50 border border-[#CBD9CC]/35 rounded-xl transition-all shadow-3xs cursor-pointer select-none active:scale-95"
            title="Toggle theme inside phone"
          >
            <span>{isDarkMode ? '☀️' : '🌙'}</span>
          </button>
        )}
      </div>

      {/* Mood Check-In Widget */}
      <div className="bg-white rounded-[24px] p-4 shadow-2xs border border-[#CBD9CC]/35 flex flex-col mb-4 select-none relative">
        {/* Spacious, premium top row pairing title, active indicator & settings button */}
        <div className="flex justify-between items-center mb-3 select-none">
          <div className="flex items-center space-x-1.5 text-left">
            <div className="w-5 h-5 rounded-md bg-[#E1E8E3] flex items-center justify-center text-[#4A6741]">
              <Smile size={12} className="font-bold" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Daily Feel</span>
              <span className="text-[8px] font-black text-[#4A6741] bg-[#E1E8E3]/60 px-1.5 py-0.2 rounded-full inline-block font-mono leading-none">
                {activeSet.id === 'custom' ? 'My Set ⚙️' : activeSet.name}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setShowSelector(true)}
              className="text-[8.5px] font-bold px-2 py-1 rounded-lg border-0 cursor-pointer bg-[#4A6741]/10 text-[#4A6741] hover:bg-[#4A6741]/25 transition-all flex items-center space-x-0.5 select-none shadow-2xs"
            >
              <span>⚙️ Options</span>
            </button>
            {loggedMood && (
              <button
                onClick={() => {
                  setLoggedMood(null);
                  updateKeyboardCustomEmoji(null);
                }}
                className="text-[8.5px] font-black text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/60 px-2 py-1 rounded-lg transition-all border-0 cursor-pointer shadow-2xs"
                title="Clear feel"
              >
                Clear ✕
              </button>
            )}
          </div>
        </div>

        {/* Dynamic status / statement label showing chosen feel inline */}
        <div className="text-left mb-2 select-none">
          {loggedMood ? (
            <div className="flex flex-col">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center space-x-1.5">
                <span>Logged Today:</span>
                <span className="w-5.5 h-5.5 rounded-full bg-[#E1E8E3] flex items-center justify-center text-xs border border-[#4A6741]/20 animate-pulse font-extrabold shadow-2xs">
                  {loggedMood}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-[11px] font-semibold text-slate-400 italic">
              Tap a physical focus symbol below to log your state today
            </p>
          )}
        </div>

        {/* Compact 5-Slot Option Grid (4 themed + 1 customizable) */}
        <div className="grid grid-cols-5 gap-2.5 mb-1 select-none">
          {/* First 4 from selected active set */}
          {activeSet.emojis.slice(0, 4).map((emoji, idx) => {
            const isSelected = loggedMood === emoji;
            return (
              <button
                key={`${emoji}-${idx}`}
                type="button"
                onClick={() => {
                  setLoggedMood(emoji);
                  updateKeyboardCustomEmoji(null); // Overwrite keyboard input with selection
                }}
                className={`text-xl h-10 rounded-xl transition-all duration-305 hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer border ${
                  isSelected 
                    ? 'bg-[#EBF2EC] border-[#4A6741] text-[#4A6741] shadow-xs font-extrabold ring-3 ring-[#4A6741]/10' 
                    : 'bg-white border-[#CBD9CC]/25 hover:bg-[#F9FAF9] hover:border-slate-300 text-slate-700'
                }`}
                title={`Log feel as ${emoji}`}
              >
                {emoji}
              </button>
            );
          })}

          {/* 5th customizable keyboard option */}
          {(() => {
            const hasKbEmoji = keyboardCustomEmoji !== null;
            const isSelected = loggedMood !== null && loggedMood === keyboardCustomEmoji;
            const displayChar = keyboardCustomEmoji || '⚙️';
            return (
              <button
                type="button"
                onClick={() => {
                  setPhoneKeyboardInput(keyboardCustomEmoji || '');
                  setShowKeyboardInput(true);
                }}
                className={`text-lg h-10 rounded-xl transition-all duration-305 hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer relative border ${
                  isSelected
                    ? 'bg-[#EBF2EC] border-[#4A6741] text-[#4A6741] shadow-xs font-extrabold ring-3 ring-[#4A6741]/10'
                    : hasKbEmoji
                    ? 'bg-amber-50/70 border-amber-200 text-slate-705 shadow-2xs'
                    : 'bg-slate-50 border-dashed border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-[#fafafc] hover:text-slate-500'
                }`}
                title={hasKbEmoji ? `Custom keyboard emoji: ${keyboardCustomEmoji}` : 'Set keyboard custom emoji'}
              >
                {hasKbEmoji ? (
                  <span className="text-xl">{displayChar}</span>
                ) : (
                  <span className="text-[9px] font-black tracking-widest text-slate-400">PICK</span>
                )}
                {/* Tiny badge indicating this is a custom keyboard-powered slot */}
                <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${hasKbEmoji ? 'bg-amber-400' : 'bg-[#4A6741]/40'}`}></span>
                  <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${hasKbEmoji ? 'bg-amber-500' : 'bg-slate-300'}`}></span>
                </span>
              </button>
            );
          })()}
        </div>


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
        <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-2">
          <span>Peaceful (1)</span>
          <span>Moderate (5)</span>
          <span>Crisis (10)</span>
        </div>

        {/* Custom Daily Scales */}
        <div className="mt-3 pt-3 border-t border-[#CBD9CC]/30 flex flex-col space-y-2 text-left">
          <div className="flex justify-between items-center select-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Custom Scales</span>
            <button
              type="button"
              onClick={() => setIsAddingScale(true)}
              className="text-[9px] font-bold text-[#4A6741] hover:text-[#3D5535] flex items-center space-x-0.5 border-0 bg-transparent cursor-pointer"
            >
              <Plus size={10} />
              <span>Add Scale</span>
            </button>
          </div>

          {isAddingScale && (
            <div className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-2xl flex flex-col space-y-1.5 mb-2">
              <span className="text-[9px] font-bold text-slate-500">Name your 1-10 daily scale:</span>
              <div className="flex space-x-1.5">
                <input
                  type="text"
                  placeholder="e.g. Anxiety, Energy, Sleep..."
                  value={newScaleName}
                  onChange={(e) => setNewScaleName(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 focus:ring-1 focus:ring-[#4A6741] focus:border-[#4A6741] rounded-xl px-2 py-1 text-[10px] outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddScale();
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddScale}
                  className="px-2.5 py-1 bg-[#4A6741] hover:bg-[#3D5535] text-white text-[9px] font-bold rounded-lg border-0 cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingScale(false);
                    setNewScaleName('');
                  }}
                  className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-600 text-[9px] font-bold rounded-lg border-0 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {customScales.length === 0 ? (
            <p className="text-[9px] text-slate-400 italic">No custom scales added yet. Track variables like Sleep, Anxiety, or Energy by adding custom 1-10 scales.</p>
          ) : (
            <div className="space-y-3">
              {customScales.map(scale => {
                const currentVal = todayCustomScaleValues[scale.id] !== undefined ? todayCustomScaleValues[scale.id] : 5;
                return (
                  <div key={scale.id} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-600 font-bold">{scale.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black text-[#4A6741]">{currentVal}/10</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteScale(scale.id)}
                          className="text-rose-400 hover:text-rose-600 border-0 bg-transparent cursor-pointer p-0.5 rounded transition"
                          title="Delete scale"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={currentVal}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setTodayCustomScaleValues?.(prev => ({
                          ...prev,
                          [scale.id]: val
                        }));
                        setSubmittedToday(false);
                      }}
                      className="w-full accent-[#4A6741] h-1 bg-[#E1E8E3] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Optional notes input */}
        <div className="mt-2 pt-2 border-t border-[#CBD9CC]/30 flex flex-col space-y-1 text-left">
          <label className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider flex items-center space-x-1 select-none">
            <FileText size={9} className="text-[#4A6741]" />
            <span>Optional Tracker Notes</span>
          </label>
          <textarea
            value={stressNotes}
            onChange={(e) => setStressNotes(e.target.value)}
            placeholder="Log triggers, details, physical state..."
            className="w-full bg-slate-50/50 border border-slate-200/60 focus:bg-white focus:ring-1 focus:ring-[#4A6741] focus:border-[#4A6741] rounded-xl px-2 py-1 text-[10px] text-slate-700 placeholder-slate-400 transition resize-none outline-none"
            rows={2}
          />
        </div>

        {/* Submit Tracker Button */}
        <div className="mt-3 pt-2.5 border-t border-[#CBD9CC]/30 flex flex-col space-y-1.5">
          <button
            onClick={() => {
              setSubmittedToday(true);
              localStorage.setItem('safespace_submitted_today', 'true');
            }}
            className={`w-full py-2 px-3 rounded-xl font-bold text-[10px] tracking-wider uppercase transition-all duration-200 flex items-center justify-center space-x-1.5 active:scale-[0.98] cursor-pointer shadow-xs ${
              submittedToday
                ? 'bg-[#EBF2EC] text-[#4A6741] border border-[#CBD9CC] hover:bg-[#E1E8E3]'
                : 'bg-[#4A6741] text-white hover:bg-[#3D5535] hover:shadow-sm'
            }`}
          >
            {submittedToday ? (
              <>
                <Check size={11} className="stroke-[3]" />
                <span>Log Submitted Successfully</span>
              </>
            ) : (
              <>
                <Save size={11} />
                <span>Submit Today's Log</span>
              </>
            )}
          </button>
          {submittedToday && (
            <span className="text-[8.5px] text-[#4A6741]/90 font-medium text-center select-none animate-fade-in block">
              ✨ Saved securely to your offline health dashboard
            </span>
          )}
        </div>
      </div>

      {/* 7-Day Mood Trend Line Chart */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 shadow-sm border border-white/60 flex flex-col mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">7-Day Stress & Mood Trend</span>
          <button
            onClick={() => onNavigate('history')}
            className="text-[9px] font-black tracking-wide text-[#4A6741] bg-[#E1E8E3] hover:bg-[#D1DBCF] active:scale-95 transition px-2.5 py-1 rounded-full cursor-pointer flex items-center space-x-1 shadow-xs border-0 leading-none select-none"
            title="View detailed historical logs"
          >
            <span>History ➔</span>
          </button>
        </div>
        <p className="text-[10px] text-slate-400 text-left mb-2">Track your stress level on a 1-10 scale and logged mood triggers.</p>
        
        {/* Recharts Wrapper */}
        <div className="w-full h-[130px] pr-2" style={{ minWidth: '0' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={moodHistory} margin={{ top: 20, right: 10, left: -25, bottom: -5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis 
                dataKey="day" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false} 
                stroke="#64748B"
              />
              <YAxis 
                domain={[1, 10]} 
                ticks={[1, 5, 10]} 
                tickFormatter={(v) => `${v}`} 
                fontSize={9} 
                tickLine={false} 
                axisLine={false} 
                width={20}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(74, 103, 65, 0.05)' }} />
              <Bar 
                dataKey="stress" 
                activeBar={<RenderCustomActiveBar />}
                shape={<RenderCustomBar />}
                barSize={16}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Clinician Recommendation Card (prescribed based on active stress level) */}
      <div className="bg-white/95 rounded-[22px] p-4 border border-slate-200/60 shadow-xs text-left mb-4.5">
        <span className="text-[8.5px] font-black uppercase tracking-widest text-[#4A6741] block mb-2">Recommended For You</span>
        {stressLevel >= 8 ? (
          <div className="flex items-start space-x-3 bg-[#eef2f6] p-3 rounded-2xl border border-[#d1dee8]">
            <div className="bg-[#3b5b7b] text-white p-2.5 rounded-xl text-xs flex justify-center items-center font-black animate-pulse shadow-sm h-8 w-8 shrink-0">
              🌬️
            </div>
            <div className="text-left">
              <h4 className="text-[11px] font-black uppercase tracking-tight text-[#3b5b7b]">Calming Rescue Space</h4>
              <p className="text-[9.5px] text-slate-500 mt-1 leading-snug">If you are feeling very overwhelmed, take a moment to rest. Let's do a simple calming exercise together.</p>
              <button 
                onClick={() => onNavigate('panicSOS')}
                className="mt-2.5 bg-[#4a7298] hover:bg-[#3b5b7b] active:scale-95 transition text-white font-extrabold text-[9px] px-3 h-7 rounded-full cursor-pointer flex items-center space-x-1 border-0 shadow-xs whitespace-nowrap"
              >
                <span>Go to Calm Space</span> <ArrowRight size={10} />
              </button>
            </div>
          </div>
        ) : stressLevel >= 4 ? (
          <div className="flex items-start space-x-3 bg-amber-50/60 p-3 rounded-xl border border-amber-100">
            <div className="bg-amber-500 text-white p-2 rounded-xl text-xs flex justify-center items-center font-bold h-8 w-8 shrink-0">
              🌿
            </div>
            <div className="text-left">
              <h4 className="text-[11px] font-black uppercase tracking-tight text-amber-700">Steady Body Balance</h4>
              <p className="text-[9.5px] text-slate-500 mt-1 leading-snug">If you feel physical tension starting to build, a quick mindful pause can help you reset.</p>
              <div className="flex flex-wrap gap-2 mt-2.5">
                <button 
                  onClick={() => onNavigate('breathing')}
                  className="bg-[#4A6741] hover:bg-[#3D5535] active:scale-95 cursor-pointer text-white font-extrabold text-[9px] px-3 h-7 rounded-full border-0 shadow-xs flex items-center space-x-0.5 whitespace-nowrap"
                >
                  <Leaf size={10} /> <span className="whitespace-nowrap">Breathe</span>
                </button>
                <button 
                  onClick={() => onNavigate('reframing')}
                  className="bg-amber-600 hover:bg-amber-700 active:scale-95 cursor-pointer text-white font-extrabold text-[9px] px-3 h-7 rounded-full border-0 shadow-xs flex items-center space-x-0.5 whitespace-nowrap"
                >
                  <span className="whitespace-nowrap">🧠 Reframe</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-start space-x-3 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100/50">
            <div className="bg-[#4A6741] text-white p-2 rounded-xl text-xs flex justify-center items-center font-bold h-8 w-8 shrink-0">
              ✨
            </div>
            <div className="text-left">
              <h4 className="text-[11px] font-black uppercase tracking-tight text-emerald-800">Quiet Mind Space</h4>
              <p className="text-[9.5px] text-slate-500 mt-1 leading-snug">You are doing great. Take a couple of minutes to practice gratitude or enjoy a quiet moment of deep breathing.</p>
              <div className="flex flex-wrap gap-2 mt-2.5">
                <button 
                  onClick={() => onNavigate('breathing')}
                  className="bg-[#4A6741] hover:bg-[#3D5535] active:scale-95 cursor-pointer text-white font-extrabold text-[9px] px-3 h-7 rounded-full border-0 shadow-xs flex items-center space-x-0.5 whitespace-nowrap"
                >
                  <Leaf size={10} /> <span className="whitespace-nowrap">Breathe</span>
                </button>
                <button 
                  onClick={() => onNavigate('gratitude')}
                  className="bg-teal-600 hover:bg-teal-700 active:scale-95 cursor-pointer text-white font-extrabold text-[9px] px-3 h-7 rounded-full border-0 shadow-xs flex items-center space-x-0.5 whitespace-nowrap"
                >
                  <span className="whitespace-nowrap">🌸 Gratitude</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Favorite Tools Section */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 shadow-sm border border-white/60 mb-4 text-left">
        <div className="flex justify-between items-center mb-2.5">
          <div className="flex items-center space-x-1.5">
            <span className="text-sm">⭐</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Favorite Tools</span>
          </div>
          <div className="flex space-x-1.5">
            <button
              type="button"
              onClick={() => {
                if (isReorderingFavorites) {
                  setIsReorderingFavorites(false);
                  saveFavoriteToolIds(favoriteIds);
                } else {
                  setIsReorderingFavorites(true);
                }
              }}
              className={`text-[9px] font-black tracking-wide ${isReorderingFavorites ? 'text-white bg-[#4A6741]' : 'text-[#4A6741] bg-[#E1E8E3] hover:bg-[#D1DBCF]'} active:scale-95 transition px-2.5 py-1 rounded-full cursor-pointer border-0 leading-none select-none flex items-center`}
            >
              <span>{isReorderingFavorites ? 'Done ✅' : 'Reorder ↕️'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowFavoritesManage(true)}
              className="text-[9px] font-black tracking-wide text-[#4A6741] bg-[#E1E8E3] hover:bg-[#D1DBCF] active:scale-95 transition px-2.5 py-1 rounded-full cursor-pointer border-0 leading-none select-none flex items-center space-x-0.5"
            >
              <span>Add ➕</span>
            </button>
          </div>
        </div>

        {/* If no favorites selected */}
        {favoriteIds.length === 0 ? (
          <div className="p-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-center">
            <p className="text-[10px] text-slate-400 leading-normal mb-2">
              No favorite tools selected yet. Curate your home screen with your primary go-to exercises!
            </p>
            <button
              type="button"
              onClick={() => setShowFavoritesManage(true)}
              className="bg-[#4A6741] hover:bg-[#3D5535] text-white font-bold text-[9px] px-3 h-7 rounded-full transition cursor-pointer border-0 shadow-xs"
            >
              Add Favorites
            </button>
          </div>
        ) : isReorderingFavorites ? (
          <Reorder.Group 
            axis="y" 
            values={favoriteIds} 
            onReorder={setFavoriteIds} 
            className="flex flex-col space-y-1.5 m-0 p-0 list-none relative"
          >
            {favoriteIds.map((id) => {
              const tool = ALL_TOOLS.find(t => t.id === id);
              if (!tool) return null;
              return (
                <Reorder.Item 
                  key={id}
                  value={id}
                  className={`flex items-center justify-between p-2.5 rounded-2xl border shadow-xs cursor-grab active:cursor-grabbing relative z-10 ${tool.bg}`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                    <div className="bg-white p-1.5 rounded-xl shadow-xs shrink-0 flex items-center justify-center text-slate-800 border border-slate-100">
                      <ToolIcon id={id} size={14} className={tool.iconColor} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[10.5px] font-extrabold text-slate-800 leading-tight whitespace-normal">{tool.name}</h4>
                      <p className="text-[8px] text-slate-400 tracking-wide font-mono uppercase bg-white/50 px-1 py-0.5 rounded border border-slate-100 inline-block leading-none mt-0.5">{tool.tag}</p>
                    </div>
                  </div>
                  <div className="px-2 text-slate-400 opacity-60 shrink-0">
                     <span className="text-xl leading-none">≡</span>
                   </div>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        ) : (
          <div className="flex flex-col space-y-1.5">
            {favoriteIds.map((id) => {
              const tool = ALL_TOOLS.find(t => t.id === id);
              if (!tool) return null;
              return (
                <div 
                  key={id}
                  className={`flex items-center justify-between p-2.5 rounded-2xl border transition duration-150 shadow-xs cursor-pointer ${tool.bg} hover:scale-[1.01] active:scale-99`}
                  onClick={() => onNavigate(id)}
                >
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                    <div className="bg-white p-1.5 rounded-xl shadow-xs shrink-0 flex items-center justify-center text-slate-800 border border-slate-100">
                      <ToolIcon id={id} size={14} className={tool.iconColor} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[10.5px] font-extrabold text-slate-800 leading-tight whitespace-normal">{tool.name}</h4>
                      <p className="text-[8px] text-slate-400 tracking-wide font-mono uppercase bg-white/50 px-1 py-0.5 rounded border border-slate-100 inline-block leading-none mt-0.5">{tool.tag}</p>
                    </div>
                  </div>
                  
                  {/* Star toggle action */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const updated = favoriteIds.filter(x => x !== id);
                      saveFavoriteToolIds(updated);
                      setFavoriteIds(updated);
                    }}
                    className="p-1 px-2 hover:bg-slate-100/30 rounded-xl transition border-0 bg-transparent text-amber-500 cursor-pointer"
                    title="Remove from favorites"
                  >
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Safety & Crisis Hub Gateway */}
      <button
        onClick={() => onNavigate('safetyHub')}
        className="w-full bg-[#f0f4f8] hover:bg-[#e1e8f0] border border-[#d1dee8] transition rounded-[22px] p-4 text-left flex items-center justify-between shadow-xs cursor-pointer select-none active:scale-99 mb-4"
      >
        <div className="flex items-center space-x-3">
          <div className="bg-[#3b5b7b] text-white p-2.5 rounded-xl flex items-center justify-center text-xs font-bold leading-none shrink-0 shadow-sm border border-[#2a455f]">
            🌬️
          </div>
          <div className="text-left">
            <h3 className="text-xs font-bold text-[#3b5b7b]">Support Hub</h3>
            <p className="text-[9px] text-[#4a7298] mt-0.5 leading-snug">Supportive tools for high-distress moments, step-by-step safety guides, and quiet reassurance.</p>
          </div>
        </div>
        <div className="bg-[#d1dee8] p-1.5 rounded-full flex items-center justify-center text-[#3b5b7b] shrink-0 border border-[#b8cce0]">
          <ArrowRight size={11} className="stroke-[2.5]" />
        </div>
      </button>

      {/* Manage Favorites Slideup / Dial modal overlay */}
      {showFavoritesManage && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-end justify-center z-55">
          <div className="bg-white rounded-t-[38px] w-full max-h-[85%] overflow-y-auto p-5 shadow-2x2 border-t border-slate-100 flex flex-col space-y-4 select-none pb-8 text-left animate-slide-up">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-sm font-black text-slate-800">Customize Favorites</h3>
                <p className="text-[9px] text-slate-400 mt-0.5">Toggle stars to customize your Home screen</p>
              </div>
              <button
                type="button"
                onClick={() => setShowFavoritesManage(false)}
                className="bg-[#4A6741] hover:bg-[#3D5535] text-white font-extrabold px-3 py-1 rounded-full text-[9px] border-0 cursor-pointer transition shadow-xs"
              >
                Apply
              </button>
            </div>

            {/* List scroll container */}
            <div className="space-y-4 overflow-y-auto pr-0.5 max-h-[320px]">
              {(['Somatic', 'CBT', 'Safety'] as const).map((cat) => {
                const catTools = ALL_TOOLS.filter(t => t.category === cat);
                return (
                  <div key={cat} className="space-y-2">
                    <span className="text-[8.5px] font-black uppercase text-[#4A6741] tracking-wider pb-1 block border-b border-emerald-100/70">
                      {cat} Pathway Tools
                    </span>
                    <div className="space-y-1.5 animate-fade-in text-slate-700">
                      {catTools.map((tool) => {
                        const isFav = favoriteIds.includes(tool.id);
                        return (
                          <div 
                            key={tool.id} 
                            onClick={() => {
                              let updated: ActiveScreen[];
                              if (isFav) {
                                updated = favoriteIds.filter(x => x !== tool.id);
                              } else {
                                updated = [...favoriteIds, tool.id];
                              }
                              saveFavoriteToolIds(updated);
                              setFavoriteIds(updated);
                            }}
                            className={`flex items-start space-x-2.5 p-2 rounded-2xl border transition cursor-pointer select-none ${
                              isFav ? 'bg-[#E1E8E3]/35 border-[#CBD9CC]' : 'bg-slate-50/40 border-slate-150/70 hover:bg-slate-50'
                            }`}
                          >
                            <div className="bg-white p-2 rounded-xl mt-0.5 shadow-xs shrink-0 flex items-center justify-center border border-slate-100">
                              <ToolIcon id={tool.id} size={13} className={tool.iconColor} />
                            </div>
                            <div className="flex-1 min-w-0 pr-1 select-none">
                              <div className="flex items-start justify-between">
                                <h4 className="text-[10px] font-bold text-slate-800 leading-tight flex-1 pr-1">{tool.name}</h4>
                                <span className="text-[6.5px] font-bold text-slate-400 border border-slate-200 px-1 py-[1px] rounded scale-90 shrink-0 select-none">{tool.tag}</span>
                              </div>
                              <p className="text-[8px] text-slate-400 leading-normal mt-0.5 line-clamp-1">{tool.desc}</p>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                let updated: ActiveScreen[];
                                if (isFav) {
                                  updated = favoriteIds.filter(x => x !== tool.id);
                                } else {
                                  updated = [...favoriteIds, tool.id];
                                }
                                saveFavoriteToolIds(updated);
                                setFavoriteIds(updated);
                              }}
                              className="p-1 px-1.5 transition text-amber-500 rounded-xl hover:bg-slate-100 border-0 bg-transparent cursor-pointer shrink-0 mt-0.5"
                            >
                              <Star size={13} className={isFav ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3 Categories Directories (Highly-categorized, low cognitive load) */}
      <span className="text-[10px] font-bold text-slate-400 text-left uppercase tracking-widest mb-2.5 block">Wellness Pathways</span>

      <div className="flex flex-col space-y-2.5 mb-6">
        {/* Somatic Hub Gateway */}
        <button
          onClick={() => onNavigate('somaticHub')}
          className="w-full bg-white hover:bg-emerald-50/20 border border-slate-200/80 transition rounded-[22px] p-4 text-left flex items-center justify-between shadow-xs cursor-pointer select-none active:scale-99"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl flex items-center justify-center text-xs font-bold leading-none shrink-0 border border-emerald-100">
              🌿
            </div>
            <div className="text-left">
              <h3 className="text-xs font-bold text-slate-800">Somatic & Body Hub</h3>
              <p className="text-[9px] text-slate-400 mt-0.5 leading-snug">Mindful breathing, sensory grounding, gentle eye pacing, muscle relaxation, and more.</p>
            </div>
          </div>
          <div className="bg-slate-100 p-1.5 rounded-full flex items-center justify-center text-slate-400 shrink-0">
            <ArrowRight size={11} className="stroke-[2.5]" />
          </div>
        </button>

        {/* CBT Hub Gateway */}
        <button
          onClick={() => onNavigate('cbtHub')}
          className="w-full bg-white hover:bg-[#FAF8F5] border border-slate-400/20 transition rounded-[22px] p-4 text-left flex items-center justify-between shadow-xs cursor-pointer select-none active:scale-99"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-[#FAF0E6] text-amber-900 p-2.5 rounded-xl flex items-center justify-center text-xs font-bold leading-none shrink-0 border border-amber-100">
              🧠
            </div>
            <div className="text-left">
              <h3 className="text-xs font-bold text-slate-800">CBT & Mind Hub</h3>
              <p className="text-[9px] text-slate-400 mt-0.5 leading-snug">A private space to write worries, look at thoughts gently, and count gratitude.</p>
            </div>
          </div>
          <div className="bg-slate-100 p-1.5 rounded-full flex items-center justify-center text-slate-400 shrink-0">
            <ArrowRight size={11} className="stroke-[2.5]" />
          </div>
        </button>

      </div>

      {/* Safety Footer note */}
      <div className="mt-auto pt-4 border-t border-slate-100">
        <p className="text-[9px] text-slate-400 text-center leading-relaxed font-medium">
          🔒 Private Local Storage. No cloud databases connected. Your logs never leave this offline device.
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
  coherent: {
    inhale: 5,
    hold1: 0,
    exhale: 5,
    hold2: 0, // No hold in Coherent 5-5
    bg: 'bg-gradient-to-br from-[#87A896] to-[#557F69]',
    accent: 'text-[#557F69] border-[#A8C69F]',
    glow: 'shadow-[0_20px_40px_rgba(85,127,105,0.3)]',
  },
};

export const SimulatorBreathing: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [breathingMode, setBreathingMode] = useState<BreathingType>('box');
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [isHapticPulsing, setIsHapticPulsing] = useState(false);
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'waves'>('none');
  const [ambientVolume, setAmbientVolumeState] = useState(0.4);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // Advanced Browser-Native Soothing TTS controls
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>(() => {
    return localStorage.getItem('mindfulVoiceName') || '';
  });
  const [voiceRate, setVoiceRate] = useState<number>(() => {
    const saved = localStorage.getItem('mindfulVoiceRate');
    return saved ? parseFloat(saved) : 0.75; // Even more relaxed-slow by default
  });
  const [voicePitch, setVoicePitch] = useState<number>(() => {
    const saved = localStorage.getItem('mindfulVoicePitch');
    return saved ? parseFloat(saved) : 0.95; // Warm, slightly lower pitch
  });
  const [voiceVolume, setVoiceVolume] = useState<number>(() => {
    const saved = localStorage.getItem('mindfulVoiceVolume');
    return saved ? parseFloat(saved) : 0.85;
  });
  const [showVoiceSettings, setShowVoiceSettings] = useState<boolean>(false);

  // Set up local SpeechSynthesis voices loading
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const loadSyncVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        // Filters for English or default browser languages
        const filtered = availableVoices.filter(v => v.lang.startsWith('en') || v.lang.startsWith('en-') || v.lang === '');
        const list = filtered.length > 0 ? filtered : availableVoices;
        setVoices(list);
        
        // Auto-select a nice soothing voice if not set
        if (!localStorage.getItem('mindfulVoiceName')) {
          const scored = list.map(v => {
            let score = 0;
            const nameLower = v.name.toLowerCase();
            if (nameLower.includes('natural')) score += 100;
            if (nameLower.includes('premium')) score += 80;
            if (nameLower.includes('enhanced')) score += 70;
            if (nameLower.includes('samantha')) score += 95; 
            if (nameLower.includes('google us english') || nameLower.includes('google uk english')) score += 90;
            if (nameLower.includes('siri')) score += 60;
            if (nameLower.includes('female') || nameLower.includes('soft') || nameLower.includes('soothing')) score += 30;
            return { voice: v, score };
          });
          scored.sort((a, b) => b.score - a.score);
          const topVoice = scored[0]?.voice?.name || list[0]?.name || '';
          if (topVoice) {
            setSelectedVoiceName(topVoice);
            localStorage.setItem('mindfulVoiceName', topVoice);
          }
        }
      };

      loadSyncVoices();
      window.speechSynthesis.onvoiceschanged = loadSyncVoices;
    }
  }, []);

  const handleToggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
  };

  const handleVoiceChange = (name: string) => {
    setSelectedVoiceName(name);
    localStorage.setItem('mindfulVoiceName', name);
  };

  const handleVoiceRateChange = (rate: number) => {
    setVoiceRate(rate);
    localStorage.setItem('mindualVoiceRate', rate.toString());
  };

  const handleVoicePitchChange = (pitch: number) => {
    setVoicePitch(pitch);
    localStorage.setItem('mindfulVoicePitch', pitch.toString());
  };

  const handleVoiceVolumeChange = (vol: number) => {
    setVoiceVolume(vol);
    localStorage.setItem('mindfulVoiceVolume', vol.toString());
  };

  const handlePreviewVoice = () => {
    playWebSpeechFallback("Breathe in... Hold your breath... Breathe out... Gently rest...");
  };

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
  const isHoldPhase = isRunning && (phase === 'hold1' || phase === 'hold2');

  const getTransitionDuration = () => {
    if (!isRunning) return 1000;
    const dur = activeConf[phase] || 4;
    return dur * 1000;
  };

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
          } else if (breathingMode === 'coherent') {
            // Coherent breathing: 5s inhale, 5s exhale (no holds)
            switch (phase) {
              case 'inhale':
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

  const playWebSpeechFallback = (word: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(word);
        
        const voicesList = window.speechSynthesis.getVoices();
        const matchingVoice = voicesList.find(v => v.name === selectedVoiceName);
        if (matchingVoice) {
          utterance.voice = matchingVoice;
          utterance.lang = matchingVoice.lang;
        } else {
          const enVoices = voicesList.filter(v => v.lang.startsWith('en'));
          if (enVoices.length > 0) {
            utterance.voice = enVoices[0];
            utterance.lang = enVoices[0].lang;
          } else {
            utterance.lang = 'en-US';
          }
        }

        utterance.pitch = voicePitch; 
        utterance.rate = voiceRate;  
        utterance.volume = voiceVolume; 

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('SpeechSynthesis fallback error:', err);
      }
    }
  };

  // Soothing vocal counting guide
  useEffect(() => {
    if (!isRunning || !voiceEnabled) {
      if (!isRunning && typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    try {
      const modeConf = BREATHING_CONFIG[breathingMode];
      const totalSeconds = modeConf[phase];
      // Calculate current offset count (starts at 1)
      const countNum = totalSeconds - secondsLeft + 1;

      const getVoiceInstruction = (num: number, currentPhase: 'inhale' | 'hold1' | 'exhale' | 'hold2') => {
        if (num === 1) {
          if (currentPhase === 'inhale') return 'In';
          if (currentPhase === 'hold1') return 'Hold';
          if (currentPhase === 'exhale') return 'Out';
          if (currentPhase === 'hold2') return 'Rest';
        }
        const digitWords = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
        return digitWords[num] || `${num}`;
      };

      const wordToSpeak = getVoiceInstruction(countNum, phase);

      // If there is no specific vocal instruction, remain peaceful and silent
      if (!wordToSpeak) {
        return;
      }

      // Speak using browser-native vocal guide
      playWebSpeechFallback(wordToSpeak);
    } catch (err) {
      console.warn('Vocal Speech synthesis error:', err);
    }

    return () => {
      // Don't cancel immediately on every second change since we only speak on transition (num === 1)
    };
  }, [secondsLeft, phase, isRunning, voiceEnabled, breathingMode]);

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
    <div className="flex flex-col h-full bg-[#F1F5F2] overflow-y-auto">
      <div className="flex flex-col min-h-full p-3.5 justify-between">
        {/* Top Banner and Description */}
      <div className="text-center mt-1 relative">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="absolute left-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-200 text-slate-500 bg-transparent border-0 cursor-pointer transition active:scale-95 flex items-center justify-center shrink-0"
            title="Go Back"
          >
            <ArrowLeft size={13} className="stroke-[3]" />
          </button>
        )}
        <h2 className="text-lg font-bold text-[#4A6741] leading-tight font-sans">Guided Breathing</h2>
        <p className="text-[10px] text-slate-500 px-4 mt-0.5">Soothe anxiety by matching your lungs to the expanding circle.</p>

        {/* Tab switcher */}
        <div className="flex w-full mt-2.5 bg-[#E1E8E3] rounded-2xl p-1 gap-1">
          <button
            onClick={() => setBreathingMode('box')}
            className={`flex-1 text-[10px] font-bold py-1.5 rounded-xl transition ${
              breathingMode === 'box' ? 'bg-white shadow-sm text-[#4A6741]' : 'text-[#4A6741]/60'
            }`}
          >
            Square (4-4)
          </button>
          <button
            onClick={() => setBreathingMode('calm')}
            className={`flex-1 text-[10px] font-bold py-1.5 rounded-xl transition ${
              breathingMode === 'calm' ? 'bg-white shadow-sm text-[#4A6741]' : 'text-[#4A6741]/60'
            }`}
          >
            Calm (4-7-8)
          </button>
          <button
            onClick={() => setBreathingMode('coherent')}
            className={`flex-1 text-[10px] font-bold py-1.5 rounded-xl transition ${
              breathingMode === 'coherent' ? 'bg-white shadow-sm text-[#4A6741]' : 'text-[#4A6741]/60'
            }`}
          >
            Coherent (5-5)
          </button>
        </div>
      </div>

      {/* Main Animation Stage */}
      <div className="flex-1 flex flex-col items-center justify-center -my-1.5">
        <div className="relative flex items-center justify-center w-48 h-48">
          
          {/* Breathing expanding bubble aura */}
          <div
            className={`absolute transition-all ease-in-out ${
              isRunning ? `${details.scale}` : 'scale-100'
            }`}
            style={{ transitionDuration: `${getTransitionDuration()}ms` }}
          >
            <div
              className={`rounded-full w-28 h-28 border-2 border-[#A8C69F] transition-all duration-300 ${
                isHapticPulsing ? 'border-solid border-opacity-90 border-[#4A6741] scale-102' : 'border-dashed border-opacity-40'
              } ${isHoldPhase ? 'animate-hold-pulse' : ''}`}
            >
              <div className="w-full h-full rounded-full opacity-10 bg-[#A8C69F]" />
            </div>
          </div>

          {/* Central actual solid bubble */}
          <div
            className={`absolute transition-all ease-in-out ${
              isRunning ? `${details.scale}` : 'scale-100'
            }`}
            style={{ transitionDuration: `${getTransitionDuration()}ms` }}
          >
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`rounded-full w-20 h-20 flex flex-col justify-center items-center text-white border border-white/40 shadow-lg cursor-pointer hover:brightness-105 active:scale-95 focus:outline-none transition-all duration-300 ${
                activeConf.bg
              } ${isRunning ? activeConf.glow : 'shadow'} ${
                isHapticPulsing ? 'brightness-110 saturate-110' : ''
              } ${isHoldPhase ? 'animate-hold-pulse' : ''}`}
            >
              <span className="text-[10px] font-bold tracking-wider uppercase opacity-95 text-center leading-tight">
                {isRunning ? details.label : 'Tap to Start'}
              </span>
              {isRunning ? (
                <span className="text-xl font-black mt-0.5 leading-none">{activeConf[phase] - secondsLeft + 1}s</span>
              ) : (
                <span className="text-[8px] uppercase tracking-widest opacity-75 mt-0.5 font-bold">Ready</span>
              )}
            </button>
          </div>

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

        {/* Toggleable option for soothing vocal guide */}
        <div className="flex flex-col bg-white/70 backdrop-blur-md rounded-2xl p-2 px-3 mb-1.5 border border-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-[#4A6741]">
              <Volume2 size={13} className={isRunning && voiceEnabled ? "animate-pulse font-bold" : ""} />
              <span className="text-[11px] font-bold">Vocal Breathing Guide</span>
            </div>
            <div className="flex items-center space-x-2">
              {voiceEnabled && (
                <button
                  type="button"
                  onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                  title="Configure Vocal Tone & Quality"
                  className="p-1 rounded-md text-[#4A6741]/80 hover:bg-[#E1E8E3] transition-colors"
                >
                  <Settings2 size={12} className={showVoiceSettings ? "rotate-45 transition-transform animate-spin-once" : "transition-transform"} />
                </button>
              )}
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`w-8 h-4 rounded-full transition-colors relative flex items-center p-0.5 ${
                  voiceEnabled ? 'bg-[#4A6741]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-3 h-3 bg-white rounded-full shadow-xs transition-transform ${
                    voiceEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Expanded Beautiful Vocal Tuning Panel */}
          {voiceEnabled && showVoiceSettings && (
            <div className="mt-2 pt-2 border-t border-[#4A6741]/10 space-y-2 animate-fade-in text-[10px] text-slate-700">
              {/* Voice Selector */}
              <div className="space-y-1">
                <label className="font-bold text-[#4A6741]/90 flex items-center justify-between">
                  <span>Selected Guide Voice:</span>
                  <span className="text-[8px] font-medium opacity-60">System Speech Engine</span>
                </label>
                <select
                  value={selectedVoiceName}
                  onChange={(e) => handleVoiceChange(e.target.value)}
                  className="w-full bg-[#F4F7F5] border border-[#CBD9CC] rounded-lg px-2 py-1 text-[10px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#4A6741]"
                >
                  {voices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name} {v.lang ? `(${v.lang.toUpperCase()})` : ''} {v.localService ? '⚡' : ''}
                    </option>
                  ))}
                  {voices.length === 0 && (
                    <option value="">Default System Voice</option>
                  )}
                </select>
              </div>

              {/* Adjust Speed Rate */}
              <div className="space-y-0.5">
                <div className="flex justify-between items-center text-[9px] font-medium text-slate-600">
                  <span>Vocal Speed:</span>
                  <span className="font-mono font-bold text-[#4A6741]">{Math.round(voiceRate * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={voiceRate}
                  onChange={(e) => handleVoiceRateChange(parseFloat(e.target.value))}
                  className="w-full accent-[#4A6741] h-1 bg-[#E1E8E3] rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Adjust Pitch Tone */}
              <div className="space-y-0.5">
                <div className="flex justify-between items-center text-[9px] font-medium text-slate-600">
                  <span>Vocal Pitch (Gender/Age):</span>
                  <span className="font-mono font-bold text-[#4A6741]">{Math.round(voicePitch * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={voicePitch}
                  onChange={(e) => handleVoicePitchChange(parseFloat(e.target.value))}
                  className="w-full accent-[#4A6741] h-1 bg-[#E1E8E3] rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Adjust Voice Volume */}
              <div className="space-y-0.5">
                <div className="flex justify-between items-center text-[9px] font-medium text-slate-600">
                  <span>Voice Volume:</span>
                  <span className="font-mono font-bold text-[#4A6741]">{Math.round(voiceVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={voiceVolume}
                  onChange={(e) => handleVoiceVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-[#4A6741] h-1 bg-[#E1E8E3] rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Preview Button */}
              <button
                type="button"
                onClick={handlePreviewVoice}
                className="w-full flex items-center justify-center space-x-1 py-1 px-2 border border-[#4A6741]/20 hover:border-[#4A6741] bg-[#4A6741]/5 hover:bg-[#4A6741]/10 rounded-lg text-[#4A6741] font-bold transition-all mt-1"
              >
                <Play size={10} className="fill-[#4A6741] shrink-0" />
                <span>Test Configured Voice Guide</span>
              </button>
            </div>
          )}

          {voiceEnabled && !showVoiceSettings && (
            <div className="text-[9px] font-bold text-[#4A6741]/80 mt-1 pr-1 text-right flex items-center justify-end gap-1 cursor-pointer" onClick={() => setShowVoiceSettings(true)}>
              <span>✨ Vocal Guide active (tap to tune tone / speed)</span>
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
  </div>
);
};


// ============================================================================
// 3. 5-4-3-2-1 GROUNDING TECHNIQUE
// ============================================================================
interface GroundingProps {
  onTriggerDebug?: () => void;
  onBack?: () => void;
}

export const SimulatorGrounding: React.FC<GroundingProps> = ({ onTriggerDebug, onBack }) => {
  const steps: GroundingStep[] = [
    { step: 5, label: 'See', prompt: 'Type or say 5 things you can see in this room.', placeholder: 'Type or say item... (typing is optional: leave blank & click Add)', color: 'bg-[#4A6741] focus-within:ring-[#A8C69F]', items: [] },
    { step: 4, label: 'Feel', prompt: 'Type or say 4 physical sensations you feel.', placeholder: 'Type or say feeling... (typing is optional: leave blank & click Add)', color: 'bg-[#608271] focus-within:ring-[#A8C69F]', items: [] },
    { step: 3, label: 'Hear', prompt: 'Type or say 3 ambient sounds you can hear.', placeholder: 'Type or say sound... (typing is optional: leave blank & click Add)', color: 'bg-[#8CA883] focus-within:ring-[#E1E8E3]', items: [] },
    { step: 2, label: 'Smell', prompt: 'Type or say 2 aromas or odors in the room.', placeholder: 'Type or say aroma... (typing is optional: leave blank & click Add)', color: 'bg-[#A8C69F] focus-within:ring-[#E1E8E3]', items: [] },
    { step: 1, label: 'Taste', prompt: 'Type or say 1 flavor in your mouth right now.', placeholder: 'Type or say taste... (typing is optional: leave blank & click Add)', color: 'bg-[#608271] focus-within:ring-[#E1E8E3]', items: [] },
  ];

  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [completedItems, setCompletedItems] = useState<{ [key: number]: string[] }>({
    5: [], 4: [], 3: [], 2: [], 1: [],
  });
  const [inputVal, setInputVal] = useState('');
  const lastClickRef = useRef<number[]>([]);

  const handleThreeClick = () => {
    const now = Date.now();
    const baseTime = [now, ...lastClickRef.current].slice(0, 3);
    lastClickRef.current = baseTime;
    if (baseTime.length === 3 && baseTime[0] - baseTime[2] < 1200) {
      if (onTriggerDebug) {
        onTriggerDebug();
      }
      lastClickRef.current = []; // reset
    }
  };

  const currentStep = steps[activeStepIdx];
  const list = completedItems[currentStep.step] || [];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    const fallbackNames: { [key: string]: string } = {
      'See': 'Noticed sight',
      'Feel': 'Noticed physical sensation',
      'Hear': 'Noticed ambient sound',
      'Smell': 'Noticed physical aroma',
      'Taste': 'Noticed taste/flavor'
    };
    
    const itemText = inputVal.trim() || (fallbackNames[currentStep.label] || 'Observed item');

    if (list.length < currentStep.step) {
      setCompletedItems({
        ...completedItems,
        [currentStep.step]: [...list, itemText],
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
      <div className="text-center mt-3 shrink-0 select-none relative">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="absolute left-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-200 text-slate-500 bg-transparent border-0 cursor-pointer transition active:scale-95 flex items-center justify-center shrink-0"
            title="Go Back"
          >
            <ArrowLeft size={13} className="stroke-[3]" />
          </button>
        )}
        <h2 className="text-xl font-bold text-[#4A6741] leading-tight font-sans">
          5-4-<span onClick={handleThreeClick} className="cursor-pointer active:scale-95 inline-block transition-transform duration-100 hover:text-[#384F31] font-extrabold px-0.5" title="Triple tap to open Developer Sandbox">3</span>-2-1 Grounding
        </h2>
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
          <p className="text-[10px] text-slate-500 mt-1 italic leading-relaxed">
            Point them out in your mind or say them aloud! Typing is completely optional — you can write something if you like, or leave it blank and just click "Add" to record each one.
          </p>
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
              Awaiting item {list.length + id + 1}...
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
export const SimulatorRelief: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const initialStatements: CopingStatement[] = [
    { id: '1', text: 'This feeling is uncomfortable, but it is temporary and it will pass.', category: 'Panic', saved: true },
    { id: '2', text: 'My racing heart is just a natural wave of energy. I am in a safe space.', category: 'Panic', saved: true },
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
      <div className="text-center mt-3 relative">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="absolute left-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-[#E1E8E3] text-[#4A6741] bg-transparent border-0 cursor-pointer transition active:scale-95 flex items-center justify-center shrink-0"
            title="Go Back"
          >
            <ArrowLeft size={13} className="stroke-[3]" />
          </button>
        )}
        <h2 className="text-xl font-bold text-[#4A6741] leading-tight font-sans">Comforting Phrases</h2>
        <p className="text-[11px] text-slate-500 mt-1">Grounding reminders and reassuring thoughts to read whenever you need them.</p>

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
interface EmergencyProps {
  onNavigate?: (route: ActiveScreen) => void;
  onBack?: () => void;
}

export const SimulatorEmergency: React.FC<EmergencyProps> = ({ onNavigate, onBack }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [savedContact, setSavedContact] = useState<{ name: string; phone: string } | null>(() => {
    const data = localStorage.getItem('aid_emergency_contact');
    return data ? JSON.parse(data) : null;
  });



  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const contact = { name: name.trim(), phone: phone.trim() };
    setSavedContact(contact);
    localStorage.setItem('aid_emergency_contact', JSON.stringify(contact));
    setName('');
    setPhone('');
  };

  const handleTriggerDial = (number: string, type: 'phone' | 'sms' = 'phone') => {
    try {
      if (type === 'sms') {
        window.location.href = `sms:${number}`;
      } else {
        window.location.href = `tel:${number}`;
      }
    } catch (e) {
      console.warn("Could not dispatch protocol link directly in this environment:", e);
    }
  };

  const handleDeleteContact = () => {
    setSavedContact(null);
    localStorage.removeItem('aid_emergency_contact');
  };

  return (
    <div className="flex flex-col h-full bg-[#F1F5F2] p-5 justify-between overflow-y-auto no-scrollbar">
      {/* Title */}
      <div className="text-center mt-3 shrink-0 relative">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="absolute left-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-200 text-slate-500 bg-transparent border-0 cursor-pointer transition active:scale-95 flex items-center justify-center shrink-0"
            title="Go Back"
          >
            <ArrowLeft size={13} className="stroke-[3]" />
          </button>
        )}
        <h2 className="text-xl font-bold text-[#4A6741] leading-tight font-sans">Crisis & Hotlines</h2>
        <p className="text-[11px] text-slate-500 mt-1">Instant offline lines and key local supporters to reach right away.</p>
      </div>

      {/* Main Hotline list */}
      <div className="flex-1 flex flex-col space-y-3.5 my-4">
        
        {/* Interactive Stanley-Brown Safety Plan Block */}
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('safetyPlan')}
            className="w-full text-left bg-gradient-to-r from-indigo-700 to-slate-800 text-white transition rounded-[24px] p-4 flex items-center justify-between shadow-xs hover:shadow-md hover:brightness-105 active:scale-99 cursor-pointer border-0 select-none"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-white/10 p-2.5 rounded-2xl flex items-center justify-center text-white font-black text-xs">
                🛡️
              </div>
              <div>
                <span className="text-[8.5px] font-bold uppercase tracking-widest text-[#A5B4FC] block leading-none">Comfort & Support Guide</span>
                <h3 className="text-xs font-black mt-1">My Safety & Comfort Plan</h3>
                <p className="text-[9.5px] text-[#C7D2FE] mt-0.5 leading-tight">Create your step-by-step personalized plan to find comfort and support.</p>
              </div>
            </div>
            <div className="bg-white/10 hover:bg-white/15 p-1.5 rounded-full text-white transition flex items-center justify-center shrink-0">
              <ArrowRight size={12} />
            </div>
          </button>
        )}

        {/* National Hotlines card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 shadow-sm border border-white flex flex-col text-left space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confidential Aid</span>
          
          {/* Hotline: 988 */}
          <div className="flex justify-between items-center bg-[#D9534F]/5 p-2.5 rounded-2xl border border-[#D9534F]/10">
            <div className="max-w-[70%]">
              <h4 className="text-xs font-bold text-[#D9534F]">988 Suicide & Crisis</h4>
              <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Call/SMS free confidential mental counseling 24/7.</p>
            </div>
            <div className="flex space-x-1 shrink-0">
              <button
                onClick={() => handleTriggerDial('988', 'phone')}
                className="bg-[#D9534F] hover:bg-[#C1403E] text-white font-bold text-xs px-3 py-2 rounded-xl transition shadow-sm active:scale-95 flex items-center space-x-1"
                title="Call 988"
              >
                <Phone size={11} />
                <span>Call</span>
              </button>
              <button
                onClick={() => handleTriggerDial('988', 'sms')}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-3 py-2 rounded-xl transition shadow-sm active:scale-95 flex items-center space-x-1"
                title="Text 988"
              >
                <span>SMS</span>
              </button>
            </div>
          </div>

          {/* Text Line */}
          <div className="flex justify-between items-center bg-[#E1E8E3]/40 p-2.5 rounded-2xl border border-[#E1E8E3]/60">
            <div className="max-w-[70%]">
              <h4 className="text-xs font-bold text-slate-800">Crisis Text Line (741741)</h4>
              <p className="text-[10px] text-slate-500 leading-tight mt-0.5">SMS text HOME to 741741 to connect directly.</p>
            </div>
            <button
              onClick={() => handleTriggerDial('741741', 'sms')}
              className="bg-[#608271] hover:bg-[#4A6741] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-sm active:scale-95"
            >
              SMS
            </button>
          </div>

          {/* The Trevor Project */}
          <div className="flex justify-between items-center bg-indigo-50/30 p-2.5 rounded-2xl border border-indigo-100/40">
            <div className="max-w-[65%]">
              <h4 className="text-xs font-bold text-indigo-700">The Trevor Project</h4>
              <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Crisis services & support for LGBTQ+ young people.</p>
            </div>
            <div className="flex space-x-1 shrink-0">
              <button
                onClick={() => handleTriggerDial('18664887386', 'phone')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] px-2.5 py-1.5 rounded-xl transition shadow-xs active:scale-95 flex items-center space-x-0.5"
                title="Call The Trevor Project"
              >
                <Phone size={10} />
                <span>Call</span>
              </button>
              <button
                onClick={() => handleTriggerDial('678678', 'sms')}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-[10px] px-2.5 py-1.5 rounded-xl transition shadow-xs active:scale-95"
                title="Text START to 678-678"
              >
                SMS
              </button>
            </div>
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
                  onClick={() => handleTriggerDial(savedContact.phone, 'phone')}
                  className="bg-[#4A6741] hover:bg-[#3E5536] text-white font-bold text-xs p-2 rounded-xl transition shadow flex items-center justify-center shrink-0"
                  title="Call Contact"
                >
                  <Phone size={13} />
                </button>
                <button
                  onClick={() => handleTriggerDial(savedContact.phone, 'sms')}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs p-2 rounded-xl transition shadow flex items-center justify-center shrink-0"
                  title="Text Contact"
                >
                  <MessageSquare size={13} />
                </button>
                <button
                  onClick={handleDeleteContact}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-500 p-2 rounded-xl transition flex items-center justify-center shrink-0"
                  title="Delete Contact"
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



      {/* Disclaimer bottom advice block */}
      <span className="text-[8px] text-slate-500 leading-tight bg-[#E1E8E3]/60 p-2 rounded-xl border border-[#A8C69F]/30 shrink-0 select-none">
        ⚠️ First Aid apps are support tools and do not substitute for expert psychiatric or professional care. If physically unsafe, please contact local emergency services immediately.
      </span>
    </div>
  );
};

// ============================================================================
// 6. HISTORICAL LOGS SCREEN
// ============================================================================
interface HistoryProps {
  moodHistory: MoodLogEntry[];
  onNavigate: (route: ActiveScreen) => void;
  resetMoodData: () => void;
  seedRandomData: () => void;
  stressLevel?: number;
  setStressLevel?: (level: number) => void;
  loggedMood?: string | null;
  setLoggedMood?: (mood: string | null) => void;
  stressNotes?: string;
  setStressNotes?: (notes: string) => void;
  customScales?: CustomScaleConfig[];
  setCustomScales?: React.Dispatch<React.SetStateAction<CustomScaleConfig[]>>;
  todayCustomScaleValues?: Record<string, number>;
  setTodayCustomScaleValues?: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const KEY_GROUPS = {
  logs: [
    'safespace_monthly_data',
    'safespace_mood_history',
    'safespace_stress_level',
    'safespace_logged_mood',
    'safespace_current_week_sunday',
    'safespace_kb_emoji_val',
    'safespace_kb_emoji_date',
    'safespace_custom_scale_configs',
    'safespace_today_custom_scale_values'
  ],
  saved: [
    'safespace_journal_logs',
    'safespace_gratitude_jar',
    'safespace_daily_habits',
    'safespace_reframing_log',
    'safespace_safety_plan',
    'safespace_worries',
    'aid_coping_statements',
    'safespace_custom_emoji_set_list',
    'safespace_favorite_tool_ids_list'
  ],
  settings: [
    'safespace_active_emoji_set_id',
    'mindfulVoiceName',
    'mindfulVoiceRate',
    'mindualVoiceRate',
    'mindfulVoicePitch',
    'mindfulVoiceVolume',
    'aid_emergency_contact'
  ]
};

export const SimulatorHistory: React.FC<HistoryProps> = ({
  moodHistory,
  onNavigate,
  resetMoodData,
  seedRandomData,
  stressLevel = 5,
  setStressLevel,
  loggedMood = null,
  setLoggedMood,
  stressNotes = '',
  setStressNotes,
  customScales = [],
  setCustomScales,
  todayCustomScaleValues = {},
  setTodayCustomScaleValues,
}) => {
  const [historyTab, setHistoryTab] = useState<'monthly' | 'weekly'>('monthly');

  const MONTHS_CONFIG = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(2026, i, 1);
    const days = new Date(2026, i + 1, 0).getDate();
    return {
      key: String(i + 1).padStart(2, '0'),
      label: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      days,
      offset: d.getDay(),
      name: d.toLocaleDateString('en-US', { month: 'long' })
    };
  });

  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(() => {
    return new Date().getMonth(); // Dynamic month index (0-11) based on current local time
  });

  const [showExport, setShowExport] = useState(false);
  const [exportRange, setExportRange] = useState<'week' | 'month'>('week');
  const [exportFormat, setExportFormat] = useState<'csv' | 'text'>('text');
  const [copied, setCopied] = useState(false);

  // Backup / Import states
  const [exportTab, setExportTab] = useState<'diary' | 'clinician' | 'backup'>('diary');
  const [backupExportLogs, setBackupExportLogs] = useState(true);
  const [backupExportSaved, setBackupExportSaved] = useState(true);
  const [backupExportSettings, setBackupExportSettings] = useState(true);

  const [backupImportFile, setBackupImportFile] = useState<any | null>(null);
  const [backupImportError, setBackupImportError] = useState<string | null>(null);
  const [backupImportLogs, setBackupImportLogs] = useState(true);
  const [backupImportSaved, setBackupImportSaved] = useState(true);
  const [backupImportSettings, setBackupImportSettings] = useState(true);
  const [importSuccess, setImportSuccess] = useState(false);

  // Clinician export states
  const [clinicianLinkDays, setClinicianLinkDays] = useState<7 | 30>(7);
  const [clinicianLinkUrl, setClinicianLinkUrl] = useState<string>('');
  const [clinicianCopied, setClinicianCopied] = useState<boolean>(false);

  const [exportSelectedMonthIdx, setExportSelectedMonthIdx] = useState<number>(selectedMonthIdx);
  const [exportSubMode, setExportSubMode] = useState<'single' | 'range'>('single');
  const [exportStartMonthIdx, setExportStartMonthIdx] = useState<number>(() => {
    return Math.max(0, new Date().getMonth() - 1);
  });
  const [exportStartDay, setExportStartDay] = useState<number>(1);
  const [exportEndMonthIdx, setExportEndMonthIdx] = useState<number>(() => {
    return new Date().getMonth();
  });
  const [exportEndDay, setExportEndDay] = useState<number>(() => {
    return new Date().getDate();
  });

  const updateStartMonth = (idx: number) => {
    setExportStartMonthIdx(idx);
    const maxDays = MONTHS_CONFIG[idx].days;
    if (exportStartDay > maxDays) {
      setExportStartDay(maxDays);
    }
  };

  const updateEndMonth = (idx: number) => {
    setExportEndMonthIdx(idx);
    const maxDays = MONTHS_CONFIG[idx].days;
    if (exportEndDay > maxDays) {
      setExportEndDay(maxDays);
    }
  };

  // Helper calculation to get corresponding date for weekday index
  const getDayDateString = (dayIndex: number) => {
    const d = new Date();
    const day = d.getDay(); // index 0-6
    const diff = d.getDate() - day + dayIndex;
    const targetDate = new Date(d.setDate(diff));
    const y = targetDate.getFullYear();
    const m = String(targetDate.getMonth() + 1).padStart(2, '0');
    const r = String(targetDate.getDate()).padStart(2, '0');
    return `${y}-${m}-${r}`;
  };

  const currentMonth = MONTHS_CONFIG[selectedMonthIdx];

  // Seed 30/31 days with a clean calendar dataset
  const getSeededMonthlyData = () => {
    const data: Record<string, { moodValue: number; moodLabel: string; stress: number; hasData: boolean }> = {};
    
    const seedForMonth = (monthStr: string, totalDays: number) => {
      for (let day = 1; day <= totalDays; day++) {
        const dateKey = `2026-${monthStr}-${day.toString().padStart(2, '0')}`;
        data[dateKey] = {
          moodValue: 0,
          moodLabel: 'No Data',
          stress: 5,
          hasData: false
        };
      }
    };

    MONTHS_CONFIG.forEach(m => {
      seedForMonth(m.key, m.days);
    });

    return data;
  };

  const [monthlyData, setMonthlyData] = useState<Record<string, { moodValue: number; moodLabel: string; stress: number; hasData: boolean }>>(() => {
    const saved = localStorage.getItem('safespace_monthly_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    const initial = getSeededMonthlyData();
    localStorage.setItem('safespace_monthly_data', JSON.stringify(initial));
    return initial;
  });

  // Persist edits back to localStorage
  useEffect(() => {
    localStorage.setItem('safespace_monthly_data', JSON.stringify(monthlyData));
  }, [monthlyData]);

  // Selected Day state in the calendar grid (default to current day)
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    return new Date().getDate();
  });

  // Sync date selection safely when cycling months
  const handlePrevMonth = () => {
    if (selectedMonthIdx > 0) {
      setSelectedMonthIdx(prev => prev - 1);
      setSelectedDay(1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonthIdx < MONTHS_CONFIG.length - 1) {
      setSelectedMonthIdx(prev => prev + 1);
      setSelectedDay(1);
    }
  };

  // Merge check-in data. Sync today's date from live props
  const getDayDetails = (monthKey: string, dayNum: number) => {
    const dateKey = `2026-${monthKey}-${dayNum.toString().padStart(2, '0')}`;
    
    const todayObj = new Date();
    const curMonthKey = String(todayObj.getMonth() + 1).padStart(2, '0');
    const curDayNum = todayObj.getDate();
    
    if (monthKey === curMonthKey && dayNum === curDayNum) {
      const todayIndex = todayObj.getDay();
      const todayAbbr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][todayIndex];
      // Sync to today's active live log (or fallback)
      const todayLog = moodHistory.find(h => h.day === 'Today' || h.day === todayAbbr);
      if (todayLog) {
        return {
          hasData: todayLog.hasData,
          moodValue: todayLog.moodValue,
          moodLabel: todayLog.moodLabel,
          stress: todayLog.stress,
          notes: todayLog.notes,
          customScales: todayLog.customScales,
        };
      }
    }

    const savedDay = monthlyData[dateKey];
    return (savedDay as any) || { hasData: false, moodValue: 0, moodLabel: 'No Data', stress: 5 };
  };

  // Mutator to update specific day entries
  const handleUpdateDay = (dayNum: number, fields: Partial<{ moodValue: number; moodLabel: string; stress: number; hasData: boolean; notes?: string; customScales?: Record<string, number> }>) => {
    const dateKey = `2026-${currentMonth.key}-${dayNum.toString().padStart(2, '0')}`;
    const current = getDayDetails(currentMonth.key, dayNum);
    const updated = {
      ...current,
      ...fields,
    };
    
    if (updated.hasData === false) {
      updated.moodLabel = 'No Data';
      updated.moodValue = 0;
    } else {
      updated.moodValue = 1;
    }

    setMonthlyData(prev => {
      const next = { ...prev, [dateKey]: { ...updated, hasData: updated.hasData ?? true } };
      return next;
    });
  };

  const checkInDays = moodHistory.filter(day => day.hasData && day.moodValue > 0);
  const averageStress = checkInDays.length > 0 
    ? (checkInDays.reduce((acc, curr) => acc + curr.stress, 0) / checkInDays.length).toFixed(1)
    : '--';

  const currentMonthCheckInDays = [];
  for (let d = 1; d <= currentMonth.days; d++) {
    const dayData = getDayDetails(currentMonth.key, d);
    if (dayData.hasData && dayData.moodValue > 0) {
      currentMonthCheckInDays.push(dayData);
    }
  }

  const monthlyAverageStress = currentMonthCheckInDays.length > 0 
    ? (currentMonthCheckInDays.reduce((acc, curr) => acc + curr.stress, 0) / currentMonthCheckInDays.length).toFixed(1)
    : '--';

  const selectableEmojis = (() => {
    const base = ['🍃', '🌊', '⛈️', '😰'];
    try {
      const saved = localStorage.getItem('safespace_custom_emoji_set_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge up to 4 custom ones with base
          return Array.from(new Set([...parsed.slice(0, 4), ...base]));
        }
      }
    } catch (e) {
      // ignore
    }
    return base;
  })();

  // Prep calendar matrix cell elements
  const daysInMonth = currentMonth.days;
  const startOffset = currentMonth.offset;
  const gridCells = [];

  // Padding offset cells
  for (let i = 0; i < startOffset; i++) {
    gridCells.push(<div key={`pad-${i}`} className="aspect-square opacity-20 pointer-events-none" />);
  }

  // Active month squares
  for (let d = 1; d <= daysInMonth; d++) {
    const dayData = getDayDetails(currentMonth.key, d);
    const hasData = dayData.hasData && dayData.moodValue > 0;
    const isSelected = selectedDay === d;
    const hasNotes = !!(dayData.notes && dayData.notes.trim());

    // Grid cells coloring coded with premium high contrast colors
    let bgClass = 'bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-500';
    if (hasData) {
      if (dayData.stress <= 3) {
        bgClass = 'bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800';
      } else if (dayData.stress <= 6) {
        bgClass = 'bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800';
      } else {
        bgClass = 'bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800';
      }
    }

    gridCells.push(
      <button
        key={`day-${d}`}
        onClick={() => setSelectedDay(d)}
        className={`aspect-square rounded-xl flex flex-col justify-between p-1.5 cursor-pointer transition-all select-none relative focus:outline-none ${bgClass} ${
          isSelected ? 'ring-2 ring-[#4A6741] ring-offset-1 scale-[1.05] z-10 shadow-sm' : ''
        }`}
      >
        <div className="flex justify-between items-center w-full">
          <span className="text-[9px] font-black leading-none">{d}</span>
          {hasNotes && (
            <FileText 
              size={8.5} 
              className={hasData ? 'text-current opacity-70' : 'text-slate-400'} 
              title="Has logs/notes" 
            />
          )}
        </div>
        <div className="flex justify-center items-center flex-1">
          {hasData ? (
            <span className="text-[10px] leading-none mb-0.5">{extractEmoji(dayData.moodLabel, dayData.moodValue)}</span>
          ) : (
            <div className="w-2.5 h-2.5 rounded-full border border-slate-300 flex items-center justify-center mb-0.5" title="No check-in">
              <div className="w-1 h-1 rounded-full bg-slate-200" />
            </div>
          )}
        </div>
      </button>
    );
  }

  const selectedDayData = getDayDetails(currentMonth.key, selectedDay);
  const selectedDayHasData = selectedDayData.hasData && selectedDayData.moodValue > 0;

  const getEmojiName = (emoji: string): string => {
    if (!emoji || emoji === 'No Data' || emoji === '—') return '—';
    const trimmed = emoji.trim();
    const mapping: Record<string, string> = {
      // Nature 🍃
      '🍃': 'Fluttering Leaf',
      '🌊': 'Water Wave',
      '⛈️': 'Thunderstorm',
      '🌿': 'Herb',

      // Faces 😊
      '😌': 'Relieved Face',
      '🙂': 'Slightly Smiling Face',
      '😟': 'Worried Face',
      '😰': 'Anxious Face',

      // Weather ☀️
      '☀️': 'Sunny',
      '⛅': 'Partly Cloudy',
      '🌧️': 'Rainy',
      '⚡': 'Lightning',

      // Vibes ✨
      '✨': 'Sparkles',
      '☕': 'Hot Beverage',
      '💭': 'Thinking',
      '🔥': 'Fire',

      // Animals 🐾
      '🐾': 'Paw Prints',
      '🕊️': 'Peaceful Dove',
      '🐈': 'Cat',
      '🐕': 'Dog',

      // Fallbacks / Base seed values
      '🧘': 'Meditating',
      '🪴': 'Potted Plant',
      '🍵': 'Teacup',
      '😊': 'Smiling',
      '😐': 'Neutral',
      '🚨': 'Overwhelmed'
    };
    return mapping[trimmed] || trimmed;
  };

  const getPastNDaysData = (n: number) => {
    const result = [];
    const today = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const targetDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
      const dd = String(targetDate.getDate()).padStart(2, '0');
      
      const details = getDayDetails(mm, targetDate.getDate());
      if (details.hasData) {
        result.push({
          d: `${mm}-${dd}`,
          v: details.moodValue,
          l: details.moodLabel,
          s: details.stress,
          n: details.notes,
          hasData: true
        });
      } else {
        result.push({
          d: `${mm}-${dd}`,
          v: 0,
          l: '',
          s: 5,
          hasData: false
        });
      }
    }
    return result;
  };

  const handleGenerateClinicianLink = (days: number) => {
    try {
      const data = getPastNDaysData(days);
      const payload = {
        period: days,
        generatedAt: new Date().toISOString().slice(0, 10),
        logs: data
      };
      const jsonStr = JSON.stringify(payload);
      const utf8Bytes = new TextEncoder().encode(jsonStr);
      const base64 = btoa(String.fromCharCode(...utf8Bytes));
      const shareUrl = `${window.location.origin}${window.location.pathname}?view=clinician&data=${encodeURIComponent(base64)}`;
      setClinicianLinkUrl(shareUrl);
      setClinicianCopied(false);
    } catch (e) {
      console.error("Failed to generate clinician link:", e);
    }
  };

  const generateExportData = () => {
    if (exportRange === 'week') {
      if (exportFormat === 'csv') {
        const scaleHeaders = customScales.map(s => `"${s.name} (1-10)"`).join(',');
        const headers = `Date,Day,Feel/Mood,Stress Level (1-10),Status${scaleHeaders ? ',' + scaleHeaders : ''}`;
        const rows = moodHistory.map((item, idx) => {
          const dateStr = getDayDateString(idx);
          const feel = item.hasData ? getEmojiName(item.moodLabel) : '—';
          const stressStatus = item.hasData ? item.stress : '—';
          const status = item.hasData ? 'Logged' : 'No Check-In';
          const scaleValues = customScales.map(s => {
            if (!item.hasData) return '—';
            const saved = item.customScales || {};
            return saved[s.id] !== undefined ? saved[s.id] : '—';
          }).join(',');
          return `"${dateStr}","${item.day}","${feel}",${stressStatus},"${status}"${scaleValues ? ',' + scaleValues : ''}`;
        });
        return [headers, ...rows].join('\n');
      } else {
        const dateStrNow = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const loggedCount = moodHistory.filter(h => h.hasData).length;
        const avgSt = moodHistory.filter(h => h.hasData).length > 0
          ? (moodHistory.filter(h => h.hasData).reduce((sum, h) => sum + h.stress, 0) / loggedCount).toFixed(1)
          : '5.0';
        
        let txt = `==================================================\n`;
        txt += `        🛡️ SAFESPACE: NERVOUS SYSTEM RECOVERY REPORT\n`;
        txt += `==================================================\n`;
        txt += `Report Type: Weekly Mood & Stress Summary\n`;
        txt += `Generated On: ${dateStrNow} UTC\n`;
        txt += `--------------------------------------------------\n`;
        txt += `[SUMMARY STATISTICS]\n`;
        txt += `- Tracked days this week: ${loggedCount} of 7 days\n`;
        txt += `- Average Stress score: ${avgSt}/10\n`;
        txt += `--------------------------------------------------\n\n`;
        txt += `[DAILY DETAIL ENTRIES]\n`;
        
        moodHistory.forEach((item, idx) => {
          const dateStr = getDayDateString(idx);
          if (item.hasData) {
            txt += `• ${item.day} (${dateStr}):\n`;
            txt += `  - Mood state: ${getEmojiName(item.moodLabel)} (${item.moodLabel})\n`;
            txt += `  - Stress level: ${item.stress}/10\n`;
            if (customScales.length > 0) {
              customScales.forEach(s => {
                const saved = item.customScales || {};
                const scaleValue = saved[s.id] !== undefined ? `${saved[s.id]}/10` : '—';
                txt += `  - ${s.name}: ${scaleValue}\n`;
              });
            }
          } else {
            txt += `• ${item.day} (${dateStr}): — No entry recorded\n`;
          }
          txt += `\n`;
        });
        txt += `==================================================\n`;
        txt += `          offline. secure. kind support.\n`;
        txt += `==================================================\n`;
        return txt;
      }
    } else {
      if (exportSubMode === 'single') {
        const activeExportMonth = MONTHS_CONFIG[exportSelectedMonthIdx];
        const monthLabel = activeExportMonth.label;
        const monthKey = activeExportMonth.key;
        const daysCount = activeExportMonth.days;

        // Calculate stats for this specific export month
        const checkInEntries = [];
        for (let d = 1; d <= daysCount; d++) {
          const dayData = getDayDetails(monthKey, d);
          if (dayData.hasData && dayData.moodValue > 0) {
            checkInEntries.push(dayData);
          }
        }
        const monthlyAvgStress = checkInEntries.length > 0 
          ? (checkInEntries.reduce((acc, curr) => acc + curr.stress, 0) / checkInEntries.length).toFixed(1)
          : '5.0';

        if (exportFormat === 'csv') {
          const scaleHeaders = customScales.map(s => `"${s.name} (1-10)"`).join(',');
          const headers = `Date,Feel/Mood,Stress Level (1-10),Status${scaleHeaders ? ',' + scaleHeaders : ''}`;
          const rows = [];
          for (let d = 1; d <= daysCount; d++) {
            const dateStr = `2026-${monthKey}-${d.toString().padStart(2, '0')}`;
            const dayData = getDayDetails(monthKey, d);
            const feel = dayData.hasData ? getEmojiName(dayData.moodLabel) : '—';
            const stressStatus = dayData.hasData ? dayData.stress : '—';
            const status = dayData.hasData ? 'Logged' : 'No Check-In';
            const scaleValues = customScales.map(s => {
              if (!dayData.hasData) return '—';
              const saved = (dayData as any).customScales || {};
              return saved[s.id] !== undefined ? saved[s.id] : '—';
            }).join(',');
            rows.push(`"${dateStr}","${feel}",${stressStatus},"${status}"${scaleValues ? ',' + scaleValues : ''}`);
          }
          return [headers, ...rows].join('\n');
        } else {
          const dateStrNow = new Date().toISOString().replace('T', ' ').substring(0, 19);
          const loggedCount = checkInEntries.length;
          const avgSt = monthlyAvgStress;

          let txt = `==================================================\n`;
          txt += `        🛡️ SAFESPACE: NERVOUS SYSTEM RECOVERY REPORT\n`;
          txt += `==================================================\n`;
          txt += `Report Type: Monthly Mood & Stress Summary\n`;
          txt += `Target Period: ${monthLabel}\n`;
          txt += `Generated On: ${dateStrNow} UTC\n`;
          txt += `--------------------------------------------------\n`;
          txt += `[SUMMARY STATISTICS]\n`;
          txt += `- Tracked days: ${loggedCount} of ${daysCount} total days\n`;
          txt += `- Average Stress score: ${avgSt}/10\n`;
          txt += `--------------------------------------------------\n\n`;
          txt += `[DAILY DETAIL ENTRIES]\n`;

          for (let d = 1; d <= daysCount; d++) {
            const dateStr = `2026-${monthKey}-${d.toString().padStart(2, '0')}`;
            const dayData = getDayDetails(monthKey, d);
            if (dayData.hasData) {
              txt += `• ${dateStr}:\n`;
              txt += `  - Mood state: ${getEmojiName(dayData.moodLabel)} (${dayData.moodLabel})\n`;
              txt += `  - Stress level: ${dayData.stress}/10\n`;
              if (customScales.length > 0) {
                customScales.forEach(s => {
                  const saved = (dayData as any).customScales || {};
                  const scaleValue = saved[s.id] !== undefined ? `${saved[s.id]}/10` : '—';
                  txt += `  - ${s.name}: ${scaleValue}\n`;
                });
              }
            } else {
              txt += `• ${dateStr}: — No entry recorded\n`;
            }
            txt += `\n`;
          }
          txt += `==================================================\n`;
          txt += `          offline. secure. kind support.\n`;
          txt += `==================================================\n`;
          return txt;
        }
      } else {
        // Date range
        const allDays: { monthKey: string; monthName: string; day: number; dateStr: string }[] = [];
        MONTHS_CONFIG.forEach(m => {
          for (let d = 1; d <= m.days; d++) {
            allDays.push({
              monthKey: m.key,
              monthName: m.name,
              day: d,
              dateStr: `2026-${m.key}-${d.toString().padStart(2, '0')}`
            });
          }
        });

        const startDateKey = `2026-${MONTHS_CONFIG[exportStartMonthIdx].key}-${exportStartDay.toString().padStart(2, '0')}`;
        const endDateKey = `2026-${MONTHS_CONFIG[exportEndMonthIdx].key}-${exportEndDay.toString().padStart(2, '0')}`;

        const startIndex = allDays.findIndex(x => x.dateStr === startDateKey);
        const endIndex = allDays.findIndex(x => x.dateStr === endDateKey);

        let startIdx = startIndex !== -1 ? startIndex : 0;
        let endIdx = endIndex !== -1 ? endIndex : allDays.length - 1;
        if (startIdx > endIdx) {
          const tmp = startIdx;
          startIdx = endIdx;
          endIdx = tmp;
        }
        const slicedDays = allDays.slice(startIdx, endIdx + 1);

        const startLabel = `${MONTHS_CONFIG[exportStartMonthIdx].name} ${exportStartDay}`;
        const endLabel = `${MONTHS_CONFIG[exportEndMonthIdx].name} ${exportEndDay}`;
        const periodLabel = `${startLabel} – ${endLabel}, 2026`;

        if (exportFormat === 'csv') {
          const scaleHeaders = customScales.map(s => `"${s.name} (1-10)"`).join(',');
          const headers = `Date,Feel/Mood,Stress Level (1-10),Status${scaleHeaders ? ',' + scaleHeaders : ''}`;
          const rows = slicedDays.map(day => {
            const dayData = getDayDetails(day.monthKey, day.day);
            const feel = dayData.hasData ? getEmojiName(dayData.moodLabel) : '—';
            const stressStatus = dayData.hasData ? dayData.stress : '—';
            const status = dayData.hasData ? 'Logged' : 'No Check-In';
            const scaleValues = customScales.map(s => {
              if (!dayData.hasData) return '—';
              const saved = (dayData as any).customScales || {};
              return saved[s.id] !== undefined ? saved[s.id] : '—';
            }).join(',');
            return `"${day.dateStr}","${feel}",${stressStatus},"${status}"${scaleValues ? ',' + scaleValues : ''}`;
          });
          return [headers, ...rows].join('\n');
        } else {
          const dateStrNow = new Date().toISOString().replace('T', ' ').substring(0, 19);
          const rangeDetails = slicedDays.map(d => {
            const dayData = getDayDetails(d.monthKey, d.day);
            return { ...d, dayData };
          });

          const loggedEntries = rangeDetails.filter(r => r.dayData.hasData && r.dayData.moodValue > 0);
          const loggedCount = loggedEntries.length;
          const avgSt = loggedCount > 0
            ? (loggedEntries.reduce((acc, curr) => acc + curr.dayData.stress, 0) / loggedCount).toFixed(1)
            : '5.0';

          let txt = `==================================================\n`;
          txt += `        🛡️ SAFESPACE: NERVOUS SYSTEM RECOVERY REPORT\n`;
          txt += `==================================================\n`;
          txt += `Report Type: Custom Date Range Summary\n`;
          txt += `Target Period: ${periodLabel}\n`;
          txt += `Generated On: ${dateStrNow} UTC\n`;
          txt += `--------------------------------------------------\n`;
          txt += `[SUMMARY STATISTICS]\n`;
          txt += `- Tracked days: ${loggedCount} of ${slicedDays.length} total days\n`;
          txt += `- Average Stress score: ${avgSt}/10\n`;
          txt += `--------------------------------------------------\n\n`;
          txt += `[DAILY DETAIL ENTRIES]\n`;

          rangeDetails.forEach(d => {
            if (d.dayData.hasData) {
              txt += `• ${d.dateStr}:\n`;
              txt += `  - Mood state: ${getEmojiName(d.dayData.moodLabel)} (${d.dayData.moodLabel})\n`;
              txt += `  - Stress level: ${d.dayData.stress}/10\n`;
              if (customScales.length > 0) {
                customScales.forEach(s => {
                  const saved = (d.dayData as any).customScales || {};
                  const scaleValue = saved[s.id] !== undefined ? `${saved[s.id]}/10` : '—';
                  txt += `  - ${s.name}: ${scaleValue}\n`;
                });
              }
            } else {
              txt += `• ${d.dateStr}: — No entry recorded\n`;
            }
            txt += `\n`;
          });
          txt += `==================================================\n`;
          txt += `          offline. secure. kind support.\n`;
          txt += `==================================================\n`;
          return txt;
        }
      }
    }
  };

  if (showExport) {
    const rawExportContent = generateExportData();
    const activeMonthName = MONTHS_CONFIG[exportSelectedMonthIdx] ? MONTHS_CONFIG[exportSelectedMonthIdx].name.toLowerCase() : 'month';
    const downloadFileName = `safespace_export_${
      exportRange === 'week' 
        ? 'week' 
        : (exportSubMode === 'single' ? activeMonthName : 'range')
    }_${new Date().toISOString().slice(0, 10)}.${exportFormat === 'csv' ? 'csv' : 'txt'}`;

    const handleCopy = () => {
      navigator.clipboard.writeText(rawExportContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
      const element = document.createElement("a");
      const file = new Blob([rawExportContent], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = downloadFileName;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    };

    const handleExportBackup = () => {
      const backupObj: Record<string, any> = {
        safespace_backup: true,
        version: "1.0",
        timestamp: new Date().toISOString(),
        categories: [] as string[]
      };

      const payload: Record<string, string | null> = {};

      if (backupExportLogs) {
        backupObj.categories.push('logs');
        KEY_GROUPS.logs.forEach(key => {
          payload[key] = localStorage.getItem(key);
        });
      }

      if (backupExportSaved) {
        backupObj.categories.push('saved');
        KEY_GROUPS.saved.forEach(key => {
          payload[key] = localStorage.getItem(key);
        });
      }

      if (backupExportSettings) {
        backupObj.categories.push('settings');
        KEY_GROUPS.settings.forEach(key => {
          payload[key] = localStorage.getItem(key);
        });
      }

      backupObj.payload = payload;

      const fileContent = JSON.stringify(backupObj, null, 2);
      const element = document.createElement("a");
      const file = new Blob([fileContent], { type: 'application/json;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = `safespace_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    };

    const handleFileSelected = (file: File) => {
      setBackupImportError(null);
      setBackupImportFile(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const parsed = JSON.parse(text);
          if (!parsed || parsed.safespace_backup !== true) {
            setBackupImportError("Invalid backup configuration. Please select a valid SafeSpace backup JSON file.");
            return;
          }
          setBackupImportFile(parsed);
          setBackupImportLogs(parsed.categories?.includes('logs') ?? false);
          setBackupImportSaved(parsed.categories?.includes('saved') ?? false);
          setBackupImportSettings(parsed.categories?.includes('settings') ?? false);
        } catch (err) {
          setBackupImportError("Failed to parse file. Please verify it is a valid backup.json file.");
        }
      };
      reader.readAsText(file);
    };

    const handlePerformRestore = () => {
      if (!backupImportFile || !backupImportFile.payload) return;

      const payload = backupImportFile.payload;

      if (backupImportLogs && backupImportFile.categories?.includes('logs')) {
        KEY_GROUPS.logs.forEach(key => {
          if (payload[key] !== undefined && payload[key] !== null) {
            localStorage.setItem(key, payload[key]);
          }
        });
      }

      if (backupImportSaved && backupImportFile.categories?.includes('saved')) {
        KEY_GROUPS.saved.forEach(key => {
          if (payload[key] !== undefined && payload[key] !== null) {
            localStorage.setItem(key, payload[key]);
          }
        });
      }

      if (backupImportSettings && backupImportFile.categories?.includes('settings')) {
        KEY_GROUPS.settings.forEach(key => {
          if (payload[key] !== undefined && payload[key] !== null) {
            localStorage.setItem(key, payload[key]);
          }
        });
      }

      setImportSuccess(true);
    };

    if (importSuccess) {
      return (
        <div className="flex flex-col h-full bg-[#F1F5F2] p-6 justify-center items-center text-center space-y-5">
          <div className="w-16 h-16 bg-[#E1E8E3] rounded-full flex items-center justify-center text-[#4A6741]">
            <CheckCircle2 size={36} />
          </div>
          <div className="space-y-2 select-none text-left">
            <h2 className="text-base font-black text-slate-800 text-center font-sans">Local Restore Successful</h2>
            <p className="text-[10px] text-slate-500 leading-relaxed max-w-[240px] text-center">
              Your requested backup partitions have been restored successfully to your browser's offline storage.
            </p>
          </div>

          <button
            id="btn-apply-reload"
            type="button"
            onClick={() => {
              window.location.reload();
            }}
            className="w-full max-w-[240px] py-3 rounded-xl bg-[#4A6741] hover:bg-[#3D5535] text-white font-extrabold text-[11px] uppercase tracking-wider cursor-pointer shadow-xs active:scale-95 transition font-sans"
          >
            Apply & Reload App
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full bg-[#F1F5F2] p-5 justify-between overflow-hidden">
        {/* Header Navigation - Keep Fixed at top */}
        <div className="flex items-center space-x-2.5 mt-3 mb-3 shrink-0 select-none">
          <button
            onClick={() => setShowExport(false)}
            className="p-1 px-1.5 rounded-xl hover:bg-[#E1E8E3] active:scale-90 text-[#4A6741] transition cursor-pointer border-0 mr-1 flex items-center justify-center font-bold"
          >
            <ArrowLeft size={16} className="stroke-[2.5]" />
          </button>
          <div className="text-left select-none flex-1">
            <span className="text-[9px] font-extrabold text-[#4A6741] uppercase tracking-widest bg-[#E1E8E3] px-2 py-0.5 rounded">EXPORT & DATA</span>
            <h2 className="text-sm font-bold text-slate-800 mt-1 leading-none">Data Portability Center</h2>
          </div>
        </div>

        {/* Tab switchers at top */}
        <div className="flex bg-slate-200/50 p-1 rounded-xl select-none mb-3 shrink-0 font-sans">
          <button
            id="tab-btn-diary"
            type="button"
            onClick={() => setExportTab('diary')}
            className={`flex-1 py-1 text-[8.5px] font-black uppercase tracking-wider rounded-lg cursor-pointer transition ${
              exportTab === 'diary' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-850'
            }`}
          >
            📝 Diary
          </button>
          <button
            id="tab-btn-clinician"
            type="button"
            onClick={() => setExportTab('clinician')}
            className={`flex-1 py-1 text-[8.5px] font-black uppercase tracking-wider rounded-lg cursor-pointer transition ${
              exportTab === 'clinician' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-850'
            }`}
          >
            🩺 Clinic
          </button>
          <button
            id="tab-btn-backup"
            type="button"
            onClick={() => setExportTab('backup')}
            className={`flex-1 py-1 text-[8.5px] font-black uppercase tracking-wider rounded-lg cursor-pointer transition ${
              exportTab === 'backup' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-850'
            }`}
          >
            🛡️ Backup
          </button>
        </div>

        {/* Scrollable Container for Config & Preview */}
        <div className="flex-1 overflow-y-auto no-scrollbar pr-0.5 pb-2 min-h-0 space-y-3.5">
          {exportTab === 'diary' && (
            <>
              <p className="text-[10px] text-slate-500 leading-snug">
                Configure secure, offline records of your nervous system tracking inputs. No external servers or cloud services are contacted.
              </p>

          {/* Configuration Area */}
          <div className="bg-white/80 border border-white p-3.5 rounded-2xl space-y-3.5 shadow-xs">
            {/* Range Toggle */}
            <div>
              <span className="text-[8.5px] font-black text-[#4A6741] uppercase tracking-wider block mb-1.5">1. Select Range</span>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setExportRange('week')}
                  className={`py-2 rounded-xl transition cursor-pointer border text-center ${
                    exportRange === 'week' ? 'bg-[#4A6741] text-white border-transparent' : 'bg-white text-slate-600 hover:text-slate-850 border-slate-200'
                  }`}
                >
                  📊 7-Day Trend
                </button>
                <button
                  type="button"
                  onClick={() => setExportRange('month')}
                  className={`py-2 rounded-xl transition cursor-pointer border text-center ${
                    exportRange === 'month' ? 'bg-[#4A6741] text-white border-transparent' : 'bg-white text-slate-600 hover:text-slate-850 border-slate-200'
                  }`}
                >
                  🗓️ {exportSubMode === 'single' ? `Month (${MONTHS_CONFIG[exportSelectedMonthIdx].name})` : 'Custom Range'}
                </button>
              </div>
            </div>

            {/* Monthly Submenu Options */}
            {exportRange === 'month' && (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 space-y-2.5 select-none">
                {/* Switch sub-mode */}
                <div className="flex border-b border-slate-200/60 pb-2 text-[9px] font-black uppercase tracking-wider text-slate-400 justify-between items-center">
                  <span>Month Selection Type</span>
                  <div className="flex space-x-1.5">
                    <button
                      type="button"
                      onClick={() => setExportSubMode('single')}
                      className={`px-2 py-0.5 rounded-md cursor-pointer transition text-[9px] ${
                        exportSubMode === 'single' ? 'bg-[#4A6741] text-white' : 'hover:bg-slate-200 text-slate-500'
                      }`}
                    >
                      Single Month
                    </button>
                    <button
                      type="button"
                      onClick={() => setExportSubMode('range')}
                      className={`px-2 py-0.5 rounded-md cursor-pointer transition text-[9px] ${
                        exportSubMode === 'range' ? 'bg-[#4A6741] text-white' : 'hover:bg-slate-200 text-slate-500'
                      }`}
                    >
                      Date Range
                    </button>
                  </div>
                </div>

                {/* Submenu choice body */}
                {exportSubMode === 'single' ? (
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 block mb-1">Pick a specific Month:</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {MONTHS_CONFIG.map((m, idx) => (
                        <button
                          key={m.key}
                          type="button"
                          onClick={() => setExportSelectedMonthIdx(idx)}
                          className={`py-1.5 rounded-lg text-[9px] font-extrabold cursor-pointer border text-center transition ${
                            exportSelectedMonthIdx === idx
                              ? 'bg-[#4A6741] text-white border-transparent'
                              : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          {m.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {/* From selectors */}
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">From:</span>
                        <div className="flex space-x-1">
                          <select
                            value={exportStartMonthIdx}
                            onChange={(e) => updateStartMonth(Number(e.target.value))}
                            className="flex-1 bg-white border border-slate-200 text-[10px] text-slate-700 font-extrabold rounded-lg p-1 focus:outline-none focus:ring-1 focus:ring-[#4A6741]"
                          >
                            {MONTHS_CONFIG.map((m, idx) => (
                              <option key={m.key} value={idx}>{m.name}</option>
                            ))}
                          </select>
                          <select
                            value={exportStartDay}
                            onChange={(e) => setExportStartDay(Number(e.target.value))}
                            className="w-12 bg-white border border-slate-200 text-[10px] text-slate-700 font-extrabold rounded-lg p-1 focus:outline-none focus:ring-1 focus:ring-[#4A6741]"
                          >
                            {Array.from({ length: MONTHS_CONFIG[exportStartMonthIdx].days }, (_, i) => i + 1).map(dayNum => (
                              <option key={dayNum} value={dayNum}>{dayNum}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* To selectors */}
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">To:</span>
                        <div className="flex space-x-1">
                          <select
                            value={exportEndMonthIdx}
                            onChange={(e) => updateEndMonth(Number(e.target.value))}
                            className="flex-1 bg-white border border-slate-200 text-[10px] text-slate-700 font-extrabold rounded-lg p-1 focus:outline-none focus:ring-1 focus:ring-[#4A6741]"
                          >
                            {MONTHS_CONFIG.map((m, idx) => (
                              <option key={m.key} value={idx}>{m.name}</option>
                            ))}
                          </select>
                          <select
                            value={exportEndDay}
                            onChange={(e) => setExportEndDay(Number(e.target.value))}
                            className="w-12 bg-white border border-slate-200 text-[10px] text-slate-700 font-extrabold rounded-lg p-1 focus:outline-none focus:ring-1 focus:ring-[#4A6741]"
                          >
                            {Array.from({ length: MONTHS_CONFIG[exportEndMonthIdx].days }, (_, i) => i + 1).map(dayNum => (
                              <option key={dayNum} value={dayNum}>{dayNum}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Presets under Date Range */}
                    <div className="pt-1.5 border-t border-slate-200/60">
                      <span className="text-[8px] font-bold text-slate-400 block mb-1">Quick Presets:</span>
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setExportStartMonthIdx(0);
                            setExportStartDay(1);
                            setExportEndMonthIdx(2);
                            setExportEndDay(30);
                          }}
                          className="bg-white hover:bg-slate-100 border border-slate-200 py-0.5 px-2 rounded-full text-[8.5px] font-extrabold text-[#4A6741] cursor-pointer"
                        >
                          All Available
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setExportStartMonthIdx(0);
                            setExportStartDay(1);
                            setExportEndMonthIdx(0);
                            setExportEndDay(30);
                          }}
                          className="bg-white hover:bg-slate-100 border border-slate-200 py-0.5 px-2 rounded-full text-[8.5px] font-extrabold text-[#4A6741] cursor-pointer"
                        >
                          April
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setExportStartMonthIdx(1);
                            setExportStartDay(1);
                            setExportEndMonthIdx(1);
                            setExportEndDay(31);
                          }}
                          className="bg-white hover:bg-slate-100 border border-slate-200 py-0.5 px-2 rounded-full text-[8.5px] font-extrabold text-[#4A6741] cursor-pointer"
                        >
                          May
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setExportStartMonthIdx(2);
                            setExportStartDay(1);
                            setExportEndMonthIdx(2);
                            setExportEndDay(30);
                          }}
                          className="bg-white hover:bg-slate-100 border border-slate-200 py-0.5 px-2 rounded-full text-[8.5px] font-extrabold text-[#4A6741] cursor-pointer"
                        >
                          June
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Choose Format */}
            <div>
              <span className="text-[8.5px] font-black text-[#4A6741] uppercase tracking-wider block mb-1.5">2. Choose Format</span>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setExportFormat('text')}
                  className={`py-2 rounded-xl transition cursor-pointer border text-center ${
                    exportFormat === 'text' ? 'bg-[#4A6741] text-white border-transparent' : 'bg-white text-slate-600 hover:text-slate-800 border-slate-200'
                  }`}
                >
                  📝 Journal Text
                </button>
                <button
                  type="button"
                  onClick={() => setExportFormat('csv')}
                  className={`py-2 rounded-xl transition cursor-pointer border text-center ${
                    exportFormat === 'csv' ? 'bg-[#4A6741] text-white border-transparent' : 'bg-white text-slate-600 hover:text-slate-800 border-slate-200'
                  }`}
                >
                  📄 CSV Spreadsheet
                </button>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex flex-col min-h-[140px] max-h-[175px]">
            <span className="text-[8.5px] font-black text-[#4A6741] uppercase tracking-wider block mb-1 pl-1 font-sans">Live Export Preview</span>
            <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl p-2.5 relative flex-1 overflow-y-auto no-scrollbar font-mono text-[8px] leading-relaxed">
              <pre className="whitespace-pre-wrap select-all">{rawExportContent}</pre>
            </div>
          </div>

          {/* Floating copy confirmation */}
          <div className="h-4 mt-1 flex items-center justify-center shrink-0">
            {copied && (
              <span className="text-[9px] text-[#4A6741] font-bold bg-[#E1E8E3] px-2.5 py-0.5 rounded-full border border-[#4A6741]/20 transition-all duration-300">
                ✓ Copied to clipboard!
              </span>
            )}
          </div>
        </>
      )}

      {exportTab === 'clinician' && (
        <div className="space-y-4 text-left font-sans">
          <p className="text-[10px] text-slate-500 leading-snug">
            Share a secure summary of your trends and notes with your clinician or therapist. Data is safely encoded directly within the URL, so no server registers your history.
          </p>

          <div className="bg-white/85 border border-white p-4 rounded-2xl space-y-4 shadow-xs">
            <span className="text-[9px] font-black text-[#4A6741] uppercase tracking-wider block mb-1">
              1. Choose Report Period
            </span>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => {
                  setClinicianLinkDays(7);
                  setClinicianLinkUrl('');
                }}
                className={`py-2 rounded-xl transition cursor-pointer border text-center ${
                  clinicianLinkDays === 7 ? 'bg-[#4A6741] text-white border-transparent' : 'bg-white text-slate-600 hover:text-slate-850 border-slate-200'
                }`}
              >
                📊 Past 7 Days
              </button>
              <button
                type="button"
                onClick={() => {
                  setClinicianLinkDays(30);
                  setClinicianLinkUrl('');
                }}
                className={`py-2 rounded-xl transition cursor-pointer border text-center ${
                  clinicianLinkDays === 30 ? 'bg-[#4A6741] text-white border-transparent' : 'bg-white text-slate-600 hover:text-slate-850 border-slate-200'
                }`}
              >
                🗓️ Past 1 Month
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col space-y-3">
              <button
                type="button"
                onClick={() => handleGenerateClinicianLink(clinicianLinkDays)}
                className="w-full py-2.5 rounded-xl bg-[#4A6741] hover:bg-[#3D5535] text-white font-extrabold text-[10px] transition cursor-pointer text-center uppercase tracking-widest border-0 shadow-xs"
              >
                🔗 Generate Clinician Link
              </button>
            </div>
          </div>

          {clinicianLinkUrl && (
            <div className="bg-[#E1E8E3]/50 border border-[#A8C69F]/40 p-4 rounded-2xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#A8C69F]/35 pb-2">
                <span className="text-[9.5px] font-black text-[#4A6741] uppercase tracking-wide">
                  2. Encoded Share Link
                </span>
                <span className="text-[8px] bg-[#E1E8E3] text-[#4A6741] font-black px-1.5 py-0.5 rounded uppercase">
                  Ready to Share
                </span>
              </div>

              <p className="text-[9.5px] text-slate-800 leading-relaxed bg-white border border-[#A8C69F]/35 p-2.5 rounded-xl font-mono break-all max-h-24 overflow-y-auto no-scrollbar">
                {clinicianLinkUrl}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(clinicianLinkUrl);
                    setClinicianCopied(true);
                    setTimeout(() => setClinicianCopied(false), 2000);
                  }}
                  className="py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition cursor-pointer text-center flex items-center justify-center space-x-1"
                >
                  <span>{clinicianCopied ? '✓ Copied!' : '📋 Copy Link'}</span>
                </button>
                <a
                  href={clinicianLinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 rounded-xl bg-[#4A6741] hover:bg-[#3D5535] text-white transition text-center flex items-center justify-center space-x-1 border-0 no-underline"
                >
                  <span>Launch View 🩺</span>
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {exportTab === 'backup' && (
        <div className="space-y-4 text-left">
          <p className="text-[10px] text-slate-500 leading-snug">
            Consolidate all local SafeSpace data—including nervous system daily logs, active tool data (journal slips, gratitude jar records, worries), and app calibration settings—into a secure JSON file or restore a past backup.
          </p>

          {/* EXPORT BACKUP BLOCK */}
          <div className="bg-white/80 border border-white p-4 rounded-2xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-[9.5px] font-black text-slate-800 uppercase tracking-wide">1. Create a Secure Backup</span>
              <span className="text-[8px] bg-[#E1E8E3] text-[#4A6741] font-black px-1.5 py-0.5 rounded uppercase font-sans">Export JSON</span>
            </div>

            <div className="space-y-3">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Choose data categories to include:</span>
              
              {/* Category 1: logs */}
              <label className="flex items-start space-x-2.5 text-[10.5px] text-slate-700 cursor-pointer select-none">
                <input 
                  id="chk-export-logs"
                  type="checkbox" 
                  checked={backupExportLogs} 
                  onChange={(e) => setBackupExportLogs(e.target.checked)} 
                  className="mt-0.5 rounded border-slate-300 text-[#4A6741] focus:ring-[#4A6741]"
                />
                <div>
                  <span className="font-bold block text-slate-800 leading-tight">Nervous System Daily Logs</span>
                  <span className="text-[8.5px] text-slate-500 block leading-normal">Calendar log entries, daily check-in states, and rating matrices.</span>
                </div>
              </label>

              {/* Category 2: saved */}
              <label className="flex items-start space-x-2.5 text-[10.5px] text-slate-700 cursor-pointer select-none">
                <input 
                  id="chk-export-saved"
                  type="checkbox" 
                  checked={backupExportSaved} 
                  onChange={(e) => setBackupExportSaved(e.target.checked)} 
                  className="mt-0.5 rounded border-slate-300 text-[#4A6741] focus:ring-[#4A6741]"
                />
                <div>
                  <span className="font-bold block text-slate-800 leading-tight">Saved Data from Clinical Skills</span>
                  <span className="text-[8.5px] text-slate-500 block leading-normal">Emotional journals, gratitude slips, safety plans, EMDR worries, daily habits, and coping cards.</span>
                </div>
              </label>

              {/* Category 3: settings */}
              <label className="flex items-start space-x-2.5 text-[10.5px] text-slate-700 cursor-pointer select-none">
                <input 
                  id="chk-export-settings"
                  type="checkbox" 
                  checked={backupExportSettings} 
                  onChange={(e) => setBackupExportSettings(e.target.checked)} 
                  className="mt-0.5 rounded border-slate-300 text-[#4A6741] focus:ring-[#4A6741]"
                />
                <div>
                  <span className="font-bold block text-slate-800 leading-tight">Settings & App Calibration</span>
                  <span className="text-[8.5px] text-slate-500 block leading-normal">Personal voice rate/parameters, emergency contact triggers, active emoji definitions.</span>
                </div>
              </label>

              {/* Quick Select Actions */}
              <div className="flex space-x-2 pt-1 border-t border-slate-100">
                <button
                  id="btn-export-select-all"
                  type="button"
                  onClick={() => {
                    setBackupExportLogs(true);
                    setBackupExportSaved(true);
                    setBackupExportSettings(true);
                  }}
                  className="text-[8.5px] font-bold text-[#4A6741] hover:underline cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-[8px] text-slate-300">|</span>
                <button
                  id="btn-export-deselect-all"
                  type="button"
                  onClick={() => {
                    setBackupExportLogs(false);
                    setBackupExportSaved(false);
                    setBackupExportSettings(false);
                  }}
                  className="text-[8.5px] font-bold text-slate-400 hover:underline cursor-pointer"
                >
                  Deselect All
                </button>
              </div>

              <button
                id="btn-export-backup-json"
                type="button"
                onClick={handleExportBackup}
                disabled={!backupExportLogs && !backupExportSaved && !backupExportSettings}
                className="w-full mt-1.5 py-2.5 rounded-xl bg-[#4A6741] hover:bg-[#3D5535] active:scale-[98] disabled:opacity-50 disabled:active:scale-100 text-white font-extrabold text-[10px] transition cursor-pointer shadow-xs flex items-center justify-center space-x-1.5"
              >
                <Download size={11} />
                <span>Download JSON Backup File</span>
              </button>
            </div>
          </div>

          {/* IMPORT BACKUP BLOCK */}
          <div className="bg-white/80 border border-white p-4 rounded-2xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-[9.5px] font-black text-slate-800 uppercase tracking-wide">2. Restore from Backup</span>
              <span className="text-[8px] bg-slate-200 text-slate-700 font-black px-1.5 py-0.5 rounded uppercase font-sans">Import JSON</span>
            </div>

            {!backupImportFile ? (
              <div className="space-y-3">
                <span className="text-[8px] font-black text-[#4A6741] uppercase tracking-widest block">Upload a valid backup file:</span>
                <div 
                  id="btn-trigger-picker"
                  onClick={() => document.getElementById('backup-file-picker')?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) handleFileSelected(file);
                  }}
                  className="border border-dashed border-slate-300 rounded-xl p-5 text-center cursor-pointer hover:bg-slate-50 transition flex flex-col items-center justify-center space-y-1.5 active:scale-95 group font-sans"
                >
                  <Upload size={20} className="text-slate-400 group-hover:text-[#4A6741] transition" />
                  <div className="space-y-0.5">
                    <span className="text-[9.5px] font-extrabold text-slate-700 block font-sans">Select backup .json</span>
                    <span className="text-[8px] text-slate-400 block font-normal font-sans">Click or drag backup file here</span>
                  </div>
                  <input 
                    id="backup-file-picker" 
                    type="file" 
                    accept=".json" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelected(file);
                    }}
                    className="hidden" 
                  />
                </div>
                
                {backupImportError && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-[9px] text-red-700 font-medium leading-tight select-none">
                    ⚠ {backupImportError}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-150 text-[9px] font-mono leading-relaxed space-y-1 text-slate-500 block relative text-left">
                  <button 
                    type="button" 
                    onClick={() => {
                      setBackupImportFile(null);
                      setBackupImportError(null);
                    }} 
                    className="absolute top-1 right-2 text-[8.5px] font-black text-red-600 hover:underline cursor-pointer"
                  >
                    Reset File
                  </button>
                  <div className="font-extrabold text-[#4A6741] text-[9.5px] font-sans">✓ Verified Backup Package</div>
                  <div>Uploaded: {new Date(backupImportFile.timestamp).toLocaleString()}</div>
                  <div className="capitalize font-mono">Partitions: {backupImportFile.categories?.join(', ') || 'unknown'}</div>
                </div>

                <div className="space-y-2.5 text-left">
                  <span className="text-[8px] font-black text-[#4A6741] uppercase tracking-wider block">Import specific segments:</span>
                  
                  {/* logs check */}
                  <label className={`flex items-start space-x-2 text-[10.5px] cursor-pointer select-none ${
                    !(backupImportFile.categories?.includes('logs')) ? 'opacity-30 pointer-events-none' : ''
                  }`}>
                    <input 
                      id="chk-import-logs"
                      type="checkbox" 
                      checked={backupImportLogs} 
                      disabled={!(backupImportFile.categories?.includes('logs'))}
                      onChange={(e) => setBackupImportLogs(e.target.checked)}
                      className="mt-0.5 rounded border-slate-350 text-[#4A6741] focus:ring-[#4A6741]"
                    />
                    <div>
                      <span className="font-bold text-slate-800 leading-tight block">Restore Nervous System Daily Logs</span>
                      <span className="text-[8.5px] text-slate-500 block">Restores calendars and rated checked-ins.</span>
                    </div>
                  </label>

                  {/* saved check */}
                  <label className={`flex items-start space-x-2 text-[10.5px] cursor-pointer select-none ${
                    !(backupImportFile.categories?.includes('saved')) ? 'opacity-30 pointer-events-none' : ''
                  }`}>
                    <input 
                      id="chk-import-saved"
                      type="checkbox" 
                      checked={backupImportSaved} 
                      disabled={!(backupImportFile.categories?.includes('saved'))}
                      onChange={(e) => setBackupImportSaved(e.target.checked)}
                      className="mt-0.5 rounded border-slate-350 text-[#4A6741] focus:ring-[#4A6741]"
                    />
                    <div>
                      <span className="font-bold text-slate-800 leading-tight block">Restore Saved Tools Entries</span>
                      <span className="text-[8.5px] text-slate-500 block">Restores gratitude slips, journal items, habit cards, worries.</span>
                    </div>
                  </label>

                  {/* settings check */}
                  <label className={`flex items-start space-x-2 text-[10.5px] cursor-pointer select-none ${
                    !(backupImportFile.categories?.includes('settings')) ? 'opacity-30 pointer-events-none' : ''
                  }`}>
                    <input 
                      id="chk-import-settings"
                      type="checkbox" 
                      checked={backupImportSettings} 
                      disabled={!(backupImportFile.categories?.includes('settings'))}
                      onChange={(e) => setBackupImportSettings(e.target.checked)}
                      className="mt-0.5 rounded border-slate-350 text-[#4A6741] focus:ring-[#4A6741]"
                    />
                    <div>
                      <span className="font-bold text-slate-800 leading-tight block">Restore settings & Emergency Contacts</span>
                      <span className="text-[8.5px] text-slate-500 block">Restores customized emergency details and voiced parameters.</span>
                    </div>
                  </label>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
                  <button
                    id="btn-import-backup-json"
                    type="button"
                    onClick={handlePerformRestore}
                    disabled={!backupImportLogs && !backupImportSaved && !backupImportSettings}
                    className="w-full py-2.5 rounded-xl bg-[#4A6741] hover:bg-[#3D5535] active:scale-[98] disabled:opacity-50 text-white font-extrabold text-[10px] cursor-pointer text-center flex items-center justify-center space-x-1 uppercase tracking-widest font-sans border-0"
                  >
                    <span>Trigger Secure Local Import</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>

    {/* Action Buttons - Fixed at bottom */}
    <div className="space-y-2 mt-2 shrink-0 border-t border-slate-250/20 pt-3">
      {exportTab === 'diary' && (
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            type="button"
            onClick={handleCopy}
            className="py-2.5 rounded-xl bg-white hover:bg-slate-100 active:scale-95 text-slate-700 font-bold text-[10px] transition cursor-pointer border border-slate-200 shadow-xs flex items-center justify-center space-x-1"
          >
            <Copy size={11} className="text-slate-500" />
            <span>Copy Data</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="py-2.5 rounded-xl bg-[#4A6741] hover:bg-[#3D5535] active:scale-95 text-white font-bold text-[10px] transition cursor-pointer border-0 shadow-xs flex items-center justify-center space-x-1 text-center font-sans"
          >
            <Download size={11} />
            <span>Save File</span>
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowExport(false)}
        className="w-full bg-slate-200 hover:bg-slate-250 text-slate-755 text-[9.5px] font-black py-2.5 rounded-xl transition cursor-pointer border-0 shadow-xs leading-none uppercase tracking-widest"
      >
        Go Back
      </button>
    </div>
  </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F1F5F2] p-5 justify-between overflow-y-auto">
      <div className="flex flex-col flex-1">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mt-3 mb-3 shrink-0">
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => onNavigate('dashboard')}
              className="p-1 px-1.5 rounded-xl hover:bg-[#E1E8E3] active:scale-90 text-[#4A6741] transition cursor-pointer border-0 mr-1 flex items-center justify-center font-bold"
            >
              <ArrowLeft size={16} className="stroke-[2.5]" />
            </button>
            <div className="text-left select-none">
              <span className="text-[9px] font-extrabold text-[#4A6741] uppercase tracking-widest bg-[#E1E8E3] px-2 py-0.5 rounded">HISTORY</span>
              <h2 className="text-sm font-bold text-slate-800 mt-1 leading-none">Nervous System Diary</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowExport(true)}
            className="flex items-center space-x-1 p-1.5 px-2.5 rounded-xl bg-[#E1E8E3] hover:bg-[#D4DDD6] text-[#4A6741] font-bold text-[9.5px] transition cursor-pointer border-0 active:scale-95 shadow-xs"
            title="Export Records"
          >
            <Download size={11} />
            <span>Export</span>
          </button>
        </div>

        {/* Tab Switching Chips */}
        <div className="flex p-0.5 bg-slate-200/60 rounded-2xl mb-3 shrink-0 text-[10px] font-bold select-none">
          <button
            onClick={() => setHistoryTab('monthly')}
            className={`flex-1 py-1.5 rounded-xl transition cursor-pointer border-0 text-center ${
              historyTab === 'monthly' ? 'bg-[#4A6741] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🗓️ Month View
          </button>
          <button
            onClick={() => setHistoryTab('weekly')}
            className={`flex-1 py-1.5 rounded-xl transition cursor-pointer border-0 text-center ${
              historyTab === 'weekly' ? 'bg-[#4A6741] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📊 7-Day Trend
          </button>
        </div>

        {historyTab === 'weekly' ? (
          /* WEEKLY LIST COMPONENT */
          <div className="flex flex-col flex-1">
            <div className="grid grid-cols-2 gap-2.5 mb-3 shrink-0">
              <div className="bg-white/80 p-2.5 rounded-2xl border border-white/60 text-left select-none">
                <span className="text-[8px] uppercase tracking-wider font-extrabold text-slate-400">Total Logs</span>
                <div className="flex items-baseline space-x-1 mt-0.5">
                  <span className="text-base font-black text-[#4A6741]">{checkInDays.length}</span>
                  <span className="text-[9px] text-slate-400">/ {moodHistory.length} checked</span>
                </div>
              </div>
              <div className="bg-white/80 p-2.5 rounded-2xl border border-white/60 text-left select-none">
                <span className="text-[8px] uppercase tracking-wider font-extrabold text-slate-400">Avg Stress</span>
                <div className="flex items-baseline space-x-1 mt-0.5">
                  <span className="text-base font-black text-[#4A6741]">{averageStress}</span>
                  <span className="text-[9px] text-slate-400">/ 10 level</span>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col space-y-2 mb-4 overflow-y-auto max-h-[300px] pr-1">
              {moodHistory.map((item, idx) => {
                return (
                  <div 
                    key={idx}
                    className="bg-white/80 rounded-2xl p-2.5 border border-white flex justify-between items-center text-left hover:scale-[1.01] transition-transform select-none"
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-slate-700">
                          {item.day === 'Today' || item.day === ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()] ? 'Today' : item.day}
                        </span>
                        {item.hasData ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border bg-[#EBF2EC] border-[#A8C69F]/40 text-[#4A6741]">
                            Feel: {extractEmoji(item.moodLabel, item.moodValue)}
                          </span>
                        ) : (
                          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full border bg-slate-50 border-slate-100 text-slate-600">
                            No Check-In
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              item.hasData 
                                ? item.stress > 7 
                                  ? 'bg-red-400' 
                                  : item.stress > 4 
                                    ? 'bg-amber-400' 
                                    : 'bg-emerald-400'
                                : 'bg-slate-200'
                            }`}
                            style={{ width: `${item.hasData ? item.stress * 10 : 0}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-mono font-bold text-slate-500">
                          Stress: {item.hasData ? `${item.stress}/10` : '—'}
                        </span>
                      </div>
                      {item.hasData && item.notes && (
                        <p className="text-[9.5px] text-slate-500 italic mt-1.5 leading-snug border-l-2 border-[#4A6741]/30 pl-2 max-w-full break-words">
                          {item.notes}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-[8px] text-slate-400 block font-sans">
                        {item.hasData ? 'Active Log' : 'Empty'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* MONTH CALENDAR COMPONENT */
          <div className="flex flex-col flex-1">
            {/* Calendar header with cycle controls */}
            <div className="flex items-center justify-between bg-white/70 border border-white/60 p-2 rounded-2xl mb-2.5 shrink-0 select-none">
              <button
                onClick={handlePrevMonth}
                disabled={selectedMonthIdx === 0}
                className="p-1 rounded-xl bg-slate-50 hover:bg-slate-100 active:scale-95 text-slate-600 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer border-0"
                title="Previous Month"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="flex items-center space-x-1.5 font-sans">
                <Calendar size={13} className="text-[#4A6741]" />
                <span className="text-[11px] font-black text-[#4A6741] uppercase tracking-wide">
                  {currentMonth.label}
                </span>
              </div>

              <button
                onClick={handleNextMonth}
                disabled={selectedMonthIdx === MONTHS_CONFIG.length - 1}
                className="p-1 rounded-xl bg-slate-50 hover:bg-slate-100 active:scale-95 text-slate-600 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer border-0"
                title="Next Month"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-2.5 shrink-0">
              <div className="bg-white/80 p-2.5 rounded-2xl border border-white/60 text-left select-none">
                <span className="text-[8px] uppercase tracking-wider font-extrabold text-slate-400">Total Logs</span>
                <div className="flex items-baseline space-x-1 mt-0.5">
                  <span className="text-base font-black text-[#4A6741]">{currentMonthCheckInDays.length}</span>
                  <span className="text-[9px] text-slate-400">/ {currentMonth.days} days</span>
                </div>
              </div>
              <div className="bg-white/80 p-2.5 rounded-2xl border border-white/60 text-left select-none">
                <span className="text-[8px] uppercase tracking-wider font-extrabold text-slate-400">Avg Stress</span>
                <div className="flex items-baseline space-x-1 mt-0.5">
                  <span className="text-base font-black text-[#4A6741]">{monthlyAverageStress}</span>
                  <span className="text-[9px] text-slate-400">/ 10 level</span>
                </div>
              </div>
            </div>

            {/* Calendar grid board */}
            <div className="bg-white/80 p-3 rounded-2xl border border-white/60 flex flex-col mb-3 shrink-0 select-none">
              <div className="grid grid-cols-7 gap-1.5 mb-1.5 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayChar, i) => (
                  <span key={i} className="text-[8px] font-bold text-slate-400 font-mono tracking-widest">{dayChar}</span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {gridCells}
              </div>
            </div>

            {/* Bottom details card displaying selected day statistics */}
            <div className="bg-white rounded-2xl p-3 border border-white shadow-xs flex-1 flex flex-col justify-between text-left min-h-[145px] max-h-[225px] overflow-y-auto no-scrollbar">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[9px] uppercase tracking-widest font-extrabold text-slate-400 leading-none">
                    {currentMonth.name} {selectedDay}, 2026 {(() => {
                      const todayObjForHistory = new Date();
                      const curMonthKeyForHistory = String(todayObjForHistory.getMonth() + 1).padStart(2, '0');
                      const curDayNumForHistory = todayObjForHistory.getDate();
                      return currentMonth.key === curMonthKeyForHistory && selectedDay === curDayNumForHistory;
                    })() && " (Today)"}
                  </span>
                  {selectedDayHasData ? (
                    <div className="flex items-center space-x-1">
                      {selectableEmojis.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => {
                            const todayObjForHistory = new Date();
                            const curMonthKeyForHistory = String(todayObjForHistory.getMonth() + 1).padStart(2, '0');
                            const curDayNumForHistory = todayObjForHistory.getDate();
                            const isToday = currentMonth.key === curMonthKeyForHistory && selectedDay === curDayNumForHistory;
                            if (isToday) {
                              setLoggedMood?.(emoji);
                            }
                            handleUpdateDay(selectedDay, { moodLabel: emoji });
                          }}
                          className={`text-[10px] p-1 rounded-lg transition cursor-pointer border-0 ${
                            selectedDayData.moodLabel === emoji
                              ? 'bg-[#EBF2EC] text-[#4A6741] font-bold scale-110'
                              : 'bg-transparent hover:bg-slate-100 text-slate-400'
                          }`}
                          title={`Set mood to ${emoji}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border bg-slate-50 border-slate-200 text-slate-400">
                      No Check-In
                    </span>
                  )}
                </div>

                {!selectedDayHasData ? (
                  <div className="flex flex-col justify-center flex-1 py-1">
                    <p className="text-[10px] text-slate-500 leading-normal">
                      No track records logged for this date.
                    </p>
                    <div className="flex items-center space-x-1.5 mt-2 bg-slate-50 border border-slate-100 p-2 rounded-xl">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      <span className="text-[10px] text-slate-400">Stress Value: <span className="font-bold">--</span> (No Record)</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5 pb-1">
                    {/* Stress slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-bold">Tracked Stress Level</span>
                        <span className="text-[11px] font-mono font-black text-[#4A6741]">{selectedDayData.stress}/10</span>
                      </div>
                      
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={selectedDayData.stress}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          const todayObjForHistory = new Date();
                          const curMonthKeyForHistory = String(todayObjForHistory.getMonth() + 1).padStart(2, '0');
                          const curDayNumForHistory = todayObjForHistory.getDate();
                          const isToday = currentMonth.key === curMonthKeyForHistory && selectedDay === curDayNumForHistory;
                          if (isToday) {
                            setStressLevel?.(val);
                          }
                          handleUpdateDay(selectedDay, { stress: val });
                        }}
                        className="w-full accent-[#4A6741] h-1 bg-[#E1E8E3] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Custom Daily Scales */}
                    {customScales.length > 0 && (
                      <div className="space-y-2 pt-1 border-t border-[#CBD9CC]/30">
                        <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider block mb-1">Custom Scales</span>
                        {customScales.map(scale => {
                          const savedScales = (selectedDayData as any).customScales || {};
                          const scaleValue = savedScales[scale.id] !== undefined ? savedScales[scale.id] : 5;
                          return (
                            <div key={scale.id} className="space-y-0.5">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] text-slate-500 font-bold">{scale.name}</span>
                                <span className="text-[9px] font-mono font-black text-[#4A6741]">{scaleValue}/10</span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="10"
                                value={scaleValue}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  const updatedScales = {
                                    ...savedScales,
                                    [scale.id]: val
                                  };
                                  const todayObjForHistory = new Date();
                                  const curMonthKeyForHistory = String(todayObjForHistory.getMonth() + 1).padStart(2, '0');
                                  const curDayNumForHistory = todayObjForHistory.getDate();
                                  const isToday = currentMonth.key === curMonthKeyForHistory && selectedDay === curDayNumForHistory;
                                  if (isToday) {
                                    setTodayCustomScaleValues?.(prev => ({
                                      ...prev,
                                      [scale.id]: val
                                    }));
                                  }
                                  handleUpdateDay(selectedDay, { customScales: updatedScales });
                                }}
                                className="w-full accent-[#4A6741] h-1 bg-[#E1E8E3] rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Notes Textarea */}
                    <div className="flex flex-col space-y-1 mt-1.5">
                      <label className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                        <FileText size={9} className="text-[#4A6741]" />
                        <span>Log Notes</span>
                      </label>
                      <textarea
                        value={selectedDayData.notes || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const todayObjForHistory = new Date();
                          const curMonthKeyForHistory = String(todayObjForHistory.getMonth() + 1).padStart(2, '0');
                          const curDayNumForHistory = todayObjForHistory.getDate();
                          const isToday = currentMonth.key === curMonthKeyForHistory && selectedDay === curDayNumForHistory;
                          if (isToday) {
                            setStressNotes?.(val);
                          }
                          handleUpdateDay(selectedDay, { notes: val });
                        }}
                        placeholder="Triggers, details, state..."
                        className="w-full bg-slate-50 border border-slate-200/60 focus:bg-white focus:ring-1 focus:ring-[#4A6741] focus:border-[#4A6741] rounded-xl px-2 py-1 text-[10px] text-slate-700 placeholder-slate-400 transition resize-none outline-none"
                        rows={2}
                      />
                    </div>

                    {/* Clear Button */}
                    <div className="flex justify-end pt-1 border-t border-slate-100/60">
                      <button
                        onClick={() => {
                          const todayObjForHistory = new Date();
                          const curMonthKeyForHistory = String(todayObjForHistory.getMonth() + 1).padStart(2, '0');
                          const curDayNumForHistory = todayObjForHistory.getDate();
                          const isToday = currentMonth.key === curMonthKeyForHistory && selectedDay === curDayNumForHistory;
                          if (isToday) {
                            setLoggedMood?.(null);
                            setStressNotes?.('');
                          }
                          handleUpdateDay(selectedDay, { hasData: false });
                        }}
                        className="text-[9px] font-bold text-rose-500 hover:text-rose-700 flex items-center space-x-1 cursor-pointer transition border-0 bg-transparent active:scale-95"
                      >
                        <Trash2 size={10} />
                        <span>Clear Log</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Day item custom checks toggling/mutations */}
              {!selectedDayHasData && (
                <div className="mt-2 text-center pt-2 border-t border-slate-100 flex items-center justify-between shrink-0">
                  <button
                    onClick={() => {
                      const todayObjForHistory = new Date();
                      const curMonthKeyForHistory = String(todayObjForHistory.getMonth() + 1).padStart(2, '0');
                      const curDayNumForHistory = todayObjForHistory.getDate();
                      const isToday = currentMonth.key === curMonthKeyForHistory && selectedDay === curDayNumForHistory;
                      if (isToday) {
                        setLoggedMood?.('🍃');
                        setStressLevel?.(5);
                        setStressNotes?.('');
                      }
                      handleUpdateDay(selectedDay, { hasData: true, moodLabel: '🍃', stress: 5, notes: '' });
                    }}
                    className="w-full bg-[#E1E8E3] hover:bg-[#D1DBCF] active:scale-95 text-[#4A6741] font-bold text-[9px] py-1.5 rounded-xl cursor-pointer border-0 transition"
                  >
                    ➕ Record Retrospective Check-In
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => onNavigate('dashboard')}
        className="mt-2 w-full bg-[#4A6741] hover:bg-[#3D5535] text-white text-[10px] font-black py-2.5 rounded-xl transition cursor-pointer border-0 shadow-sm leading-none shrink-0 uppercase tracking-widest"
      >
        Return to Dashboard
      </button>
    </div>
  );
};


