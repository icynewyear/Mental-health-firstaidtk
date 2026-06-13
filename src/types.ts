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

export type ActiveScreen = 'dashboard' | 'breathing' | 'grounding' | 'relief' | 'emergency';
export type BreathingType = 'box' | 'calm'; // Box: 4-4-4-4, Calm (4-7-8)
