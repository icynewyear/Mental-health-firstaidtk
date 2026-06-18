import React, { useState, useEffect, useRef } from 'react';
import { Leaf, Compass, BookOpen, Phone, ArrowLeft, ArrowRight, Heart, Save, Plus, Trash2, CheckCircle2, Smartphone, Zap, Music, CloudRain, Waves, Volume2, VolumeX, Calendar, ChevronLeft, ChevronRight, Sliders, Settings2, Play } from 'lucide-react';
import { ActiveScreen, BreathingType, CopingStatement, GroundingStep, MoodLogEntry } from '../types';
import { startAmbientSound, stopAmbientSound, setAmbientVolume, setSoundscapeChannel, stopSoundscapeChannel, setSoundscapeChannelVolume, stopAllSoundscapeChannels, setMasterSoundscapeVolume } from '../utils/audioSynth';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Custom Tooltip for the Recharts Mood Trend Chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if (!data.hasData || !data.moodValue) {
      return null;
    }
    return (
      <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-2.5 shadow-lg text-[10px] leading-relaxed select-none font-sans z-50">
        <p className="font-bold text-[#A8C69F]">{data.day === 'Today' ? 'Today' : `${data.day}`}</p>
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

// Custom rendered Dot showing nervous system emoji corresponding to each day's mood
const RenderCustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (cx === undefined || cy === undefined) return null;
  
  const hasData = payload.hasData;

  if (!hasData) {
    return null;
  }
  
  const emoji = extractEmoji(payload.moodLabel, payload.moodValue);

  return (
    <g>
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

// Larger floating Custom rendered Active Dot
const RenderCustomActiveDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (cx === undefined || cy === undefined) return null;

  const hasData = payload.hasData;

  if (!hasData) {
    return null;
  }

  const emoji = extractEmoji(payload.moodLabel, payload.moodValue);

  return (
    <g>
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
}

export const SimulatorDashboard: React.FC<DashboardProps> = ({
  onNavigate,
  stressLevel,
  setStressLevel,
  loggedMood,
  setLoggedMood,
  moodHistory,
}) => {
  const PREDEFINED_EMOJI_SETS = [
    {
      id: 'nature',
      name: 'Nature 🍃',
      emojis: ['🍃', '🌊', '⛈️', '🌿']
    },
    {
      id: 'faces',
      name: 'Faces 😊',
      emojis: ['😌', '🙂', '😟', '😰']
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
    return localStorage.getItem('safespace_active_emoji_set_id') || 'nature';
  });

  const [showSelector, setShowSelector] = useState<boolean>(false);
  const [activeCustomSlotIndex, setActiveCustomSlotIndex] = useState<number>(0);
  const [customEmojiSet, setCustomEmojiSet] = useState<string[]>(() => {
    const saved = localStorage.getItem('safespace_custom_emoji_set_list');
    return saved ? JSON.parse(saved) : ['🧘', '🪴', '🍵', '🕯️'];
  });
  const [newCustomInput, setNewCustomInput] = useState<string>('');

  // 5th custom keyboard emoji state with "until next day" detection
  const [keyboardCustomEmoji, setKeyboardCustomEmoji] = useState<string | null>(() => {
    const savedDate = localStorage.getItem('safespace_kb_emoji_date');
    const todayStr = new Date().toDateString();
    if (savedDate === todayStr) {
      return localStorage.getItem('safespace_kb_emoji_val') || null;
    }
    return null;
  });

  const [showKeyboardInput, setShowKeyboardInput] = useState<boolean>(false);
  const [phoneKeyboardInput, setPhoneKeyboardInput] = useState<string>('');

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

  return (
    <div className="flex flex-col h-full bg-[#F1F5F2] p-5 overflow-y-auto relative">
      {/* Phone custom keyboard picker input modal */}
      {showKeyboardInput && (
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-5 z-55">
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

      {/* Greeting */}
      <div className="text-left mt-4 mb-5 select-none">
        <span className="text-[10px] font-bold text-[#4A6741] uppercase tracking-widest bg-[#E1E8E3] px-2 py-0.5 rounded">OFFLINE FIRST</span>
        <h2 className="text-2xl font-bold text-[#4A6741] tracking-tight mt-1.5 font-sans">Safe Space</h2>
        <p className="text-xs text-slate-500 mt-1">Take a moment. You are safe, and you are here.</p>
      </div>

      {/* Mood Check-In Widget */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4.5 shadow-xs border border-white/60 flex flex-col mb-4">
        
        {/* Compact, dense top row pairing title, active indicator & settings button */}
        <div className="flex justify-between items-center mb-2 select-none">
          <div className="flex items-center space-x-1.5 text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daily Feel</span>
            <span className="text-[9px] text-[#4A6741] bg-[#E1E8E3] px-2 py-0.5 rounded-full font-extrabold shadow-2xs">
              {activeSet.id === 'custom' ? 'My Set ⚙️' : activeSet.name}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setShowSelector(!showSelector)}
              className={`text-[9px] font-black px-2.5 py-1 rounded-full border-0 cursor-pointer transition flex items-center space-x-0.5 select-none ${
                showSelector 
                  ? 'bg-[#4A6741] text-white shadow-xs' 
                  : 'bg-[#4A6741]/10 text-[#4A6741] hover:bg-[#4A6741]/20'
              }`}
            >
              <span>⚙️ Tune Set</span>
            </button>
            {loggedMood && (
              <button
                onClick={() => {
                  setLoggedMood(null);
                  updateKeyboardCustomEmoji(null);
                }}
                className="text-[9px] font-extrabold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/70 px-2.5 py-1 rounded-full transition border-0 cursor-pointer"
                title="Clear feel"
              >
                Clear feel ✕
              </button>
            )}
          </div>
        </div>

        {/* Dynamic status / statement label showing chosen feel inline */}
        <div className="text-left mb-3 select-none">
          {loggedMood ? (
            <p className="text-xs font-semibold text-slate-800 flex items-center space-x-1.5">
              <span>Today representing as</span>
              <span className="w-6 h-6 rounded-lg bg-[#E1E8E3] flex items-center justify-center text-sm border border-[#4A6741]/30 animate-pulse font-bold">
                {loggedMood}
              </span>
              <span className="text-[9px] font-normal text-slate-400">(Saved to history)</span>
            </p>
          ) : (
            <p className="text-xs font-semibold text-slate-400 italic">
              Tap a focus symbol to log your feel today
            </p>
          )}
        </div>

        {/* Dense 5-Slot Option Grid (4 themed + 1 customizable) */}
        <div className="grid grid-cols-5 gap-1.5 mb-1 select-none">
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
                className={`text-xl py-2.5 rounded-2xl transition hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer border ${
                  isSelected 
                    ? 'bg-[#EBF2EC] border-[#4A6741] text-[#4A6741] shadow-xs font-extrabold ring-3 ring-[#4A6741]/10' 
                    : 'bg-[#F9FAF9] border-[#CBD9CC]/50 hover:bg-white text-slate-700'
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
            const displayChar = keyboardCustomEmoji || '❓';
            return (
              <button
                type="button"
                onClick={() => {
                  setPhoneKeyboardInput(keyboardCustomEmoji || '');
                  setShowKeyboardInput(true);
                }}
                className={`text-xl py-2.5 rounded-2xl transition hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer relative border ${
                  isSelected
                    ? 'bg-[#EBF2EC] border-[#4A6741] text-[#4A6741] shadow-xs font-extrabold ring-3 ring-[#4A6741]/10'
                    : hasKbEmoji
                    ? 'bg-amber-50/50 border-amber-200 hover:bg-amber-100/40 text-slate-700'
                    : 'bg-slate-50 border-dashed border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-100/50'
                }`}
                title={hasKbEmoji ? `Custom keyboard emoji: ${keyboardCustomEmoji}` : 'Set keyboard custom emoji'}
              >
                <span className={!hasKbEmoji ? "text-xs font-black opacity-60" : ""}>{displayChar}</span>
                {/* Tiny badge indicating this is a custom keyboard-powered slot */}
                <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${hasKbEmoji ? 'bg-amber-400' : 'bg-[#4A6741]/40'}`}></span>
                  <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${hasKbEmoji ? 'bg-amber-500' : 'bg-slate-300'}`}></span>
                </span>
              </button>
            );
          })()}
        </div>

        {/* Universal Emoji Selector & Custom Set Customizer Panel */}
        {showSelector && (
          <div className="mt-3.5 p-3.5 bg-[#FAFDFB] border border-[#CBD9CC]/60 rounded-2xl shadow-inner animate-fade-in text-left">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 leading-none">Select Active Set</span>
            
            {/* Tabs */}
            <div className="flex flex-wrap gap-1.5 mb-3 pb-2.5 border-b border-dashed border-slate-100">
              {PREDEFINED_EMOJI_SETS.map((set) => {
                const isActive = activeSetId === set.id;
                return (
                  <button
                    key={set.id}
                    type="button"
                    onClick={() => handleSelectSet(set.id)}
                    className={`text-[9px] font-bold px-2 py-1 rounded-lg transition-all cursor-pointer border-0 ${
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
                className={`text-[9px] font-black px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center space-x-0.5 border-0 ${
                  activeSetId === 'custom'
                    ? 'bg-amber-600 text-white font-bold shadow-xs'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                <span>My Set ⚙️</span>
              </button>
            </div>

            {/* Predefined View showing preview of the 4 items */}
            {activeSetId !== 'custom' && (
              <div className="space-y-2 pb-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Set Preview (4 Emojis)</span>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mr-1">Currently Selected Active Set</span>
                </div>
                <div className="grid grid-cols-4 gap-1 bg-[#F9FBF9] p-2 rounded-xl border border-slate-100">
                  {activeSet.emojis.map((emoji, idx) => (
                    <div 
                      key={idx} 
                      className="text-base p-1 bg-white border border-slate-100 rounded-lg flex items-center justify-center"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Emoji Set Panel with precisely 4 slots customizer */}
            {activeSetId === 'custom' && (
              <div className="flex flex-col space-y-2.5">
                <div className="flex justify-between items-center bg-amber-50/50 p-2 rounded-xl border border-amber-100">
                  <p className="text-[8.5px] text-amber-800 leading-tight">
                    <strong>Custom Slot Editor</strong>: Select one of the 4 slots below and assign any emoji to swap it!
                  </p>
                </div>

                {/* The 4 Slot Cards for custom list */}
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 1, 2, 3].map((idx) => {
                    const emoji = customEmojiSet[idx] || '🧘';
                    const isSelectedSlot = activeCustomSlotIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveCustomSlotIndex(idx)}
                        className={`p-1.5 rounded-xl transition flex flex-col items-center justify-center cursor-pointer border ${
                          isSelectedSlot
                            ? 'bg-[#E1E8E3] border-[#4A6741] ring-2 ring-[#4A6741]/40 scale-[1.03]'
                            : 'bg-slate-50 border-slate-150 hover:bg-white text-slate-800'
                        }`}
                      >
                        <span className="text-[7.5px] uppercase font-bold text-slate-400 mb-0.5">Slot {idx + 1}</span>
                        <span className="text-base">{emoji}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Slot replacement controls */}
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-extrabold text-[#4A6741] uppercase tracking-wide">
                      Update Slot {activeCustomSlotIndex + 1} ({customEmojiSet[activeCustomSlotIndex] || '🧘'})
                    </span>
                  </div>

                  {/* Input form */}
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Type or paste emoji to auto-assign..."
                      value={newCustomInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewCustomInput(val);
                        if (val.trim()) {
                          updateCustomSlot(val);
                          setNewCustomInput('');
                        }
                      }}
                      className="bg-white border border-[#CBD9CC] rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#4A6741] w-full"
                      maxLength={4}
                    />
                  </div>

                  {/* Recommendations / suggestions */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-slate-200/40">
                    <span className="text-[8px] font-black text-slate-400">Suggestions:</span>
                    {['🌸', '🪐', '🍀', '🌈', '🌙', '🌌', '🎈', '🧸', '🍦', '🍕', '🎡', '🐈', '🧘', '🪴', '🍵', '🕯️', '💭'].map(sug => {
                      return (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => updateCustomSlot(sug)}
                          className="text-[12px] p-0.5 rounded hover:bg-[#E1E8E3] hover:scale-110 active:scale-95 transition cursor-pointer select-none border-0 bg-transparent"
                        >
                          {sug}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
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
            <LineChart data={moodHistory} margin={{ top: 10, right: 10, left: -25, bottom: -5 }}>
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
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#A8C69F', strokeWidth: 1, strokeDasharray: '2 2' }} />
              <Line 
                type="monotone" 
                dataKey="stress" 
                stroke="transparent" 
                strokeWidth={0} 
                dot={<RenderCustomDot />}
                activeDot={<RenderCustomActiveDot />}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sleek Ambient Soundscape Promo Card */}
      <button
        type="button"
        onClick={() => onNavigate('soundscape')}
        className="w-full bg-gradient-to-r from-[#4A6741] to-[#608271] text-white transition rounded-[24px] p-4 text-left flex items-center justify-between shadow-xs mb-4.5 hover:shadow-md active:scale-99 cursor-pointer border-0 select-none animate-fade-in shrink-0"
      >
        <div className="flex items-center space-x-3.5">
          <div className="bg-white/20 p-2.5 rounded-2xl flex items-center justify-center">
            <Music size={16} className="text-white animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/70 block leading-none">Nervous System Audio</span>
            <h3 className="text-xs font-black mt-1">Soundscape Mixer</h3>
            <p className="text-[10px] text-white/80 mt-0.5 leading-tight">Mix procedural offline-first nature resonance.</p>
          </div>
        </div>
        <div className="bg-white/15 hover:bg-white/20 p-1.5 rounded-full text-white transition flex items-center justify-center">
          <ArrowRight size={13} />
        </div>
      </button>

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

      {/* 4 Therapeutic Toolkits (CBT, Somatic, Biology, Resilience) */}
      <span className="text-[10px] font-bold text-slate-400 text-left uppercase tracking-widest mb-2.5">Therapeutic Toolkits</span>
      <div className="grid grid-cols-2 gap-3 mb-4.5">
        {/* Gratitude Jar */}
        <button
          onClick={() => onNavigate('gratitude')}
          className="bg-[#608271]/5 hover:bg-[#608271]/10 border border-[#608271]/10 text-[#608271] transition rounded-[24px] p-4 text-left flex flex-col justify-between h-28 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-98 cursor-pointer select-none"
        >
          <div className="bg-[#608271] text-white p-1.5 rounded-full w-fit flex items-center justify-center text-[10px] h-6 w-6">
            ✨
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wide">Gratitude Jar</h3>
            <p className="text-[8.5px] text-[#608271]/85 mt-0.5 leading-tight">Drop and draw warm memories.</p>
          </div>
        </button>

        {/* Thought Reframer */}
        <button
          onClick={() => onNavigate('reframing')}
          className="bg-amber-600/5 hover:bg-amber-600/10 border border-amber-600/10 text-amber-700 transition rounded-[24px] p-4 text-left flex flex-col justify-between h-28 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-98 cursor-pointer select-none"
        >
          <div className="bg-amber-600 text-white p-1.5 rounded-full w-fit flex items-center justify-center text-[10px] h-6 w-6">
            🧠
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wide">CBT Reframer</h3>
            <p className="text-[8.5px] text-amber-700/85 mt-0.5 leading-tight">Deconstruct worrying thoughts.</p>
          </div>
        </button>

        {/* Somatic Release */}
        <button
          onClick={() => onNavigate('somatic')}
          className="bg-indigo-650/5 hover:bg-indigo-650/10 border border-indigo-650/10 text-indigo-700 transition rounded-[24px] p-4 text-left flex flex-col justify-between h-28 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-98 cursor-pointer select-none"
        >
          <div className="bg-indigo-600 text-white p-1.5 rounded-full w-fit flex items-center justify-center text-[10px] h-6 w-6">
            ✊
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wide">Somatic Lock</h3>
            <p className="text-[8.5px] text-indigo-700/85 mt-0.5 leading-tight">Progressive muscle relaxer guide.</p>
          </div>
        </button>

        {/* Physiological Basics */}
        <button
          onClick={() => onNavigate('habit')}
          className="bg-sky-600/5 hover:bg-sky-600/10 border border-sky-600/10 text-sky-700 transition rounded-[24px] p-4 text-left flex flex-col justify-between h-28 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-98 cursor-pointer select-none"
        >
          <div className="bg-sky-600 text-white p-1.5 rounded-full w-fit flex items-center justify-center text-[10px] h-6 w-6">
            💧
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wide">Neuro-Vitals</h3>
            <p className="text-[8.5px] text-sky-750/85 mt-0.5 leading-tight">Verify hydration, Sunlight & rest.</p>
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
}

export const SimulatorGrounding: React.FC<GroundingProps> = ({ onTriggerDebug }) => {
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
      <div className="text-center mt-3 shrink-0 select-none">
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
interface EmergencyProps {
  onNavigate?: (route: ActiveScreen) => void;
}

export const SimulatorEmergency: React.FC<EmergencyProps> = ({ onNavigate }) => {
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
    <div className="flex flex-col h-full bg-[#F1F5F2] p-5 justify-between overflow-y-auto no-scrollbar">
      {/* Title */}
      <div className="text-center mt-3 shrink-0">
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
                <span className="text-[8.5px] font-bold uppercase tracking-widest text-[#A5B4FC] block leading-none">Stanley-Brown Protocol</span>
                <h3 className="text-xs font-black mt-1">Shield of Safety Builder</h3>
                <p className="text-[9.5px] text-[#C7D2FE] mt-0.5 leading-tight">Create your custom crisis plan step-by-step.</p>
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

// ============================================================================
// 6. HISTORICAL LOGS SCREEN
// ============================================================================
interface HistoryProps {
  moodHistory: MoodLogEntry[];
  onNavigate: (route: ActiveScreen) => void;
  resetMoodData: () => void;
  seedRandomData: () => void;
}

export const SimulatorHistory: React.FC<HistoryProps> = ({
  moodHistory,
  onNavigate,
  resetMoodData,
  seedRandomData,
}) => {
  const [historyTab, setHistoryTab] = useState<'monthly' | 'weekly'>('monthly');
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(2); // Default to June

  const MONTHS_CONFIG = [
    { key: '04', label: 'April 2026', days: 30, offset: 3, name: 'April' },
    { key: '05', label: 'May 2026', days: 31, offset: 5, name: 'May' },
    { key: '06', label: 'June 2026', days: 30, offset: 1, name: 'June' },
  ];

  const currentMonth = MONTHS_CONFIG[selectedMonthIdx];

  // Seed 30/31 days with a clean calendar dataset
  const getSeededMonthlyData = () => {
    const data: Record<string, { moodValue: number; moodLabel: string; stress: number; hasData: boolean }> = {};
    
    const seedForMonth = (monthStr: string, totalDays: number, monthNum: number) => {
      for (let day = 1; day <= totalDays; day++) {
        const dateKey = `2026-${monthStr}-${day.toString().padStart(2, '0')}`;
        
        // Seed some days with data, some without
        const pseudoRandom = Math.sin(day * 13 + monthNum * 37) * 10000;
        const val = pseudoRandom - Math.floor(pseudoRandom);
        const hasData = val > 0.35; // ~65% check-in
        
        if (hasData) {
          const stress = Math.floor((val * 99) % 9) + 1; // 1 to 9
          let emoji = '🍃';
          if (stress <= 3) emoji = '🍃';
          else if (stress <= 5) emoji = '🌊';
          else if (stress <= 7) emoji = '⛈️';
          else emoji = '😰';

          data[dateKey] = {
            moodValue: 1,
            moodLabel: emoji,
            stress,
            hasData: true
          };
        } else {
          data[dateKey] = {
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

  // Selected Day state in the calendar grid (default to 13th)
  const [selectedDay, setSelectedDay] = useState<number>(13);

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

  // Merge check-in data. Sync today's date "June 13" from live props
  const getDayDetails = (monthKey: string, dayNum: number) => {
    const dateKey = `2026-${monthKey}-${dayNum.toString().padStart(2, '0')}`;
    
    if (monthKey === '06' && dayNum === 13) {
      const todayLog = moodHistory.find(h => h.day === 'Today');
      if (todayLog) {
        return {
          hasData: todayLog.hasData,
          moodValue: todayLog.moodValue,
          moodLabel: todayLog.moodLabel,
          stress: todayLog.stress,
        };
      }
    }

    return monthlyData[dateKey] || { hasData: false, moodValue: 0, moodLabel: 'No Data', stress: 5 };
  };

  // Mutator to update specific day entries
  const handleUpdateDay = (dayNum: number, fields: Partial<{ moodValue: number; moodLabel: string; stress: number; hasData: boolean }>) => {
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
    : '5.0';

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
        <span className="text-[9px] font-black leading-none">{d}</span>
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

  return (
    <div className="flex flex-col h-full bg-[#F1F5F2] p-5 justify-between overflow-y-auto">
      <div className="flex flex-col flex-1">
        {/* Header Navigation */}
        <div className="flex items-center space-x-2.5 mt-3 mb-3 shrink-0">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-1 px-1.5 rounded-xl hover:bg-slate-200 active:scale-90 text-slate-500 transition cursor-pointer border-0 mr-1"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="text-left select-none flex-1">
            <span className="text-[9px] font-extrabold text-[#4A6741] uppercase tracking-widest bg-[#E1E8E3] px-2 py-0.5 rounded">HISTORY</span>
            <h2 className="text-sm font-bold text-slate-800 mt-1 leading-none">Nervous System Diary</h2>
          </div>
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
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-slate-700">{item.day === 'Today' ? 'Today' : item.day}</span>
                        {item.hasData ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border bg-[#EBF2EC] border-[#A8C69F]/40 text-[#4A6741]">
                            Feel: {extractEmoji(item.moodLabel, item.moodValue)}
                          </span>
                        ) : (
                          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full border bg-slate-50 border-slate-100 text-slate-400">
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
                            style={{ width: `${item.hasData ? item.stress * 10 : 50}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-mono font-bold text-slate-500">
                          Stress: {item.hasData ? `${item.stress}/10` : '— (5/10)'}
                        </span>
                      </div>
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
            <div className="bg-white rounded-2xl p-3 border border-white shadow-xs flex-1 flex flex-col justify-between text-left min-h-[140px] max-h-[165px] select-none">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[9px] uppercase tracking-widest font-extrabold text-slate-400 leading-none">
                    {currentMonth.name} {selectedDay}, 2026
                  </span>
                  {selectedDayHasData ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-[#EBF2EC] border-[#A8C69F]/40 text-[#4A6741]">
                      Feel: {extractEmoji(selectedDayData.moodLabel, selectedDayData.moodValue)}
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border bg-slate-50 border-slate-200 text-slate-400">
                      No Check-In
                    </span>
                  )}
                </div>

                {!selectedDayHasData ? (
                  <div className="flex flex-col justify-center flex-1 py-1">
                    <p className="text-[10px] text-slate-500 leading-normal">
                      No track records logged for this date. Defaulting to standard baseline state.
                    </p>
                    <div className="flex items-center space-x-1.5 mt-2 bg-slate-50 border border-slate-100 p-2 rounded-xl">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                      <span className="text-[10px] text-slate-400">Stress Value: <span className="font-bold">5/10</span> (Open Circle)</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-slate-50 py-1.5 px-2 rounded-xl">
                      <span className="text-[10px] text-slate-500">Tracked Stress Level</span>
                      <span className="text-[11px] font-mono font-black text-[#4A6741]">{selectedDayData.stress}/10</span>
                    </div>
                    
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          selectedDayData.stress > 7 
                            ? 'bg-rose-400' 
                            : selectedDayData.stress > 4 
                              ? 'bg-amber-400' 
                              : 'bg-emerald-400'
                        }`}
                        style={{ width: `${selectedDayData.stress * 10}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Day item custom checks toggling/mutations */}
              <div className="mt-2 text-center pt-2 border-t border-slate-100 flex items-center justify-between shrink-0">
                {!selectedDayHasData ? (
                  <button
                    onClick={() => handleUpdateDay(selectedDay, { hasData: true, moodLabel: '🍃', stress: 5 })}
                    className="w-full bg-[#E1E8E3] hover:bg-[#D1DBCF] active:scale-95 text-[#4A6741] font-bold text-[9px] py-1.5 rounded-xl cursor-pointer border-0 transition"
                  >
                    ➕ Record Retrospective Check-In
                  </button>
                ) : (
                  <div className="flex items-center justify-between w-full space-x-2">
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => handleUpdateDay(selectedDay, { stress: Math.max(1, selectedDayData.stress - 1) })}
                        className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-90 flex items-center justify-center font-bold text-slate-600 font-mono text-xs cursor-pointer border-0 select-none pb-0.5"
                        title="Decrease Stress"
                      >
                        -
                      </button>
                      <span className="text-[9px] font-bold text-slate-500 shrink-0 font-mono">Stress</span>
                      <button 
                        onClick={() => handleUpdateDay(selectedDay, { stress: Math.min(10, selectedDayData.stress + 1) })}
                        className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-90 flex items-center justify-center font-bold text-slate-600 font-mono text-xs cursor-pointer border-0 select-none pb-0.5"
                        title="Increase Stress"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex space-x-1">
                      {selectableEmojis.map((emoji) => {
                        const isCurrent = selectedDayData.moodLabel === emoji;
                        return (
                          <button
                            key={emoji}
                            onClick={() => handleUpdateDay(selectedDay, { moodLabel: emoji })}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition cursor-pointer border-0 ${
                              isCurrent ? 'bg-[#E1E8E3]/80 ring-1 ring-[#4A6741]' : 'bg-slate-50 hover:bg-slate-100'
                            }`}
                            title="Mark Feel"
                          >
                            {emoji}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => handleUpdateDay(selectedDay, { hasData: false, moodValue: 0, stress: 5 })}
                        className="w-6 h-6 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-[10px] text-red-500 cursor-pointer border-0"
                        title="Clear check-in"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )}
              </div>
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

// ============================================================================
// 6. PROCEDURAL AMBIENT SOUNDSCAPE GENERATOR MIXER
// ============================================================================
interface SoundscapeProps {
  onBack: () => void;
}

export const SimulatorSoundscape: React.FC<SoundscapeProps> = ({ onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState(0.7);

  const [channels, setChannels] = useState<Record<string, { active: boolean; volume: number }>>(() => {
    const saved = localStorage.getItem('safespace_sound_mix');
    return saved ? JSON.parse(saved) : {
      rain: { active: false, volume: 0.5 },
      waves: { active: false, volume: 0.5 },
      wind: { active: false, volume: 0.4 },
      crickets: { active: false, volume: 0.3 },
      bowl: { active: false, volume: 0.5 },
      brownNoise: { active: false, volume: 0.4 },
    };
  });

  const PRESETS = [
    {
      name: 'Forest Rain',
      icon: '🌧️',
      mix: {
        rain: { active: true, volume: 0.65 },
        waves: { active: false, volume: 0.3 },
        wind: { active: true, volume: 0.35 },
        crickets: { active: true, volume: 0.25 },
        bowl: { active: false, volume: 0.3 },
        brownNoise: { active: false, volume: 0.3 },
      }
    },
    {
      name: 'Zen Sanctum',
      icon: '🥣',
      mix: {
        rain: { active: false, volume: 0.3 },
        waves: { active: false, volume: 0.3 },
        wind: { active: true, volume: 0.25 },
        crickets: { active: false, volume: 0.2 },
        bowl: { active: true, volume: 0.75 },
        brownNoise: { active: true, volume: 0.4 },
      }
    },
    {
      name: 'Ocean Swell',
      icon: '🌊',
      mix: {
        rain: { active: false, volume: 0.3 },
        waves: { active: true, volume: 0.75 },
        wind: { active: true, volume: 0.5 },
        crickets: { active: false, volume: 0.2 },
        bowl: { active: false, volume: 0.3 },
        brownNoise: { active: false, volume: 0.3 },
      }
    },
    {
      name: 'Deep Sleep',
      icon: '🌙',
      mix: {
        rain: { active: true, volume: 0.3 },
        waves: { active: false, volume: 0.3 },
        wind: { active: false, volume: 0.2 },
        crickets: { active: false, volume: 0.2 },
        bowl: { active: false, volume: 0.3 },
        brownNoise: { active: true, volume: 0.8 },
      }
    },
  ];

  useEffect(() => {
    localStorage.setItem('safespace_sound_mix', JSON.stringify(channels));
  }, [channels]);

  // Synchronise soundscape engines with play/pause and user selections
  useEffect(() => {
    if (isPlaying) {
      Object.entries(channels).forEach(([chId, chState]: [string, any]) => {
        setSoundscapeChannel(chId as any, chState.active, chState.volume);
      });
      setMasterSoundscapeVolume(masterVolume);
    } else {
      stopAllSoundscapeChannels();
    }
    return () => {
      // Don't stop on regular re-render, only on full unmount
    };
  }, [isPlaying, channels]);

  // Sync Master Volume shifts instantly
  useEffect(() => {
    setMasterSoundscapeVolume(masterVolume);
  }, [masterVolume]);

  const handleToggleChannel = (chId: string) => {
    const isNowActive = !channels[chId].active;
    setChannels(prev => ({
      ...prev,
      [chId]: { ...prev[chId], active: isNowActive }
    }));
    if (isNowActive && !isPlaying) {
      setIsPlaying(true);
    }
  };

  const handleChannelVolumeChange = (chId: string, value: number) => {
    setChannels(prev => ({
      ...prev,
      [chId]: { ...prev[chId], volume: value }
    }));
    if (isPlaying && channels[chId].active) {
      setSoundscapeChannelVolume(chId, value);
    }
  };

  const loadPreset = (presetMix: any) => {
    setChannels(presetMix);
    setIsPlaying(true);
  };

  const handleStopAll = () => {
    setIsPlaying(false);
    stopAllSoundscapeChannels();
    setChannels(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(k => {
        updated[k] = { ...updated[k], active: false };
      });
      return updated;
    });
  };

  const anyActive = Object.values(channels).some((ch: any) => ch.active);

  const CHANNEL_DETAILS = [
    { id: 'rain', name: 'Summer Rain', icon: '🌧️', desc: 'Procedural warm pitter patter drops' },
    { id: 'waves', name: 'Ocean Swell', icon: '🌊', desc: 'LFO swept continuous rolling tidal sweeps' },
    { id: 'wind', name: 'Forest Wind', icon: '🌬️', desc: 'Generative air whistletones' },
    { id: 'crickets', name: 'Night Insects', icon: '🦗', desc: 'Pulsed analog-style organic shimmer and chirp series' },
    { id: 'bowl', name: 'Singing Bowl', icon: '🥣', desc: 'Tibetan modal sinus beating harmonics' },
    { id: 'brownNoise', name: 'Deep Sleep Drone', icon: '🟤', desc: 'Lowpass brown noise deep background rumble' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F1F5F2] p-5 justify-between overflow-y-auto select-none no-scrollbar">
      
      {/* Header bar and back button */}
      <div className="flex items-center justify-between mt-3 mb-2 shrink-0">
        <button
          onClick={() => {
            onBack();
          }}
          className="text-[#4A6741] hover:bg-[#E1E8E3] rounded-full p-1.5 transition border-0 bg-transparent cursor-pointer flex items-center justify-center"
          title="Back to Dashboard"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Offline Synthesizer</span>
        <div className="w-8 h-8" />
      </div>

      {/* Main Title */}
      <div className="text-center mb-3 shrink-0">
        <h2 className="text-xl font-bold text-[#4A6741] leading-tight font-sans">Soundscapes</h2>
        <p className="text-[11px] text-slate-500 mt-1">
          Mix customized nature streams generated entirely on-device with zero network latency.
        </p>
      </div>

      {/* Hero Sound Console Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 shadow-2xs border border-white/60 flex flex-col items-center shrink-0 mb-3.5">
        
        {/* Breathing audio ring indicators */}
        <div className="relative flex items-center justify-center w-20 h-20 mb-3.5 select-none">
          <div className={`absolute inset-0 rounded-full bg-[#4A6741]/15 ${isPlaying && anyActive ? 'animate-ping opacity-25' : 'opacity-0'} transition-all`} style={{ animationDuration: '3.5s' }} />
          <div className="absolute inset-1.5 rounded-full bg-white border border-[#A8C69F]/30 flex items-center justify-center shadow-xs">
            <Music size={26} className={`${isPlaying && anyActive ? 'text-[#4A6741] animate-spin' : 'text-slate-300'}`} style={{ animationDuration: '10s' }} />
          </div>
        </div>

        {/* Console buttons */}
        <div className="w-full flex flex-col space-y-3 pb-0.5">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => {
                if (isPlaying) {
                  setIsPlaying(false);
                } else {
                  // If none active, turn on Rain as a beautiful default
                  const activeCount = Object.values(channels).filter((c: any) => c.active).length;
                  if (activeCount === 0) {
                    setChannels(prev => ({
                      ...prev,
                      rain: { active: true, volume: 0.5 },
                      bowl: { active: true, volume: 0.4 },
                    }));
                  }
                  setIsPlaying(true);
                }
              }}
              className={`px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-wider flex items-center justify-center transition shadow-xs cursor-pointer border-0 ${
                isPlaying && anyActive
                  ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
                  : 'bg-[#4A6741] hover:bg-[#3D5535] text-white'
              }`}
            >
              <span>{isPlaying && anyActive ? '⏸️ Mute Synthesizer' : '▶️ Play Soundscape'}</span>
            </button>

            {(isPlaying || anyActive) && (
              <button
                onClick={handleStopAll}
                className="bg-red-50 hover:bg-red-100 text-red-600 text-[9px] font-black uppercase tracking-wider px-4 py-2 rounded-full transition cursor-pointer border-0"
              >
                Reset Mixer ✕
              </button>
            )}
          </div>

          {/* Master slider */}
          <div className="bg-slate-50/50 p-2 rounded-xl border border-slate-100 flex items-center space-x-3 w-full select-none">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider shrink-0 pl-1">Master Vol</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
              className="accent-[#4A6741] h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer flex-1"
            />
            <span className="text-[10px] font-mono font-bold text-slate-500 w-8 text-right shrink-0 pr-1">
              {Math.round(masterVolume * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Presets Grid */}
      <div className="shrink-0 mb-3 mt-1 select-none">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left block mb-2">Soundscape Presets</span>
        <div className="grid grid-cols-4 gap-1.5">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => loadPreset(preset.mix)}
              className="bg-white/80 hover:bg-[#E1E8E3]/60 border border-white hover:border-[#4A6741]/25 transition p-2.5 rounded-2xl flex flex-col items-center justify-center cursor-pointer text-center space-y-1 scale-100 hover:scale-102"
            >
              <span className="text-base">{preset.icon}</span>
              <span className="text-[8px] font-extrabold text-slate-700 tracking-wide truncate max-w-full">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Multi-Channel Scroll List */}
      <div className="flex-1 flex flex-col space-y-2 overflow-y-auto mb-3 max-h-[310px] no-scrollbar">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left block mb-1">Interactive Mix Layers</span>
        
        {CHANNEL_DETAILS.map((ch) => {
          const state = channels[ch.id];
          const isActive = state ? state.active : false;
          const userVol = state ? state.volume : 0.5;

          return (
            <div
              key={ch.id}
              className={`rounded-2xl p-2.5 border transition flex items-center justify-between gap-3 ${
                isActive 
                  ? 'bg-[#EBF2EC]/70 border-[#4A6741]/40 shadow-2xs' 
                  : 'bg-white/80 border-slate-100/60 hover:border-slate-200/80'
              }`}
            >
              <div className="flex items-center space-x-2.5 text-left min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => handleToggleChannel(ch.id)}
                  className={`text-lg w-9 h-9 rounded-xl flex items-center justify-center border transition select-none cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-white text-[#4A6741] border-[#4A6741] shadow-2xs scale-[1.02] font-black'
                      : 'bg-slate-50 text-slate-400 border-slate-200/50 hover:bg-white'
                  }`}
                  title={isActive ? 'Deactivate layer' : 'Activate layer'}
                >
                  {ch.icon}
                </button>
                <div className="min-w-0">
                  <h4 className="text-[10px] font-black text-slate-800 flex items-center space-x-1.5 leading-none">
                    <span>{ch.name}</span>
                    {isActive && (
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#4A6741] animate-pulse" />
                    )}
                  </h4>
                  <p className="text-[8px] text-slate-400 truncate leading-none mt-1">{ch.desc}</p>
                </div>
              </div>

              {/* Individual Multi-Voice Amplification strip */}
              <div className="flex items-center space-x-2 w-24 shrink-0">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={userVol}
                  onChange={(e) => handleChannelVolumeChange(ch.id, parseFloat(e.target.value))}
                  disabled={!isActive}
                  className={`h-1 rounded-lg appearance-none cursor-pointer flex-1 ${
                    isActive ? 'accent-[#4A6741] bg-slate-200' : 'bg-slate-200 cursor-not-allowed opacity-40'
                  }`}
                />
                <span className={`text-[8px] font-mono font-bold w-5 text-right ${isActive ? 'text-[#4A6741]' : 'text-slate-300'}`}>
                  {isActive ? `${Math.round(userVol * 100)}` : 'OFF'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety Compliance Statement */}
      <div className="shrink-0 pt-3 border-t border-slate-100 flex items-center justify-center gap-1">
        <span className="text-[8px] font-black text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-wider scale-95 font-sans leading-none">Vitals Tuned</span>
        <span className="text-[8.5px] text-slate-400 italic font-medium leading-none">
          Custom analog wave synthesis; 0% cellular data usage
        </span>
      </div>

    </div>
  );
};
