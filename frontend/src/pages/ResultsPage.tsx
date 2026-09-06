import React, { useState } from 'react';
import {
  CheckCircle2,
  Award,
  ThumbsUp,
  ThumbsDown,
  Star,
  Printer,
  AlertTriangle,
  Pill,
  User as UserIcon,
  Calendar
} from 'lucide-react';
import type { ActivePage, AssessmentResult } from '../types';
import { feedbackService } from '../services/feedbackService';

interface ResultsPageProps {
  result: AssessmentResult | null;
  onNavigate: (page: ActivePage) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ result, onNavigate }) => {
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Retrieve latest saved medical record diagnostic result if result prop is null
  const getLatestSavedResult = (): AssessmentResult | null => {
    if (result) return result;
    try {
      const recordsStr = localStorage.getItem('user_medical_records');
      if (recordsStr) {
        const records = JSON.parse(recordsStr);
        if (Array.isArray(records) && records.length > 0 && records[0].diagnosticResult) {
          return records[0].diagnosticResult;
        }
      }
    } catch (e) {}
    return null;
  };

  const latestSaved = getLatestSavedResult();

  const res = latestSaved || {
    id: 'res-101',
    assessmentId: 'asm-101',
    userId: 'usr-1',
    patientName: 'Zainab Sulaiman',
    patientAge: 24,
    patientSex: 'Female' as const,
    assessmentTypeName: 'AI Healthcare Diagnostic Support System',
    identifiedArea: 'Diagnostic Suggestion: Suspected Acute Febrile Illness / Malaria Syndrome',
    summary: 'Based on your reported symptoms (high fever, severe headache, body weakness, and chills), duration (1 to 3 days), severity rating (8/10), age (24 yrs, Female), and vital signs (Temperature: 38.5°C, BP: 125/82 mmHg), our AI Diagnostic Support System has generated the following patient diagnostic evaluation, clinical drug prescriptions, and care recommendations.',
    confidenceScore: 92,
    confidenceLabel: 'AI Diagnostic Match Confidence',
    keyFindings: [
      { id: 'kf-1', title: 'Patient Profile & Symptom Analysis: Malaria Syndrome', description: 'Patient: Zainab Sulaiman (24 yrs, Female). High fever (>38°C) with joint pain and severe headache persisting for 2 days.', severity: 'high' as const },
      { id: 'kf-2', title: 'Clinical Vitals & Severity Rating', description: 'Recorded temperature: 38.5°C. Blood pressure: 125/82 mmHg. Severity score rated at 8/10.', severity: 'high' as const },
      { id: 'kf-3', title: 'Medical History & Co-Factors', description: 'No history of chronic renal or hepatic failure reported.', severity: 'medium' as const }
    ],
    recommendations: [
      {
        id: 'rec-1',
        assessmentId: 'asm-101',
        title: '1. Recommended Diagnostic Laboratory Confirmation',
        description: 'Obtain immediate laboratory test confirmation to verify pathogen presence before initiating drug therapy.',
        priority: 'HIGH' as const,
        category: 'Laboratory Investigations',
        createdAt: new Date().toISOString().substring(0, 10),
        actionableSteps: [
          'Request Rapid Diagnostic Test (RDT) or Thick/Thin Blood Film for Malaria parasites.',
          'Perform Full Blood Count (FBC) and Widal test if fever persists.',
          'Present lab test report to a medical clinician.'
        ]
      },
      {
        id: 'rec-2',
        assessmentId: 'asm-101',
        title: '2. Professional Medical Doctor Consultation',
        description: 'Schedule an evaluation with a licensed physician at a primary healthcare facility in Nigeria.',
        priority: 'HIGH' as const,
        category: 'Clinical Follow-Up',
        createdAt: new Date().toISOString().substring(0, 10),
        actionableSteps: [
          'Visit nearest clinic or general hospital for physical examination.',
          'Bring this AI diagnostic summary report, drug prescription list, and recent vitals readings.'
        ]
      }
    ],
    prescribedMedications: [
      {
        id: 'med-1',
        name: 'Artemether / Lumefantrine (Coartem)',
        dosage: '80/480mg (4 Tablets per dose)',
        route: 'Oral',
        frequency: 'Twice Daily (BD at 0h, 8h, 24h, 36h, 48h, 60h)',
        duration: '3 Days (6 Doses Total)',
        instructions: 'Take strictly with fatty food or milk to enhance drug absorption.',
        purpose: 'First-line Artemisinin-based Combination Therapy (ACT) for P. falciparum malaria.'
      },
      {
        id: 'med-2',
        name: 'Paracetamol (Acetaminophen)',
        dosage: '500mg - 1000mg (1 to 2 Tablets)',
        route: 'Oral',
        frequency: '8-Hourly as needed (TDS for fever >38°C)',
        duration: '3 to 5 Days',
        instructions: 'Maximum 4000mg per 24 hours. Do not exceed recommended dosage.',
        purpose: 'Antipyretic for fever reduction and analgesic for joint & muscle body pains.'
      },
      {
        id: 'med-3',
        name: 'Oral Rehydration Salts (ORS)',
        dosage: '1 Sachet in 1 Litre Water',
        route: 'Oral',
        frequency: 'Drink 2 to 3 Litres daily',
        duration: '3 Days',
        instructions: 'Sip regularly throughout the day to replace fluids lost to sweating and high temperature.',
        purpose: 'Maintains optimal blood volume and electrolyte balance during fever spikes.'
      }
    ],
    nextStepsTimeline: [
      { stepNumber: 1, title: 'Perform Diagnostic Lab Work', detail: 'Get Malaria RDT/MP blood film or baseline blood pressure monitoring.' },
      { stepNumber: 2, title: 'Review Drug Prescriptions with Doctor', detail: 'Verify prescribed medications with a physician or registered pharmacist.' },
      { stepNumber: 3, title: 'Initiate Treatment & Dosage', detail: 'Take prescribed medication according to exact dosage schedules.' },
      { stepNumber: 4, title: 'Re-evaluate in 48-72 Hours', detail: 'Re-assess symptom resolution or seek urgent emergency care if condition worsens.' }
    ],
    safetyDisclaimer: 'Notice: This AI diagnostic support system is designed to assist healthcare decision-making in Nigeria. Prescribed drug guidance should be reviewed with a registered medical practitioner or pharmacist.',
    evaluatedAt: new Date().toISOString().substring(0, 10)
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isHelpful === null) return;
    try {
      await feedbackService.submitFeedback(res.id, isHelpful, rating, comment);
      setFeedbackSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Step 8 Completed • AI Healthcare Evaluation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">
              Diagnostic & Clinical Recommendation Report
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              System: <strong>AI Diagnostic Support System for Nigeria</strong> • Topic: Development of an AI Diagnostic Support System
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl inline-flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
          >
            <Printer className="w-4 h-4 text-emerald-600" />
            <span>Print Report</span>
          </button>
        </div>

        {/* Patient Demographics Bar */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Patient Name</span>
            <span className="font-extrabold text-slate-900 text-sm font-outfit flex items-center space-x-1">
              <UserIcon className="w-3.5 h-3.5 text-emerald-600 mr-1" />
              <span>{res.patientName || 'Zainab Sulaiman'}</span>
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Age & Sex</span>
            <span className="font-extrabold text-slate-900 text-sm font-outfit">
              {res.patientAge || 24} Yrs ({res.patientSex || 'Female'})
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Evaluation Date</span>
            <span className="font-extrabold text-slate-900 text-sm font-outfit flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 mr-1" />
              <span>{res.evaluatedAt}</span>
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">System ID</span>
            <span className="font-extrabold text-emerald-700 text-sm font-mono">
              RES-{res.id.length > 10 ? res.id.substring(4, 12) : res.id}
            </span>
          </div>
        </div>
      </div>

      {/* Step 9: Primary Health Diagnostic Suggestion & Circular Confidence Score */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center border border-emerald-900/50">
        {/* Left Identified Area Text */}
        <div className="md:col-span-8 space-y-3">
          <span className="px-3 py-1 bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase tracking-wider rounded-full inline-block">
            Step 9: Possible Health Diagnostic Suggestion
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white tracking-tight leading-snug">
            {res.identifiedArea}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed opacity-95">
            {res.summary}
          </p>
        </div>

        {/* Right Circular Confidence Score Indicator */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-900/80 rounded-2xl border border-slate-800 text-center space-y-2">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* SVG Circular Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400"
                strokeDasharray={`${res.confidenceScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-2xl font-black font-outfit text-white">
              {res.confidenceScore}%
            </span>
          </div>

          <div>
            <span className="font-bold text-xs text-emerald-300 block">{res.confidenceLabel}</span>
            <p className="text-[10px] text-slate-400 leading-normal mt-1">
              Based on symptoms, severity (1-10), age ({res.patientAge || 24} yrs, {res.patientSex || 'Female'}), vitals, and history.
            </p>
          </div>
        </div>
      </div>

      {/* AI Prescribed Drug Medication & Treatment Plan Section */}
      {res.prescribedMedications && res.prescribedMedications.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 font-outfit uppercase tracking-wider flex items-center">
              <Pill className="w-4 h-4 text-emerald-600 mr-2" />
              AI Prescribed Drug Medication & Treatment Plan
            </h3>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md uppercase">
              Clinical Drug Prescription
            </span>
          </div>

          <div className="space-y-4">
            {res.prescribedMedications.map((med) => (
              <div key={med.id} className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center font-mono">Rx</span>
                    <h4 className="font-extrabold text-slate-900 text-sm font-outfit">{med.name}</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-white">Dosage: {med.dosage}</span>
                    <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-900">Frequency: {med.frequency}</span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800">Duration: {med.duration}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <strong className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Clinical Indication / Purpose:</strong>
                    <p className="text-slate-700 font-medium text-[11px]">{med.purpose || med.instructions}</p>
                  </div>
                  <div>
                    <strong className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Administration & Precautions:</strong>
                    <p className="text-slate-700 font-medium text-[11px]">{med.instructions}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Findings Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 font-outfit uppercase tracking-wider">
          Diagnostic Clinical Evidence & Findings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {res.keyFindings.map((finding) => (
            <div key={finding.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 font-outfit">{finding.title}</h4>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                  finding.severity === 'high' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {finding.severity} Severity
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">{finding.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Step 10: Recommended Next Steps Cards Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 font-outfit uppercase tracking-wider flex items-center">
            <Award className="w-4 h-4 text-emerald-600 mr-2" />
            Step 10: Recommendations on What to Do Next
          </h3>
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md uppercase">
            Actionable Clinical Plan
          </span>
        </div>

        <div className="space-y-4">
          {res.recommendations.map((rec) => (
            <div key={rec.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 text-sm font-outfit">{rec.title}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  rec.priority === 'HIGH' ? 'bg-emerald-900 text-white' : 'bg-teal-100 text-teal-900'
                }`}>
                  {rec.priority} PRIORITY
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">{rec.description}</p>

              {rec.actionableSteps && (
                <div className="pt-2 border-t border-slate-200/80 space-y-1 text-[11px]">
                  <span className="font-bold text-slate-500 uppercase tracking-wider block">Actionable steps:</span>
                  <ul className="space-y-1 text-slate-700">
                    {rec.actionableSteps.map((step, i) => (
                      <li key={i} className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Numbered Next Steps Timeline */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 font-outfit uppercase tracking-wider">
          Patient Care Follow-Up Timeline
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {res.nextStepsTimeline.map((item) => (
            <div key={item.stepNumber} className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center font-outfit">
                {item.stepNumber}
              </span>
              <h4 className="font-bold text-slate-900 font-outfit text-xs">{item.title}</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs">
          <button
            onClick={() => onNavigate('intro')}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
          >
            Start Another Assessment
          </button>
          <button
            onClick={() => onNavigate('history')}
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
          >
            View Assessment History
          </button>
        </div>
      </div>

      {/* Result Safety Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold uppercase tracking-wider block text-[10px] mb-0.5">Disclaimer:</strong>
          <span>{res.safetyDisclaimer}</span>
        </div>
      </div>

      {/* Interactive Feedback Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <h3 className="text-sm font-bold text-slate-900 font-outfit uppercase tracking-wider">
          Was This Recommendation Helpful?
        </h3>

        {feedbackSubmitted ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Thank you for your feedback! Your evaluation helps improve system accuracy.</span>
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-4 max-w-xl">
            {/* Thumbs Up / Down */}
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setIsHelpful(true)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                  isHelpful === true
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Yes, Helpful</span>
              </button>

              <button
                type="button"
                onClick={() => setIsHelpful(false)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                  isHelpful === false
                    ? 'bg-red-600 text-white border-red-600 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span>No, Not Helpful</span>
              </button>
            </div>

            {/* Star Rating */}
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Rating (1 to 5 Stars):</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star className={`w-6 h-6 ${rating >= star ? 'fill-amber-400' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Comments Textarea */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">What could we improve? (Optional)</label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on the recommendation output..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={isHelpful === null}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer disabled:opacity-50"
            >
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
