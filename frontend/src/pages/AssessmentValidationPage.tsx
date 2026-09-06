import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Sparkles,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import type { ActivePage, Question } from '../types';
import { assessmentService } from '../services/assessmentService';
import { StageTracker } from '../components/assessment/StageTracker';

interface AssessmentValidationPageProps {
  answers: Record<string, any>;
  questions: Question[];
  onNavigate: (page: ActivePage) => void;
  onStartAnalysis: () => void;
}

export const AssessmentValidationPage: React.FC<AssessmentValidationPageProps> = ({
  answers,
  questions,
  onNavigate,
  onStartAnalysis
}) => {
  const [isValidated, setIsValidated] = useState(false);
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; missingQuestions: Question[] } | null>(null);
  const [loading, setLoading] = useState(false);

  // Group questions by section
  const sections = Array.from(new Set(questions.map((q) => q.categorySection || 'General Information')));

  const handleCheckInformation = async () => {
    setLoading(true);
    try {
      const res = await assessmentService.validateAssessment('asm-temp', answers, questions);
      setValidationResult(res);
      setIsValidated(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans pb-12">
      {/* Stage 2 Tracker */}
      <StageTracker currentStage={2} />

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
            Stage 2: Completeness Validation
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">
            Review Your Information
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review your answers grouped by section before submitting for AI pattern analysis.
          </p>
        </div>

        {/* Answers Grouped By Section */}
        <div className="space-y-6">
          {sections.map((sectionName) => {
            const sectionQuestions = questions.filter((q) => (q.categorySection || 'General Information') === sectionName);
            return (
              <div key={sectionName} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-outfit">
                    {sectionName}
                  </h3>
                  <button
                    onClick={() => onNavigate('wizard')}
                    className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center space-x-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Section</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {sectionQuestions.map((q) => {
                    const ansVal = answers[q.id];
                    const isAnswered = ansVal !== undefined && ansVal !== '' && (!Array.isArray(ansVal) || ansVal.length > 0);
                    return (
                      <div key={q.id} className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                        <div className="flex items-center justify-between text-slate-500 font-semibold text-[11px]">
                          <span>{q.questionText}</span>
                          {isAnswered ? (
                            <span className="text-emerald-600 font-bold">✓ Complete</span>
                          ) : q.required ? (
                            <span className="text-amber-600 font-bold">⚠ Required</span>
                          ) : (
                            <span className="text-slate-400">○ Optional</span>
                          )}
                        </div>
                        <p className="font-bold text-slate-900 text-xs">
                          {isAnswered
                            ? Array.isArray(ansVal)
                              ? ansVal.join(', ')
                              : String(ansVal)
                            : 'Not answered'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Validation Result Display */}
        {isValidated && validationResult && (
          <div className="animate-in fade-in pt-2">
            {!validationResult.isValid ? (
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-3 text-xs">
                <div className="flex items-center space-x-2 font-bold text-amber-900 text-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>Some Required Information is Still Missing</span>
                </div>
                <p className="text-amber-800 leading-relaxed">
                  Please provide responses to the following required questions so the AI system can properly analyze your situation:
                </p>
                <div className="space-y-2 pt-1">
                  {validationResult.missingQuestions.map((mq) => (
                    <div key={mq.id} className="p-3 bg-white rounded-xl border border-amber-300 flex items-center justify-between">
                      <div>
                        <strong className="font-bold text-slate-900 block">{mq.questionText}</strong>
                        <span className="text-[10px] text-amber-700 font-semibold">Reason: Required for accurate diagnostic scoring</span>
                      </div>
                      <button
                        onClick={() => onNavigate('wizard')}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] rounded-lg"
                      >
                        Answer Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2 text-xs">
                <div className="flex items-center space-x-2 font-bold text-emerald-900 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Your Assessment Information is Complete!</span>
                </div>
                <p className="text-emerald-800">
                  All required information has been collected and validated. You may now proceed to the AI Analysis stage.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 border-t border-slate-100">
          <button
            onClick={() => onNavigate('wizard')}
            className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center space-x-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Questions</span>
          </button>

          {!isValidated ? (
            <button
              onClick={handleCheckInformation}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Validating Information...' : 'Check Information Completeness'}</span>
            </button>
          ) : validationResult?.isValid ? (
            <button
              onClick={onStartAnalysis}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Analyze My Assessment (Stage 3)</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('wizard')}
              className="w-full sm:w-auto px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Answer Missing Questions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
