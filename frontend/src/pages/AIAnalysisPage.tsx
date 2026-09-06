import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Stethoscope } from 'lucide-react';
import type { ActivePage, AssessmentResult } from '../types';
import { assessmentService } from '../services/assessmentService';
import { StageTracker } from '../components/assessment/StageTracker';

interface AIAnalysisPageProps {
  answers: Record<string, any>;
  onNavigate: (page: ActivePage) => void;
  onAnalysisComplete: (result: AssessmentResult) => void;
}

export const AIAnalysisPage: React.FC<AIAnalysisPageProps> = ({
  answers,
  onNavigate,
  onAnalysisComplete
}) => {
  const [stageIndex, setStageIndex] = useState(1);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Stage timer transitions
    const t1 = setTimeout(() => setStageIndex(2), 700);
    const t2 = setTimeout(() => setStageIndex(3), 1400);
    const t3 = setTimeout(() => setStageIndex(4), 2100);

    const tExecute = setTimeout(async () => {
      try {
        const result = await assessmentService.analyzeAssessment('asm-temp', answers);
        onAnalysisComplete(result);
        onNavigate('result');
      } catch (err) {
        setHasError(true);
      }
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tExecute);
    };
  }, [answers, onAnalysisComplete, onNavigate]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans pb-12">
      {/* Stage 3 Tracker */}
      <StageTracker currentStage={3} />

      <div className="bg-slate-950 text-white p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl flex flex-col items-center justify-center text-center space-y-6">
        {/* Large Centered Pulse Animation */}
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-pulse">
          <Stethoscope className="w-12 h-12 text-white" />
        </div>

        <div className="space-y-2 max-w-md">
          <span className="px-3 py-1 bg-emerald-900/60 text-emerald-400 border border-emerald-700/50 text-[11px] font-bold uppercase tracking-wider rounded-full inline-block">
            Step 8: AI Diagnostic Analysis
          </span>
          <h2 className="text-2xl font-extrabold font-outfit text-white">Analyzing Diagnostic Data</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Our AI decision-support system is evaluating your symptoms, severity score, medical history, and vital signs.
          </p>
        </div>

        {/* High-Level Processing Stages */}
        <div className="w-full max-w-sm space-y-2.5 text-xs text-left">
          <div
            className={`p-3 rounded-xl border transition-all flex items-center space-x-3 ${
              stageIndex >= 1
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                : 'bg-slate-800/60 border-slate-800 text-slate-500'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>1. Validating symptom descriptions & details</span>
          </div>

          <div
            className={`p-3 rounded-xl border transition-all flex items-center space-x-3 ${
              stageIndex >= 2
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                : 'bg-slate-800/60 border-slate-800 text-slate-500'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>2. Evaluating duration & severity scale (1-10)</span>
          </div>

          <div
            className={`p-3 rounded-xl border transition-all flex items-center space-x-3 ${
              stageIndex >= 3
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                : 'bg-slate-800/60 border-slate-800 text-slate-500'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>3. Checking medical history & blood pressure/temperature</span>
          </div>

          <div
            className={`p-3 rounded-xl border transition-all flex items-center space-x-3 ${
              stageIndex >= 4
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                : 'bg-slate-800/60 border-slate-800 text-slate-500'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>4. Formulating diagnostic suggestions & next steps</span>
          </div>
        </div>

        {hasError && (
          <div className="p-4 rounded-xl bg-red-950 border border-red-800 text-red-200 text-xs space-y-3">
            <div className="flex items-center space-x-2 font-bold">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>Something went wrong while analyzing your diagnostic assessment.</span>
            </div>
            <div className="flex justify-center space-x-3 pt-1">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-800 text-white font-bold rounded-lg"
              >
                Try Again
              </button>
              <button
                onClick={() => onNavigate('wizard')}
                className="px-4 py-2 bg-slate-800 text-slate-200 font-bold rounded-lg"
              >
                Return to Assessment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

