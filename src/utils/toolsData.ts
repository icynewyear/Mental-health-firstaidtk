import { ActiveScreen } from '../types';

export interface ToolDef {
  id: ActiveScreen;
  name: string;
  desc: string;
  tag: string;
  category: 'Somatic' | 'CBT' | 'Safety';
  bg: string;
  iconColor: string;
  textColor?: string;
  descColor?: string;
  tagBg?: string;
}

export const ALL_TOOLS: ToolDef[] = [
  // Somatic
  {
    id: 'breathing',
    name: 'Guided Breathing',
    desc: 'Box and 4-7-8 deep breathing rhythms with peaceful pacing helpers.',
    tag: 'Gentle Breathe',
    category: 'Somatic',
    bg: 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100/50',
    iconColor: 'text-emerald-700'
  },
  {
    id: 'grounding',
    name: 'Sensory Grounding',
    desc: 'A simple 5-4-3-2-1 sequence and warm check-ins to feel grounded.',
    tag: 'Grounding Help',
    category: 'Somatic',
    bg: 'bg-teal-50 border-teal-100 hover:bg-teal-100/50',
    iconColor: 'text-teal-700'
  },
  {
    id: 'vagusHacks',
    name: 'Vagus Nerve Resets',
    desc: 'Simple nerve holds, jaw releases, and gentle breath pressures to settle.',
    tag: 'Gentle Soothe',
    category: 'Somatic',
    bg: 'bg-amber-50 border-amber-100 hover:bg-amber-100/50',
    iconColor: 'text-amber-700'
  },
  {
    id: 'somatic',
    name: 'Somatic Muscle Relax',
    desc: 'A progressive tension-and-release sequence to ease physical tightness.',
    tag: 'Body Release',
    category: 'Somatic',
    bg: 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100/50',
    iconColor: 'text-indigo-700'
  },
  {
    id: 'emdr',
    name: 'EMDR Eye Pacer',
    desc: 'A steady visual pacer to help quiet your thoughts and find steady focus.',
    tag: 'Visual Pacer',
    category: 'Somatic',
    bg: 'bg-sky-50 border-sky-100 hover:bg-sky-100/50',
    iconColor: 'text-sky-700'
  },
  // CBT
  {
    id: 'reframing',
    name: 'Thought Reframer',
    desc: 'A friendly guided space to find perspective and gently ease worrying thoughts.',
    tag: 'CBT Perspective',
    category: 'CBT',
    bg: 'bg-[#FAF8F5] border-[#F2ECE4] hover:bg-[#F2ECE4]/50',
    iconColor: 'text-emerald-600'
  },
  {
    id: 'worryBox',
    name: 'Worry Lockbox',
    desc: 'A warm, private space to write down worries and let them rest for later.',
    tag: 'Postpone Worry',
    category: 'CBT',
    bg: 'bg-amber-50/50 border-amber-100 hover:bg-amber-100/40',
    iconColor: 'text-amber-600'
  },
  {
    id: 'emotionWheel',
    name: 'Emotion Journal',
    desc: 'Explore and name your feelings step-by-step in a private, gentle journal.',
    tag: 'Explore Feelings',
    category: 'CBT',
    bg: 'bg-rose-50 border-rose-100 hover:bg-rose-100/50',
    iconColor: 'text-rose-600'
  },
  {
    id: 'relief',
    name: 'Coping Words',
    desc: 'Comforting, reassuring phrases to read and recall whenever you need them.',
    tag: 'Comfort & Ease',
    category: 'CBT',
    bg: 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100/60',
    iconColor: 'text-[#4A6741]'
  },
  {
    id: 'gratitude',
    name: 'Gratitude Jar',
    desc: 'Write down small moments of joy and kindness to look back on.',
    tag: 'Warm Affirmations',
    category: 'CBT',
    bg: 'bg-[#F2F8F5] border-[#DCEBE2] hover:bg-[#DCEBE2]/60',
    iconColor: 'text-[#608271]'
  },
  {
    id: 'habit',
    name: 'Everyday Basics',
    desc: 'A quick, simple checklist to check in on rest, water, and sunlight.',
    tag: 'Basics Check',
    category: 'CBT',
    bg: 'bg-sky-50 border-sky-100 hover:bg-sky-100/55',
    iconColor: 'text-sky-700'
  },
  // Safety
  {
    id: 'panicSOS',
    name: 'Calm Rescue Space (SOS)',
    desc: 'A simple, direct pace-helper that provides deep soothing tones and reassuring visual guidance.',
    tag: '💗 Calm Space',
    category: 'Safety',
    bg: 'bg-rose-950 border-rose-900 text-rose-100 hover:bg-rose-900/60',
    textColor: 'text-rose-100',
    descColor: 'text-rose-200/80',
    iconColor: 'text-rose-600'
  },
  {
    id: 'safetyPlan',
    name: 'Comfort Safety Plan',
    desc: 'A custom safety blueprint based on standard, helpful steps to keep you safe and cared for.',
    tag: '🛡️ Safety Plan',
    category: 'Safety',
    bg: 'bg-emerald-50 border-emerald-100 hover:bg-[#E1E8E3]/60 text-slate-800',
    textColor: 'text-slate-800',
    descColor: 'text-slate-500',
    iconColor: 'text-[#4A6741]'
  },
  {
    id: 'emergency',
    name: 'Support & Helpline Contacts',
    desc: 'Immediate, easy access to supportive helplines, text services, and caring peer advocates loaded offline.',
    tag: '📞 Get Support',
    category: 'Safety',
    bg: 'bg-rose-50 border-rose-100 hover:bg-rose-100/50 text-slate-800',
    textColor: 'text-slate-800',
    descColor: 'text-slate-500',
    iconColor: 'text-rose-750'
  },
  {
    id: 'resources',
    name: 'Mental Health Resource Links',
    desc: 'Direct web access to trusted global mental health organizations, educational guides, and screening tools.',
    tag: '🌐 Web Resources',
    category: 'Safety',
    bg: 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100/50 text-slate-800',
    textColor: 'text-slate-800',
    descColor: 'text-slate-500',
    iconColor: 'text-indigo-650'
  }
];

// Helper to load favorites from localStorage.
// Fallback: Default to a couple of useful tools (e.g. Guided Breathing, Thought Reframer, Everyday Basics)
export const getFavoriteToolIds = (): ActiveScreen[] => {
  const saved = localStorage.getItem('safespace_favorite_tool_ids_list');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
  }
  return ['breathing', 'reframing', 'habit'];
};

// Helper to save favorites list
export const saveFavoriteToolIds = (ids: ActiveScreen[]) => {
  localStorage.setItem('safespace_favorite_tool_ids_list', JSON.stringify(ids));
  window.dispatchEvent(new Event('safespace_favorites_updated'));
};

// Helper to toggle a tool's favorite status
export const toggleFavoriteToolId = (id: ActiveScreen): boolean => {
  const current = getFavoriteToolIds();
  let updated: ActiveScreen[];
  let isFavoriteNow = false;
  
  if (current.includes(id)) {
    updated = current.filter(x => x !== id);
  } else {
    updated = [...current, id];
    isFavoriteNow = true;
  }
  saveFavoriteToolIds(updated);
  return isFavoriteNow;
};
