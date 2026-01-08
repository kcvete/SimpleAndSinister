import React from 'react';
import { DailyWorkout, ExerciseType } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format, parseISO, subDays } from 'date-fns';
import useLocalStorage from '../hooks/useLocalStorage';

const ProgressChart: React.FC = () => {
  const [history] = useLocalStorage<Record<string, DailyWorkout>>('ss_history', {});

  // Transform data for charts
  const workouts = Object.values(history) as DailyWorkout[];
  const data = workouts
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(workout => {
      const swing = workout.exercises.find(e => e.type === ExerciseType.SWING);
      const tgu = workout.exercises.find(e => e.type === ExerciseType.TGU);
      return {
        date: workout.date,
        swingWeight: swing?.weight || 0,
        tguWeight: tgu?.weight || 0,
        swingReps: swing?.reps || 0,
        tguReps: tgu?.reps || 0,
      };
    })
    // Last 30 entries only for cleanliness, or can be filtered
    .slice(-30);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
        <p>No workout data yet.</p>
        <p className="text-sm">Complete a workout to see your progress.</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-xl text-xs">
          <p className="text-slate-300 font-semibold mb-2">{format(parseISO(label), 'MMM do, yyyy')}</p>
          {payload.map((entry: any) => (
            <p key={entry.name} style={{ color: entry.color }}>
              {entry.name}: {entry.value} {entry.name.includes('Weight') ? 'kg' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-24">
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-white">Weight Progression</h2>
        <div className="h-64 w-full bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(str) => format(parseISO(str), 'MM/dd')} 
                stroke="#64748b" 
                tick={{ fontSize: 10 }}
              />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="swingWeight" 
                name="Swing (kg)" 
                stroke="#ef4444" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="tguWeight" 
                name="TGU (kg)" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-white">Volume Consistency</h2>
        <div className="h-64 w-full bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(str) => format(parseISO(str), 'MM/dd')} 
                stroke="#64748b" 
                tick={{ fontSize: 10 }}
              />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="step" 
                dataKey="swingReps" 
                name="Swing Reps" 
                stroke="#f97316" 
                strokeWidth={2} 
                dot={false} 
              />
               <Line 
                type="step" 
                dataKey="tguReps" 
                name="TGU Reps" 
                stroke="#a855f7" 
                strokeWidth={2} 
                dot={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;