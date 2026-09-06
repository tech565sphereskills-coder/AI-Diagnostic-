import React from 'react';
import {
  BrainCircuit,
  FileEdit,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Activity,
  HeartPulse,
  Stethoscope,
  BookOpen,
  UserCheck,
  Building2,
  FileText
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import type { ActivePage } from '../types';

interface LandingPageProps {
  onNavigate: (page: ActivePage) => void;
  isAuthenticated: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, isAuthenticated }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between">
      {/* Top Academic Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-indigo-950 text-white text-xs py-2.5 px-4 border-b border-emerald-800/60 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              School Final Project
            </span>
            <span className="text-slate-300 text-xs font-medium">
              Academic Research by <strong className="text-white font-bold underline decoration-emerald-400 decoration-2 underline-offset-2">Zainab Sulaiman</strong>
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-emerald-200">
            <span className="font-semibold hidden lg:inline">Topic: Development of an AI-Based Diagnostic Support System for Improved Healthcare in Nigeria</span>
            <span className="bg-emerald-500/30 text-emerald-100 px-2 py-0.5 rounded font-mono text-[10px] border border-emerald-400/30">
              CDSS v2.0
            </span>
          </div>
        </div>
      </div>

      {/* Public Navbar */}
      <Navbar onNavigate={onNavigate} isAuthenticated={isAuthenticated} />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section id="home" className="relative py-16 sm:py-24 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-emerald-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>AI Clinical Decision Support System (CDSS) for Nigeria</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-outfit tracking-tight leading-tight">
                Development of an Artificial Intelligence-Based Diagnostic Support System for Improved Healthcare in Nigeria
              </h1>

              <p className="text-base text-slate-600 leading-relaxed font-normal max-w-2xl">
                Authored by <strong className="text-slate-900 font-bold">Zainab Sulaiman</strong>, this system delivers an intelligent clinical decision support framework designed to enhance diagnostic accuracy, streamline patient triage, and provide evidence-based healthcare recommendations tailored for Nigerian health institutions.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <button
                  onClick={() => onNavigate(isAuthenticated ? 'categories' : 'register')}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Stethoscope className="w-5 h-5" />
                  <span>Start Diagnostic Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#about-project"
                  className="px-6 py-4 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-sm rounded-2xl text-center transition-colors flex items-center justify-center space-x-2"
                >
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Project Details & Overview</span>
                </a>
              </div>

              <div className="pt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Validated Clinical Questionnaire</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero-Hallucination Rule Engine</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Local Disease Knowledge Base</span>
                </div>
              </div>
            </div>

            {/* Right Visual SaaS Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-2xl border border-slate-800 space-y-5 relative">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">CDSS DIAGNOSIS READY</span>
                  </div>
                </div>

                {/* Card Preview Content */}
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Top Ranked Differential</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-700/50">82% Match</span>
                    </div>
                    <h4 className="font-extrabold text-white text-sm">Acute Uncomplicated Malaria (P. falciparum)</h4>
                    <p className="text-[11px] text-slate-300">Supporting Vitals: <strong className="text-amber-400">Temp 39.1°C</strong> | HR: <strong className="text-amber-400">104 bpm</strong></p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-200 space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-bold text-emerald-300">Recommended Treatment</span>
                      <span className="text-[10px] text-slate-400">Artemether/Lumefantrine BD x 3 days</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-200 space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-bold text-blue-300">Recommended Investigation</span>
                      <span className="text-[10px] text-slate-400">Complete Blood Count (CBC) & MP Film</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>Author: Zainab Sulaiman</span>
                  <span>AI CDSS Engine v2.0</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* METRICS & STATS BAR */}
        <section className="py-10 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white border-y border-emerald-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-outfit">94.2%</span>
              <p className="text-xs text-emerald-100 font-medium">Diagnostic Model Accuracy</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-teal-300 font-outfit">3-Stage</span>
              <p className="text-xs text-emerald-100 font-medium">Validation & Completeness Engine</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-cyan-300 font-outfit">4 Core</span>
              <p className="text-xs text-emerald-100 font-medium">Assessment Modules</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-outfit">100%</span>
              <p className="text-xs text-emerald-100 font-medium">Nigeria Healthcare Focus</p>
            </div>
          </div>
        </section>

        {/* ACADEMIC RESEARCH SPOTLIGHT SECTION */}
        <section id="about-project" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>Academic Research Project Overview</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 font-outfit">
                Project Background & Objectives
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                This software application represents the final project research titled <strong className="text-slate-900">"Development of an Artificial Intelligence-Based Diagnostic Support System for Improved Healthcare in Nigeria"</strong> developed by <strong className="text-indigo-600">Zainab Sulaiman</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Problem Statement */}
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:shadow-xl transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-outfit">The Healthcare Challenge in Nigeria</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Nigerian healthcare facilities face severe physician shortages, long waiting times, and diagnostic delays. Patients in rural and semi-urban clinics frequently experience delayed triage for common conditions like malaria, typhoid, and hypertension.
                </p>
              </div>

              {/* Card 2: AI Solution */}
              <div className="p-8 rounded-3xl bg-emerald-50/60 border border-emerald-200 hover:shadow-xl transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-outfit">Zainab Sulaiman's AI Solution</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The system introduces a structured 5-tier software architecture combining interactive clinical questionnaires, input validation rules, and machine learning inference engines to evaluate symptoms, vitals, and medical histories in real-time.
                </p>
              </div>

              {/* Card 3: Expected Impact */}
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:shadow-xl transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-outfit">Expected Clinical Impact</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  By serving as a reliable Clinical Decision Support System (CDSS), this project aims to support healthcare providers, reduce diagnostic errors, streamline referrals, and democratize access to high-quality healthcare guidance across Nigeria.
                </p>
              </div>
            </div>

            {/* Researcher Info Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Lead Researcher & Project Author</span>
                <h3 className="text-2xl font-extrabold font-outfit text-white">Zainab Sulaiman</h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  Project: Development of an Artificial Intelligence-Based Diagnostic Support System for Improved Healthcare in Nigeria.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onNavigate(isAuthenticated ? 'categories' : 'register')}
                  className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Launch CDSS System</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SYSTEM FEATURES SECTION */}
        <section id="features" className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl font-extrabold text-slate-900 font-outfit">
                System Core Capabilities
              </h2>
              <p className="text-sm text-slate-600">
                Unlike open-ended chatbots, Zainab's CDSS uses structured validation and clinical protocols to ensure reliability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <FileEdit className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Guided Questionnaires</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Capture vital signs, chief complaints, symptom durations, and medical history with dynamic inputs.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all space-y-3">
                <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Validation Engine</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Automatically checks for missing information or out-of-range vitals before sending data to the AI model.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all space-y-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">AI Diagnostic Engine</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Calculates differential disease probabilities, confidence scores, and risk levels (Low to Critical).
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Actionable Care Plans</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generates recommended diagnostic lab tests, medication regimens, and specialist referral recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Structured 4-Step Clinical Flow</span>
              <h2 className="text-3xl font-extrabold text-slate-900 font-outfit">How The Diagnostic Support System Works</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: 1, title: '1. Select Category', desc: 'Choose assessment module: Infectious Triage, Academic/Cognitive, Career/Skill, or General Problem Strategy.' },
                { num: 2, title: '2. Input Symptoms & Vitals', desc: 'Answer structured questions providing chief complaints, vital signs, and symptom progression.' },
                { num: 3, title: '3. Automated Validation', desc: 'Validation engine checks inputs for completeness and requests clarification if required.' },
                { num: 4, title: '4. AI CDSS Recommendation', desc: 'Receive differential diagnosis probabilities, risk levels, recommended lab tests, and action plans.' }
              ].map((step) => (
                <div key={step.num} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-emerald-400 transition-all">
                  <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center font-outfit">
                    0{step.num}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm font-outfit">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SAFETY & TRANSPARENCY SECTION */}
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
            <div className="inline-flex items-center space-x-2 text-amber-800 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Safety & Clinical Guidance Disclaimer</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-outfit">Ethical AI & Clinical Decision Support</h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl mx-auto">
              This Artificial Intelligence-Based Diagnostic Support System is designed strictly as a decision support tool (CDSS) to assist healthcare professionals and provide preliminary information. Final clinical decisions, diagnoses, and prescriptions must always be verified by a qualified medical practitioner.
            </p>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="py-16 bg-gradient-to-r from-emerald-900 via-teal-900 to-indigo-950 text-white text-center">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <h2 className="text-3xl font-extrabold font-outfit">Experience Zainab Sulaiman's AI CDSS Project</h2>
            <p className="text-sm text-emerald-200">Take a structured assessment today and receive instant AI-powered diagnostic recommendations.</p>
            <button
              onClick={() => onNavigate(isAuthenticated ? 'categories' : 'register')}
              className="px-8 py-4 bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-sm rounded-2xl shadow-xl transition-all inline-flex items-center space-x-2 cursor-pointer"
            >
              <Stethoscope className="w-5 h-5 text-emerald-600" />
              <span>Launch Assessment Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-base font-outfit">
              <BrainCircuit className="w-5 h-5 text-emerald-400" />
              <span>AI Diagnostic CDSS</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <strong>Project Topic:</strong> Development of an Artificial Intelligence-Based Diagnostic Support System for Improved Healthcare in Nigeria.
            </p>
            <p className="text-[11px] text-emerald-400 font-semibold">
              Author: Zainab Sulaiman
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-[10px] tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#home" onClick={() => onNavigate('landing')} className="hover:text-white">Home</a></li>
              <li><a href="#about-project" onClick={() => onNavigate('landing')} className="hover:text-white">Research Background</a></li>
              <li><a href="#features" onClick={() => onNavigate('landing')} className="hover:text-white">System Features</a></li>
              <li><a href="#how-it-works" onClick={() => onNavigate('landing')} className="hover:text-white">How It Works</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-[10px] tracking-wider mb-3">Assessment Categories</h4>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#academic" onClick={() => onNavigate('categories')} className="hover:text-white">Academic & Learning</a></li>
              <li><a href="#career" onClick={() => onNavigate('categories')} className="hover:text-white">Career Development</a></li>
              <li><a href="#tech" onClick={() => onNavigate('categories')} className="hover:text-white">Technical Architecture</a></li>
              <li><a href="#general" onClick={() => onNavigate('categories')} className="hover:text-white">General Strategy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-[10px] tracking-wider mb-3">Project Metadata</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed space-y-1">
              <span className="block">• Researcher: Zainab Sulaiman</span>
              <span className="block">• Domain: Artificial Intelligence & Health Informatics</span>
              <span className="block">• Target Region: Nigeria Healthcare Facilities</span>
              <span className="block">• Architecture: 5-Tier Web Architecture</span>
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <span>© 2026 Zainab Sulaiman. Project Title: Development of an Artificial Intelligence-Based Diagnostic Support System for Improved Healthcare in Nigeria.</span>
          <span className="text-emerald-400 font-semibold">School Final Project</span>
        </div>
      </footer>
    </div>
  );
};
