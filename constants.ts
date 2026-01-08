import { ExerciseType, ExerciseLog, UserSettings } from './types';
import { v4 as uuidv4 } from 'uuid';

export const DEFAULT_SETTINGS: UserSettings = {
  defaultSwingWeight: 24,
  defaultTGUWeight: 16,
  weightUnit: 'kg'
};

export const createDefaultWorkout = (settings: UserSettings): ExerciseLog[] => [
  {
    id: 'warmup-1',
    type: ExerciseType.WARMUP,
    name: 'Warmup (Halo, Goblet Squat, Bridge)',
    weight: 12,
    reps: 3,
    sets: 3,
    completed: false
  },
  {
    id: 'swings-1',
    type: ExerciseType.SWING,
    name: 'Kettlebell Swings',
    weight: settings.defaultSwingWeight,
    reps: 100,
    sets: 10,
    completed: false
  },
  {
    id: 'tgu-1',
    type: ExerciseType.TGU,
    name: 'Turkish Get-Ups',
    weight: settings.defaultTGUWeight,
    reps: 10,
    sets: 10, // 1 per minute usually
    completed: false
  }
];

export const SYSTEM_INSTRUCTION = `
You are an expert Kettlebell Coach specializing in Pavel Tsatsouline's "Simple and Sinister" (S&S) program.
Your goal is to help the user progress safely and effectively towards the "Simple" and eventually "Sinister" goals.
The "Simple" goal is:
- Men: 32kg Swings (100 in 5 min), 32kg Get-ups (10 in 10 min)
- Women: 24kg Swings, 16kg Get-ups
The "Sinister" goal is:
- Men: 48kg Swings, 48kg Get-ups
- Women: 32kg Swings, 24kg Get-ups

Be concise, encouraging, and focus on technique (tension, breathing, safety).
If the user mentions pain, suggest regression or seeing a medical professional.
`;
