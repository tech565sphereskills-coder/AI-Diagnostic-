import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Mail } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is AI Diagnostic & Recommendation System?',
      a: 'The application is an AI-powered software engineering system that helps users identify and understand their problem or situation by collecting information through a structured assessment, checking whether enough information has been provided, analyzing the information with an AI engine, and returning a personalized result and recommendation.'
    },
    {
      q: 'How does the assessment process work?',
      a: 'The system operates in 3 distinct stages: 1. COLLECT (Answer structured questions), 2. VALIDATE (System checks required information completeness), and 3. ANALYZE (AI evaluates patterns and generates recommendations).'
    },
    {
      q: 'Why does the system ask additional questions?',
      a: 'If required information is missing during Stage 2 validation, the system prompts you to complete those specific questions so the AI analysis can produce reliable, high-confidence results.'
    },
    {
      q: 'How are recommendations generated?',
      a: 'The backend engine preprocesses your validated responses, extracts key findings, calculates confidence scores (%), and matches prioritized next steps based on your specific situation.'
    },
    {
      q: 'Can I retake an assessment?',
      a: 'Yes! You can start a new assessment anytime from your dashboard or assessment history page.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans pb-12">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
          Help & Support Center
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">Frequently Asked Questions</h1>
        <p className="text-xs text-slate-500 mt-0.5">Find answers to common questions about system operation and recommendations.</p>
      </div>

      {/* FAQ Accordions */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openFaq === idx;
          return (
            <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <button
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                className="w-full p-4 text-left font-bold text-slate-900 bg-slate-50 flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center">
                  <HelpCircle className="w-4 h-4 text-indigo-600 mr-2" />
                  {faq.q}
                </span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {isOpen && (
                <div className="p-4 bg-white text-slate-600 leading-relaxed border-t border-slate-200">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Support Contact Box */}
      <div className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white p-6 rounded-3xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3">
          <Mail className="w-8 h-8 text-indigo-300" />
          <div>
            <h4 className="font-bold text-sm font-outfit">Need Further Assistance?</h4>
            <p className="text-slate-300 text-[11px]">Contact the software engineering project team or system administrator.</p>
          </div>
        </div>

        <a
          href="mailto:support@aidiagnostic.com"
          className="px-5 py-2.5 bg-white text-indigo-900 font-bold text-xs rounded-xl shadow-md hover:bg-slate-100 transition-colors"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};
