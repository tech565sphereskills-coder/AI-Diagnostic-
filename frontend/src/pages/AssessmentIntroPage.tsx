import React from 'react';
import { Clock, ArrowRight, ArrowLeft, Info, BrainCircuit, Activity, Stethoscope } from 'lucide-react';
import type { ActivePage, AssessmentType } from '../types';
import { StageTracker } from '../components/assessment/StageTracker';

interface AssessmentIntroPageProps {
  category: AssessmentType | null;
  onNavigate: (page: ActivePage) => void;
  onStartWizard: () => void;
}

export const AssessmentIntroPage: React.FC<AssessmentIntroPageProps> = ({
  onNavigate,
  onStartWizard
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans pb-12">
      {/* 3-Stage Progress Tracker Bar */}
      <StageTracker currentStage={1} />

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 mb-1 uppercase tracking-wider">
            <Stethoscope className="w-4 h-4 text-emerald-600" />
            <span>AI Healthcare Diagnostic Support System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">
            New Patient Diagnostic Assessment
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            Follow the 8 simple diagnostic steps below to submit your symptoms, vitals, and medical history for automated AI clinical evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
            <div className="flex items-center space-x-2 text-emerald-950 font-bold">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Estimated Assessment Time</span>
            </div>
            <span className="text-lg font-extrabold text-emerald-950 font-outfit block">
              3 to 5 Minutes
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center space-x-2 text-slate-900 font-bold">
              <BrainCircuit className="w-4 h-4 text-teal-600" />
              <span>AI Diagnostic Engine</span>
            </div>
            <span className="text-lg font-extrabold text-slate-900 font-outfit block">
              5 Diagnostic Data Fields
            </span>
          </div>
        </div>

        {/* 8-Step Diagnostic Process Checklist */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center">
            <Info className="w-4 h-4 text-emerald-600 mr-2" />
            Assessment Workflow & Steps:
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-start space-x-2.5 p-3 bg-white rounded-xl border border-slate-200 text-slate-800">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              <div>
                <strong className="font-bold text-slate-900 block">Patient Age</strong>
                <span className="text-slate-500 text-[11px]">Used for age-appropriate drug dosage calculation</span>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 p-3 bg-white rounded-xl border border-slate-200 text-slate-800">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              <div>
                <strong className="font-bold text-slate-900 block">Biological Sex</strong>
                <span className="text-slate-500 text-[11px]">Used for pregnancy & drug contraindication checks</span>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 p-3 bg-white rounded-xl border border-slate-200 text-slate-800">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              <div>
                <strong className="font-bold text-slate-900 block">Describe Symptoms</strong>
                <span className="text-slate-500 text-[11px]">Detail fever, headache, pain, or discomfort</span>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 p-3 bg-white rounded-xl border border-slate-200 text-slate-800">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
              <div>
                <strong className="font-bold text-slate-900 block">Symptom Duration</strong>
                <span className="text-slate-500 text-[11px]">Indicate how long symptoms have persisted</span>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 p-3 bg-white rounded-xl border border-slate-200 text-slate-800">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">5</span>
              <div>
                <strong className="font-bold text-slate-900 block">Rate Severity (1-10)</strong>
                <span className="text-slate-500 text-[11px]">Rate intensity from 1 (mild) to 10 (severe)</span>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 p-3 bg-white rounded-xl border border-slate-200 text-slate-800">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">6</span>
              <div>
                <strong className="font-bold text-slate-900 block">Medical History</strong>
                <span className="text-slate-500 text-[11px]">Select past conditions, allergies, or medications</span>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 p-3 bg-white rounded-xl border border-slate-200 text-slate-800">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">7</span>
              <div>
                <strong className="font-bold text-slate-900 block">Blood Pressure & Temperature</strong>
                <span className="text-slate-500 text-[11px]">Enter measured vitals (°C, mmHg, etc.)</span>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 p-3 bg-white rounded-xl border border-slate-200 text-slate-800">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">8</span>
              <div>
                <strong className="font-bold text-slate-900 block">Submit for AI Analysis</strong>
                <span className="text-slate-500 text-[11px]">Automated AI diagnostic pattern processing</span>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 p-3 bg-white rounded-xl border border-emerald-200 bg-emerald-50/50 text-slate-800">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">9</span>
              <div>
                <strong className="font-bold text-emerald-950 block">Diagnostic Suggestions</strong>
                <span className="text-emerald-800 text-[11px]">Receive AI health diagnostic possibilities</span>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 p-3 bg-white rounded-xl border border-teal-200 bg-teal-50/50 text-slate-800">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">10</span>
              <div>
                <strong className="font-bold text-teal-950 block">AI Drug Prescription & Next Steps</strong>
                <span className="text-teal-800 text-[11px]">Clinical drug treatment plan & dosage guide</span>
              </div>
            </div>
          </div>
        </div>

        {/* Guidance Note */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs leading-relaxed flex items-start space-x-2">
          <Activity className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold uppercase block text-[10px] tracking-wider mb-0.5">Clinical Note:</strong>
            Providing complete symptom descriptions and accurate vital signs ensures high AI diagnostic match confidence.
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center space-x-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </button>

          <button
            onClick={onStartWizard}
            className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center space-x-2 cursor-pointer"
          >
            <span>Begin Diagnostic Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

