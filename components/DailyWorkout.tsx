import React, { useEffect, useState } from 'react';
import { DailyWorkout, ExerciseLog, UserSettings } from '../types';
import { createDefaultWorkout } from '../constants';
import ExerciseInput from './ExerciseInput';
import { format } from 'date-fns';
import { Calendar, Flame } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';

interface DailyWorkoutViewProps {
  settings: UserSettings;
}

const DailyWorkoutView: React.FC<DailyWorkoutViewProps> = ({ settings }) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [history, setHistory] = useLocalStorage<Record<string, DailyWorkout>>('ss_history', {});
  const [currentWorkout, setCurrentWorkout] = useState<DailyWorkout | null>(null);

  // Load today's workout or create a new one
  useEffect(() => {
    if (history[today]) {
      setCurrentWorkout(history[today]);
    } else {
      const newWorkout: DailyWorkout = {
        date: today,
        exercises: createDefaultWorkout(settings),
        completed: false
      };
      setCurrentWorkout(newWorkout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today, settings]); // Intentionally not including history to avoid loop, only initial load

  const handleUpdateExercise = (updatedExercise: ExerciseLog) => {
    if (!currentWorkout) return;

    const updatedExercises = currentWorkout.exercises.map(ex => 
      ex.id === updatedExercise.id ? updatedExercise : ex
    );

    const isAllComplete = updatedExercises.every(ex => ex.completed);

    const updatedWorkout = {
      ...currentWorkout,
      exercises: updatedExercises,
      completed: isAllComplete
    };

    setCurrentWorkout(updatedWorkout);
    setHistory(prev => ({
      ...prev,
      [today]: updatedWorkout
    }));
  };

  const completedCount = currentWorkout?.exercises.filter(e => e.completed).length || 0;
  const totalCount = currentWorkout?.exercises.length || 0;
  const progress = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

  if (!currentWorkout) return <div className="p-8 text-center text-slate-500">Loading protocol...</div>;

  return (
    <div className="space-y-6 pb-20">
      {/* Header Section */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Calendar className="text-red-500" size={24} />
          {format(new Date(currentWorkout.date), 'EEEE, MMM do')}
        </h2>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Flame size={14} />
          <span>Simple & Sinister Protocol</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Exercises List */}
      <div className="space-y-4">
        {currentWorkout.exercises.map(exercise => (
          <ExerciseInput 
            key={exercise.id} 
            exercise={exercise} 
            onUpdate={handleUpdateExercise} 
          />
        ))}
      </div>

      {/* Completion Message */}
      {currentWorkout.completed && (
        <div className="mt-8 p-6 bg-gradient-to-br from-red-900/50 to-slate-900 rounded-2xl border border-red-800/30 text-center animate-pulse">
          <h3 className="text-xl font-bold text-white mb-2">Protocol Complete</h3>
          <p className="text-slate-300">Strong work today, comrade. Rest and recover.</p>
        </div>
      )}
    </div>
  );
};

export default DailyWorkoutView;
