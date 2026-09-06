import React from 'react';
import { FileEdit, ShieldCheck, Sparkles } from 'lucide-react';

export type SystemStage = 1 | 2 | 3; // 1: COLLECT, 2: VALIDATE, 3: ANALYZE

interface StageTrackerProps {
  currentStage: SystemStage;
}

export const StageTracker: React.FC<StageTrackerProps> = ({ currentStage }) => {
  const stages = [
    {
      num: 1 as SystemStage,
      title: '1. COLLECT',
      subtitle: 'Structured Questions',
      icon: <FileEdit className="w-4 h-4" />
    },
    {
      num: 2 as SystemStage,
      title: '2. VALIDATE',
      subtitle: 'Information Check',
      icon: <ShieldCheck className="w-4 h-4" />
    },
    {
      num: 3 as SystemStage,
      title: '3. ANALYZE',
      subtitle: 'AI Recommendation Engine',
      icon: <Sparkles className="w-4 h-4" />
    }
  ];

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 font-sans">
      <div className="grid grid-cols-3 gap-2">
        {stages.map((stage) => {
          const isActive = currentStage === stage.num;
          const isDone = currentStage > stage.num;
          return (
            <div
              key={stage.num}
              className={`p-3 rounded-xl border transition-all text-center flex flex-col items-center justify-center space-y-1 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-900 to-blue-900 text-white border-indigo-700 shadow-md font-bold'
                  : isDone
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                  : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}
            >
              <div className="flex items-center space-x-1.5 text-xs">
                <span className={isActive ? 'text-indigo-300' : isDone ? 'text-emerald-600' : 'text-slate-400'}>
                  {stage.icon}
                </span>
                <span className="font-extrabold uppercase tracking-wider text-[11px] font-outfit">
                  {stage.title}
                </span>
              </div>
              <span className="text-[10px] hidden sm:block opacity-80">{stage.subtitle}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
