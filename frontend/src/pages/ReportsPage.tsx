import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Stethoscope,
  ShieldCheck,
  BrainCircuit
} from 'lucide-react';
import type { Patient, AIDiagnosticAssessment } from '../types';
import { Modal } from '../components/common/Modal';

interface ReportsPageProps {
  patients: Patient[];
  assessments: AIDiagnosticAssessment[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ patients, assessments }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedReportTitle, setSelectedReportTitle] = useState('Full Clinical Diagnostic & Decision Support Report');
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || 'PT-2026-001');

  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const asm = assessments.find((a) => a.patientId === patient.id) || assessments[0];

  const reportTypes = [
    {
      title: 'Full Clinical Report',
      desc: 'Comprehensive document combining patient demographics, vitals, lab parasitemia, AI differential diagnosis, and clinician authorization signature.',
      icon: <FileText className="w-6 h-6 text-blue-900" />
    },
    {
      title: 'AI Diagnostic Assessment Report',
      desc: 'Detailed breakdown of AI probabilistic risk scores, supporting clinical factors, and explainability vectors.',
      icon: <BrainCircuit className="w-6 h-6 text-teal-700" />
    },
    {
      title: 'Patient Summary Report',
      desc: 'High-level medical summary including chronic conditions, allergies, and emergency contact information.',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />
    },
    {
      title: 'Laboratory Findings Report',
      desc: 'Microscopic and haematological lab test trends and reference range comparisons.',
      icon: <Stethoscope className="w-6 h-6 text-amber-700" />
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    alert(`Exporting ${selectedReportTitle} as PDF for ${patient.name}...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900 font-outfit">Clinical Reports</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Generate, preview, print, and export official clinical decision-support reports.
        </p>
      </div>

      {/* Patient Target Selector */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-3 text-xs">
        <span className="font-semibold text-slate-700">Select Patient for Report Generation:</span>
        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          className="p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-blue-900"
        >
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.id})
            </option>
          ))}
        </select>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((rt, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex-shrink-0">{rt.icon}</div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-outfit">{rt.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{rt.desc}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setSelectedReportTitle(rt.title);
                  setPreviewOpen(true);
                }}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Report Preview</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Printable / Exportable Clinical Report Modal */}
      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Official Clinical Decision Support Report"
        subtitle="Formatted for medical records and institutional print out"
        maxWidth="4xl"
      >
        <div className="space-y-6 py-2 text-xs text-slate-800 print:p-0">
          {/* Official Printable Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-blue-950 text-white font-bold flex items-center justify-center text-lg">
                CDSS
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-outfit tracking-tight">
                  AI Diagnostic Support System
                </h2>
                <p className="text-[10px] text-slate-500 font-semibold">
                  Development of an Artificial Intelligence-Based Diagnostic Support System for Improved Healthcare in Nigeria
                </p>
                <p className="text-[10px] text-teal-800 font-bold mt-0.5">
                  Federal Republic of Nigeria • Healthcare Decision Support Unit
                </p>
              </div>
            </div>

            <div className="text-right text-[11px]">
              <span className="font-mono font-bold text-blue-900 block text-xs">REP-2026-0089</span>
              <span className="text-slate-500 block">Date: {new Date().toISOString().split('T')[0]}</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[9px] inline-block mt-1">
                OFFICIAL RECORD
              </span>
            </div>
          </div>

          {/* Patient Details Table */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider mb-2 border-b border-slate-200 pb-1">
              PATIENT CLINICAL IDENTIFICATION
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div><span className="text-slate-400 block text-[10px]">PATIENT NAME</span><strong className="text-slate-900">{patient.name}</strong></div>
              <div><span className="text-slate-400 block text-[10px]">PATIENT ID</span><strong className="font-mono text-blue-900">{patient.id}</strong></div>
              <div><span className="text-slate-400 block text-[10px]">AGE / SEX</span><strong>{patient.age} yrs / {patient.sex}</strong></div>
              <div><span className="text-slate-400 block text-[10px]">STATE / BLOOD GROUP</span><strong>{patient.stateOfResidence} / {patient.bloodGroup}</strong></div>
            </div>
          </div>

          {/* Clinical Findings & Symptoms Summary */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
              1. CLINICAL PRESENTATION & VITAL SIGNS
            </h4>
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <p><strong>Chief Complaint:</strong> {asm.chiefComplaint || 'High spiking fever (39.1°C), frontal headache, and fatigue for 4 days.'}</p>
              <p><strong>Vital Signs:</strong> Temp 39.1°C • HR 104 bpm • BP 118/78 mmHg • SpO2 98% • BMI 23.5 kg/m²</p>
            </div>
          </div>

          {/* AI Diagnostic Probabilities */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
              2. AI DIAGNOSTIC DECISION SUPPORT EVALUATION
            </h4>
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-950 text-sm">Overall Risk Level: {asm.overallRisk} ({asm.riskScore}% Score)</span>
                <span className="text-[10px] font-semibold text-blue-800">Model Engine v1.0</span>
              </div>

              <div className="space-y-2">
                {asm.possibleConditions.map((cond) => (
                  <div key={cond.rank} className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">#{cond.rank} {cond.conditionName}</span>
                      <p className="text-[11px] text-slate-500">{cond.supportingFactors[0]}</p>
                    </div>
                    <span className="font-bold text-blue-900">{cond.confidence}% Confidence</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Clinician Decision & Signature Block */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
              3. QUALIFIED HEALTHCARE PROFESSIONAL REVIEW
            </h4>
            <p><strong>Clinician Status:</strong> Accepted AI Assessment • Approved ACT antimalarial management plan.</p>
            <div className="pt-4 flex items-center justify-between border-t border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Reviewing Medical Officer</span>
                <span className="font-bold text-slate-900 text-sm">Dr. Chinedu Okafor, MBBS, FWACP</span>
                <span className="text-[10px] text-slate-500 block">Consultant Physician • Reg # NMD/88492</span>
              </div>
              <div className="text-right">
                <span className="font-mono text-emerald-700 font-bold block text-xs">ELECTRONICALLY AUTHORIZED</span>
                <span className="text-[10px] text-slate-400">Date: {asm.dateTime}</span>
              </div>
            </div>
          </div>

          {/* Mandatory Footer Disclaimer */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[10px] text-amber-900 text-center font-semibold">
            AI-Assisted Clinical Decision Support – Final clinical decisions must be made by a qualified healthcare professional.
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end space-x-3 no-print">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md flex items-center space-x-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
