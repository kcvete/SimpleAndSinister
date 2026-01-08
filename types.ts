export enum ExerciseType {
  SWING = 'SWING',
  TGU = 'TGU', // Turkish Get Up
  WARMUP = 'WARMUP'
}

export interface ExerciseLog {
  id: string;
  type: ExerciseType;
  name: string;
  weight: number; // in kg
  reps: number;
  sets: number;
  completed: boolean;
  notes?: string;
}

export interface DailyWorkout {
  date: string; // ISO date string YYYY-MM-DD
  exercises: ExerciseLog[];
  completed: boolean;
  durationMinutes?: number;
}

export interface UserSettings {
  defaultSwingWeight: number;
  defaultTGUWeight: number;
  weightUnit: 'kg' | 'lbs';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
