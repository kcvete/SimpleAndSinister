import React, { useState } from 'react';
import { ExerciseLog } from '../types';
import { Check, Edit2, X, Save, Dumbbell, Repeat } from 'lucide-react';
import { clsx } from 'clsx';

interface ExerciseInputProps {
  exercise: ExerciseLog;
  onUpdate: (updatedExercise: ExerciseLog) => void;
}

const ExerciseInput: React.FC<ExerciseInputProps> = ({ exercise, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedWeight, setEditedWeight] = useState(exercise.weight);
  const [editedReps, setEditedReps] = useState(exercise.reps);

  const handleToggleComplete = () => {
    onUpdate({ ...exercise, completed: !exercise.completed });
  };

  const handleSave = () => {
    onUpdate({
      ...exercise,
      weight: editedWeight,
      reps: editedReps,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedWeight(exercise.weight);
    setEditedReps(exercise.reps);
    setIsEditing(false);
  };

  return (
    <div className={clsx(
      "relative overflow-hidden rounded-xl border p-4 transition-all duration-300",
      exercise.completed 
        ? "bg-emerald-950/30 border-emerald-900/50" 
        : "bg-slate-900 border-slate-800"
    )}>
      {/* Background Status Indicator */}
      {exercise.completed && (
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <Check size={120} className="text-emerald-500" />
        </div>
      )}

      <div className="relative z-10 flex flex-col gap-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className={clsx("font-bold text-lg", exercise.completed ? "text-emerald-400" : "text-white")}>
              {exercise.name}
            </h3>
            <p className="text-xs text-slate-400">
              {exercise.sets} sets target
            </p>
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Edit"
          >
            {isEditing ? null : <Edit2 size={18} />}
          </button>
        </div>

        {/* Content */}
        {isEditing ? (
          <div className="grid grid-cols-2 gap-4 mt-2 bg-slate-950/50 p-3 rounded-lg border border-slate-700">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 flex items-center gap-1">
                <Dumbbell size={12} /> Weight (kg)
              </label>
              <input
                type="number"
                value={editedWeight}
                onChange={(e) => setEditedWeight(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400 flex items-center gap-1">
                <Repeat size={12} /> Total Reps
              </label>
              <input
                type="number"
                value={editedReps}
                onChange={(e) => setEditedReps(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="col-span-2 flex justify-end gap-2 mt-2">
              <button 
                onClick={handleCancel}
                className="p-1 px-3 rounded text-sm text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm px-4 py-1.5 rounded-full font-medium transition-colors"
              >
                <Save size={14} /> Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-end justify-between mt-1">
            <div className="flex gap-4">
              <div>
                <span className="block text-2xl font-bold tracking-tight text-white">{exercise.weight}<span className="text-sm font-normal text-slate-500 ml-1">kg</span></span>
              </div>
              <div>
                <span className="block text-2xl font-bold tracking-tight text-white">{exercise.reps}<span className="text-sm font-normal text-slate-500 ml-1">reps</span></span>
              </div>
            </div>

            <button
              onClick={handleToggleComplete}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all shadow-lg active:scale-95",
                exercise.completed
                  ? "bg-emerald-600 text-white shadow-emerald-900/20"
                  : "bg-slate-700 text-slate-200 hover:bg-slate-600 shadow-black/20"
              )}
            >
              {exercise.completed ? (
                <>
                  <Check size={18} /> Done
                </>
              ) : (
                "Mark Done"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseInput;
