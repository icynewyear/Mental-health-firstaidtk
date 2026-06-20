export interface CodeFile {
  name: string;
  path: string;
  language: string;
  description: string;
  code: string;
}

export interface CopingStatement {
  id: string;
  text: string;
  category: 'Anxiety' | 'Panic' | 'Grounding' | 'Stress';
  saved: boolean;
}

export interface GroundingStep {
  step: number;
  label: string;
  prompt: string;
  placeholder: string;
  color: string;
  items: string[];
}

export type ActiveScreen = 
  | 'dashboard' 
  | 'breathing' 
  | 'grounding' 
  | 'relief' 
  | 'emergency' 
  | 'history' 
  | 'reframing'
  | 'habit'
  | 'gratitude'
  | 'somatic'
  | 'safetyPlan'
  | 'worryBox'
  | 'emdr'
  | 'emotionWheel'
  | 'vagusHacks'
  | 'panicSOS'
  | 'somaticHub'
  | 'cbtHub'
  | 'safetyHub';

export type BreathingType = 'box' | 'calm' | 'coherent'; // Box: 4-4-4-4, Calm (4-7-8), Coherent (5-5)

export interface MoodLogEntry {
  day: string;
  moodValue: number; // 4: Calm, 3: Steady, 2: Anxious, 1: Panic
  moodLabel: string;
  stress: number;
  hasData?: boolean;
}

export interface ReframedThought {
  id: string;
  negative: string;
  distortion: string;
  rational: string;
  timestamp: string;
}

export interface HabitItem {
  id: string;
  name: string;
  completed: boolean;
  category: string;
  icon: string;
}

export interface GratitudeSlip {
  id: string;
  text: string;
  timestamp: string;
  hue: number;
}

export interface SafetyPlanData {
  warningSigns: string[];
  copingStrategies: string[];
  socialOutlets: string[];
  keySupporters: string[];
  safeEnvironments: string[];
}

