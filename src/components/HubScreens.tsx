import React, { useState } from 'react';
import { 
  Leaf, 
  Compass, 
  BookOpen, 
  Phone, 
  ArrowLeft, 
  Music, 
  Zap, 
  Shield, 
  Activity, 
  Eye, 
  Smile, 
  Sparkles, 
  Brain, 
  Info,
  Star,
  Wind
} from 'lucide-react';
import { ActiveScreen } from '../types';
import { getFavoriteToolIds, toggleFavoriteToolId } from '../utils/toolsData';

interface HubProps {
  onNavigate: (route: ActiveScreen) => void;
  onBack?: () => void;
}

// ---------------------------------------------------------
// 1. SOMATIC / BODY RESET HUB
// ---------------------------------------------------------
export const SimulatorSomaticHub: React.FC<HubProps> = ({ onNavigate, onBack }) => {
  const [favoriteIds, setFavoriteIds] = useState<ActiveScreen[]>(() => getFavoriteToolIds());

  const handleToggleFavorite = (id: ActiveScreen, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteToolId(id);
    setFavoriteIds(getFavoriteToolIds());
  };

  const tools = [
    {
      id: 'breathing' as ActiveScreen,
      name: 'Guided Breathing',
      desc: 'Box and 4-7-8 deep breathing rhythms with peaceful pacing helpers.',
      icon: <Leaf size={16} className="text-emerald-700" />,
      bg: 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100/50',
      tag: 'Gentle Breathe',
    },
    {
      id: 'grounding' as ActiveScreen,
      name: 'Sensory Grounding',
      desc: 'A simple 5-4-3-2-1 sequence and warm check-ins to feel grounded.',
      icon: <Compass size={16} className="text-teal-700" />,
      bg: 'bg-teal-50 border-teal-100 hover:bg-teal-100/50',
      tag: 'Grounding Help',
    },
    {
      id: 'vagusHacks' as ActiveScreen,
      name: 'Vagus Nerve Resets',
      desc: 'Simple nerve holds, jaw releases, and gentle breath pressures to settle.',
      icon: <Zap size={16} className="text-amber-700" />,
      bg: 'bg-amber-50 border-amber-100 hover:bg-amber-100/50',
      tag: 'Gentle Soothe',
    },
    {
      id: 'somatic' as ActiveScreen,
      name: 'Somatic Muscle Relax',
      desc: 'A progressive tension-and-release sequence to ease physical tightness.',
      icon: <Activity size={16} className="text-indigo-700" />,
      bg: 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100/50',
      tag: 'Body Release',
    },
    {
      id: 'emdr' as ActiveScreen,
      name: 'EMDR Eye Pacer',
      desc: 'A steady visual pacer to help quiet your thoughts and find steady focus.',
      icon: <Eye size={16} className="text-sky-700" />,
      bg: 'bg-sky-50 border-sky-100 hover:bg-sky-100/50',
      tag: 'Visual Pacer',
    },
    {
      id: 'habit' as ActiveScreen,
      name: 'Everyday Basics',
      desc: 'A quick, simple checklist to check in on rest, water, and sunlight.',
      icon: <Activity size={16} className="text-sky-700" />,
      bg: 'bg-sky-50 border-sky-100 hover:bg-sky-100/55',
      tag: 'Basics Check',
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#F1F5F2] p-5 overflow-y-auto select-none">
      {/* Header */}
      <div className="flex items-center space-x-2.5 mb-5 relative">
        {onBack && (
          <button 
            type="button"
            onClick={onBack}
            className="p-1 px-1.5 rounded-xl hover:bg-[#E1E8E3] text-[#4A6741] transition active:scale-95 cursor-pointer border-0 bg-transparent flex items-center justify-center shrink-0"
          >
            <ArrowLeft size={16} className="stroke-[2.5]" />
          </button>
        )}
        <div className="text-left">
          <span className="text-[9px] font-black tracking-widest text-[#4A6741] uppercase">Restful Regulation</span>
          <h2 className="text-base font-black text-slate-800 leading-none mt-1">Somatic & Body Hub</h2>
        </div>
      </div>

      <div className="bg-white/80 p-3.5 rounded-3xl border border-white/60 shadow-xs text-left mb-4">
        <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
          These gentle offline exercises help you connect with your body, pause for a moment, and discover your natural physical center of calm.
        </p>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 gap-2.5 mb-6">
        {tools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => onNavigate(tool.id)}
            className={`flex items-start space-x-3 p-3.5 rounded-[22px] border text-left transition duration-200 cursor-pointer shadow-xs select-none ${tool.bg} active:scale-99 relative`}
          >
            <div className="bg-white p-2.5 rounded-2xl shadow-xs shrink-0 flex items-center justify-center">
              {tool.icon}
            </div>
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-start justify-between">
                <h3 className="text-xs font-bold text-slate-800 leading-snug flex-1 pr-1.5">{tool.name}</h3>
                <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border shrink-0 hub-tool-tag">
                  {tool.tag}
                </span>
              </div>
              <p className="text-[9px] text-slate-500 mt-1 leading-snug">{tool.desc}</p>
            </div>
            <button
              type="button"
              onClick={(e) => handleToggleFavorite(tool.id, e)}
              className="absolute bottom-2.5 right-3 p-1 hover:bg-slate-200/40 rounded-lg transition text-amber-500 cursor-pointer border-0 bg-transparent flex items-center justify-center shrink-0"
              title={favoriteIds.includes(tool.id) ? "Remove from favorites" : "Add to favorites"}
            >
              <Star size={12} className={favoriteIds.includes(tool.id) ? "fill-amber-400 text-amber-400" : "text-slate-350"} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


// ---------------------------------------------------------
// 2. COGNITIVE / CBT / MIND HUB
// ---------------------------------------------------------
export const SimulatorCbtHub: React.FC<HubProps> = ({ onNavigate, onBack }) => {
  const [favoriteIds, setFavoriteIds] = useState<ActiveScreen[]>(() => getFavoriteToolIds());

  const handleToggleFavorite = (id: ActiveScreen, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteToolId(id);
    setFavoriteIds(getFavoriteToolIds());
  };

  const tools = [
    {
      id: 'dbt' as ActiveScreen,
      name: 'Interactive DBT Skills',
      desc: 'Quick, high-comfort Dialectical Behavior Therapy skills built to help you when emotionally activated.',
      icon: <Sparkles size={16} className="text-purple-700" />,
      bg: 'bg-purple-50/70 border-purple-100 hover:bg-purple-100/50',
      tag: 'DBT Crisis Aid',
    },
    {
      id: 'reframing' as ActiveScreen,
      name: 'Thought Reframer',
      desc: 'A friendly guided space to find perspective and gently ease worrying thoughts.',
      icon: <Brain size={16} className="text-emerald-705" />,
      bg: 'bg-[#FAF8F5] border-[#F2ECE4] hover:bg-[#F2ECE4]/50',
      tag: 'CBT Perspective',
    },
    {
      id: 'worryBox' as ActiveScreen,
      name: 'Worry Lockbox',
      desc: 'A warm, private space to write down worries and let them rest for later.',
      icon: <Smile size={16} className="text-amber-600" />,
      bg: 'bg-amber-50/50 border-amber-100 hover:bg-amber-100/40',
      tag: 'Postpone Worry',
    },
    {
      id: 'emotionWheel' as ActiveScreen,
      name: 'Emotion Journal',
      desc: 'Explore and name your feelings step-by-step in a private, gentle journal.',
      icon: <BookOpen size={16} className="text-rose-600" />,
      bg: 'bg-rose-50 border-rose-100 hover:bg-rose-100/50',
      tag: 'Explore Feelings',
    },
    {
      id: 'relief' as ActiveScreen,
      name: 'Coping Words',
      desc: 'Comforting, reassuring phrases to read and recall whenever you need them.',
      icon: <BookOpen size={16} className="text-[#4A6741]" />,
      bg: 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100/60',
      tag: 'Comfort & Ease',
    },
    {
      id: 'gratitude' as ActiveScreen,
      name: 'Gratitude Jar',
      desc: 'Write down small moments of joy and kindness to look back on.',
      icon: <Sparkles size={16} className="text-[#608271]" />,
      bg: 'bg-[#F2F8F5] border-[#DCEBE2] hover:bg-[#DCEBE2]/60',
      tag: 'Warm Affirmations',
    },
    {
      id: 'habit' as ActiveScreen,
      name: 'Everyday Basics',
      desc: 'A quick, simple checklist to check in on rest, water, and sunlight.',
      icon: <Activity size={16} className="text-sky-700" />,
      bg: 'bg-sky-50 border-sky-100 hover:bg-sky-100/55',
      tag: 'Basics Check',
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#F1F5F2] p-5 overflow-y-auto select-none">
      {/* Header */}
      <div className="flex items-center space-x-2.5 mb-5 relative">
        {onBack && (
          <button 
            type="button"
            onClick={onBack}
            className="p-1 px-1.5 rounded-xl hover:bg-[#E1E8E3] text-[#4A6741] transition active:scale-95 cursor-pointer border-0 bg-transparent flex items-center justify-center shrink-0"
          >
            <ArrowLeft size={16} className="stroke-[2.5]" />
          </button>
        )}
        <div className="text-left">
          <span className="text-[9px] font-black tracking-widest text-[#4A6741] uppercase">Mind & Thoughts</span>
          <h2 className="text-base font-black text-slate-800 leading-none mt-1">CBT & Mind Hub</h2>
        </div>
      </div>

      <div className="bg-white/80 p-3.5 rounded-3xl border border-white/60 shadow-xs text-left mb-4">
        <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
          Thought exercises help you pause spiraling fears, set aside future concerns, and bring your mind back to a place of comfort and clarity.
        </p>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 gap-2.5 mb-6">
        {tools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => onNavigate(tool.id)}
            className={`flex items-start space-x-3 p-3.5 rounded-[22px] border text-left transition duration-200 cursor-pointer shadow-xs select-none ${tool.bg} active:scale-99 relative`}
          >
            <div className="bg-white p-2.5 rounded-2xl shadow-xs shrink-0 flex items-center justify-center">
              {tool.icon}
            </div>
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-start justify-between">
                <h3 className="text-xs font-bold text-slate-800 leading-snug flex-1 pr-1.5">{tool.name}</h3>
                <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border shrink-0 hub-tool-tag">
                  {tool.tag}
                </span>
              </div>
              <p className="text-[9px] text-slate-500 mt-1 leading-snug">{tool.desc}</p>
            </div>
            <button
              type="button"
              onClick={(e) => handleToggleFavorite(tool.id, e)}
              className="absolute bottom-2.5 right-3 p-1 hover:bg-slate-200/40 rounded-lg transition text-amber-500 cursor-pointer border-0 bg-transparent flex items-center justify-center shrink-0"
              title={favoriteIds.includes(tool.id) ? "Remove from favorites" : "Add to favorites"}
            >
              <Star size={12} className={favoriteIds.includes(tool.id) ? "fill-amber-400 text-amber-400" : "text-slate-350"} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


// ---------------------------------------------------------
// 3. SAFETY / SOS HUB
// ---------------------------------------------------------
export const SimulatorSafetyHub: React.FC<HubProps> = ({ onNavigate, onBack }) => {
  const [favoriteIds, setFavoriteIds] = useState<ActiveScreen[]>(() => getFavoriteToolIds());

  const handleToggleFavorite = (id: ActiveScreen, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteToolId(id);
    setFavoriteIds(getFavoriteToolIds());
  };

  const tools = [
    {
      id: 'panicSOS' as ActiveScreen,
      name: 'Calm Rescue Space',
      desc: 'A simple, direct pace-helper that provides deep soothing tones and reassuring visual guidance.',
      icon: <Wind size={16} className="text-[#3b5b7b]" />,
      bg: 'bg-[#f0f4f8] border-[#d9e2ec] hover:bg-[#e1e8f0]/60 text-slate-800',
      textColor: 'text-slate-800',
      descColor: 'text-slate-500',
      tag: '🌬️ Calm Space',
    },
    {
      id: 'safetyPlan' as ActiveScreen,
      name: 'Comfort Safety Plan',
      desc: 'A custom safety blueprint based on standard, helpful steps to keep you safe and cared for.',
      icon: <Shield size={16} className="text-[#4A6741]" />,
      bg: 'bg-emerald-50 border-emerald-100 hover:bg-[#E1E8E3]/60 text-slate-800',
      textColor: 'text-slate-800',
      descColor: 'text-slate-500',
      tag: '🛡️ Safety Plan',
    },
    {
      id: 'emergency' as ActiveScreen,
      name: 'Support & Helpline Contacts',
      desc: 'Immediate, easy access to supportive helplines, text services, and caring peer advocates loaded offline.',
      icon: <Phone size={16} className="text-[#6b5b95]" />,
      bg: 'bg-[#f4effa] border-[#e9defe] hover:bg-[#ede4f8] text-slate-800',
      textColor: 'text-slate-800',
      descColor: 'text-slate-500',
      tag: '📞 Get Support',
    },
    {
      id: 'resources' as ActiveScreen,
      name: 'Mental Health Resource Links',
      desc: 'Direct web access to trusted global mental health organizations, educational guides, and screening tools.',
      icon: <BookOpen size={16} className="text-indigo-650" />,
      bg: 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100/50 text-slate-800',
      textColor: 'text-slate-800',
      descColor: 'text-slate-500',
      tag: '🌐 Web Links',
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#F5F8F6] p-5 overflow-y-auto select-none">
      {/* Header */}
      <div className="flex items-center space-x-2.5 mb-5 relative">
        {onBack && (
          <button 
            type="button"
            onClick={onBack}
            className="p-1 px-1.5 rounded-xl hover:bg-[#E1E8E3] text-[#4A6741] transition active:scale-95 cursor-pointer border-0 bg-transparent flex items-center justify-center shrink-0"
          >
            <ArrowLeft size={16} className="stroke-[2.5]" />
          </button>
        )}
        <div className="text-left">
          <span className="text-[9px] font-black tracking-widest text-[#4A6741] uppercase">Comfort & Support Backup</span>
          <h2 className="text-base font-black text-slate-800 leading-none mt-1">Support Hub</h2>
        </div>
      </div>

      <div className="bg-white/80 p-3.5 rounded-3xl border border-[#CBD9CC]/50 shadow-sm text-left mb-4">
        <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
          These resources are here to support you in difficult moments. If you are feeling overwhelmed, take a slow breath. You are safe here.
        </p>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 gap-3.5 mb-6">
        {tools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => onNavigate(tool.id)}
            className={`flex items-start space-x-3.5 p-4 rounded-[22px] border text-left transition duration-200 cursor-pointer shadow-sm select-none ${tool.bg} active:scale-99 relative`}
          >
            <div className="bg-white p-2.5 rounded-2xl shadow-xs shrink-0 flex items-center justify-center">
              {tool.icon}
            </div>
            <div className="flex-1 min-w-0 pr-6 text-left">
              <div className="flex items-start justify-between">
                <h3 className={`text-xs font-black leading-snug flex-1 pr-1.5 ${tool.textColor}`}>{tool.name}</h3>
                <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border shrink-0 hub-tool-tag">
                  {tool.tag}
                </span>
              </div>
              <p className={`text-[9.5px] mt-1.5 leading-snug ${tool.descColor}`}>{tool.desc}</p>
            </div>
            <button
              type="button"
              onClick={(e) => handleToggleFavorite(tool.id, e)}
              className="absolute bottom-2.5 right-3 p-1 hover:bg-white/40 rounded-lg transition text-amber-400 cursor-pointer border-0 bg-transparent flex items-center justify-center shrink-0"
              title={favoriteIds.includes(tool.id) ? "Remove from favorites" : "Add to favorites"}
            >
              <Star 
                size={12} 
                className={favoriteIds.includes(tool.id) ? "fill-[#F59E0B] text-[#F59E0B]" : "text-slate-300"} 
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
