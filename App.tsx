import React, { useState } from 'react';
import DailyWorkoutView from './components/DailyWorkout';
import ProgressChart from './components/ProgressChart';
import AICoach from './components/AICoach';
import { UserSettings } from './types';
import { DEFAULT_SETTINGS } from './constants';
import useLocalStorage from './hooks/useLocalStorage';
import { Dumbbell, LineChart, MessageSquare, Menu } from 'lucide-react';
import { clsx } from 'clsx';

// Simple Router Enums
enum View {
  WORKOUT = 'WORKOUT',
  PROGRESS = 'PROGRESS',
  COACH = 'COACH'
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.WORKOUT);
  const [settings] = useLocalStorage<UserSettings>('ss_settings', DEFAULT_SETTINGS);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans">
      
      {/* Top Bar - Only visual, sticky */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-white/5 px-4 py-3 flex items-center justify-between">
         <h1 className="text-xl font-bold tracking-tighter text-white">
            <span className="text-red-500">S</span>&<span className="text-red-500">S</span> Tracker
         </h1>
         <div className="text-xs font-mono text-slate-500 border border-slate-800 px-2 py-0.5 rounded">v1.0</div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto p-4 md:p-6 overflow-hidden">
        {currentView === View.WORKOUT && (
          <DailyWorkoutView settings={settings} />
        )}
        {currentView === View.PROGRESS && (
          <ProgressChart />
        )}
        {currentView === View.COACH && (
          <AICoach />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full z-50 bg-slate-950 border-t border-slate-800 pb-safe">
        <div className="max-w-md mx-auto grid grid-cols-3 h-16">
          <button
            onClick={() => setCurrentView(View.WORKOUT)}
            className={clsx(
              "flex flex-col items-center justify-center gap-1 transition-colors",
              currentView === View.WORKOUT ? "text-red-500" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <Dumbbell size={20} className={currentView === View.WORKOUT ? "stroke-2" : "stroke-1"} />
            <span className="text-[10px] font-medium tracking-wide">Workout</span>
          </button>
          
          <button
            onClick={() => setCurrentView(View.PROGRESS)}
            className={clsx(
              "flex flex-col items-center justify-center gap-1 transition-colors",
              currentView === View.PROGRESS ? "text-red-500" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <LineChart size={20} className={currentView === View.PROGRESS ? "stroke-2" : "stroke-1"} />
            <span className="text-[10px] font-medium tracking-wide">Progress</span>
          </button>
          
          <button
            onClick={() => setCurrentView(View.COACH)}
            className={clsx(
              "flex flex-col items-center justify-center gap-1 transition-colors",
              currentView === View.COACH ? "text-red-500" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <MessageSquare size={20} className={currentView === View.COACH ? "stroke-2" : "stroke-1"} />
            <span className="text-[10px] font-medium tracking-wide">Coach</span>
          </button>
        </div>
      </nav>
      
      {/* Safe Area Spacer for iOS Home Bar */}
      <div className="h-6 w-full bg-slate-950" />
    </div>
  );
};

export default App;
